---
title: 'Micro-Library Facades and Dependency Management using RequireJS'
url: 'https://custardbelly.com/blog/2012/03/06/facaded-micro-libraries-and-dependency-management-using-requirejs/'
author:
  name: 'todd anderson'
date: '2012-03-06'
---

I recently have been evaluating some JavaScript micro-libraries mainly to see what the community has put out there, read through some code and see what might be appropriate for any upcoming projects, but also to break a dependency on loading libraries that include code that largely goes unused in an application. 

As of late, I have been a pretty strong proponent of [AMD](https://github.com/amdjs/amdjs-api) (with a favor toward [RequireJS](http://requirejs.org/)) largely with the intent of modularized development but also with an ideal of downloading only what is required by the application. Introducing a dependence (and unnecessary download time) on a library that is only fractionally used seems contradictory in the goal of deploying a compact and stream-lined application. That is not to say that such libraries aren’t useful or have a place; and more often than not, such libraries have a great history, a number of brilliant engineers behind it and proven track record with production-level applications. There is definitely a give and take, and options do need to be weighed on a per-application basis, yet I feel there can be a great benefit in using a collection of libraries that each serve a single purpose.

So with that determination, I have been investigating some JavaScript micro-libraries that are out there in the wild – from DOM accessors, to routers, to observers. I haven’t settled on anything to definitively give the OK on using one library over another; just having a bit of fun discovering what the community has to offer – and hopefully one day can contribute and give back to.

## The Problem

While test-driving some micro-libraries it quickly became apparent how inefficient my process was. I would start creating a new project to test out a library and copy over numerous files or _worse_ just fill up a directory with files targeting and named after the library I was including. This grew out of control and weakened a proper evaluation of a library with all the clutter; _which one was it? where did i use it? why am i so hungry?_

Out of a desire to mitigate this confusion, I settled on an approach to provide a consistent API for development of an application through facades that affords the ability to test-drive different micro-libraries with similar responsibilities. The basic premise is to define a common API that I can develop against contextually, and define and swap out abstracted adaptations of different micro-libraries. As such, I can amass a directory of modules that define this API and declare the library I am currently working within a require statement using [RequireJS](http://requirejs.org/). I believe it is more of a poor-man’s, less-robust and perhaps not production ready approach that [Addy Osmani](http://addyosmani.com/blog/) is working on with [Aura](https://github.com/addyosmani/backbone-aura) – a library I am very excited to checkout.

I have some basic examples of the solution I am using at [http://github.com/bustardcelly/requirejs-microlib-facade](http://github.com/bustardcelly/requirejs-microlib-facade).

## Facades

As mentioned previously, the largest part of this solution is to provide a common API to develop against. I want to have my scripts that interact with an API to pass tests regardless of the dependency passed in – with the dependence being the facade module that is adapted to the target micro-library. This area is possibly the crux of the whole argument. Which API do you adapt to? Or rather, which implementation of a micro-library should you favor in exposing an API for multiple micro-libraries? A lot of them have similar methods, but the delegate response signatures can vary. It’s all at the whim of the developer of the micro-library and their vision of the cleanest solution. I don’t have an answer to this, by the way ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) Just bringing it up. I lean towards providing an API that is similar to the most widely-used solution.

Recently I have been evaluating client-side routing libraries that fit perfectly into this modularized facading concept. Particularly, the first library I wanted to test was [PathJS](https://github.com/mtrpcic/pathjs) which provided support for [HTML5 history](http://diveintohtml5.info/history.html) as well as fall-back to hash tags (plus niceties like parameterized routes, roots, and others). However, as it provided these capabilities, it also provided two different APIs for them. We could go into a discussion of whether this is good practice and whether it should be abstracted away from the front-end developer, but that isn’t my biggest concern at the moment – especially as we can mitigate that concern by abstracting each approach into facades that share a common API. The following are examples of the implementations that adapt to the hash tag implementation and the History implementation respectively:

_/script/router/PathHashTagFacade.js_
    
    define( ['../../lib/path.min.js'], function() {
    
     
    
        return {
    
            map: function( fragment, delegate ) {
    
                Path.map( '#'+fragment ).to( function() {
    
                    var paramProperty,
    
                        paramArray = [];
    
                    for( paramProperty in this.params ) {
    
                        paramArray[paramArray.length] = this.params[paramProperty];
    
                    }
    
                    delegate.apply( this, paramArray )
    
                });
    
            },
    
            root: function( fragment ) {
    
                Path.root( '#'+fragment );
    
            },
    
            init: function( useHistory ) {
    
                Path.listen();
    
            }
    
        };
    
     
    
    });

_/script/router/PathHistoryFacade.js_
    
    define( ['../selector/SimpleSelectorFacade', '../../lib/path.min.js'], function( $ ) {
    
     
    
        var links = $('a'),
    
            i = 0, length = links.length;
    
     
    
        for( i; i < length; i++ ) {
    
            links[i].onclick = function( event ){
    
                event.preventDefault();
    
     
    
                var location = this.attributes['href'].value;
    
                location = location.split( '#' ).join( '' );
    
                Path.history.pushState( {}, '', location );
    
                return false;
    
            };
    
        }
    
     
    
        return {
    
            map: function( fragment, delegate ) {
    
                Path.map( fragment ).to( function() {
    
                    var paramProperty,
    
                        paramArray = [];
    
                    for( paramProperty in this.params ) {
    
                        paramArray[paramArray.length] = this.params[paramProperty];
    
                    }
    
                    delegate.apply( this, paramArray )
    
                });
    
            },
    
            root: function( fragment ) {
    
                Path.history.pushState( {}, '', fragment );
    
            },
    
            init: function( useHistory ) {
    
                Path.history.listen( true );
    
            }
    
        };
    
    });

Within the definition of each module, a dependency on the [PathJS](https://github.com/mtrpcic/pathjs) library is declared and loaded prior to entering the load delegate. [PathJS](https://github.com/mtrpcic/pathjs) is not provided as an AMD module, so it is accessed using _Path_ globally in both examples. The two differ, however, in their implementation of the their common API: _map_, _root_, and _init_. Let’s set aside the irony of the fact that I am now loading two files (_path.js_ and either facade file) with the end goal being to minimize load times – this will be made clearer in the next example; I just wanted to show the possibility this solution provides in also testing implementation with the same library.

The implementations are very similar in the two examples. The former mostly takes input and prepends values with a hash (#). The latter uses the History API on _Path_, and intercepts click events on links to properly handle then in the context of _Path.history_.

Just as a quick example of how I would then employ this:
    
    require( ['script/router/PathHashTagFacade'], handleRouterDependency );
    
     
    
    function handleRouteDependency( router ) {
    
        require( ['script/RouterDependentClient'], function( client ) {
    
            client.setRouter( router );
    
        });
    
    };

If HTML5 History API was okay’d for the project and we wanted to utilize the History API on [PathJS](https://github.com/mtrpcic/pathjs), then we just change the loaded dependency in the first _require_() statement.

If we look back at the two facade examples for the _Path_ library, both _map_ implementations change the way in which a mapped delegate is handed state with regards to how _Path_ is designed to forward along parameterized values. Usually the parameter key/value pairs are filled on a _params_ Object which is then inspected within the delegate method for the mapped URL. In those examples, I have changed the invocation on the delegate to actually provide the parameterized values as arguments. The reason is because another library I am evaluating does such, and I much prefer it.

Another popular routing library is [Director](https://github.com/flatiron/director). We can now provide a facade for that library that adheres to the same API as the other examples and not have to modify any scripts that interact with the routing dependency (aside from the original _require_() call):

_/script/router/DirectorFacade.js_
    
    define( ['../../lib/director-1.0.7.min.js'],function() {
    
     
    
        var router, root,
    
            routes = {},
    
            adapter = {
    
                map: function( fragment, delegate ) {
    
                    routes[fragment] = delegate;
    
                },
    
                root: function( fragment ) {
    
                    if( router === undefined ) {
    
                        root = fragment;
    
                    }
    
                    else {
    
                        router.setRoute( fragment );
    
                    }
    
                },
    
                init: function( useHistory ) {
    
                    router = new Router( routes );
    
                    router.init();
    
                    if( root !== undefined ) {
    
                        router.setRoute( root );
    
                    }
    
                }
    
            };
    
     
    
        return adapter;
    
     
    
    });

Now I can swap out the preferred facade at any time during the development cycle of my project and not have to change any application code that depends on the one chosen.

You can checkout the code and an example at [https://github.com/bustardcelly/requirejs-microlib-facade](https://github.com/bustardcelly/requirejs-microlib-facade).

## Evaluation

This isn’t going to be an evaluation of the micro-libraries I am currently testing. Perhaps I will do that in another post, but usually I reserve stating my preference on libraries through [annoying tweets](http://twitter.com/_toddanderson_). Rather, I wanted to provide my running list of Pro’s and Con’s with regards to this approach of developing an application against a common API that is defined in AMD modules that provide access similarly to underlying micro-libraries that implement the same contextual task differently. I like starting with Con’s.

**Cons:**

* Adapting to each libraries implementation.

  * With the glut of micro-libraries out there, it can be a daunting task to simply say that I can fit each one into a similar interface – much less provide the same outgoing signature on any delegate responders. 
* Facading to a single task.

  * There are many libraries that are well-suited for a task, but provide implementations for multiple tasks.
  * Typically, I think of a facade as providing one API for multiple composited pieces that may or may not interact with each other. I can get over the nomenclature, but what if a the same library provides a well-suited implementation for multiple tasks and is not provided as an AMD? I have not addressed cutting down multiple requests for the same library that may be used across multiple facade modules.
* JavaScript itself.

  * In JavaScript we can not define an Object as being an implementation of a specific Interface nor, consequently, run any tools to ensure that it adheres to one. I am sure there are libraries and ‘tools’ out there that can provide a way that makes it appear that an Object needs to or is adhering to an Interface, I am speaking more out-of-the-box: JavaScript doesn’t have interfaces. _Not arguing whether that is right or wrong_.
  * The main advantage of this approach to facade modules is to develop against a consistent API. As such, it is far too easy – because of the dynamicism of JavaScript – to lose that across multiple modules, even just in simple spelling mistakes. This calls for more unit testing, which you should be doing anyway (**yes, I am glaring at myself right now**).

**Pros:**

* Developing an application against a dependency whose API will not change based on the required underlying micro-library.
* Ability to inject, at runtime, a different dependency if required (say, for instance, after having checked browser capabilities).
* The use of high-falootin’ buzzwords when describing your approach to colleagues.

Does one outweigh the other? In as far as development, I am leaning toward the _Pro’s_, but I do worry that some the _Con’s_ may deter me from really evaluating a library that may be best-suited, simply because it is too difficult at the time to fit into the defined API.

## Conclusion

Will I recommend this approach for production-level application deployment? 

That is yet to be determined. I still subscribe to the practice that you should compile in (concatenate and minify) all the sources required by an application. So, having the ability to switch the target facade at runtime or on the server by just modifying a line in some script file doesn’t seem to be the right approach in delivering a web-based application at the moment for me. I would evaluate a handful of libraries, determine the best suited one for the application and include that one (along with the accompanying facade) in my [r.js build](https://github.com/jrburke/r.js/). But I reserve the right to be proven wrong and/or change my mind ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

Posted in [AMD](https://custardbelly.com/blog/category/amd/), [JavaScript](https://custardbelly.com/blog/category/javascript/), [RequireJS](https://custardbelly.com/blog/category/requirejs/), [micro-library](https://custardbelly.com/blog/category/micro-library/).
