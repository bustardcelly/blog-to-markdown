---
title: 'BDD in JavaScript V: CucumberJS and The Browser, II'
author:
  name: 'todd anderson'
date: '2014-02-12'
---
"Whoa. Whoa. Whoa. You can't just use roman numerals all over the place in your post titles..."

In the [previous article](http://custardbelly.com/blog/blog-posts/2014/02/10/cucumberjs-tests-browser/index.html) I addressed the available libraries and practices to have your [CucumberJS](https://github.com/cucumber/cucumber-js) specs running in a browser environment, as well as introduced a new project begun by me: [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser).

I had originally had the entirety of this post in the previous post, but felt that it was a little bit of information overload. As such, I decided to split them into two posts.

The intent of this article is to address inforporating [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) into our current Grocery List Application example and continue developing features that involve User Interaction with the DOM.

### &gt; code
Supported files related to this and any subsequent posts on this topic will be available at:  
[https://github.com/bustardcelly/cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples)

## cucumberjs-browser
The [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) CLI tool was created to provide a means in which to write my __Features__, __Step Definitions__ and support files as I normally would for a project, and bundle them to be run in a browser and provide custom reporting.

First order of business for incorporating the __cucumberjs-browser__ tool into the Grocery List applicaiton project we have been working through in this series is to install the tool:

```
$npm install -g cucumberjs-browser
```

(you may need to `sudo`) 

That should install the tool and now be accessible from the command line. The [README](https://github.com/bustardcelly/cucumberjs-browser/blob/master/README.md) is the best place to find the most up-to-date infromation about the tool, but the general usage is as follows:

```
$ cucumberjs-browser [-o outdir] [-f format] [--tmpl template] [--features features]
```

We'll get into how we will use it with our project and the options in a bit, but before then...

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

<div style="width: 100%; overflow-x: scroll; background-color:#fff; text-align: center;">
  <img src="http://custardbelly.com/blog/images/cucumberjs-browser-2.png" alt="cucumberjs in the browser">
</div>

We have gone from failing on the command line to failing in the browser... isn't it glorious :)

### Automate all the things
We had [previously automated out testing](http://custardbelly.com/blog/blog-posts/2014/01/29/cucumberjs-build/index.html) under the node-based environment; it was a simple as setting up a file watcher and issuing a command to run the [CucumberJS](https://github.com/cucumber/cucumber-js) CLI tool on change.

Our process has now become a little more involved, but not anything to complex that an automated build and test procedure couldn't be implemented. The only drawback, as it stands currently, is that feedback is more visual as it now resides in the DOM and/or Console of a browser - so instead of coding in an editor and watching it fail on the command line, we are now going to need to focus on failures reported in the browser as we TDD.

## Back to Passing

## Mocking in Node

## The cucumberjs-browser tool