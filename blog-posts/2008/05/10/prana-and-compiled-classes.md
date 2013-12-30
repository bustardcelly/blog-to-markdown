# [Prana and compiled classes](http://custardbelly.com/blog/2008/05/10/prana-and-compiled-classes/)

I have recently gotten into incorporating [Prana – the Inversion of Control framework of AS3](http://www.pranaframework.org/) created by [Christophe Herreman](http://www.herrodius.com/blog/)- into my projects. I gotta say, it’s beautiful piece of work and makes me rethink my approach to the architecture of applications again.

I don’t want to go into IoC and dependency injection and how your applications can truly benefit by using the [Prana](http://www.pranaframework.org/) framework, as this post may get pretty long and these references are much better reading than my rambling:

Christophe’s blog: [http://www.herrodius.com/blog/](http://www.herrodius.com/blog/)  
Martin Fowler’s [Inversion of Control Containers and the Dependency injection pattern](http://martinfowler.com/articles/injection.html)  
[the hollywood principle](http://en.wikipedia.org/wiki/Hollywood_Principle)

What i did want to bring up is that i had a small problem with the workflow and how i develop. Which is my problem, of course ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) but nonetheless…

One important thing to remember is that the context file is an external file that is loaded by the application at runtime. This means you will need to have all the possible classes your application _may_ use already compiled into the SWF in order for the objects to be instantiated and your application to work. If you are typing to interfaces, this could prove to be a bit of a problem. You could create a reference for each class that may be needed in another class that is known to be compiled into the SWF – as Christophe explains [in this post](http://www.herrodius.com/blog/65) – but that always seemed dirty to me. 

As is mentioned in the comments to that [post](http://www.herrodius.com/blog/65), you can also go about adding each class using the -includes compiler option. Adding all possible classes using the -includes option makes for an excellent case on when to use additional compiler configurations, and presents the option to really just change the application context file and the additional configuration file as the project sees fit, without having to open up the source and tack on or remove dummy references to classes.

As an example, take for instance this application context file:
    
    < ?xml version="1.0" encoding="utf-8"?>
    <objects>
    	<property file="app.properties" />
    	<!-- Handles direct invocation on client -->
    	<object id="callbackHandler" class="com.example.responder.CallbackResponderImpl" />
    	<!-- Handles connection to Red5 application -->
    	<object id="connectionDelegate" class="com.example.business.ConnectionDelegateImpl">
    		<property name="rtmpURI" value="${app.rtmpURI}" />
    		<property name="client">
    			<ref>callbackHandler</ref>
    		</property>
    	</object>
    </objects>

.. for each possible implementation of **ConnectionDelegate** and **CallbackResponder** that i may decide to swap in and out as the project seems fit, i would either need to hold a reference to each implementation in some class sure or be compiled into the SWF, or i could store them in an additional config file that can be added using the -load-config option with an additional value:

The **prana.config** file:
    
    <flex -config>
    	<includes append="true">
    		<symbol>com.example.reponder.CallbackResponderImpl</symbol>
    		<symbol>com.example.business.ConnectionDelegateImpl</symbol>
    	</includes>
    </flex>

… drop that in my source folder and add the compiler option:
    
    -load-config+=prana.config

From there, i could change the context as i see fit, update the prana.config file to reflect my preferences and just recompile the application without having to go into the source and muck about. It’s a little more clean for me and allows me to happily go about using the [Prana](http://www.pranaframework.org/) framework.

The best part is that [Prana is truthfully AS3 compliant](http://www.herrodius.com/blog/64)! Meaning you can use it in your Flex _AND_ AS3 projects, which cannot be said for some frameworks that claim to be AS3 and actually use class from the mx package… (looking at you [as3lib](http://code.google.com/p/as3lib/)). _A huge pet-peeve of mine._  
*Last i checked, the source under version control doesn’t seem to reflect the current changes [Christophe](http://www.herrodius.com/blog/) has made, but they are included in the downloads.

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/), [Prana](http://custardbelly.com/blog/category/prana/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – May 10, 2008
  *[May 10, 2008]: 2008-05-10T14:58
