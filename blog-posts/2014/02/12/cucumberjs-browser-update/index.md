---
title: 'BDD in JavaScript V: CucumberJS and The Browser, II'
author:
  name: 'todd anderson'
date: '2014-02-12'
---
_"Whoa. Whoa. Whoa. You can't just use roman numerals all over the place in your post titles..."_

In the [previous article](http://custardbelly.com/blog/blog-posts/2014/02/10/cucumberjs-tests-browser/index.html) I addressed the available libraries and practices to have your [CucumberJS](https://github.com/cucumber/cucumber-js) specs running in a browser environment, as well as introduced a new project begun by me: [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser).

I had originally had the entirety of this post in the previous post, but felt that it was a little bit of information overload. As such, I decided to split them into two posts.

The intent of this article is to address incorporating [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) into our current Grocery List Application example and continue developing features that involve User Interaction with the DOM.

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

Let's define our spec:

_/features/add-item-view.feature_

```
Feature: Shopper can add and view new item in Grocery List
  As a shopper using the browser-based app
  I want to add an item to my grocery list view
  So that I can remember to buy that item at the grocery store

  Background: Grocery List Application is Open
    Given I have opened the grocery list application

  Scenario: Submit of valid item adds item to list
    Given I have an empty grocery list view
    When I provide a valid grocery list item name
    And I select to add an item
    Then The item is added to the grocery list view

  Scenario: Submit of valid item adds item to collection
    Given I have an empty grocery list view
    When I provide a valid grocery list item name
    And I select to add an item
    Then The item is accessible from the grocery list collection
```

We have declared two __Scenarios__ that define the __Feature__ criteria in which a User interacts with DOM elements to add and view a new item to the Grocery List application.

Running that produces the expected `undefined` steps notification:

```
$ npm run test
.UUU.UUUU.UUUU........

4 scenarios (2 undefined, 2 passed)
21 steps (10 undefined, 11 passed)
```

### Given I have an empty grocery list view

We have a few things we need to address, but before we get into the nitty-gritty, let's turn this <span style="color:red;">red</span> in true TDD fashion while filling out our API expectation of the _Given_ in each of the __Scenarios__

_/features/step_definitions/add-item-view.steps.js_

```
var assert = require('assert');

module.exports = function() {
  'use strict';

  this.World = require('../support/world').World;

  this.Given(/^I have an empty grocery list view$/, function(callback) {
    this.emptyGroceryListView();
    assert.equal(this.getGroceryListView().childNodes.length, 0);
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

## Index File
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

Most of what is in this page template is copied from the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) project. The only addition - at this point - is the script appended within the `body` that will load our app bundle.

If we were to run the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) tool and generate our bundled app, specs and template:

```
$ cucumberjs-browser -o test --tmpl template/testrunner.html -f tap
```

That will generate the JavaScript bundle files for the __Features__, __Step Definitions__ and support files we have been creating and curating in this series, along with the templated HTML file with our resources defined and place them in a _/test_ directory.

If we were to open that HTML file - _/test/cucumberjs-testrunner.html_ - and opened the Console of our developer tools, we would see a [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) report of our test... <span style="color: red;">failing</span> :)

If we were to change the format option:

```
$ cucumberjs-browser -o test --tmpl template/testrunner.html -f ui
```

We would see those same <span style="color:red;">failing</span> tests, but this time on the DOM.

<div style="width: 100%; overflow-x: scroll; background-color:#fff; text-align: center;">
  <img src="http://custardbelly.com/blog/images/cucumberjs-browser-2.png" alt="cucumberjs in the browser, failing">
</div>

We have gone from failing on the command line to failing in the browser... isn't it glorious :)

## Automate all the things
We had [previously automated our testing](http://custardbelly.com/blog/blog-posts/2014/01/29/cucumberjs-build/index.html) under the node-based environment; it was a simple as setting up a file watcher and issuing a command to run the [CucumberJS](https://github.com/cucumber/cucumber-js) CLI tool on change.

Our process has now become a little more involved, but not anything too complex (_thanks to the wonderful [npm](https://www.npmjs.org/) community!_) that an automated build and test procedure couldn't be implemented. The only difference is that feedback will now reside in the DOM and/or Console of a browser - so instead of coding in an editor and watching it fail on the command line, we are now going to need to focus on failures reported in the browser as we TDD.

### watch script
Just as we had done in a [previous article](http://custardbelly.com/blog/blog-posts/2014/01/29/cucumberjs-build/index.html), we are going to create a new script that will essentially do the following:

1. start a livereload server
2. start a local server to serve the testrunner
3. launch the testrunner in a browser
4. bundle the app and run the cucumberjs-browser tool
5. watch and reload the testrunner in the browser on change to source files

To accomplish this task, we are going to use a couple more npm modules; in particular:

1. [tiny-lr](https://github.com/mklabs/tiny-lr)
2. [connect](https://github.com/senchalabs/connect)
3. [open](https://github.com/jjrdn/node-open)

I invite you to go check each of those projects out as I won't go into much detail about each of them in this article. It should be noted, however, that you will need to install the [LiveReload](http://livereload.com/) [browser extension(s)](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) in order to properly use the `watch` script:

_cuke-browser-watcher.js_

```
#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var watch = require('node-watch');
var child_process = require('child_process');
var mkdirp = require('mkdirp');
var browserify = require('browserify');

var http = require('http');
var tinylr = require('tiny-lr');
var connect = require('connect');
var open = require('open');
var S = require('string');

var outdir = 'test';
var browserCukes;

var livereloadPort = 35729;
var connectPort = 8080;
var JS_EXT = /^.*\.js/i;
var options = ['-f', 'ui',
               '-o', outdir,
               '--tmpl', 'template/testrunner.html'];

// [TASKS]
// a. re-bundle the app.
var bundleApplication = function(f, callback) {
  return function() {
    browserify(__dirname + '/script/app.js')
      .bundle({
        standalone: 'app'
      })
      .pipe(fs.createWriteStream(path.resolve(outdir + '/script/app.js')))
      .on('close', function() {
        console.log('changed app.js...');
        if(callback) {
          callback();
        }
      });
  };
};
// b. rerun cucumberjs-browser tool.
var cuke = function(f, callback) {
  return function() {
    var filename = S(path.basename(f, '.js').split('.').join('-')).camelize().s;
    browserCukes = child_process.spawn('cucumberjs-browser', options)
      .on('exit', function() {
        console.log('changed ' + filename + '...');
        if(callback) {
          callback();
        }
      });
  };
};

// 1. Recursive mkdir /test/script if not exist.
mkdirp.sync(outdir + '/script');

// 2. Create tiny-livereload server.
var lr = tinylr();
lr.listen(livereloadPort, function() {
  console.log('livereload listening on ' + livereloadPort + '...');
});

// 3. Start server on localhost.
var app = connect().use(connect.static(__dirname + '/test'));
var server = http.createServer(app).listen(connectPort, function() {
  console.log('local server started on ' + connectPort + '...');
  console.log('Note: Remember to start the livereload browser extension!');
  console.log('http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-');
  cuke('./features/support/world', function() {
    bundleApplication('./script/app.js', function() {
      open('http://localhost:' + connectPort + '/cucumber-testrunner.html');  
    })();
  })();
});

// 4. Watch source and generate bundles.
watch(['./features', './script'], {recursive:true}, function(filename) {
  // Used to resolve when running operation(s) are complete.
  var resolver;
  var running = false;
  var resolveWatch = function(limit) {
    var count = 0;
    running = true;
    return function() {
      if(++count === limit) {
        count = 0;
        running = false;
      }
      else {
        running = true;
      }
    };
  };

  if(!running && filename.match(JS_EXT)) {
    var bundleAppInvoke = bundleApplication(filename, function() {
      lr.changed({
        body: {
          files: ['script/app']
        }
      });
      resolver();
    });
    if(/^script?/i.test(filename)) {
      resolver = resolveWatch(1);
      bundleAppInvoke();
    }
    else if(/^features?/i.test(filename)) {
      resolver = resolveWatch(2);
      cuke(filename, function() {
        lr.changed({
          body: {
            files: [filename]
          }
        });
        resolver();
        bundleAppInvoke();
      })();
    }
  }

});
```

This `watch` script is very similar to the one we created previously. Aside from moving the bundler tasks outside of the `watch()`, the main difference is that we now start a `tiny-livereload` server and `http` server running on port 8080 before starting the `watch` task.

Running this will also automatically launch the testrunner in your default browser. It is important to note that, in order for the reload on file change to work, you must enable the [LiveReload](http://livereload.com/) [browser extension for that browser](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-).

As we have done before, we can add this to our package `scripts`:

_package.json_

```
{
  "name": "cucumberjs-examples",
...
  "scripts": {
    "test": "node node_modules/.bin/cucumber-js",
    "watch": "node cuke-watcher.js",
    "watch-browser": "node cuke-browser-watcher"
  }
...
}
```

Open up the terminal and enter the following command:

```
$ npm run watch-browser
```

... and we are all set to keep TDD'ing with an automated `watch` script that will reload the browser on change to our step definitions and application source files!

## Back to Passing
We side-stepped our development to address a few key issues: bundling scripts for the browser and automating tests against [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser). With our `watch` script up and running, we can see we are in the <span style="color:red;">red</span> still - let's start turning steps <span style="color:green">green</span> :)

First order of business is that our first __Given__ step for the Add Item View __Feature__ is interfacing with a currently non-existant API on the __World__. We eschewed the need for an additional Web Driver library which would provide a conventient API through a browser facade. At this stage, I think we can reasonably have our __World__ provide that API and not need to include more external libraries. 

_It might even be a reasonable discussion that such Web Drivers are not needed at all in such circumstances, but I won't go there for the moment as that gets into a discussion about integration testing vs unit testing and BDD practice - ie, a can of worms ;)_

### Modifying Our World
Now that we know we are running our tests in the browser, we have access to the global `window` and can reference the DOM without restriction to running [CucumberJS](https://github.com/cucumber/cucumber-js) under [node](http://nodejs.org).

Let's modify our __World__ to expose the API we are invoking from our __Given__ in the Add Item View __Feature:

_/features/support/world.js_

```
'use strict';

var World = function World(callback) {

  this.window = window;
  this.app = window.app;
  this.groceryListApplication = undefined;

  this.openGroceryList = function() {
    return this.app.newSession();
  };
  this.createGroceryItem = function() {
    return 'apple';
  };

  this.emptyGroceryListView = function() {
    this.app.empty();
  };

  callback();

};

module.exports.World = World;
```

There is actually a quite bit changed from our previous __World__:

1. Removed `require()` of app module
2. Added access to `app` reference on `window` from our browserified bundle
3. Changed reference to `app` that creates a new session
4. Added `emptyGroceryListView` method to World

So we took the __World__ into a browser environment with its referencing the app, but we are still (as expected) failing - this time alerting us to:

<p><span style="color:red;">- Cannot call method 'newSession' of undefined at World.openGroceryList</span></p>

which is stemming from our previously defined __Background__ step definition:

```
Background: Grocery List Application is Open
  Given I have opened the grocery list application
```

This actually stems from a much larger problem: accessing the the application module on the `window` before it has finished being loaded by the browser. As such, we will need to modify this step definition to ensure that the DOM has completed load before we can move forward in interactinf with the __World__ API that now exposes communication to the DOM.

_/features/step_definitions/background-open-application.step.js_

```
'use strict';
var assert = require('assert');

module.exports = function() {
  
  this.World = require('../support/world').World;

  this.Given(/^I have opened the grocery list application$/, function(callback) {
    (function(world) {
      world.domload(function() {
        world.groceryListApplication = world.openGroceryList();
        assert(world.groceryListApplication, 'Grocery List Application is required to be open for editability.');
        callback();
      });
    }(this));
  });

};
```

Now we are offloading our assertion and callback to the complete of DOM load through the __World__ to ensure that we have successfully loaded the application.

This will now fail on <span style="color: red;">- Object #<World> has no method 'domload'</span>, so let's get that fixed up:

_/features/support/world.js_

```
'use strict';

var World = function World(callback) {

  this.window = process.browser ? window : {};
  this.app = undefined;
  this.groceryListApplication = undefined;

  var defineGlobals = function(w, doc) {
    this.app = w.app;
  };

  this.domload = function(callback) {
    (function(world) {
      if(document.readyState === 'complete') {
        defineGlobals.call(world, window, document);
        callback();  
      }
      else {
        var delegate = document.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventType = document.addEventListener ? 'load' : 'onload';
        window[delegate](eventType, function() {
          defineGlobals.call(world, window, document);
          callback();
        });
      }
    }(this));
  };

  this.openGroceryList = function() {
    return this.app.newSession();
  };
  this.createGroceryItem = function() {
    return 'apple';
  };

  callback();

};

module.exports.World = World;
```

Woohoo! Now we are back with the exception <span style="color: red;">Object #<World> has no method 'emptyGroceryListView'</span> that got us in this mess... _BUT_ the previous tests we had <span style="color: green;">passing</span> are now passing again :)

For the sake of getting too "noisy" with code and explanations, for the following edits - unless an explanation is deemed worthy - I will just roll along with modifications to the test and source and show the series of <span style="color: red;">failures</span>.

_/features/support/world.js_

```
'use strict';

var World = function World(callback) {

  this.window = process.browser ? window : {};
  this.app = undefined;
  this.groceryListApplication = undefined;

...

  this.emptyGroceryListView = function() {
    this.groceryListApplication.empty();
  };

  callback();

};

module.exports.World = World;
```

<p><span style="color: red;">- Object #<Object> has no method 'empty' at World.emptyGroceryListView</span></p>

_/script/app.js_

```
...

var application = {
  init: function(list) {
    this.list = list;
    return this;
  },
  empty: function() {
    this.list.empty();
  }
};

...
```

<p><span style="color: red;">- Object #<World> has no method 'getGroceryListView' at World</span></p>

_/features/support/world.js_

```
'use strict';

var World = function World(callback) {

  this.window = process.browser ? window : {};
  this.app = undefined;
  this.groceryListApplication = undefined;

...

  this.getGroceryListView = function() {
    this.groceryListApplication.$listview;
  };

  callback();

};

module.exports.World = World;
```

<p><span style="color: red;">- Cannot read property 'childNodes' of undefined at World</span></p>

_/script/app.js_

```
...

var application = {
  init: function(list) {
    this.list = list;
    this.$listview = document.querySelector('#grocery-list');
    return this;
  },
  empty: function() {
    var gl = this.$listview;
    while (gl.hasChildNodes()) {
      gl.removeChild(gl.lastChild);
    }
    this.list.empty();
  }
};

...
```

<p><span style="color: red;">- Cannot read property 'childNodes' of null at World</span></p>

_/template/testrunner.html_

```
<!doctype html>
<html>
  <body>
    ...
    <ul id="grocery-list"></ul>
    <script src="./script/app.js"></script>
  </body>
</html>
```

And we are back to <span style="color: green;">green</span>!... and <span style="color: beige">pending</span>. Let's move on to our next step definition:

### When I provide a valid grocery list item name

_/features/step_definitions/add-item-view.steps.js_

```
...

var enteredItem;

this.Given(/^I have an empty grocery list view$/, function(callback) {
  this.emptyGroceryListView();
  assert.equal(this.getGroceryListView().childNodes.length, 0);
  callback();
});

this.When(/^I provide a valid grocery list item name$/, function(callback) {
  enteredItem = this.createGroceryItem();
  this.enterNewGorceryListItem(enteredItem);
  callback();
});

...
```

Back in the <span style="color: red;">red</span>!  
<p><span style="color: red;">- Object #<World> has no method 'enterNewGorceryListItem' at World</span></p>

_/features/support/world.js_

```
var World = function World(callback) {

  this.window = process.browser ? window : {};
  this.app = undefined;
  this.groceryListApplication = undefined;

  var defineGlobals = function(w, doc) {
    this.app = w.app;
  };

...

  this.enterNewGorceryListItem = function(item) {
    this.groceryListApplication.enterNewItem(item);
  };

  callback();

};

module.exports.World = World;
```

<p><span style="color: red;">- Object #<Object> has no method 'enterNewItem' at World.enterNewGorceryListItem</span></p>

_/script/app.js_

```
...

var application = {
  init: function(list) {
    this.list = list;
    this.$listview = document.querySelector('#grocery-list');
    this.$itemInputView = document.querySelector('#item-input');
    return this;
  },
  empty: function() {
    var gl = this.$listview;
    while (gl.hasChildNodes()) {
      gl.removeChild(gl.lastChild);
    }
    this.list.empty();
  },
  enterNewItem: function(item) {
    this.$itemInputView.value = item;
  }
};

...
```

<p><span style="color: red;">- Cannot set property 'value' of null at Object.application.enterNewItem</span></p>

_/template/testrunner.html_

```
<!doctype html>
<html>
  <body>
    ...
    <ul id="grocery-list"></ul>
    <form>
      <label for="itemInput">Item name:</label>
      <input id="item-input" name="itemInput" type="text"></item>
    </form>
    <script src="./script/app.js"></script>
  </body>
</html>
```

Back to <span style="color: beige;">pending</span>! Next step:

### And I select to add an item

_/features/step_definitions/add-item-view.steps.js_

```
...

this.When(/^I select to add an item$/, function(callback) {
  this.clickAddGroceryListItem();
  callback();
});

...
```

<p><span style="color: red;">- Object #<World> has no method 'clickAddGroceryListItem' at World.</span></p>

_/features/support/world.js_

```
var World = function World(callback) {

  this.window = process.browser ? window : {};
  this.app = undefined;
  this.groceryListApplication = undefined;

  var defineGlobals = function(w, doc) {
    this.app = w.app;
  };

...

  this.createClickEvent = function() {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, false);
    return event;
  };

  this.clickAddGroceryListItem = function() {
    var clickevent = this.createClickEvent();
    this.groceryListApplication.$addbutton.dispatchEvent(clickevent);
  };

...

  callback();

};

