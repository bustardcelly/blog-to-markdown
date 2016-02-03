---
title: 'Running Browser-Based CucumberJS Specs in Testling'
author:
  name: 'todd anderson'
date: '2014-02-18'
---
In my [previous](https://custardbelly.com/blog/blog-posts/2014/02/10/cucumberjs-tests-browser/index.html) [posts](https://custardbelly.com/blog/blog-posts/2014/02/12/cucumberjs-browser-update/index.html) I discuss bringing [CucumberJS](https://github.com/cucumber/cucumber-js) specs to the browser using the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) CLI tool. In this post I intend to address how to use the format reporting options of the __cucumberjs-browser__ tool to enable integration with the [testling](https://ci.testling.com/) automated cross-browser testing tool to run your specs in various browser environment targets that you may not have installed on your own system.

## Requirements
For the purposes of this article, it is assumed that you are knowledgable of [node](http://nodejs.org) and [npm](http://npmjs.org) and familiar with creating feature specs for [CucumberJS](https://github.com/cucumber/cucumber-js). 

To view examples of features and step definitions for a browser-based application, please visit the [cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples) repo, from which this post will use to demonstrate integrating the generated testrunner from [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) with [testling](https://ci.testling.com/).

## cucumberjs-browser
The [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) CLI tool provides the ability to run your feature specs in the browser by bundling your features, steps and support files - written in the usual way you would - to be run and evaluated at runtime by the browser-based [CucumberJS](https://github.com/cucumber/cucumber-js) testrunner

To install __cucumberjs-browser__:

```
$ npm install -g cucumberjs-browser
```

_you may need to `sudo`_

After installation, the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) will be accessible on the command-line using `cucumberjs-browser` and can be run within any directory that has __Features__ and __Step Definitions__ (along with optional support files) that can be consumed by [CucumberJS](https://github.com/cucumber/cucumber-js).

The __cucumberjs-browser__ CLI tool can be run with the following options:

```
$ cucumberjs-browser [-o outdir] [-f format] [--tmpl template] [--features features]
```

Though it is strongly encouraged to provide a custom template using the `--tmpl` option, for the purpose of this article, we will focus on the format (`-f`) option. As of the writing of this article, the following format options are available:

* ui
* tap
* testem
* saucelabs

For the purpose of this article, we will be discussing the [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) format option value.

_For more infromation about other format options, please visit the latest [documentation regarding formats](https://github.com/bustardcelly/cucumberjs-browser/wiki/Formats) on the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser)._

## TAP
The [Test Anything Protocol](http://en.wikipedia.org/wiki/Test_Anything_Protocol) is a specification for reporting test information. The benefit of using such a specification is that it can be consumed by any test harness that recognizes it.

You can output __TAP__ reports from [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) using the `tap` value for the foromat option:

```
$ cucumberjs-browser -f tap
```

Running this command will generate the necessary files to print [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) test results in the console when loaded by a browser.

If you were to open the generated testrunner file in a browser using the example from [cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples), you would see something like the following if you were to open the browser console:

```
TAP version 13
# Submit of valid item adds item to list
ok 1 I have opened the grocery list application
ok 2 I have an empty grocery list view
ok 3 I provide a valid grocery list item name
ok 4 I select to add an item
ok 5 The item is added to the grocery list view
# Submit of valid item adds item to collection
ok 6 I have opened the grocery list application
ok 7 I have an empty grocery list view
ok 8 I provide a valid grocery list item name
ok 9 I select to add an item
ok 10 The item is accessible from the grocery list collection
# Item added to grocery list
ok 11 I have opened the grocery list application
ok 12 I have an empty grocery list
ok 13 I add an item to the list
ok 14 The grocery list contains a single item
# Item accessible from grocery list
ok 15 I have opened the grocery list application
ok 16 I have an empty grocery list
ok 17 I add an item to the list
ok 18 I can access that item from the grocery list

1..18
# tests 18
# pass  18

# ok
```

It should be noted that the `tap` listener for [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) uses the excellent [tape](https://github.com/substack/tape) module.

## testling
I can't say enough how much I appreciate [testling](https://ci.testling.com/). You can install __testling__ locally to run tests on the browsers installed on your system or use their remote service to run tests against various browsers that may not be available to you, yet are required as targets for your current project.

### local
You can install [testling](https://ci.testling.com/) to be run locally:

```
$ npm install -g testling
```

To run it, change directories into the generated files from [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) and run the following command:

```
$ cd browser-test
$ testling
```

That will consume a local `package.json` file and read a `testling` entry with options associated with running the generated html file againsta installed browsers on your system:

_/browser-test/package.json_

```
{
...

  "testling" : {
    "html" : "cucumber-testrunner.html",
    "browsers" : [
        "chrome/latest",
        "firefox/latest",
        "safari/latest"
    ]
  },

...
}
...
```

Truthfully, I never run [testling](https://ci.testling.com/) locally. The main reasons being 

__a)__ I can automate the running of specs on locally installed browsers easier with other tools (this is for another post :) )  
__b)__ Testling provides a bigger benefit in providing tests against browsers I would otherwise have to install VMs for.

That said, I don't want ot pursuade you from using __testling__ locally if it provides benefit in your workflow.

### remote
To use the remote service that [testling](https://ci.testling.com/) provides, you still define the `testling` property in your `package.json` for the project as described above, but you additionally have to provide a webhook for your __git__ repo in order to invoke the test harness. Upon a `PUSH` to your repository, [testling](https://ci.testling.com/) will run the specified HTML file under the listed target browsers and report results based on the [Test Anything Protocol](http://en.wikipedia.org/wiki/Test_Anything_Protocol) output printed to `console`.

In addition to providing a great service, you also get the option of adding a nice looking badge to your project.

![testling harness output](https://custardbelly.com/blog/images/testling-1.png)

This badge was produced by pushing an update to the [cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples) exampe repo with a defined webhook. (If you followed along in the previous articles, you will note that the failing IE tests are due to the use of `Object.create` in source without a polyfill).

_The process of adding a webhook to your project is described in better detail in the [testling documentation](https://ci.testling.com/guide/quick_start)._

### donate
If you do use [testling](https://ci.testling.com/) in any fashion, I implore you to [donate to the cause](https://ci.testling.com/donate) :)

## Conclusion
In this article I introduced how the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) CLI tool can be used to generate a browser-based testrunner to report tests in [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) format and integrate the invaluable [testling](https://ci.testling.com/) service to run the tests on various browsers that may not be at your disposal otherwise.

While [testling](https://ci.testling.com/) provides one consumer endpoint, using the [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) specification in reporting test results can easily be consumed by another test harness of your choice.

For more information on running [CucumberJS](https://github.com/cucumber/cucumber-js) in the browser and/or to report any issues, please visit the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) repository.