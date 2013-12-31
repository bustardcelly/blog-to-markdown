---
title: 'massroute-js: dojo example'
url: 'http://custardbelly.com/blog/2011/10/04/massroute-js-dojo-example/'
author:
  name: 'todd anderson'
date: '2011-10-04'
---

_I have created a github repository at [http://github.com/bustardcelly/massroute-js](http://github.com/bustardcelly/massroute-js) to explore various JavaScript libraries and frameworks with a focus of delivering a web-based application for [real-time transportation data made available from MassDOT](http://www.eot.state.ma.us/developers/realtime/). This article intends to address my findings in an exploration of one of those libraries or frameworks that have caught my interest. If you have any suggestions for another **JavaScript** library/framework please leave a comment._

_It should also be noted that some explanations may be heavily influenced by my experience in developing for the **Flash Platform** and particularly their relation to the **ActionScript** and the **Flex** mark-up language._

As far as **JavaScript** libraries that go beyond providing an abstraction layer/decorator to the **DOM** and a facade for **AJAX** requests – such as one would find with [jQuery](http://jquery.com) – I have been interested in digging into [Dojo](http://dojotoolkit.org/) for some time. I should state that I am in no way knocking **jQuery**. It works extremely well at what it purports to do. I do, however, have an interest in how to “maintain” an application written in **JavaScript** in as much as not only adhering to architectural patterns but code organization and dependency management. That is not to say you could not work with another library that incorporates or works laterally with **jQuery** for such support; I am also interested in those libraries that provide more of a unified application structure alongside **AJAX** and **DOM** access. Enough defending **jQuery**…

For many reasons [Dojo](http://dojotoolkit.org/) caught my eye because not only does it provide **DOM** access/manipulation through abstraction (as well as using [Sizzle](http://sizzlejs.com/) as the selector engine, as **jQuery** does) but dependency management through a modular package system, as well. What that really means is that I can organize my scripts in a directory tree structure, and define classes and their dependencies using the provide/declare/require API of [Dojo](http://dojotoolkit.org/). This allows for a common “package structure” and resolves to namespaced objects at runtime (or _build time_- maybe more on that later), providing a modular-approach to building a **JavaScript** application.

_The example was built against **Dojo 1.6.1**, so any further explanations in this post are dependent on my knowledge working with the Dojo library at that version._

## Modules

Now, truth be told, I utilized the **Dojo** module dependency system as I would with declaring and importing classes. This is mainly because of my experience with languages that are class-based (or provide a class “structure”) and that **Dojo** provides an elegant and easy way for class declaration and inheritance on top of the prototypical nature of **JavaScript**. So my modules really became more like classes or groupings of common classes – which is perfectly acceptable to me and how I would prefer to work – but it should be noted (if you were to look at [the example in the github repo](htts://github.com/bustardcelly/massroute-js)) that modules are not restricted to only declaring classes.

Just to provide a quick example of what i mean by treating modules as independent classes or a grouping of common classes, let’s look at an abbreviated version of the main context module (script file) for the application:
    
    dojo.provide( "context.massroute" );
    
    dojo.require( "model.session" );
    
     
    
    dojo.declare( "context.massroute.MassRouteContext", null, {
    
        constructor: function() {
    
            this.session = new model.session.Session();
    
        }
    
    }

The value within a _dojo.provide()_ invocation creates (if not previously existant) a namespaced object on global (window) scope and caches the reference within _dojo._loadedModules_ with the property value of the string argument (”context.massroute” in this example). Essentially this sets up a “package” structure for your declarations with access to classes once a module has been requested and loaded. 

Modules are loaded using_ dojo.require()_. The _dojo.require()_ states a dependency on another module. For this example, **Dojo** is requested to load the “model.session” module. More on the association between files and package declarations in a bit, but for now know that if “model.session” is not found on the _dojo._loadedModules_ cache, a request for **/model/session.js** will be made. Once loaded, it would go through much of what is currently being covered in this example: defining namespace, loaded dependencies and declaring classes. If we were to open the **/model/session.js** file found the application script source, we would find a _dojo.declare()_ for the **model.session.Session** class.

With each _dojo.declare()_ within the provided namespace, the objects on the direct global scope and within _dojo._loadedModules_ are updated to hold reference to the class, which essentially allows you to create a new instance of a class as one normally would:
    
    var context = new context.massroute.MassRouteContext();

// declare explanation  
The _dojo.declare()_ takes three arguments:

  * className: defines the associated name for the class within the package/namespace.
  * inheritance: defines the classes to “mixin” to your class. This can be null, a single class reference or an array of class references. The class reference(s) can be thought of as base or multiple inheritance if defined.
  * properties: defines the object that encapsulates all the logic particular to the class

_The inheritance I found of particular note as dojo provides an easy way to call super methods. Essentially, within the scope of the override method of a subclass you can call this.inherited(arguments)._

To get a better understanding of how this all works and what is modified as modules are loaded and classes declared, if we suppose that this module is requested to be loaded in the current domain, the global object will be modified to reflect the following:
    
    [window] {
    
        dojo: {
    
            _loadedModules: {
    
                "context.massroute": {
    
                    "MassRouteContext": function() { ... };
    
                }
    
                "model.session": {
    
                    "Session": function() { ... };
    
                }
    
            }
    
        }
    
        context: {
    
            massroute: {
    
                MassRouteContext: function() { ... };
    
            }
    
        }
    
        model: {
    
            session: {
    
                Session: function() { ... };
    
            }
    
        }
    
    }

That gives a little insight into **Dojo**’s nested namespace pattern and how access to classes is provided, as well as how **Dojo** manages caching of previously requested dependencies.

Just for kicks, if we translated this example over to ActionScript it would be read as this:
    
    package context.massroute {
    
        import model.session.Session;
    
     
    
        class MassRouteContext {
    
            public var session:Session;
    
     
    
            function MassRouteContext() {
    
                session = new Session();
    
            }
    
        }
    
    }

I touched on it briefly before, but you may be wondering how dojo knows how to associated these namespaces with modules to load within its package system. By default, **Dojo** will assume that a file with the name of the ending namespace resides in a relative location of its request – meaning, if my main **index.html** file resides at the root of the directory, when I _dojo.require(”context.massroute”)_, **dojo** will make a request for **./context/massroute.js** if the path to that module is not defined. If you have taken a look at the example in my github repo, you may notice that **/content/massroute.js** is not located at the root but in a parenting directory describing the scripts for my application.

You can define the path to your modules by declaring a global _dojoConfig_ object prior to load of the **Dojo** library. An abbreviated version of what that would be for the example above:
    
    <script>
    
        dojoConfig = {
    
          baseUrl: './',
    
          modulePaths : {
    
                app : "js/app",
    
                context: "js/app/context",
    
                model: "js/app/model"
    
            }
    
        };
    
    </script>
    
    <script src="[http://ajax.googleapis.com/ajax/libs/dojo/1.6.1/dojo/dojo.xd.js](http://ajax.googleapis.com/ajax/libs/dojo/1.6.1/dojo/dojo.xd.js)"></script>

This defines the base URL for the directories defined in **modulePaths**. Now when you _dojo.require( “context.massroute” )_, **dojo** will look up the associated directory for the context namespace and request to load **massroute.js**. Once loaded, it is important to note that the file isn’t inserted into a script tag which is a common practice for script loaders. It is actually run through _dojo.eval()_ which creates namespaced objects on **global** and **dojo** scopes as described above.

### Some Caveats

There are some things that I didn’t immediately realize or think of off-hand that may be of interest to those of you whether or not you come from a class-based language:

  * Anything you think is defined privately to the “class” in the constructor using _dojo.declare()_ is actually set at global scope.
  * No such things as private members to the class. Prepending members with “**_**” is the convention to “convey” to developers that a member is private.

There is a way around this whole private member business, however. If you are in dire need to keep something private, you can use an [Immediately Invoked Function Expression](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) (**IIFE**) to define your private members as well as the class, such as:
    
    dojo.provide( "context.massroute" );
    
    dojo.require( "model.session" );
    
     
    
    (function() {
    
        var _session = new model.session.Session();
    
        dojo.declare( "context.massroute.MassRouteContext", null, {
    
            constructor: function() {
    
                console.info( _session );
    
            }
    
        }
    
    }
    
    )();

It should also be noted that you don’t have to use _dojo.declare()_ at all to get the same structure. Essentially – from what I gather – under the hood, the library does the following (in as far as constructing the namespace) which you are perfectly welcome to do as well in a module and can help with your private requirements using a mix of **IIFE** and the [Constructor Pattern](http://javascript.crockford.com/private.html):
    
    dojo.require( "model.session");
    
     
    
    (function() {
    
        if( !dojo._hasResource["context"] ) {
    
            dojo._hasResource["context"] = true;
    
            dojo.context = {};
    
        }
    
        if( !dojo._hasResource["context.massroute"] ) {
    
            dojo._hasResource["context.massroute"] = true;
    
            dojo.provide( "context.massroute" );
    
     
    
            context.massroute.MassRouteContext = function() {
    
                var _session = new model.session.Session();
    
                return {
    
                    getSession: function() {
    
                        return _session;
    
                    }
    
                }
    
            }
    
        }
    
    })();

Obviously, going that route, you will miss the niceties that **Dojo** provides in class inheritance but just throwing it out there.

## Events

**Dojo**’s event system was another part of the framework i enjoyed. Using _dojo.connect()_ and _dojo.disconnect()_ you could easily assign and remove event handling (delegate functions) to **DOM** events on a target scope, respectively. And, because _dojo.connect()_ returned a connect object, it conveniently made it possible to disconnect all connection I may have set up in a view controller that was going to be trashed:
    
    var connections = [];
    
    connections.push( dojo.connect( dojo.byId('submitButton'), 'onclick', handleSubmitRequest ) );
    
    connections.push( dojo.connect( dojo.byId('cancelButton'), 'onclick', handleCancelRequest ) );
    
    ...
    
    dojo.forEach( connections, dojo.disconnect );

It should be noted that when using _dojo.connect()_ you are not limited to just **DOM** events. You can connect to “custom” events on non-**DOM** objects. To do so, the second argument is actually the function on the target object that you wish to “listen” for invocation of. As a quick example:
    
    var test = function() {
    
        return {
    
            run: function() {
    
                setTimeout( this.onTimeout, 1000 );
    
            },
    
            onTimeout: function() {
    
                console.info( "test.onTimeout" );
    
            }
    
        }
    
    };
    
     
    
    var myTest = new tester();
    
    dojo.connect( myTest, "onTimeout", function() {
    
        console.info( "dojo.connect() > onTimeout" );
    
    });
    
    myTest.run();

Along with _dojo.connect()_ and _dojo.disconnect()_, using _dojo.publish()_ and _dojo.subscribe()_/_dojo.unsubscribe()_ you can make use of the global event bus to broadcast and subscribe to custom events – similar to, say, the _NSNotificationCenter_ from **Objective-C**. I used this heavily in reporting what i deemed application-level state related events from the view controllers in the **Dojo** example in the [massroute-js github repo](http://github.com/bustardcelly/massroute-js), and thought it was a pleasure to work with.

## Other

Just quick notes on some other things that i found interesting from the **Dojo** framework that I either used or want to use in the future using **Dojo**:

### dojo.hitch

Keeping scope was a pleasure with _dojo.hitch()_. Due to developer requirements from **MassDOT** in using their **API** for real-time transportation data, you cannot make **API** calls more frequently than every 10 seconds. This meant that I had to implement a request queue in which I had to route the calls: immediate invoke if timer not running, else your next in line when timer runs out. Keeping scope of what was to be called when inside this queue manager was necessary as the queue manager itself was not supposed to have any logic about the service, only knowledge of state between orders coming and going. So it was important that when it was time to process the order, the scope was tied to the one who placed the order.  
[dojo reference: dojo.hitch()](http://dojotoolkit.org/reference-guide/dojo/hitch.html)

### dojo.behavior

Though I went with my own custom view controllers and their logic encapsulated in respective classes, Dojo provides the ability to assign “behaviors” which i really want to look into further as it looks to be a nice design in separation of logic from view using mediation that can be swapped out quite easily at runtime.  
[dojo toolkit: Using dojo.behaviour](http://dojotoolkit.org/documentation/tutorials/1.6/using_behavior/)

## Wish I Coulda

The following are a couple things I struggled with when working with the **Dojo** toolkit.

### Development/Debugging

I love **breakpoints**. Being able to set a breakpoint and traverse a call stack and inspect properties is the pleasurable way for me to debug any problems. However, due to the design of **Dojo**’s modular architecture I found myself relying more on console for debugging purposes as modules are essentially read from a URL and evaluated as an expression. This means i couldn’t locate the file resource in development tools and set a breakpoint in any of my modules. 

I am sure there is some trick or project set-up that would provide a more debugging-friendly environment when developing an application with **Dojo**, but I couldn’t find it. If you know of one, please leave a comment. 

### Build

From the looks of it, **Dojo** has a pretty powerful [Build System](http://dojotoolkit.org/reference-guide/build/). Intended to produce minified and concatenated scripts, using the build system allows you to package only what your app required from the **Dojo** framework. I frustratingly tried to get it to work a couple times, but it always ended up with the full dojo and my scripts were never minified or concatenated and it created this weird directory structure that made no sense. I am probably doing it wrong, but there is little out there in documentation if anything goes wrong. 

There is also the [online Build Tool](http://build.dojotoolkit.org/), but i didn’t know the whole breath of source I needed for my build; I am assuming from the docs that there is where the power of the Build System and profiles comes into play.. Something I would definitely like to check out further because, next to the modular design, this *in theory* makes **Dojo** a real winner.

## Conclusion

All in all, I was pretty impressed by **Dojo** and would recommend trying it out and may bring it up as a framework of choice for any larger projects in the future (especially if i could get Build to work for me). There was a slight learning curve mainly in the class declaration and inheritance design, but nothing over-daunting and actually quite revealing. The curve probably would have been higher if I was not already familiar with popular **JavaScript** patterns.

[Dojo Toolkit](http://dojotoolkit.org/)  
[massroute-js/dojo](https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/dojo)

Posted in [JavaScript](http://custardbelly.com/blog/category/javascript/), [dojo](http://custardbelly.com/blog/category/dojo/), [massroute-js](http://custardbelly.com/blog/category/massroute-js/).
