---
title: 'BDD in JavaScript II: CucumberJS, the World and Background'
author:
  name: 'todd anderson'
date: '2014-01-22'
---
In [my previous post](http://custardbelly.com/blog/blog-posts/2014/01/08/bdd-in-js-cucumberjs/index.html), I demonstrated how I use [CucumberJS](https://github.com/cucumber/cucumber-js) - the JavaScript port of the [Cucumber](http://cukes.info/) BDD testing tool - in developing Test-Driven code. I walked through going from a <span style="color:red;">failing</span> feature with two scenarios to a <span style="color:green;">passing</span> cuke, while taking care to only add enough code that would make the assertions pass and refactoring as I went along under the assurance of a test harness.

There are a few topics that I didn't address in the previous post that I utilize in my testing process that I wanted to touch on in this post as any further articles I may write on the subject of [CucumberJS](https://github.com/cucumber/cucumber-js) most likely will reference them. These are:

* the World~~, chico, and everything in it.~~
* Background

## World
The __World__ brings context to your __Scenarios__.

In the examples from [my previous post](http://custardbelly.com/blog/blog-posts/2014/01/08/bdd-in-js-cucumberjs/index.html) variables were declared locally to the module export and available for reference within each __Step__. This may be suitable for some cases, but can cause issues or provide false results if you are not aware that those values last across the life cycle of _all_ the __Steps__ declared in that module. In other words, they are not reset for each __Scenario__.

To bring context to each __Scenario__, you can use the __World__ constructor within which you can define various properties and methods that may be relevant in setting up the environment under test for each __Scenario__. Additonally, you access the defined __World__ within each __Step__ using the `this` keyword - just as you are familiar to in referencing context scope within JavaScript.

### Example
If I were to take the complete steps module for the _Add Item_ __Feature__ from the [previous example](https://github.com/bustardcelly/cucumberjs-examples/blob/0.1.0.post/features/step_definitions/add-item.steps.js) and modify it to incorporate a __World__ context, it would look something like the following:

_/features/step_definitions/add-item.steps.js_

```  
'use strict';
var assert = require('assert');

module.exports = function() {

  var listItem;

  this.World = require(process.cwd() + '/features/support/world').World;

  this.Given(/^I have an empty grocery list$/, function(callback) {
    this.myList = this.createNewGroceryList();
    callback();
  });

  this.When(/^I add an item to the list$/, function(callback) {
    listItem = this.createGroceryItem();
    this.myList.add(listItem);
    callback();
  });

  this.Then(/^The grocery list contains a single item$/, function(callback) {
    assert.equal(this.myList.getAll().length, 1, 'Grocery List should grow by one item.');
    callback();
  });

  this.Then(/^I can access that item from the grocery list$/, function(callback) {
    assert.notEqual(this.myList.getItemIndex(listItem), -1, 'Added item should be found at non-negative index.');
    callback();
  });

};
```

You will notice that in place of the `myList` variable declaration is a definition of the __World__ context that will be the context for each __Step__ in a __Scenario__. The __World__ constructor is run at the start of each __Scenario__. As such, any properties have a life-cycle within the __Steps__ of each __Scenario__ that may be defined in this __Feature__. Again, this differs from the previous implementation where `myList` had a life-cycle through _all_ the __Steps__ of the module. 

_Note: The life of `this.myList` is realistically the same as the function local `myList` in the previous example, since it was being reassigned a new instance of `GroceryList` for each __Scenario__._

Additionally, you may notice that I have offloaded the creation or declaration of items to factory methods on the __World__ - it's just a habit or best practice of mine and allows me to "hide" such implementation details within a single context so I can focus more closely on the assertion rules.

The __World__ that is referenced in this __Steps__ module is pulled in from the _/features/support_ directory:

_/features/support/world.js_

```  
'use strict';

var GroceryList = require(process.cwd() + '/script/model/grocery-list');

var World = function World(callback) {

  this.myList = undefined;
  this.createNewGroceryList = function() {
    return GroceryList.create();
  };
  this.createGroceryItem = function() {
    return 'apple';
  };

  callback();

};

module.exports.World = World;
```

This defines the __World__ constructor on the `module.exports` and, when is invoked by [CucumberJS](https://github.com/cucumber/cucumber-js), is provided a `callback` delegate that you invoke when you are done "prepping" your __World__ context. There are other support hooks, such as _BeforeEach()_ and _AfterEach()_ that are available, but I won't discuss them in this article.

If we were to run our tests now:

```
$ node_modules/.bin/cucumber-js

......

2 scenarios (2 passed)
6 steps (6 passed)
```
We arrive at the same result as before: <span style="color:green;">passing</span>.

#### &gt; aside
This example may seem a little superfluos in its demonstration of the benefits of a __World__ context, but - for the sake of continuity - I wanted to show how I would modify the previous example to incorporate the __World__. As well, we will be building off of this structure when we approach incorporating tests within a browser context.

## Background
The __Background__ is part of the [Gherkin DSL](http://docs.behat.org/guides/1.gherkin.html) that allows you to provide an overarching context for all __Scenarios__ defined in a __Feature__. It is defined in your feature spec and details __Steps__ to be run prior to each __Scenario__ defined within the same spec. _It should be noted that if you use the Before Hooks the __Background__ steps are run after those hook methods._

I use __Background__ mainly to provide an environmental context for my __Feature__. With the state of JavaScript today - and sometimes wearing the full-stack developer hat - it is not uncommon that I would be writing a [node](http://nodejs.org) module for the server-side along with browser-based modules for the client-side within the same project. Additionally, with the various with module libraries and build tools available from the community today, I am sometimes on projects that provide a module for both the browser and [node](http://nodejs.org)! Crazy mixed up world. But I digress...

The point being: __Background__ is useful, in my testing workflow, in setting up a __Feature__ with the context of running the Tests under [node](http://nodejs.org) or in a browser.

We could modify the existing __Feature__ created in the [previous post](http://custardbelly.com/blog/blog-posts/2014/01/08/bdd-in-js-cucumberjs/index.html) to include a __Background__ used in defining the environment:

_/features/add-item.feature_

```
Feature: Shopper can add an item to their Grocery List
  As a shopper
  I want to add an item to my grocery list
  So that I can remember to buy that item at the grocery store

  Background:
    Given I have opened the grocery list application

  Scenario: Item added to grocery list
    Given I have an empty grocery list
    When I add an item to the list
    Then The grocery list contains a single item

  Scenario: Item accessible from grocery list
    Given I have an empty grocery list
    When I add an item to the list
    Then I can access that item from the grocery list
```

I have set up my __Background__ to explicitly state that I have opened up the application we are building. If you have been following along, we actually had never even created a main application file - we were just testing a collection model. So this brings a little more real-life context to the situation at hand; we are in the process of building an application that people will use and interact with.

Within the __Background__ you can add additional steps, such as _And_, _But_, _When_ and _Then_, yet I try to stick to only having a _Given_ followed by one or two _And_'s or _But_'s.

If we were to run that now:

```
$ node_modules/.bin/cucumber-js

U-U-

2 scenarios (2 undefined)
8 steps (2 undefined, 6 skipped)

You can implement step definitions for undefined steps with these snippets:

this.Given(/^I have opened the grocery list application$/, function(callback) {
  // express the regexp above with the code you wish you had
  callback.pending();
});
```

We'd see that neither of the _Scenarios_ are entered and we are alerted to an undefined step definition.

### Background Step Definition
I have a tendency to separate my background step definitions from my scenario step definitions - in both separate files and file naming convention. In other words, I would not add this step to the _/features/step_definitions/add-item.steps.js_. The main reason being that I reuse the same background step definitions across many features. As such, I place these steps in a seperate file that is prefixed with __background-__:

_/features/step_definitions/background-open-application.steps.js_

```
'use strict';
var assert = require('assert');

module.exports = function() {
  
  this.World = require(process.cwd() + '/features/support/world').World;

  this.Given(/^I have opened the grocery list application$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

};
```

Similar to how we just modified the Add Item __Feature__, we are defining our world and we now a have pending __Step__ to assert as passing. Now, technically I save the assertions for the _Then_ __Steps__, but when I work with __Background__'s I consider them pretty vital to the __Scenarios__ environment. Therefore, most of my __Background__'s have assertios, or in the very least, asynchronous request which invoke the callback on completion. _(A better example of this will be in a following post when I address testing under a browser)_.

Let's define how we expect the application to be started in the __World__ and what sort of validation we expect to assert that, in fact, we have opened the grocery list application so that we can edit its collection:

_/features/step_definitions/background-open-application.steps.js_

```
'use strict';
var assert = require('assert');

module.exports = function() {
  
  this.World = require(process.cwd() + '/features/support/world').World;

  this.Given(/^I have opened the grocery list application$/, function(callback) {
    this.groceryListApplication = this.openGroceryList();
    assert(this.groceryListApplication, 'Grocery List Application is required to be open for editability.');
    callback();
  });

};
```

Running that will <span style="color:red;">fail</span> both or our scenarios due to exceptions on the __World__:

```
$ node_modules/.bin/cucumber-js

F-F-

(::) failed steps (::)

TypeError: Object #<World> has no method 'openGroceryList'

Failing scenarios:
/Users/toddanderson/Documents/workspace/custardbelly/cucumberjs-example/features/add-item.feature:9 # Scenario: Item added to grocery list
/Users/toddanderson/Documents/workspace/custardbelly/cucumberjs-example/features/add-item.feature:14 # Scenario: Item accessible from grocery list

2 scenarios (2 failed)
8 steps (2 failed, 6 skipped)
```

We'll modify our __World__ to handle such properties and perform operations with regards to how we design the act of "opening" a new grocery list application. 

_Note: As mentioned previously in this and past articles, such details are really meant for a team discussion in architecture of the application. As such, I am taking liberties here in how I would go about providing as little code as possible to make the tests pass while adhering to my current design principles._

_/features/support/world.js_

```
'use strict';

var application = require(process.cwd() + '/script/app');
var GroceryList = require(process.cwd() + '/script/model/grocery-list');

var World = function World(callback) {

  this.groceryListApplication = undefined;
  this.myList = undefined;

  this.openGroceryList = function() {
    return application.newSession();
  };
  this.createNewGroceryList = function() {
    return GroceryList.create();
  };
  this.createGroceryItem = function() {
    return 'apple';
  };

  callback();

};

module.exports.World = World;
```

The __World__ has been modified with the previously expected properties from our __Background__ step and defines the creation of a new application through the `newSession` method on the `application` module. However, that module does not exist:

```
$ node_modules/.bin/cucumber-js

module.js:340
    throw err;
          ^
Error: Cannot find module '/Users/toddanderson/Documents/workspace/custardbelly/cucumberjs-example/script/app'
```

Let's quickly create the main application module:

_/script/app.js_

```
'use strict';

var application = {
  init: function() {
    // stub.
    return this;
  }
};

module.exports = {
  newSession: function() {
    return Object.create(application).init();
  }
};
```

In this module, we have defined the factory method `newSession` which generates a new `application` instance and returns the reference from a call to `init()`.

If we were to run our tests again:

```
$ node_modules/.bin/cucumber-js

........

2 scenarios (2 passed)
8 steps (8 passed)
```

We are back to <span style="color:green;">green</span>!

### take a breather
Alright, we just added some environment context to our tests using the __Background__ and _Given_ step(s), and are bringing more solidarity to the actual testing environment in so much as we have started to address the concept that the grocery list is to be interacted with from an application. This concept was known and assumed before, yet in our previous example, we did not address an actual __User Role__ (_The Shopper_) in context - we simply made sure that our gorcery list collection model was able to receiev and retain an item.

That's fine, we were getting started; we had some tasks and we are not going to throw away our work.

However, our previous example and step definitions should be modified to address the __User__ interacting with the application, in so much as operations being acted upon in context to an open grocery list application.

### get back to work
That last section was all very wordy. Basically the whole `myList` business that is going on the __World__ and references in the Add Item __Feature__ steps that we just did previously in this article, I want that to go away. I want to interact with a list instance held on the application.

### Refactorying

The first modification is in the Add Item __Feature__ steps:

_/features/step_definitions/add-item.steps.js_

```
'use strict';
var assert = require('assert');

module.exports = function() {

  var listItem;

  this.World = require(process.cwd() + '/features/support/world').World;

  this.Given(/^I have an empty grocery list$/, function(callback) {
    this.groceryListApplication.list.empty();
    callback();
  });

  this.When(/^I add an item to the list$/, function(callback) {
    listItem = this.createGroceryItem();
    this.groceryListApplication.list.add(listItem);
    callback();
  });

  this.Then(/^The grocery list contains a single item$/, function(callback) {
    assert.equal(this.groceryListApplication.list.getAll().length, 1, 'Grocery List should grow by one item.');
    callback();
  });

  this.Then(/^I can access that item from the grocery list$/, function(callback) {
    assert.notEqual(this.groceryListApplication.list.getItemIndex(listItem), -1, 'Added item should be found at non-negative index.');
    callback();
  });

};
```

We have removed all references to the `myList` property that we added to __World__ and replaced it with references to the `groceryListApplication.list` property.

```
$ node_modules/.bin/cucumber-js

.F-.F-

(::) failed steps (::)

TypeError: Cannot call method 'empty' of undefined
```

Back to <span style="color:red;">failing</span> at the first __Step__ in each __Scenario__; the reason being that the application instance has no `list` property.

_/script/app.js_

```
'use strict';

var GroceryList = require('./model/grocery-list');

var application = {
  init: function(list) {
    this.list = list;
    return this;
  }
};

module.exports = {
  newSession: function() {
    var newList = GroceryList.create();
    return Object.create(application).init(newList);
  }
};
```

In modifying the `app` module, we have designed it so that wehn `newSession` is invoked, a new instance of `GroceryList` is passed in.

Run that:

```
$ node_modules/.bin/cucumber-js

.F-.F-

(::) failed steps (::)

TypeError: Object #<Object> has no method 'empty'
```

… and we have no `empty` method on the `GroceryList`.

_/script/model/grocery-list.js_

```
'use strict';

var groceryList = {
  empty: function() {
    this.list.length = 0;
  },
  add: function(item) {
    this.list.push(item);
  },
  getAll: function() {
    return this.list;
  },
  getItemIndex: function(value) {
    var index = this.list.length;
    while(--index > -1) {
      if(this.list[index] === value) {
        return index;
      }
    }
    return -1;
  }
};

module.exports = {
  create: function() {
    return Object.create(groceryList, {
      'list': {
        value: [],
        writable: false,
        enumerable: true  
      }
    });
  }
};
```

We added the `empty` method to the `groceryList` object which essentially just clears the underlying `Array` instance.

Run the tests again:

```
$ node_modules/.bin/cucumber-js

........

2 scenarios (2 passed)
8 steps (8 passed)
```

And we are back to <span style="color:green;">green</span>! Successful reactor… so far :)

We have carefully moved our collection model that is under test to the application, but we have some lingering unneccessary code in our __World__. _I love removing code._

Here is our now cleaned up __World__:

_/features/support/world.js_

```
'use strict';

var application = require(process.cwd() + '/script/app');

var World = function World(callback) {

  this.groceryListApplication = undefined;

  this.openGroceryList = function() {
    return application.newSession();
  };
  this.createGroceryItem = function() {
    return 'apple';
  };

  callback();

};

module.exports.World = World;
```

Woohoo!

## Conclusion
I set out to address a few concepts associated with CucumberJS that I use regurlarly, but in doing so, I ended up modifying and refactoring the current example :) That wasn't the original intent when I started this post, but I was having fun.

* The __World__ is useful in defining context for each __Scenario__. I often use it to also hold factory and general operation methods that may be called across many different __Scenarios__
* __Background__ is useful in defining environment context across __Scenarios__ in separate __Features__. I often use it to assert that the proper environment is available before stepping into the __Scenarios__.

I think the work we went through in this post will be very beneficial when I introduce running tests under a browser. Stay tuned…