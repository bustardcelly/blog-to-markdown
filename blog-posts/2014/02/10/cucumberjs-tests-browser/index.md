---
title: 'BDD in JavaScript IV: CucumberJS and The Browser'
author:
  name: 'todd anderson'
date: '2014-02-10'
---
In my [previous post](http://custardbelly.com/blog/blog-posts/2014/01/29/cucumberjs-build/index.html) in this series detailing how I use [CucumberJS](https://github.com/cucumber/cucumber-js), I addressed a few common bulid tools in JavaScript to automate the watching and running of tests. While beneficial to a proper agile workflow, I did not introduce any new concepts or development information directly associated with using CucumberJS, itself.

In this article, I intend to take on a pretty meaty subject - running your cukes in the browser. It is a subject I have grappled with for some time and have tried different solutions, eventually [creating my own](https://github.com/bustardcelly/cucumberjs-browser). 

### &gt; code
Supported files related to this and any subsequent posts on this topic will be available at:  
[https://github.com/bustardcelly/cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples)

_Disclaimer: I did not start out this series to promote the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) tool. In fact, in came to life as a result of this series :)_

## Why The Browser
[CucumberJS](https://github.com/cucumber/cucumber-js) is built on [Node](http://nodejs.org). As such, the CLI tool that we have been running to verify our tests in previous articles is living in that environment. 

This is well and good if we were creating an application that was intended to live within Node. However, what if we are building an application that is to live inside the browser, which is often the case for me as a, primarily, Front End Developer? How do we go from __Features__ detailing DOM interaction to passing __Step Definitions__ that require a browser environment using [CucumberJS](https://github.com/cucumber/cucumber-js)?

## Options
The following options are those I have found or been alerted to by the community. I have used a few of them to much benefit, but felt there was always one or two things that kept me from truly embracing them as a good solution. I hope to showcase their strengths and weaknesses to allow you to make a more informed decision on what may be the best for your team.

### Writing Specs in the DOM
Example: [https://github.com/cucumber/cucumber-js/blob/master/example/index.html](https://github.com/cucumber/cucumber-js/blob/master/example/index.html).

This is an example from the [CucumberJS](https://github.com/cucumber/cucumber-js) team that demonstrates how to define __Features__ and __Step Definitions__ in `textarea` elements. These are read and evaluated at runtime by the bundled browser-based CucumberJS library, with the assertions being printed to the DOM as well.

A reasonable approach, and much of its implementation was an inspiration for my [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) tool (addressed later). My main issue with incorporating this into my development and testing workflow is the break in having my __Features__, __Step Definitions__ and test support as entities residing in separate files as we have done in the examples of previous articles in this series. Instead of curating __Features__ in a much more organized way involving the file system, I would need to maintain them in the textual values defined for `textarea`s in a web page. My workflow just seemed interrupted in doing so; I could not directly relate a Ticket in our Issue Tracker with a __Feature__ file and its associated __Step__ file(s).

### ZombieJS
There are small examples on the landing page for [CucumberJS](https://github.com/cucumber/cucumber-js) repo that are fairly easy to follow and there is a great example [Antony Denyer](http://www.antonydenyer.co.uk/) as well: [https://github.com/antonydenyer/zombiejsplayground](https://github.com/antonydenyer/zombiejsplayground).

The [ZombieJS](http://zombie.labnotes.org/) API is actually quite easy to understand and use and have incorporated using Zombie in a couple of my projects. The main issue I have in using Zombie in all my projects is "trust". Not trust in Zombie as a good tool, trust in that the assertions are cross-browser; under the covers, it is a mixture of the DOM library [JSDom](http://jsdom.org/), [Contextify](https://github.com/brianmcd/contextify) for V8 execution and various other - very excellent, I should say - libraries that are used to 'emulate' a browser in a headless manner.

Again, I don't want that explanation to take away from the excellent tool that [ZombieJS](http://zombie.labnotes.org/) is and its usefulness and benefits it has provided me in previous (and future) projects. Infact, while I was [extolling its virtues over twitter](https://twitter.com/_toddanderson_/status/414210165001699328), [Omar Gonzalez](https://twitter.com/s9tpepper) reminded me that it is best to run tests in browsers and tipped me to his project [karma-cucumberjs](https://github.com/s9tpepper/karma-cucumberjs).

Omar was right. While it has a nice API and is quick and easy to get working, it is not a real browser. In the end, I may have false positives and if I was to go to production with my application that requires cross-browser support, issues may arise that the tests did not catch under Zombie.

### karma-cucumberjs
As mentioned in the previous section, respected TDD'er [Omar Gonzalez](https://twitter.com/s9tpepper) has a project - [karma-cucumberjs](https://github.com/s9tpepper/karma-cucumberjs) - that allows you to define Cucumber specs for the browser and provides an adapter for the [Karma](http://karma-runner.github.io/0.10/index.html) testrunner.

Now, I have not personally tried it (apologies, Omar!), nor do I use [Karma](http://karma-runner.github.io/0.10/index.html). Both are filed under `Things to Look Into`. I will say, what kept me from jumping in and testing the waters was similar to the reason for not using the [DOM example](https://github.com/cucumber/cucumber-js/blob/master/example/index.html) provided by the [CucumberJS](https://github.com/cucumber/cucumber-js) team: I had to write my __Step Definitions__ differently than I normally would - specifically, I would have to wrap them in a `addStepDefinitions` function.

Again, I viable solution from a venerable developer whom I trust, but I have not personally used because I wanted to keep my workflow relatively the same as I would in defining __Features__ and __Step Definitions__ for specs don't need to know about or run under a browser environment.

### cucumberjs-browser
Not finding a solution that afforded me to simply deploy my __Features__, __Steps Definitions__ and subsequent support files to be run in the browser, I decided to make one that would allow me to; and so [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) was born.

In basic terms, what [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) does is bundle the __Features__, __Step Definitions__ and any support files into standalone modules (using [browserify](http://browserify.org/)) and defines them for a page using a [lodash](http://lodash.com/docs) template. Included, as well, is the bundled library from [CucumberJS](https://github.com/cucumber/cucumber-js). 

When the page is loaded in any browser, the specs are run just as they normally would be from the command line. Though the CLI options, you have the ability to define a listener that will handle the passing and failing of steps. _Current support for [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) in console and basic UI. More to come..._

The [README](https://github.com/bustardcelly/cucumberjs-browser/blob/master/README.md) is probably the best place to start as it will be kept more up to date than this post in the future, but here is a quick rundown:

#### Installation
You install [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) globally through npm:

```
$ npm install -g cucumberjs-browser
```

#### Usage
```
$ cucumberjs-browser [-o outdir] [-f format] [--tmpl template] [--features features]
```

There are defaults for each of these options and you most likely will only really need to provide a custom template to be used based on the requirements of your project. The basic one that ships with the tool does nothing but load and run your specs: [cucumber-testrunner.template](https://github.com/bustardcelly/cucumberjs-browser/blob/master/template/cucumber-testrunner.template). This should be a jumping off point in which you add your css and scripts and anything else required to get your tests passing. Again, it uses [lodash](http://lodash.com/docs) to generate the page, so bear that in mind.

I don't want to get into more wordy specifics without a good example, so without further ado...

## Fail first
In a pervious article in this series, we added an `add-item` feature that detailed the scenarios of adding and accessible an item from a collection of the Grocery List application. This is still a valid logical feature that normally I would not modify to incorporate User Interaction when incorporating __Features__ related to the application being browser-based. Instead, I would create a new __Feature__ that details how a User can add and view new item in a browser environment.

Let's define out spec:

_/features/add-item-view.feature_

```
Feature: Shopper can add and view new item in Grocery List
  As a shopper using the browser-based app
  I want to add an item to my grocery list view
  So that I can remember to buy that item at the grocery store

  Background: Grocery List Application is Open
    Given I have opened the grocery list application

  Scenario: Select of Add Item opens input
    Given I have an empty grocery list view
    When I select to add an item
    Then I can provide a name for the grocery list item

  Scenario: Submit of valid item adds item to list
    Given I have an empty grocery list view
    When I select to add an item
    And I provide a valid grocery list item name
    Then The item is added to the grocery list view

  Scenario: Submit of valid item adds item to collection
    Given I have an empty grocery list view
    When I select to add an item
    And I provide a valid grocery list item name
    Then The item is accessible from the grocery list collection
```

We have declared three __Scenarios__ that define the __Feature__ criteria in which a User interacts with DOM elements to add and view a new item to the Grocery List application.

Running that produces the expected `undefined` steps notification:

```
$ npm run test
.UUU.UUUU.UUUU........

5 scenarios (3 undefined, 2 passed)
22 steps (11 undefined, 11 passed)
```

We have a few things we need to address, but before we get into the nitty-gritty, let's turn this <span style="color:red;">red</span> in true TDD fashion while filling out our API expectation of the _Given_ in each of the __Scenarios__

_/features/step_definitions/add-item-view.steps.js_

```
var assert = require('assert');

module.exports = function() {
  'use strict';

  this.World = require('../support/world').World;

  this.Given(/^I have an empty grocery list view$/, function(callback) {
    this.emptyGroceryListView();
    assert.equal(this.groceryListView.childNodes.length, 0);
    callback();
  });

});
```

```
$ npm run test
.F.F.F........

(::) failed steps (::)
...
Failing scenarios:
/Users/toddanderson/Documents/workspace/custardbelly/cucumberjs-example/features/add-item-view.feature:9 # Scenario: Select of Add Item opens input
/Users/toddanderson/Documents/workspace/custardbelly/cucumberjs-example/features/add-item-view.feature:14 # Scenario: Submit of valid item adds item to list
/Users/toddanderson/Documents/workspace/custardbelly/cucumberjs-example/features/add-item-view.feature:20 # Scenario: Submit of valid item adds item to collection

5 scenarios (3 failed, 2 passed)
22 steps (3 failed, 8 skipped, 11 passed)
```

Huge explosion. Red everywhere. Dogs and cats, living together. Mass hysteria.

That's good, we expect the world to crash with nothing to support our claims of an "empty grocery list view". What does that even mean in the current context? We haven't even a web page to view our Grocery List. These all are issues we need to address in resolving just this single __Step Definition__.

## Client-Side Script
This is a good point to discuss the client-side script that will act as our main entry point for the browser-based Grocery List Application. 

If you have been following along with the examples in this series, we have been slowly building up specs for our Grocery List Application, yet it has been done so while testing under the [Node](http://nodejs.org)-based [CucumberJS](https://github.com/cucumber/cucumber-js) CLI tool. Nothing wrong with that, and in fact we have a good starting point in which we can ensure that a proper collection model is maintained with regards to adding and accessing items.

However, now we are moving to a browser environment and need to address how we will load and interact with our application within the browser context. Because we have been developing node modules (to be tested under CucumberJS specs) which utilize the [CommonJS module format](http://wiki.commonjs.org/wiki/Modules/1.1) we can easily bundle our scripts for the browser using the wonderful [browserify](http://browserify.org/) tool.

_Disclaimer: Hats off to [Ben Clinkenbeard](http://benclinkinbeard.com/) for finally persuading me to look into [browserify](http://browserify.org/) over my years-long obsession with [RequireJS](http://requirejs.org/)._

### Browserify
It is too much for this article to address [browserify](http://browserify.org/) and its history and attributes. There are several articles that are google-able that explain what __browserify__ is, how to use it, and its virtues and disadvantages over AMD. I implore you to check them out and make a sound judgement as it relates to your team and project requirements.

That said, I have found [browserify](http://browserify.org/) extremely beneficial and am going to use it for the examples in this series in delivering the client-side scripts.

First order of business is to install __browserify__ as you would any project-local node module:

```
$ npm install browserify
```

Now we need to define how we want our module to be bundled for the browser. If we are talking a single entry point - which most main files are - I prefer to define a global name to assign our module so it is easily accessible on the DOM. Keeping in mind that we are primarily bundling our code so we can do TDD, we define an proper output directory that won't get mixed up with our distribution:

```
$ mkdir test/script && \
  node node_modules/.bin/browserify script/app.js -o test/script/app.js -s grocerylist
```

With that command, we created the output directory for our main file - `app.js` - and bundled the _script/app.js_ file with any dependencies (which currently were only _script/model/grocery-list.js_). As well, our module is accessible on the `window` object as `grocerylist`.

### Index File
So we have our bundled scripts and an exposed entry to our application through `window.grocerylist`, and now we need a way to access and view the application - an html file.

Because we will be using the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) tool to bundle our features and specs to be run under a browser environment, we will copy and modify the default template shipped with that tool to suit our needs for our application.

At this stage, we are simply going to add a `script` tag for our application bundle we created in the previous section:

_template/testrunner.html_

```
<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <script src="lib/cucumber.js"></script>
    <script src="features.js"></script>
    <% _.each(modules, function(module) { %>
    <script src="<%= module.filepath %>"></script>
    <% }); %>
    <% if(listener.exists) { %>
      <script src="script/<%= listener.filename %>"></script>
    <% }; %>
  </head>
  <body>
    <script>
      (function(window) {
        
        // Need to concat all *.features > browserify.standalone = cukefeatures
        var features = window.cukefeatures.split('&crarr').join('\n');

        // Need to concat all support + step_definitions, and export as a function
        var support = function() {
          this.Given = this.When = this.Then = this.defineStep;
          // Would be put on window if /support/world found.
          if('world' in window) {
            this.World = window['world'].World;
          }
          <% _.each(steps, function(step) { %>
          window['<%= step.name %>'].call(this);
          <% }); %>
        };

        var runtime = Cucumber(features, support);
        <% if(listener.exists) { %>
        runtime.attachListener(window.cukelistener.instance());
        <% }; %>
        runtime.start(function(){
          <% if(listener.exists) { %>
          window.cukelistener.instance().complete();
          <% } else { %>
          console.log(Array.prototype.slice.call(arguments));
          <% }; %>
        });
      }(window));
    </script>
    <script src="./script/app.js"></script>
  </body>
</html>
```

Most of what is in this page tmeplate is copied from the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) project. The only addition - at this point - is the script appended within the `body` that will load our app bundle.

If we were to run the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) tool and generate our bundled app, specs and template:

```
$ cucumberjs-browser -o test --tmpl template/testrunner.html -f tap
```

That will generate the JavaScript bundle files for the __Features__, __Step Definitions__ and support files we have been creating and curating in this series, along with the templated HTML file with our resources defined.

If we were to open that HTML file - _/test/cucumberjs-testrunner.html_ - and opened the Console of our developer tools, we would see a [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) report of our test... <span style="color: red;">failing</span> :)

If we were to change the format option:

```
$ cucumberjs-browser -o test --tmpl template/testrunner.html -f ui
```

We would see those same <span style="color:red;">failing</span> tests, but this time on the DOM.

We have gone from failing on the command line to failing in the browser... isn't it glorious :)

### Automate all the things
We had [previously automated out testing](http://custardbelly.com/blog/blog-posts/2014/01/29/cucumberjs-build/index.html) under the node-based environment; it was a simple as setting up a file watcher and issuing a command to run the [CucumberJS](https://github.com/cucumber/cucumber-js) CLI tool on change.

Our process has now become a little more involved, but not anything to complex that an automated build and test procedure couldn't be implemented. The only drawback, as it stands currently, is that feedback is more visual as it now resides in the DOM and/or Console of a browser - so instead of coding in an editor and watching it fail on the command line, we are now going to need to focus on failures reported in the browser as we TDD.

## Back to Passing

## The cucumberjs-browser tool