module.exports.World = World;
```

<p><span style="color: red;">- Cannot call method 'dispatchEvent' of undefined at World.clickAddGroceryListItem</span></p>

_/script/app.js_

```
var application = {
  init: function(list) {
    this.list = list;
    this.$listview = document.querySelector('#grocery-list');
    this.$itemInputView = document.querySelector('#item-input');
    this.$addbutton = document.querySelector('#add-button');
    return this;
  },
  empty: function() {
    var gl = this.$listview;
    while (gl.hasChildNodes()) {
      gl.removeChild(gl.lastChild);
    }
    this.list.empty();
  },
  enterNewItem: function(item) {
    this.$itemInputView.value = item;
  }
};
```

<p><span style="color: red;">- Cannot call method 'dispatchEvent' of null at World.clickAddGroceryListItem</span></p>

_/template/testrunner.html_

```
<!doctype html>
<html>
  <body>
    ...
    <ul id="grocery-list"></ul>
    <form>
      <label for="itemInput">Item name:</label>
      <input id="item-input" name="itemInput" type="text"></item>
      <button id="add-button" type="button">add</button>
    </form>
    <script src="./script/app.js"></script>
  </body>
</html>
```

Back to <span style="color: beige;">pending</span>! We're getting into assertion territory :) Next step:

### Then The item is added to the grocery list view

_/features/step_definitions/add-item-view.steps.js_

```
...

