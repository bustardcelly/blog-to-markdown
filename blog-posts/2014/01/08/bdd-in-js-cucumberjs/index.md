---
title: 'BDD in JavaScript: CucumberJS'
author:
  name: 'todd anderson'
date: '2014-01-08'
---
I have previously written about __TDD__ in JavaScript, most notably using the BDD-style library [Jasmine](https://github.com/pivotal/jasmine) in a series on [building a Test-Driven Grocery List Application](http://custardbelly.com/blog/blog-pages/category/grocery-ls.html). In that posts series I went through thinking of User Stories for features and Scenarios as actual development tasks, and - reading back on it - it's all very green in my finding a way to deliver test-driven code. Nothing wrong with that and I will most likely look upon this and subsequent posts in the same manner. That said, I still hold true that TDD is the best way to deliver concise, tested and well thought-out code.

Since that time, however, I have incorporated a different tool into my __TDD__ workflow for JavaScript-based projects that affords me the integration of feature specs more closely to my development and truly encompasses my current ideal of __Behaviour Driven Development__: [CucumberJS](https://github.com/cucumber/cucumber-js). Essentially, it allows me to truly adhere to __TDD__ while developing from the outside in - running automated tests that fail until I have written code that supports a feature.

### &gt; assumptions and notes
It is assumed that you are familiar with [NodeJS](http://nodejs.org), [npm](https://npmjs.org/), developing node modules and common unit testing practices as these topics too large to discuss in this post.

Supported files related to this and any subsequent posts on this topic will be available at:  
[https://github.com/bustardcelly/cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples)

## CucumberJS
[CucumberJS](https://github.com/cucumber/cucumber-js) is the JavaScript version of the popular BDD tool [Cucumber](http://cukes.info/) (which itself was a rewrite of RSpec). It allows you to define Feature Specs in a Domain-Specific-Language (DSL) - called [Gherkin](http://docs.behat.org/guides/1.gherkin.html) - and run your specs using a command line tool which will report the passing and/or failing of scenarios and the steps they are comprised of.

It is important to note that __Cucumber__ itself does not provide a default assertion library. It provides a command line tool that will consume defined features and validate scenarios by running steps that are written in JavaScript. It is the developers choice include the assertion library to be used in making those steps pass or fail. It is my intent to clarify the process through the example in this post.

Install __CucumberJS__ in your project using npm:
```
$ npm install cucumber --save-dev
```

## Gherkin
If you had followed along in the previous [TDD Series](http://custardbelly.com/blog/blog-pages/category/grocery-ls.html), you will find the specs defined in that series similar to [Gherkin](http://docs.behat.org/guides/1.gherkin.html). In fact, I will be re-hashing a feature spec from that series to demonstrate working through your first cuke.

If we were to remake the [Grocery List]((http://custardbelly.com/blog/blog-pages/category/grocery-ls.html) application under TDD/BDD using __Cucumber__, we would first start with a feature using the __Gherkin__ syntax:

_/features/add-item.feature_
```
Feature: Shopper can add an item to their Grocery List
  As a shopper
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

The __Feature__ defines a business value, while the __Scenarios__ define the steps that provides that value. Most often, in the software development world, it is from these Scenarios that development tasks are taken on and QA tests are defined.

I stopped at two Scenarios, but we could very easily add more scenarios to this feature; immediately what comes to mind is validation of properties that allow for an item to be added or rejected. In hindsight, it could make more sense in creating seperate feature specs for such details. We could spend a whole post on such topics, though... let's get back to the feature already defined.

Within each __Scenario__ is a list of sequential __Steps__: _Given_, _When_ and _Then_. After each of those, you can optionally have _And_ and _But_, however - though necessary and unavoidable at times - I try to stay away from such additional step clauses. It is these steps that [CucumberJS](https://github.com/cucumber/cucumber-js) will execute after having consume this feature spec.

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

An important part of that snippet to understand is that there are only 4 steps to implement. In our __Feature__ we have 2 __Scenerios__ each with 3 __Steps__. There are a total of 6 steps, but we only need to define 4. The reason being that each __Scenario__ shared the same _Given_ and _When_ step; these only need to be defined once and will be run separately for each __Scenario__. Essentially, if you define similar __Steps__ using the same context, it will reuse the "setup" for a single __Step__ within each __Scenario__.

_I use "setup" in quotes because I mean it more in a role of defining context for __When__ and __Then__ steps._

_I don't want to get it confused with the setup/teardown methods of other unit testing practices - which are known as Before/After support tasks in CucumberJS - and carry more of a context of setting up an environment in which tests are then executed (such as filling a DB of users) and then tearing down that set up._

## Step Definitions
In the previous section, we saw that running [CucumberJS](https://github.com/cucumber/cucumber-js) against our Add Item Feature alerted us that we have undefined (and, though not printed in <span style="color:red;">red</span>, failing) scenarios to support the feature. By default __CucumberJS__ reads in all features from the __/features__ directory relative to where the command was run, but it could not locate the supported step files in which these methods are defined.

As mentioned previously, __CucumberJS__ does not provide an assertion library. The only assumption at this point - since the __CucumberJS__ tool is run under [NodeJS](http://nodejs.org/) - is that the supported steps will be loaded as node modules with an exported function to be executed. As we start implementing the steps, we will need to decide on the assertion library to use in validating our logic. We'll put that decision on the shelf at the moment and get the barebones setup to fail :)

To start, let's take those step definitions provided by the __CucumberJS__ ci tool and drop them into a node module:

_add-item.steps.js_
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

### Given
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
In the previous section, to make the _Given_ step pass on each __Scenario__ we implemented the beginnings of a Grocery List model generated from a factory method, `create`, from the `grocery-list` module. I don't want to get into a debate of object creation, the __new__ operator, classes and prototypes - at least not in this post - and will assume that you are familiar and comfortable (at least in reading code) with [Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) defined for ECMA 5.1 and available in JavaScript 1.8.5.

In reviewing the _When_ step for the __Scenarios__:
```
When I add an item to the list
```
we need to provide a way in which to add an item to the Grocery List instance create in the _Given_ - and do so in as little code to make the step pass...

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
We progressed through our step implementations and have reached the step(s) at which we assert operations and properties that prove that or scenario provides its intended value. As mentioned previously, [CucumberJS](https://github.com/cucumber/cucumber-js) does not provide an assert library. My preference in assertion libraries lies with a combination of [Chai](https://github.com/chaijs/chai), [Sinon](http://github.com/cjohansen/Sinon.JS) and [Sinon-Chai](http://github.com/domenic/sinon-chai), but for the examples in this post, I am just going to use the `assert` module that comes with [NodeJS](http://nodejs.org). I encourage you to check out other assertion libraries and leave a note if you have a favorite; perhaps one of these posts will address how I use __Chai__ and __Sinon__.

In reviewing the first __Scenario__'s _Then_ step:
```
Then The grocery list contains a single item
```
we will need to prove that the Grocery List instance grows by a factor or 1 for each new item added.

Updating out steps to define how we expect that to be validated:

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
We've pulled in the `assert` module and attempt to validate that the length of the Grocery List has grown by one after having run the previous step - _When_ - in adding the item.

## World

## Grunt Tasks

## Conclusion
In a following post I want to address how I use [CucumberJS](https://github.com/cucumber/cucumber-js) to run tests that rely on browser integration - ie, __window__ and __document__ access.

_In the past I have used [ZombieJS](http://zombie.labnotes.org/) to much success, but [Oscar Gonzalez](https://twitter.com/s9tpepper) has tipped me to him [Karma solution](https://github.com/s9tpepper/karma-cucumberjs) that I am excited to test-drive._

