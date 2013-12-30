# [Current Workflow: Developing, Linting, Testing and Distributing JavaScript](http://custardbelly.com/blog/2012/02/07/current-workflow-developing-linting-testing-and-distributing-javascript/)

The title is a bit lofty, no? You’d expect a treatise to follow, but alas it will most likely be a rambling mess about the various tools and libraries I have a current fascination with and why – the reason, of which, is due to a recent desire to have a proper build system in place to comfortably develop **JavaScript**. 

If you have been following along on this blog, you may be aware of the [massroute_js project i have up on github](https://github.com/bustardcelly/massroute-js). I am testing out various **JavaScript** toolkits, libraries and frameworks and have pushed a few up on the repo. As I was finishing up playing around with the last framework, it dawned on me that I didn’t have an example with _NO_ framework; NO not being the latest the JS framework. NO being no… but with more face-palm. Perhaps it is telling of the state of **JavaScript** development these days that I am missing a plain vanilla JS example of my [MassRoute](https://github.com/bustardcelly/massroute-js) application, and it is all true. I still don’t have one committed to the repo. However, the reasoning for that is a lengthy one – I got obsessed with a proper development environment and custom build system ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) By obsessed, I mean I researched a fair bit of tools and libraries involved in the following areas that I thought fit into my workflow:

  * AMD
  * Code Quality
  * Unit Testing
  * Minification / Concatenation
  * Build / Deploy

I intend to address each of these topics in this article and the tools/libraries I found and those I had chosen for my workflow. It should be noted that I was not considered with development and deployment of the other two piece of the webstack – **HTML** and **CSS**. It is vital to have a good workflow when working with those technologies as well, and especially if all three are part of your job. There are some great tools and libraries out there for developing and shipping **HTML** and **CSS** and perhaps I will dive into that at a later date.

For now, I have created a common library in the [massroute_js](https://github.com/bustardcelly/massroute-js) repo to develop what was turning out to be common pieces of the application I was developing against various **JavaScript** libraries out there. In there are the tools and libraries I will discuss in this post along with a simple build script: [https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/common](https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/common)

I will do my best to explain the history and usage behind each tool and library, but will try to not get too in depth as I may get lost in the actual meaning of this post – which is to highlight the tools and the workflow in which they can be used together. 

## AMD

The **Asynchronous Module Definition** – commonly referred to as **AMD** – is a specification that defines how modules and their dependencies can be defined and loaded asynchronously. The asynchronous part of **AMD** fits nicely in a browser environment so as to not block rendering and script execution while loading modules, but the bigger take away for my development purposes is really the modularization of code and dependency management.

There is a larger history behind [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) and its fruition from [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) which I will not go into, not only as I do not have enough personal involvement to speak intelligently about such matters, but that [James Burke](http://tagneto.blogspot.com/?m=1) and [Addy Osmani](http://addyosmani.com/blog/) already have some extremely insightful articles already out there on the webs:

[James Burke: Simplicity and JavaScript modules](http://tagneto.blogspot.com/2012/01/simplicity-and-javascript-modules.html?m=1)  
[Addy Osmani: Writing Modular JavaScript with AMD, CommonJS and ES Harmony](http://addyosmani.com/writing-modular-js/)

I started dabbling and really getting interested in the idea of modular JavaScript when [I began using the Dojo toolkit](http://custardbelly.com/blog/2011/10/04/massroute-js-dojo-example/). That was back at 1.6.1 release and the use of _dojo.provide_, _dojo.require_ and _dojo.declare_. Now at 1.7, [Dojo](http://custardbelly.com/blog/dojotoolkit.com) is fully compliant with **AMD**. Here is an article discussing **Dojo**’s move to **AMD** compatibility: [http://dojotoolkit.org/features/1.6/async-modules](http://dojotoolkit.org/features/1.6/async-modules). _Just as an aside – you really should check out [Dojo](http://dojotoolkit.org/), particularly if you come from a **Flex** background and have happened upon this post._

So, with some familiarity and a strong interest to incorporate modular development, I set out to find a library that would fit nicely in my workflow. There are a handful of **AMD**-compatible libraries, most notably [curl](https://github.com/unscriptable/curl) from [John Hann](http://unscriptable.com), [Backdraft](http://bdframework.org/bdLoad/), and [RequireJS](http://requirejs.org/) from [James Burke](http://tagneto.blogspot.com/). I settled on the last **RequireJS** as, not only because of its ease of use and the cleanest, most concise documentation, but because of its [author and his history](http://requirejs.org/docs/history.html) and [active role in the community](https://twitter.com/#!/jrburke); not to mention that the related optimization tool – [r.js](http://requirejs.org/docs/optimization.html) – was also a good selling point.

### RequireJS

The [RequireJS API](http://requirejs.org/docs/api.html) defines how to define a module as well as how to load modules with dependencies. Along with other niceties, it also provides the ability to define dependency load order and loading of **text** files (including **CSS**).  
Just taking some stripped down and generalized examples from the common lib of my [massroute_js repo](https://github.com/bustardcelly/massroute-js), a module is defined as such:

_/script/com/custardbelly/js/RequestToken.js_
    
    define( function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var RequestToken = (function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.then = function( handler ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return RequestToken;
    
    &nbsp_place_holder;
    
    })l

> and a module with dependencies are defined as so:

_/script/com/custardbelly/js/Request.js_
    
    define( ["com/custardbelly/js/RequestToken"], function( RequestToken ) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var Request = (function( url ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.send = function( variables ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var token = new RequestToken();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return token;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return Request;
    
    &nbsp_place_holder;
    
    });

So with these two examples we see how to define modules with and without dependencies, hopefully demonstrating the benefit of modularization but also the beauty of composition through dependency that **AMD** libraries like [RequireJS](http://requirejs.org/) provide. 

Another great benefit in using RequireJS is that it gets rid of you having to manage your code in namespaces. In other words, this is no longer necessary:
    
    (function( window ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var massroute = getNamspace( 'com.custardbelly.massroute' );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function getNamespace( value ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var parts = value.split( '.' ),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;i = 0,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;length = parts.length,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;package, parent = window;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;for( i; i < length; i++ ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;package = parts[i];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;parent[package] = parent[package] || {};
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;parent = package;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return parent;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var Something = function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;....
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;massroute.Something = Something;
    
    &nbsp_place_holder;
    
    })( this );

What is happening under the hood, loading and reference-wise, is that **RequireJS** (now _require_ on the **window** Object) holds a list of file references in its own _contexts.urlMap_ property – the key being the normalized string of the module based on configuration and the value being the actual url for that module file. As dependency requests are made, a lookup is made on **require**’s _contexts.loaded_ property which maps the normalized module string to a flag of already loaded and available. A script tag is actually written and attached to the **DOM** to begin loading of the script just as most script loaders do. What sets it apart is the use of async and datasets. If we take a look at what is appended for the _Request_ module from a previous example:
    
    <script type="text/javascript" charset="utf-8" async="" data-requirecontext="_" data-requiremodule="com/custardbelly/js/Request" src="./../script/com/custardbelly/js/Request.js"></script>

We can see that the values on the datasets directly correspond to those of the key/value pairs in _require.context.urlMap_ for your application. So as these are loaded, the flag in _require.context.loaded_ is flipped. Pretty elegant, and if you are interested in more about **RequireJS**’s design and the requirements it adheres to, this is a great article: [http://requirejs.org/docs/requirements.html](http://requirejs.org/docs/requirements.html). Now… back to looking at code.

When it came time to employ these modules, I would _require_() where my application is responsible for making a request. Let’s just take on start-up in a main file as an example:

_/app/main.js_
    
    (function( require ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;require.config({
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;baseUrl: ".",
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;paths: {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"com": "./script/com"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;require( ['com/custardbelly/js/Request'], function( Request ) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var request = new Request( '[http://somewhere.fun/go](http://somewhere.fun/go)'),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;token = request.send({person:'Todd'});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;token.then( relax );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function relax() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;console.log( 'ahhh' );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    })( requirejs );

It should be noted that anything (ie. objects, functions, native objects) can be returned from a module definition. Typically, though, and which is seen from these examples, i tend to return constructors probably due to my class-based language background; in other words, _x_ requires _y_ as _x_ is going to create at least one new instance of it. But you could very well return an object or a function, and the real power comes in when you consider composition and module dependencies… and for all you **DI** fans out there like me, the cogs might start spinning up in that noggin. I have yet to do a real test-drive of **IoC** containers for **JavaScript** but there must be or could be something that is a perfect match for **RequireJS**. I am aware of [wire](https://github.com/briancavalier/wire), but as I said, have yet to give it a go – Santa failed on delivering more hours in the day ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) If you know of any, please leave a comment.

So that is where my **AMD** loader choice stands. I have been using it for some time and have been pretty happy. Keep in mind that all these modules are separated to their own files. Depending on the size of the project, that can tally up to a lot of requests. And if we compound that with a slow network and a limited caching capabilities, we’re talking about trade-offs in even using **AMD**… unless we can optimize our development workspace down to a reasonable production environment that will go live. We’ll address those concerns a little later in the article…

### AMD reading link dump:

[AMD specification on GitHub](https://github.com/amdjs/amdjs-api/wiki/AMD)  
[(UMD) Universal Module Definition](https://github.com/umdjs/umd)  
[John Hann: AMD vs CommonJS](http://unscriptable.com/code/AMD-vs-CommonJS/#0)  
[DailyJS: The How and Why of AMD](http://dailyjs.com/2011/12/22/framework/)  
[Addy Osmani: Writing Modular JavaScript with AMD, CommonJS and ES Harmony](http://addyosmani.com/writing-modular-js/)  
[James Burke: Simplicity and JavaScript modules](http://tagneto.blogspot.com/2012/01/simplicity-and-javascript-modules.html?m=1)  
[Tom Dale: AMD is Not the Answer](http://tomdale.net/2012/01/amd-is-not-the-answer)  
[ES Harmony modules proposal](http://wiki.ecmascript.org/doku.php?id=harmony:modules_examples)  
[RequireJS](http://requirejs.org/)

## Code Quality

What makes **JavaScript** so _fun_ is you can get away with a lot of shi… pped code that is littered with syntactical errors, misspellings, declared and unused variables and not to mention code that is improperly formatted. Such things can cause your application to fail silently and unsuspectingly to a user – no flag is explicitly raised that the code is failing unless an end-user cares about opening the debugger tools of a browser and submitting tickets for you. Such things you can’t mitigate and handle properly with more code because it is the code itself… well, i guess you could wrap everything in a little try… catch’s, but that would be silly.

If you are coming to **JavaScript** from a language that gets compiled, finding such mistakes during development might be a bit of a challenge in as far as the IDE department goes. There are a handful of excellent **IDE**s out there targeting web development (I enjoy [Sublime Text 2](http://www.sublimetext.com/2)), but the nature of an interpreted language leaves the ability to analyze and catch possible syntax and runtime errors before deploying code a challenge; unlike **SDK**s and **IDE**s that employ compiler tools that can determine errors in live edit or through a pre-compilation build.

That’s not to say, _by any means_, that a program has less bugs in a compiled environment than in an interpreted one. It just means you have to be a little more diligent in analyzing and testing your code – more on testing later. This type of analysis without actually executing or running the code for a program is commonly referred to as _linting_[. When it comes to JavaScript, you can’t go far into searching for a linter without finding ](http://en.wikipedia.org/wiki/Lint_(software))[JSLint](http://www.jslint.com/), nor [JSHint](http://www.jshint.com/) and their [connection](http://anton.kovalyov.net/2011/02/20/why-i-forked-jslint-to-jshint/). 

I won’t go over the benefits of one or the other, nor their history as there are plenty of articles out there on such. For the benefit of my own development environment and workflow, I have chosen [JSHint](http://www.jshint.com/) for linting code – mainly because of the ease of set-up especially when it comes to disregarding the formatting of my code. I am much more concerned with syntactical errors and do not consider such things as indentation to be detrimental to the performance of the program, especially as it will later be run through minification. That is in no way stating that proper formatting is un-important, especially, especially, especially when working with a team. I do strive to keep a consistent format to my code, and certain IDEs help in some respect with coding standards and conventions, but at this time [JSLint](http://www.jslint.com/) is a little too strict and feels a little more like prodding the code into a certain style – like a master’s apprentice. Not necessarily a bad thing and I may change my mind at some point, but for now **JSHint** it is. Plus, there is a sweet [JSHint package](https://github.com/uipoet/sublime-jshint) for [Sublime Text 2](http://www.sublimetext.com/2) that I can hook into a hotkey to check for errors on the current file I have open. 

### Code Quality reading link dump:

[JSLint](http://www.jslint.com/)  
[JSHint](http://www.jshint.com/)  
[Anton Kovalyov: Why I Forked JSLint to JSHint](http://anton.kovalyov.net/2011/02/20/why-i-forked-jslint-to-jshint/)  
[JSHint Sublime Plugin: uipoet/sublime-jshint](https://github.com/uipoet/sublime-jshint)

## Unit Testing

This topic is too large to really go into discussing methodologies, extolling the virtues of and defining best practices for in this article. As such, I will simply state that I am guilty of not doing enough testing during the design of applications. For a time, when I was getting more familiar with languages and programming in general, creating unit tests for my code seemed more as a distraction from getting down to brass tacks and delivering a product. I’ll admit that, and the hugely naive stance that it takes ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) That is in no way to say that now I practice good [Test Driven Development](http://en.wikipedia.org/wiki/Test-driven_development) (TDD). Far from it; really far from it. But I am trying to get better. More importantly, my thinking has changed in that I now believe unit testing is actually a proper way of testing the _design_ of my application rather than finding errors in the code. I think that was a big leap for me. And, for whatever it may mean, coming to an interpreted language like **JavaScript**, designing and developing upon unit tests becomes even more important to me. [Test-Driven JavaScript Development](http://www.amazon.com/Test-Driven-JavaScript-Development-Developers-Library/dp/0321683919) by [Christian Johansen](http://cjohansen.no/) has definitely gone a long way in swaying my development practices for **JavaScript**, and I highly recommend picking up this book. 

Like I said, it is too much to get into a discussion of **TDD** and unit testing, I wanted more to highlight the choices I have made for my development and deployment workflow in unit testing my code. I looked at and tried out a couple different unit testing frameworks for **JavaScript** – with [Jasmine](http://pivotal.github.com/jasmine/), [Hiro](http://hirojs.com/) and [QUnit](http://docs.jquery.com/QUnit) catching my eye. 

### QUnit

I ended up settling with **QUnit** for the following reasons:

  1. Familiarity and ease of use.
  2. Easy integration with RequireJS.
  3. Easy and already available source/docs for integration with headless test runners ([JSTestDriver](http://code.google.com/p/js-test-driver/wiki/QUnitAdapter), [PhantomJS](http://code.google.com/p/phantomjs/wiki/TestFrameworkIntegration) – more on this later).

All of those are important. That list is really more representative of the order the contact states of a 3-way bulb where it eventually all came together. It was imperative that I could keep developing without choosing a **Unit Testing** framework that influenced the **AMD** library I chose and (as I will go into in a bit) it was necessary for my deployment needs to run the tests in a headless environment; during development, i want to write my tests (hopefully using “[_TDD-like-you-mean-it_](http://www.markhneedham.com/blog/2009/04/30/coding-dojo-13-tdd-as-if-you-meant-it/)“) and run them quickly and visually, but I also was looking forward to take that work in unit testing unmodified and provide it to a headless test runner when it came to run a full deployment. So [QUnit](http://docs.jquery.com/QUnit) fit in nicely… for now at least. The familiarity and ease of use is a nice initial draw, but the other two are really the weighing factors and I would not mind giving [Jasmine](http://pivotal.github.com/jasmine/) more of a go at a later date if i can ensure those two points.

In any event, using [RequireJS](http://requirejs.org/) and [QUnit](http://docs.jquery.com/QUnit) together is rather straight-forward, especially after finding this [nice gist from drewwells: https://gist.github.com/920405](https://gist.github.com/920405). The main rule to remember is to set _autostart_ to false on **QUnit**, and only invoke :_start()_ once you have required all tests:

_/test/index.html_
    
    <script src="../lib/require-1.0.4.js"></script>
    
    <script src="lib/qunit.js"></script>
    
    <script>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;QUnit.config.autostart = false;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;require.config({
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;baseUrl: ".",
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;paths: {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"com": "../script/com"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;requirejs(['script/RequestTest.js', 'script/RequestTokenTest.js', 'script/RouteStopTest.js'], function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;QUnit.start(); // Tests loaded, run tests
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    </script>

In basic terms, you have replaced adding _<script>_ tags for each test – as you normally would when working with **QUnit** – with loading them as modules through **RequireJS**. The tests utilize **RequireJS** as well, but do not define a module; rather require necessary dependencies through **RequireJS** and define tests that **QUnit** will find:

_/test/script/RequestTest.js_
    
    require( ['com/custardbelly/js/RequestToken', 'com/custardbelly/js/Request'], function( RequestToken, Request ) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;module( "Request Test" );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;test( 'send returns RequestToken', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var token,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;xhr = new Request( '[http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta](http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=mbta)' );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;token = xhr.send();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;equals( ( token !== 'undefined' ), true, 'Request.send() returns RequestToken' );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    });

The source library dependencies are defined in the first argument for _require_(), while the second argument is a handler with there reference supplied as arguments. As for the _module_() call, there’s nothing there now accept the name that will be associated and printed along with the tests but the **QUnit** _modules_ can also be used to define your _setUp_ and _tearDown_ fixtures. [Check out the docs for more information](http://docs.jquery.com/QUnit).

### PhantomJS

As I mentioned in the previous part of this section, it is a requirement for my deployment process to be able to run my unit tests in a headless environment. As well, it is preferable to not modify the set-up for unit testing in the development environment to run the tests later in deployment. I originally checked out [JsTestDriver](http://code.google.com/p/js-test-driver/) for my headless environment as it is undoubtably the most widely known – and for good reason. It even has an [adapter for QUnit](http://code.google.com/p/js-test-driver/wiki/QUnitAdapter), and I spent a great deal of time to get it working with my **QUnit** + **RequireJS** setup. To no available, however, as [this discussion reveals](http://groups.google.com/group/requirejs/browse_thread/thread/5113a89cf5f5dc52) in which script loading is not really supported by **JsTestDriver**, which is required (no pun) as we saw earlier in this article that **RequireJS** writes _async_ _<script>_ tags to the **DOM**.

That discovery led me to [PhantomJS](http://www.phantomjs.org/) which I am pretty happy out. As the site states:

“PhantomJS is a headless WebKit with JavaScript API. It has fast and native support for various web standards: DOM handling, CSS selector, JSON, Canvas, and SVG.  
PhantomJS is created by [Ariya Hidayat](https://twitter.com/AriyaHidayat).”

What that basically means is that it is nothing short of awesome, and by executing the **QUnit** adapter script provided at [http://code.google.com/p/phantomjs/wiki/TestFrameworkIntegration](http://code.google.com/p/phantomjs/wiki/TestFrameworkIntegration) I could point to my local main file that I use for running unit tests during development and run **PhantomJS** during deployment to stop and report back any failures encountered. Here is an example of that command:
    
    ./bin/phantomjs run-qunit.js file://localhost/Users/todd/massroute_js/massroute-examples/common/test/index.html

I actually played around with [PhantomJS](http://www.phantomjs.org/) farther beyond just trying to integrate with my [RequireJS](http://requirejs.org/) and [QUnit](http://docs.jquery.com/QUnit) set up for deployment, and the **API** it provides is exceptional and proves its use in a variety of automated tasks: [http://code.google.com/p/phantomjs/wiki/Interface](http://code.google.com/p/phantomjs/wiki/Interface).

* _If you are interested in how you can hook up additional logging/output for PhantomJS+QUnit, [@gavincoop](https://twitter.com/gavincoop) tweeted this gist to me that incorporates output of JUnit XML, which I hadn’t incorporated into my workflow: [https://gist.github.com/1588423](https://gist.github.com/1588423)_

### Unit Testing link dump:

[Test Driven Development](http://en.wikipedia.org/wiki/Test-driven_development)  
[Jasmine](http://pivotal.github.com/jasmine/)  
[Hiro](http://hirojs.com/)  
[QUnit](http://docs.jquery.com/QUnit)  
[JsTestDriver](http://code.google.com/p/js-test-driver/)  
[PhantomJS](http://www.phantomjs.org/)  
[Test-Driven JavaScript Development](http://www.amazon.com/Test-Driven-JavaScript-Development-Developers-Library/dp/0321683919) by Christian Johansen.

## Minification & Concatenation (min-concat)

As I was researching and introducing unit testing for my development workflow, the choice of unit testing framework began to hinge on its integration in a headless testing environment that could be used in a deployment scheme. When it comes to deployment and production-level sources, it is recommended to minify and concatenate scripts. Concatenation has the benefit of minimizing HTTP requests (with a trade off of size of course), and should be done with respect to dependencies; meaning, I would concatenate Service and Token modules together, but not with interactivity utility scripts – the user may not require one or the other during their session, so there is no need to bundle them together and bloat file size and request response time.

Typically I would save the min-concat for deployment. I would develop and test (both with browser developer tools and unit test) with fully spaced-up, line-break-containing, long-variable-name-using scripts and only min-concat when it came time to push to staging and production. Some say that this may present false positives as I would not be testing with what is to be live code. I would tend to agree and I am looking for a reliable way to fit this into the dev/deploy workflow, but for now it is much easier to test code with the full source using the browser developer tools (though i have heard that there may be new advancements in file swapping a’la [Charles](http://www.charlesproxy.com/) or [Service Capture](http://kevinlangdon.com/serviceCapture/) for dev tools).

When it comes to minification and concatenation of **JavaScript** files, there are a handful. When researching the right one to fit into my current development and deployment workflow, I also discovered and kick the tires on some fuller build systems that incorporated min-concat to see if they were something I could use. I highlight a few in the links section of this part as I think they may be beneficial to others, but I stuck with rolling my one build/deployment script mainly due to the dependency (happily and no pun intended ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) ) of [RequireJS](http://custardbelly.com/blog/requirejs.org) in my development.

### Minification

Here is a quick rundown of the most popular minifier/optimization scripts out there that I see:

  * [YUI Compressor](http://developer.yahoo.com/yui/compressor/)
  * [Google Closure Compiler](http://code.google.com/closure/compiler/)
  * [UglifyJS](https://github.com/mishoo/UglifyJS/)

In one way or another, most open-source build systems I have come across use one or a coupling of these. Each have their own strengths and compiler options, but I can not speak at length on the benefits outweighing one or the other. The reason that I didn’t delve into which incorporated better into my workflow was due to my want of modular development and **RequireJS**. So for obvious reasons that lead me to the supported optimizer tool from **RequireJS** – [r.js](http://requirejs.org/docs/optimization.html).

[r.js](https://github.com/jrburke/r.js) is an optimizer for JavaScript source files that use the AMD API. It can be configured to use either **UglifyJS**(default) or the **Closure Compiler** and can be run under [node.js](http://nodejs.org/) and [Rhino](http://www.mozilla.org/rhino/). It is a minifier and concatenator rolled into one and does so with respect to AMD loaders.

When using **r.js**, you provide a build file that defines your desired configuration in optimization. There is a good base example up in github: [https://github.com/jrburke/r.js/blob/master/build/example.build.js](https://github.com/jrburke/r.js/blob/master/build/example.build.js), and just as a quick example of what I have for a build file for the custom script in [massroute-js/common](https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/common):
    
    ({
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;baseUrl: '../../script',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;name: 'com/custardbelly/js/Request',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;include: ['com/custardbelly/js/RequestToken'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;out: '../../dist/script/custardbelly.min.js',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;optimize: "closure",
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;wrap: true
    
    })

That is the defining the base URL for modules to be used by the AMD loader (_baseUrl_), the main module (_name_) and its dependencies (_include[]_), the output filename (_out_), preferred optimizer (_optimize_), and whether or not to wrap the optimized file in _(function() { … }());_ to encapsulate the code.

Now, for my “commons” library that is being developed for the [massroute-js examples](https://github.com/bustardcelly/massroute-js), I have source split up into two packages – one that may be considered common to my domain, and one that is considered common to the application. Unfortunately, a single build file for [r.js](https://github.com/jrburke/r.js) doesn’t seem to be compatible to define multiple output modules with their own separate dependencies. In remembering the configuration file from previous example, I had thought this would be achievable by placing the _name_, _include_ and _out_ properties into each element of the modules list available from the **r.js** build API, eg.:
    
    ({
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;baseUrl: '../../script',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;dir: '../../dist/script',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;modules: [
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;name: 'com/custardbelly/js/Request',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;include: ['com/custardbelly/js/RequestToken'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;out: 'custardbelly.min.js'
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;name: 'com/custardbelly/massroute/model/InflatableModel',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;include: ['com/custardbelly/massroute/model/Route', 'com/custardbelly/massroute/model/RouteStop'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;out: 'massroute.min.js'
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;optimize: "closure",
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;wrap: true
    
    })

In this build file example, I attempted to output two optimized modules – one each for the _custardbelly_ and _massroute_ namespace, as I figured with the previous example representing a single module output with its configuration, defining them in the list in _modules_ would perform multiple module outputs; which is not the case. That is when i stumbled upon [this ticket in requirejs’ github](https://github.com/jrburke/r.js/issues/30#issuecomment-3693033) and gave the solution of using multiple “single file” builds, which is what I wound up using in my deployment.

It should be noted that [James Burke](http://tagneto.blogspot.com) has also released [almond.js](https://github.com/jrburke/almond), which is a light-weight AMD loader. With this, it is possible to run **r.js** and compile in **almond.js** to remove the dependency of loading the **require.js** library at runtime. I attempted to fold this solution into my deployment build, but ended up not using it mainly because of how **Rhino** looks up resources based on the _name_ property in the **r.js** configuration file; the only way to reliably fold **almond.js** into my optimized library was to include in the same directory as my custom scripts. I generally like to separate my scripts out into folders that rightly define their role and particularly do not intermix third-party libraries with my own scripts. But whatever. I am being a stickler and if it comes a benefit, I will probably incorporate a script that will temporarily copy the _/external/lib/almond.js_ file into my _/scripts_ directory only to remove if after running optimization with [r.js](http://requirejs.org/docs/optimization.html).

### Min/Concat link dump:

[Yahoo!: Best Practices For Speeding Up Your Website](http://developer.yahoo.com/performance/rules.html)  
[YUI Compressor](http://developer.yahoo.com/yui/compressor/)  
[Google Closure Compiler](http://code.google.com/closure/compiler/)  
[UglifyJS](https://github.com/mishoo/UglifyJS/)  
[r.js](http://requirejs.org/docs/optimization.html)  
[almond.js](https://github.com/jrburke/almond)

### Other min-concat build systems

[juicer: A command line tool for JavaScript and CSS developers.](https://github.com/cjohansen/juicer)_(Incredible work and will probably use again at a later date)_  
[smoosh: something like a himalountain.](https://github.com/fat/smoosh) _(I personally liked using this)_  
[grunt: A command line build tool for JavaScript projects.](https://github.com/cowboy/grunt)  
[jaguarandi: Ant build script to optimize and version Javascript, CSS, and HTML files](https://github.com/webpro/jaguarundi)  
[modulr-node: Resolves and concatenates CommonJS module dependencies for use in the browser.](https://github.com/tobie/modulr-node/)

## Deployment

The last couple sections of research – headless test runners and min-concat optimization – were leading up to deployment. These two areas are outside of my development workflow and are part of my deployment workflow. Truth be told, I will probably incorporate running headless test on the optimized scripts as well to make sure that the compiler didn’t ming anything once in production, but for now I am putting trust in the fact that it does not – and any runtime errors that occur are due to my source code (it happens!). 

In any event, here we stand with being tasked to fold in linting, testing, optimization and deployment. In the last section, I highlighted a few build systems I had come across as I was researching minification and concatenation of **JavaScript**, but I wanted to roll my own deployment script just so I can tailor it to my needs. I am not intending to provide it as an open source project as I feel it is very specific, but it is available and being continually developed from the [massroute-js github](https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/common) if you are interested.

When it came to creating the build script(s), I sat for moment to think about the environment I wanted to use. I took under consideration what I thought should be considered of a client-side developer to have installed on her machine. Is it too much to ask to install [node.js](http://nodejs.org/) or [ruby](http://www.ruby-lang.org/en/) for the sole purpose of running a development/deployment script? Should I stick with old reliable [ANT](http://ant.apache.org/) as it is pretty much accepted as a requirement for current and past projects? I answered “No” to both, though I do think the first question is a good discussion for another time; and I have written so many **ANT** build scripts that I wanted to do something different…

I settled on a simple [Makefile](http://www.gnu.org/software/make/manual/make.html), as it is quick and easy to understand and fulfills its current purpose:
    
    # Lint - JSHint
    
    LINT = ./build/lint/jshint
    
    SRC_DIR = ./script
    
    &nbsp_place_holder;
    
    # Tests - PhantomJS
    
    PHANTOM = ./build/phantom/phantomjs
    
    PHANTOM_QUNIT_RUNNER = ./build/phantom/run-qunit.js
    
    TEST_DIR = ./test
    
    TEST_INDEX_URL = file://localhost/Users/todd/massroute_js/massroute-examples/common/test/index.html
    
    &nbsp_place_holder;
    
    # Min/Concat - r.js
    
    R_JS = java -classpath ./build/rhino/js.jar:./build/closure/compiler.jar org.mozilla.javascript.tools.shell.Main
    
    R_DIR = ./build/require
    
    &nbsp_place_holder;
    
    all: lint phantom optimize
    
    &nbsp_place_holder;
    
    lint:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;@echo '==> JSHint $<'
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;@@for file in `find ${SRC_DIR} -name "*.js"`; \
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;do echo ===Linting $$file...===; ${LINT} $$file; done;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;@echo
    
    &nbsp_place_holder;
    
    phantom:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;@echo '==> Phantom $<'
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;${PHANTOM} ${PHANTOM_QUNIT_RUNNER} ${TEST_INDEX_URL};
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;@echo
    
    &nbsp_place_holder;
    
    optimize:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;@echo '==> r.js $<'
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;@@for file in `find ${R_DIR} -name "*.build.js"`; \
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;do echo ===r.js: $$file...===; ${R_JS} ${R_DIR}/r.js -o $$file; done;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;@echo

Certainly, this sort of [Makefile](http://www.gnu.org/software/make/manual/make.html) is intended for the lead developer or automated system to run at deployment, rather than being shared across multiple developers during development as the constants are pretty system specific. If this development/deployment workflow were to introduced into a company workflow, I would probably opt for [ANT](http://ant.apache.org/) or [Rake](http://rake.rubyforge.org/) – which I intend to add to the repository at some point. As well, this deployment is simply just for JavaScript. I may find down the line that a more complete system is required which can optimize HTML, CSS, images, etc. and actually deploy files to a server. The playing field then widens and sticking with **Make** is probably not going to be the optimal solution, and I may rethink requiring [node.js](http://nodejs.org/) or [ruby](http://www.ruby-lang.org/en/) environments for deployment.

## Conclusion

So there we have it. My current development and deployment workflow. Subject to change, as always. Decisions towards testing and optimization were definitely weighted with respect to my choice in [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD), but I feel [RequireJS](http://requirejs.org/) presents a strong enough case for modular development, so I am pretty confortable and happy with it at the moment. It was a great learning experience researching and testing all the various frameworks, libraries and systems in finding what worked and I appreciate the openness of the **JavaScript** community in releasing such quality and well-documented code; I hope to return the favor some day.

A quick round-up from the original listing of what i wanted to achieve, marked with the decision:

  * AMD – [RequireJS](http://requirejs.org/)
  * Code Quality – [JSHint](http://www.jshint.com/)
  * Unit Testing – [QUnit](http://docs.jquery.com/QUnit) & [PhantomJS](http://www.phantomjs.org/)
  * Minification / Concatenation – [r.js](https://github.com/jrburke/r.js/) (+[Closure Compiler](http://code.google.com/closure/compiler/))
  * Build / Deploy – [make](http://www.gnu.org/software/make/manual/make.html)

cheers!

Posted in [AMD](http://custardbelly.com/blog/category/amd/), [JSHint](http://custardbelly.com/blog/category/jshint/), [JavaScript](http://custardbelly.com/blog/category/javascript/), [PhantomJS](http://custardbelly.com/blog/category/phantomjs/), [QUnit](http://custardbelly.com/blog/category/qunit/), [RequireJS](http://custardbelly.com/blog/category/requirejs/), [r.js](http://custardbelly.com/blog/category/r-js/).