this.Then(/^The item is added to the grocery list view$/, function(callback) {
  assert.equal(this.getGroceryListViewItemAtIndex(0), enteredItem, 'Entered item should be first in empty list.');
  callback();
});

...
```

<p><span style="color: red;">- Object #<World> has no method 'getGroceryListViewItemAtIndex' at World</span></p>

_/features/support/world.js_

```
var World = function World(callback) {

  this.window = process.browser ? window : {};
  this.app = undefined;
  this.groceryListApplication = undefined;

  var defineGlobals = function(w, doc) {
    this.app = w.app;
  };

...

  this.getGroceryListViewItemAtIndex = function(index) {
    return this.groceryListApplication.$listview.childNodes[index].textContent;
  }

...

  callback();

};

module.exports.World = World;
```

<p><span style="color: red;">- Cannot read property 'textContent' of undefined at World.getGroceryListViewItemAtIndex</span></p>

_/script/app.js_

```
...

var application = {
  init: function(list) {
    this.list = list;
    this.$listview = document.querySelector('#grocery-list');
    this.$itemInputView = document.querySelector('#item-input');
    this.$addbutton = document.querySelector('#add-button');
    (function(app) {
      app.$addbutton.addEventListener('click', function(event) {
        var item = app.$itemInputView.value;
        app.addItemToView(item);
      });
    }(this));
    return this;
  },
  empty: function() {
    var gl = this.$listview;
    while (gl.hasChildNodes()) {
      gl.removeChild(gl.lastChild);
    }
    this.list.empty();
  },
  enterNewItem: function(item) {
    this.$itemInputView.value = item;
  },
  addItemToView: function(item) {
    var li = document.createElement('li');
    var text = document.createTextNode(item);
    li.appendChild(text);
    this.$listview.appendChild(li);
  }
};

