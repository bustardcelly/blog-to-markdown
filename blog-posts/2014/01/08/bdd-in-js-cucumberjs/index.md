---
title: 'BDD in JavaScript: CucumberJS'
author:
  name: 'todd anderson'
date: '2014-01-19'
---
I have previously written about __TDD__ in JavaScript, most notably using the BDD-style library [Jasmine](https://github.com/pivotal/jasmine) in a series on [building a Test-Driven Grocery List Application](http://custardbelly.com/blog/blog-pages/category/grocery-ls.html). In that posts series I went through thinking of User Stories for Features and Scenarios as actual development tasks, and - reading back on it - it's all very green (no pun intended) in my finding a way to deliver test-driven code. Nothing wrong with that and I will most likely look upon this and subsequent posts in the same manner. That said, I still hold true that TDD is the best way to deliver concise, tested and well thought-out code.

Since that time, however, I have incorporated a different tool into my __TDD__ workflow for JavaScript-based projects that affords me the integration of Feature specs more closely to my development and truly encompasses my current ideal of __Behaviour Driven Development__: [CucumberJS](https://github.com/cucumber/cucumber-js). Essentially, it allows me to truly adhere to __TDD__ while developing from the outside in - running automated tests that fail until I have written code that supports a feature.

### &gt; assumptions and notes
For the examples in this post, it is assumed that you are familiar with [NodeJS](http://nodejs.org), [npm](https://npmjs.org/), developing node modules and common unit testing practices as these topics too large to discuss in this post.

Supported files related to this and any subsequent posts on this topic will be available at:  
[https://github.com/bustardcelly/cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples)

## CucumberJS
[CucumberJS](https://github.com/cucumber/cucumber-js) is a JavaScript port of the popular BDD tool [Cucumber](http://cukes.info/) (which itself was a rewrite of RSpec). It allows you to define Feature Specs in a Domain-Specific-Language (DSL) - called [Gherkin](http://docs.behat.org/guides/1.gherkin.html) - and run your specs using a command line tool which will report the passing and/or failing of scenarios and the steps they are comprised of.

It is important to note that __Cucumber__ itself does not provide a default assertion library. It is a testing framework providing a command line tool that consumes defined Features and validates Scenarios by running Steps that are written in JavaScript. It is the developers choice to include the desired assertion library used in order to make those steps <span style="color:green;">pass</span> or <span style="color:red;">fail</span>. It is my intent to clarify the process by example through a single Feature with multiple Scenarios in this post.

### Installation
You can install [CucumberJS](https://github.com/cucumber/cucumber-js) in your project using [npm](https://npmjs.org/):
```
$ npm install cucumber --save-dev
```

## Gherkin
If you had followed along in the previous [TDD Series](http://custardbelly.com/blog/blog-pages/category/grocery-ls.html), you will find the specs defined in that series similar to [Gherkin](http://docs.behat.org/guides/1.gherkin.html). In fact, I will be re-hashing a feature spec from that series to demonstrate working through your first cuke (aka, passing feature spec).

If we were to remake the [Grocery List]((http://custardbelly.com/blog/blog-pages/category/grocery-ls.html) application under TDD/BDD using __Cucumber__, we would first start with a feature using the __Gherkin__ syntax:

_/features/add-item.feature_
```
Feature: Shopper can add an item to their Grocery List
  As a grocery shopper
  I want to add an item to my grocery list
  So that I can remember to buy that item at the grocery store

  Scenario: Item added to grocery list
    Given I have an empty grocery list
    When I add an item to the list
    Then The grocery list contains a single item

  Scenario: Item accessible from grocery list
    Given I have an empty grocery list
    When I add an item to the list
    Then I can access that item from the grocery list
```

The __Feature__ defines a business value, while the __Scenarios__ define the steps that provides that value. Most often, in the software development world, it is from these __Scenarios__ that development tasks are taken on and QA tests are defined.

I stopped at two Scenarios, but we could very easily add more scenarios to this feature; immediately what comes to mind are item insertion rules and validation of properties that allow for an item to be added or rejected. In hindsight, it could make more sense in creating seperate feature specs for such details. We could spend a whole post on such topics, though... let's get back to the feature already defined.

Within each __Scenario__ is a list of sequential __Steps__: _Given_, _When_ and _Then_. It is these steps that [CucumberJS](https://github.com/cucumber/cucumber-js) will execute after having consume this feature spec. After each of those, you can optionally have _And_ and _But_, however - though necessary and unavoidable at times - I try to stay away from such additional step clauses.

### Running it
Having saved that down to a file in a __/features__ direcory, we can then run it under __Cucumber__:
```
$ node_modules/.bin/cucumber-js
```
By default, [CucumberJS](https://github.com/cucumber/cucumber-js) will consume all feature specs found in the relative __/features__ directory.

The current console output will look something like the following which essentially means that all the steps have not been located or defined:
```
UUUUUU

2 scenarios (2 undefined)
6 steps (6 undefined)

You can implement step definitions for undefined steps with these snippets:

this.Given(/^I have an empty grocery list$/, function(callback) {
  // express the regexp above with the code you wish you had
  callback.pending();
});

this.When(/^I add an item to the list$/, function(callback) {
  // express the regexp above with the code you wish you had
  callback.pending();
});

this.Then(/^The grocery list contains a single item$/, function(callback) {
  // express the regexp above with the code you wish you had
  callback.pending();
});

this.Then(/^I can access that item from the grocery list$/, function(callback) {
  // express the regexp above with the code you wish you had
  callback.pending();
});
```
So we have 6 undefined __Steps__ that make up 2 __Scenarios__ and the __CucumberJS__ ci tool even provides examples of defining them!

An important part of that snippet to understand is that there are only 4 steps to implement. In our __Feature__ we have 2 __Scenerios__ each with 3 __Steps__. There are a total of 6 steps, but we only need to define 4. The reason being that each __Scenario__ shares the same _Given_ and _When_ step; these only need to be defined once and will be run separately for each __Scenario__. Essentially, if you define similar __Steps__ using the same context, it will reuse the "setup" for a single __Step__ within each __Scenario__.

_I use "setup" in quotes because I mean it more in a role of defining context for __When__ and __Then__ steps._

_I don't want to get it confused with the setup/teardown methods of other unit testing practices - which are known as Before/After support tasks in CucumberJS - and carry more of a context of setting up an environment in which tests are then executed (such as filling a DB of users) and then tearing down that set up._

## Step Definitions
In the previous section, we saw that running [CucumberJS](https://github.com/cucumber/cucumber-js) against our Add Item Feature alerted us that we have undefined (and, though not printed in <span style="color:red;">red</span>, failing) scenarios to support the feature. By default __CucumberJS__ reads in all features from the __/features__ directory relative to where the command was run, but it could not locate the supported step files in which these methods are defined.

As mentioned previously, __CucumberJS__ does not provide an assertion library. The only assumption at this point - since the __CucumberJS__ tool is run under [NodeJS](http://nodejs.org/) - is that the supported steps will be loaded as node modules with an exported function to be executed. As we start implementing the steps, we will need to decide on the assertion library to use in validating our logic. We'll put that decision on the shelf at the moment and get the barebones setup to fail :)

To start, let's take those step definitions provided by the __CucumberJS__ ci tool and drop them into a node module:

_/features/step_definitions/add-item.steps.js_
```
'use strict';

module.exports = function() {

  this.Given(/^I have an empty grocery list$/, function(callback) {
    callback.pending();
  });

  this.When(/^I add an item to the list$/, function(callback) {
    callback.pending();
  });

  this.Then(/^The grocery list contains a single item$/, function(callback) {
    callback.pending();
  });

  this.Then(/^I can access that item from the grocery list$/, function(callback) {
    callback.pending();
  });

};
```
By default, __CucumberJS__ will look for steps to be loaded within a folder titled `step_definitions` under the __/features__ directory relative to where you issue the command. You can optionally use the `-r` option to have __CucumberJS__ load steps from another location. Running the default is the same as setting the following step definition directory option:

```
./node_modules/.bin/cucumber-js -r features/step_definitions
```
The console output will now look like the following:
```
P--P--

2 scenarios (2 pending)
6 steps (2 pending, 4 skipped)
```
Not too suprising seeing as we notify the callback of a `pending` state. [CucumberJS](https://github.com/cucumber/cucumber-js) enters the first step (_Given_) and is immediately returned with a pending notification. As such, it doesn't bother with entering any subsequent steps and marks them as skipped.

_Note: It is too much to get into a discussion about [client-side modules and AMD vs CommonJS](http://addyosmani.com/writing-modular-js/). For the purposes of this example I will be using CommonJS, as I my current interests lie in utilizing [Browserify](https://github.com/substack/node-browserify) for client-side development. For a long time, I was a proponent of [RequireJS](http://requirejs.org/) and AMD. Again, a whole other discussion :)_

### Given
<hr/>
To get closer to <span style="color:green;">green</span>, we'll tackle the __Given__ step first:

_/features/step_definitions/add-item.step.js_
```
'use strict';

var GroceryList = require(process.cwd() + '/script/model/grocery-list');

module.exports = function() {

  var myList;

  this.Given(/^I have an empty grocery list$/, function(callback) {
    myList = GroceryList.create();
    callback();
  });
  ...

};
```
If we were to run that again, we'd get an exception right away:
```
$ ./node_modules/.bin/cucumber-js

module.js:340
    throw err;
          ^
Error: Cannot find module './script/model/grocery-list'
    at Function.Module._resolveFilename (module.js:338:15)
    at Function.Module._load (module.js:280:25)
    at Module.require (module.js:364:17)
    at require (module.js:380:17)
    at Object.<anonymous> (/Users/toddanderson/Documents/workspace/custardbelly/cucumberjs-example/features/step_definitions/add-item.steps.js:3:19)
```
Which is understandable, we haven't any other code but this step definition module and are trying to require a module that doesn't exist. In sticking with TDD, this is a good thing - we know why it's failing and we expect it; I would be pulling my hair out if it _didn't_ throw an exception!

In order to get this to pass, we'll create a node module in the specified directory and which exports an object with a `create` method:

_/script/model/grocery-list.js_
```
'use strict';

module.exports = {
  create: function() {
    return Object.create(null);
  }
};
```
We have provided the minimal requirement to get our _Given_ step to pass. We'll worry about the details as we approach the latter steps.

Run that again, and __CucumberJS__ enters in to the _When_ step of each __Scenario__ and aborts due to pending return.
```
$ ./node_modules/.bin/cucumber-js

.P-.P-

2 scenarios (2 pending)
6 steps (2 pending, 2 skipped, 2 passed)
```

### When
<hr/>
In the previous section, to make the _Given_ step pass on each __Scenario__ we implemented the beginnings of a Grocery List model generated from a factory method, `create`, from the `grocery-list` module. I don't want to get into a debate of object creation, the __new__ operator, classes and prototypes - at least not in this post - and will assume that you are familiar and comfortable (at least in reading code) with [Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) defined for ECMAScript 5.

In reviewing the _When_ step for the __Scenarios__:
```
When I add an item to the list
```
we need to provide a way in which to add an item to the Grocery List instance created in the _Given_ - and do so in as little code to make the step pass...

First, we'll define our expectation of the make up and `add` signature of the Grocery List in the step definitions:

_/features/step_definitions/add-item.step.js_
```
...
module.exports = function() {

  var myList,
      listItem = 'apple';

  this.Given(/^I have an empty grocery list$/, function(callback) {
    myList = GroceryList.create();
    callback();
  });

  this.When(/^I add an item to the list$/, function(callback) {
    myList.add(listItem);
    callback();
  });
  ...

};
```
If we run that again:
```
$ ./node_modules/.bin/cucumber-js

.F-.F-

(::) failed steps (::)

TypeError: Object object has no method 'add'
```
Oooo-weee! Now we're talking. Big, bright <span style="color:red;">red F's</span>. :)

To make that get back to passing, we'll modify `grocery-list` with as little code as possible:

_/script/model/grocery-list.js_
```
'use strict';

var groceryList = {
  add: function(item) {
    //
  }
};

module.exports = {
  create: function() {
    return Object.create(groceryList);
  }
};
```
Run again, and __CucumberJS__ has progressed to the _Then_ steps which are reporting a `pending` state.
```
$ ./node_modules/.bin/cucumber-js

..P..P

2 scenarios (2 pending)
6 steps (2 pending, 4 passed)
```

### Then
<hr/>
We progressed through our step implementations and have reached the step(s) at which we assert operations and properties that prove that our scenario provides its intended value. As mentioned previously, [CucumberJS](https://github.com/cucumber/cucumber-js) does not provide an assertion library. My preference in assertion libraries is a combination of [Chai](https://github.com/chaijs/chai), [Sinon](http://github.com/cjohansen/Sinon.JS) and [Sinon-Chai](http://github.com/domenic/sinon-chai), but for the examples in this post, I am just going to use the `assert` module that comes with [NodeJS](http://nodejs.org). I encourage you to check out other assertion libraries and leave a note if you have a favorite; perhaps one of these posts will address how I use __Chai__ and __Sinon__.

_Note: This section will be a little example heavy as we quickly switch from modifying our code and run the spec runner frequently._

### First Scenario
In reviewing the first __Scenario__'s _Then_ step:
```
Then The grocery list contains a single item
```
we will need to prove that the Grocery List instance grows by a factor of 1 for each new item added.

Update the step to define how we expect that specification to be validated:

_/feature/step_definitions/add-item.step.js_
```
...
var assert = require('assert');
...
module.exports = function() {
...

  this.Then(/^The grocery list contains a single item$/, function(callback) {
    assert.equal(myList.getAll().length, 1, 'Grocery List should grow by one item.');
    callback();
  });

...
};
...

```
We've pulled in the `assert` module and attempt to validate that the length of the Grocery List has grown by a value of 1 after having run the previous step - _When_ - in adding the item.

Run that and we'll get an exception:
```
$ ./node_modules/.bin/cucumber-js

..F..P

(::) failed steps (::)

TypeError: Object #<Object> has no method 'getAll'
```

Let's add that method to our Grocery List model:

_/script/model/grocery-list.js_
```
'use strict';

var groceryList = {
  add: function(item) {
    //
  },
  getAll: function() {
    //
  }
};

module.exports = {
  create: function() {
    return Object.create(groceryList);
  }
};
```

And back to running our specs:
```
$ ./node_modules/.bin/cucumber-js

..F..P

(::) failed steps (::)

TypeError: Cannot read property 'length' of undefined
```
Seeing as the code is not returning anything from `getAll()`, we can't access a `length` property for our assertion test.

If we modify the code to return an Array:

_/feature/step_definitions/add-item.step.js_
```
...
getAll: function() {
  return [];
}
...
```
And run the specs again, we'll get the assertion error message we provided:
```
$ ./node_modules/.bin/cucumber-js

..F..P

(::) failed steps (::)

AssertionError: Grocery List should grow by one item.
```
Now, we have a proper <span style="color:red;">Fail</span> being reported to us from an assertion that causes the step to not pass. Hooray!

### -- take a breather --
Let's pause here for a second before adding more code to get this step to <span style="color:green;">pass</span>. The issue at hand is not actually adding an item to the array being returned, it is more about ensuring that an item is added through the `add` method and the result from `getAll` being a list extended with that item.

Implementation details that are involved in making this test pass is where your team uses their architecture experience, but care is required that only the most essential code is added and not to go overboard in thinking about the internals of the Grocery List collection model. It's a slippery tight-rope that could easily fall down a rabbit hole - just like that poorly-worded metaphor :)

### -- get back to work! --
For the purposes of this examples, we'll use the `propertiesObject` argument of `Object.create` to define a `list` getter that will serve as a mutable array for our grocery list items:

_/script/model/grocery-list.js_
```
'use strict';

var groceryList = {
  add: function(item) {
    this.list.push(item);
  },
  getAll: function() {
    return this.list;
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
If we run that, we'll find that the first __Scenario__ is now passing!

```
$ ./node_modules/.bin/cucumber-js

.....P

2 scenarios (1 pending, 1 passed)
6 steps (1 pending, 5 passed)
```

### Second Scenario
In reviewing the final step of our 2nd __Scenario__, the pending implementation is accessing the added item:
```
Then I can access that item from the grocery list
```

To make this step pass we need to verify that we can access the item appended to the Grocery List by invoking `add()` with an item. 

As with the implementation of accessing the length of the Grocery List, there are several ways in which we could make this test pass in the code. Again, I feel this is where software development experience and taste comes into play with regards to architecture, but I also do prefer _trying_ to produce the least amount of code possible; and I will be the first to admit that sometimes I go a little absent-minded and create more code than is necessary... hence, _trying_ :)

That said, we also have to take into account language and environment specifications in how we address making the assertion pass - and the browser, with its history, has many to consider. That is not a slight, it is just a forethought in setting expectations for requirements.

Specifically: suppose we were to say that the step can be verified using the `Array.indexOf()` method on the collection returned from 'getAll()' on the Grocery List object? Without a polyfill, then we are limiting ourselves to passing assertions on [IE 9 and older](http://kangax.github.io/es5-compat-table/#Array.prototype.indexOf). Such considerations are just the tip of the iceberg when deciding about what to introduce into your codebase in order to have your tests pass, and really should be left up to a team discussion on what is considered necessary to get the product to production.

I could go on and on, but let's just assume we want to cover all bases when it comes to browsers (IE 6 and up, shudder). In my opinion, to make this second __Scenario__ turn green, we will add a `getItemIndex()` method with the following signature:
```
+ getItemIndex(itemValue):int
```

We'll first modify the step to fail:

_/feature/step_definitions/add-item.step.js_
```
this.Then(/^I can access that item from the grocery list$/, function(callback) {
  assert.notEqual(myList.getItemIndex(listItem), -1, 'Added item should be found at non-negative index.');
  callback();
});
```
The acceptance in order for this test to pass is that the index at which the added item resides in the collection is non-negative. For this scenariom we are not trying to validate a specification as to _where_ new item is added in a list (eg, prepended or appended), but simply that it is accessible.

Running that will produce an exception:
```
$ ./node_modules/.bin/cucumber-js

.....F

(::) failed steps (::)

TypeError: Object #<Object> has no method 'getItemIndex'
```

Let's modify our __Grocery List__ object to support the `getItemIndex` method:

_/script/model/grocery-list.js_
```
'use strict';

var groceryList = {
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
In our implementation of `getItemIndex`, the list is traversed and, if item is found, the index is returned. Otherwise, a value of -1 is returned. Essentially, how the `Array.indexOf` method works of ECMAScript 5.

_Note: I know it seems silly to use Object.create from ECMAScript 5, but not Array.indexOf. The reason - mostly - being that I normally always include a polyfill for Object.create and not for Array.indexOf. I suppose habit._

Now if we run the specs again under [CucumberJS](https://github.com/cucumber/cucumber-js):
```
$ ./node_modules/.bin/cucumber-js

......

2 scenarios (2 passed)
6 steps (6 passed)
```

Our cukes are <span style="color:green;">GREEN</span>! (This is the point you wipe your brow and slow clap).

## Conclusion
In this post, I introduce how I use the BDD tool [CucumberJS](https://github.com/cucumber/cucumber-js) in order to adhere to Test Driven Development in JavaScript. I went through using an example of a single __Feature__ with two __Scenarios__ and turning <span style="color:red;">failing</span> __Steps__ to <span style="color:green;">green</span> cukes. If you are unfamiliar with the process with making tests fail first only to produce code to make the test pass, I hope you followed along; I may be wordy and the process could appear to take a lot of time, but development under such practices does start to move smoothly once you get in the groove. Additionally, I think there is a huge reward in having your code under a test harness when it comes to refactoring and bug fixing - both in developer health and business.

## The Future
I was going to cover the following topics in this post but have decided to exclude with the hopes of re-addressing in a later post:

* The [World](https://github.com/cucumber/cucumber-tck/blob/master/world.feature) support utility
* Build integration ([Grunt](http://gruntjs.com/) and [Gulp](http://gulpjs.com/)) and automation
* Report generation for Continuous Integration

Additionally, in a following post I want to address how I use [CucumberJS](https://github.com/cucumber/cucumber-js) to run tests that rely on browser integration - ie, __window__ and __document__ access.

_In the past I have used [ZombieJS](http://zombie.labnotes.org/) to much success, but [Omar Gonzalez](https://twitter.com/s9tpepper) has tipped me to him [Karma solution](https://github.com/s9tpepper/karma-cucumberjs) that I am excited to test-drive._