---
title: 'BDD in JavaScript IV: CucumberJS and The Browser'
author:
  name: 'todd anderson'
date: '2014-02-10'
---
In my [previous post](https://custardbelly.com/blog/blog-posts/2014/01/29/cucumberjs-build/index.html) in this series detailing how I use [CucumberJS](https://github.com/cucumber/cucumber-js), I addressed a few common build tools in JavaScript to automate the watching and running of tests. While beneficial to a proper agile workflow, I did not introduce any new concepts or development information directly associated with using CucumberJS, itself.

In this article, I intend to take on a pretty meaty subject - running your cukes in the browser. It is a subject I have grappled with for some time and have tried different solutions, eventually [creating my own](https://github.com/bustardcelly/cucumberjs-browser). 

### &gt; code
Supported files related to this and any subsequent posts on this topic will be available at:  
[https://github.com/bustardcelly/cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples)

_Disclaimer: I did not start out this series to promote the [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) tool. In fact, it came to life as a result of this series :)_

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

Again, a viable solution from a venerable developer whom I trust, but I have not personally used because I wanted to keep my workflow relatively the same as I would in defining __Features__ and __Step Definitions__ for specs don't need to know about or run under a browser environment.

### cucumberjs-browser
Not finding a solution that afforded me to simply deploy my __Features__, __Steps Definitions__ and subsequent support files to be run in the browser, I decided to make one that would allow me to; and so [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) was born.

In basic terms, what [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) does is bundle the __Features__, __Step Definitions__ and any support files into standalone modules (using [browserify](http://browserify.org/)) and defines them for a page using a [lodash](http://lodash.com/docs) template. Included, as well, is the bundled library from [CucumberJS](https://github.com/cucumber/cucumber-js). 

When the page is loaded in any browser, the specs are run just as they normally would be from the command line. Through the CLI options, you have the ability to define a listener that will handle the passing and failing of steps. _Current support for [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) in console and basic UI. More to come..._

The [README](https://github.com/bustardcelly/cucumberjs-browser/blob/master/README.md) is probably the best place to start as it will be kept more up to date than this post in the future, but here is a quick rundown:

#### Installation
You install [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) globally through npm:

```
$ npm install -g cucumberjs-browser
```

#### Usage
To run the tool, you can use the following options:

```
$ cucumberjs-browser [-o outdir] [-f format] [--tmpl template] [--features features]
```

There are defaults for each of these options and you most likely will only really need to provide a custom template to be used based on the requirements of your project. The basic one that ships with the tool does nothing but load and run your specs: [cucumber-testrunner.template](https://github.com/bustardcelly/cucumberjs-browser/blob/master/template/cucumber-testrunner.template). This should be a jumping off point in which you add your css and scripts and anything else required to get your tests passing. Again, it uses [lodash](http://lodash.com/docs) to generate the page, so bear that in mind.

#### Output
If we were to run [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) against the current work we have been doing in this series and then open any browser, we would be presented with something like the following:

<div style="width: 100%; overflow-x: scroll; background-color:#fff; text-align: center;">
  <img src="https://custardbelly.com/blog/images/cucumberjs-browser-1.png" alt="cucumberjs in the browser">
</div>

## Conclusion
For this post, I had originally started updating the example we have been working through in this series to incoprate User Interaction with the application in a browser with <span style="color: red;">failing</span> tests everywhere... it made me smile :) But, I felt it was extending the length of this post to a point in which it was becoming information overload.

As such, I am in the middle of a follow up post in how to utilize [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser) for our current Grocery List Application example in delivering a test-driven browser-based application supported by [CucumberJS](https://github.com/cucumber/cucumber-js) specs.

At the very least, I hope this post highlighted some possible solutions for testing in the browser and will draw you back to the following post where i go more in depth about working with [cucumberjs-browser](https://github.com/bustardcelly/cucumberjs-browser). 'Til then...