...

```

By adding a `click` handler to the `button`, we are updating the view by adding a `li` element to the list view.

And we're back to <span style="color: beige;">pending</span>! One last step:

### Then The item is accessible from the grocery list collection

_/features/step_definitions/add-item-view.steps.js_

```
...

this.Then(/^The item is accessible from the grocery list collection$/, function(callback) {
  assert.equal(this.groceryListApplication.list.getItemIndex(enteredItem), 0, 'Added item should be found at first index.');
  callback();
});

...
```

Utilizing the `getItemIndex()` method we created in passing the collection features from a previous article, we get back to failing.  <span style="color: red;">Added item should be found at first index. at World</span>

_/script/app.js_

```
...

var application = {
  init: function(list) {
    this.list = list;
    this.$listview = document.querySelector('#grocery-list');
    this.$itemInputView = document.querySelector('#item-input');
    this.$addbutton = document.querySelector('#add-button');
    (function(app) {
      app.$addbutton.addEventListener('click', function(event) {
        var item = app.$itemInputView.value;
        app.addItemToView(item);
        app.list.add(item);
      });
    }(this));
    return this;
  },
  ...
};

...
```

In adding a call to `list.add()` in the button handler within we just defined an update to the view, we bring ourselves to full <span style="color: green;">green</span>!

<div style="width: 100%; overflow-x: scroll; background-color:#fff; text-align: center;">
  <img src="http://custardbelly.com/blog/images/cucumberjs-browser-3.png" alt="cucumberjs in the browser, passing">
</div>

## Considerations
If you have following along in getting these new browser-based __Features__ to pass in that environment, I have taken some liberties with regards to architecture and process with the hopes to not add noise to the task at hand.

In reality, we should consider the next phase as a _Refactor_. The particular areas in which I see issues that I would address and.or discuss with my team are:

* Implementing view update based on collection events
* Templatize-ing the main view to be wrapped in production and injecting as a partial to the testrunner template
* Building the application to be deployed as a web-based application and User Tested

I am sure there are more, and that you have a few ideas as well, but these are at least three aspects of the architecture of the project and product that can be tackled with assurance now that we have a test harness for the features criteria :)

## Conclusion
If you made it down this far, I do appreciate you taking the time to follow along - I know this was a bit of a long one.