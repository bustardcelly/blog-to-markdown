---
title: 'Flex 4.5 (Hero) – Persistant Data in MobileApplication'
url: 'https://custardbelly.com/blog/2010/11/15/flex-hero-persistant-data-in-mobileapplication/'
author:
  name: 'todd anderson'
date: '2010-11-15'
---

I had the a great time at [**RIAUnleashed**](http://riaunleashed.com/) this year and had a chance to check out [Christophe Coenraet](http://coenraets.org/)’s session on [Flex 4 “Burrito” and Flex “Hero” SDK](http://labs.adobe.com/technologies/flashbuilder_burrito/). An excellent speaker and one I had been hoping to see for some time. His presentation was mainly focused on **Mobile Application** development with **Hero SDK** in _“Burrito”_.

[Christophe](http://coenraets.org/) gave a great talk and one thing that really stood out to me – as far as the navigation framework for a Mobile Application in **Hero** – was how to persist state for a view in as far as the life of the current application session. And it got me thinking about how there really is a difference between persisting data within the session of an application, and persisting data throughout the life (or rather, until the user deletes) your application from their device. I am familiar with – what i still call (thanks objective-c!) – “user prefs” and session data within the iOS and Android frameworks, but Flex (granted) takes on a different context on how a view is notified of data, both in session and from recovery/restart.

[**[NOTE]** _It should be noted that this post will be discussing some of the finer points of the persistant data API available, as of this writing, with the free trial download of [Flash Builder “Burrito”](http://labs.adobe.com/technologies/flashbuilder_burrito/) and the included Flex SDK Version 4.5.0 build 17689_]

## A Brief Rundown

### View

A Flex **MobileApplication** is *roughly* made up of multiple **View** objects. Each **View** is pushed on or popped from a history stack depending on the user action. As one **View** is activated, the previous view is deactivated and its state is cached through its _data_ property. Meaning, each time you enter a view, a new instance of it is instantiated and provided a data object through its **IDataRenderer** method implementation of the _data_ attribute. There is much more to a **View**, including its display which was explained in great detail by [Christophe](http://coenraets.org), but for the purposes of this post I just wanted to touch on the importance of the _data_ property of **View** and two additional methods: _serializeData_() and _deserializePersistedData_(). Keep those in the back of your mind.

### PeristanceManager

**MobileApplication**, the base view and main application instance used when creating a new _Flex Mobile Application_, has a **PersistanceManager** member whose primary job is to read and write data to a **Shared Object** and save it on the local disk.

_Where are those saved?_

**Mac OSX**: /Users/{user}/Library/Preferences/{project.name}/  
LocalStore/#SharedObjects/{project.name}.swf/FXAppCache.sol

<del>**PC**: I don’t know.</del>

**PC**: (Window 7): C:\Users\{user}\AppData\Roaming\{project.name}/  
LocalStore/#SharedObjects/{project.name}.swf/FXAppCache.sol _[ED: Thanks, [Dennis](http://www.gread.net/devdesign/)!]_

Seeing as we are storing data out of the application, when employing the **PersistanceManager** we intend to serialize some state information to be used throughout the life of the application (from installation to un-installation). In order to enable a **MobileApplication** to use persistant data in such a way, you need to set _sessionCachingEnabled_ to _true_:
    
    <s :MobileApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
    					 xmlns:s="library://ns.adobe.com/flex/spark" 
    					 firstView="MyHome" 
    					 sessionCachingEnabled="true">
    </s>

In brief, that will enable the application to invoke serialization and deserialization of state data when exiting and entering new **View** instances, respectively; those methods mentioned previously when explaining **View**. Enabling session caching in your **MobileApplication** also allows for event handling of the following events when the application is initializing and deactivated:
    
    /* dispatched in MobileApplication +initialize() */
    FlexEvent.APPLICATION_RESTORING
    FlexEvent.APPLICATION_RESTORE
    /* dispatched in MobileApplication -applicationDeactivateHandler() */
    FlexEvent.APPLICATION_PERSISTING
    FlexEvent.APPLICATION_PERSIST

Those events are fired on startup and close of the application. Do with them what you will, but the real magic happens when creating and destroying **View** objects within the **ViewNavigator** of an application session.

### ViewNavigator

The **ViewNavigator** member of **MobileApplication** is actually a skin part and is instantiated in _MobileApplicationSkin.as_. It is an ActionScript file in the SDK (as opposed to MXML which most **Spark** skins are) i suppose in the hopes that if you do create a custom skin for **MobileApplication**, you extend **MobileApplicationSkin**. That’s a whole ‘nother topic… back to the role of **ViewNavigator**. The **ViewNavigator**, while providing some visual elements in relation to action bar content, serves as a manager for a collection of **View** objects. The top-most **View** is visible and active, while any other View objects are represented by a data object. Meaning, each time a **View** is added to the display list (via _pushView_()), an instance of it its class is instantiated. Each time a **View** is removed from the display list (via _popView_() or _pushView_()) its instance is destroyed, but its data model is stored in memory.

It should be noted that once the *first* new instance of a **View** class is instantiated, it is first notified to handle any persistent data (previously serialized) through **View**:_deserializePersistedData_(). If there is persistent data available, that data is handed along to the new **View** instance through the _data_ property. Any subesequent instantiations of the same **View** class within the same application session will not be requested to deserialize persistent data and will just be given its data model through the _data_ property. The reason being that the the **View** has already been re-activated previously with any persisted data and data currently relates to the session. Now any new state must be updated on the _data_ property for the rest of the application session and if required for restart of the application at a later date.

In order to save session state for a **View**, you must modify the _data_ property. This property will be requested when destroying the current instance of the **View** class. And the _data_ property value will be assigned back to a newly created instance of the same **View** class when navigating back to that view. Behind the scenes is the **ViewHistoryData** model object which, in essence, is keeping track of the **View** class and its factory instance as well as the data model and related persistent data. In fact, by extending **IExternalizable**, it is the **ViewHistoryData** class that handles reading and writing the persistent data to the disk.

## Summary

In short, persisting data between sessions of an AIR-enabled **MobileApplication** is possible. And the implementation is rather straight forward:

1. View is first created.  
2. View is asked to de-serialize persisted data.  
3. View is given de-serialized data through its _data_ property.  
4. View is later requested to be removed.  
5. The data property of the View is accessed and stored.  
6. View is asked to serialize any persistent data.  
7. View is later created.  
8. View is handed the stored data property value.

It is important to note how the progress from step 7 to 8 differs from 1 to 3. Even though the **View** is requested to serialize its data on each removal, it is not necessarily requested to de-serialize on each creation. It gets a little tricky, but the **View** is guaranteed to have _deserializePersistedData_() invoked on first creation. However, if you override the _data_ property getter in the **View** and return custom data, _deserializePersistedData_() will not be invoked in following creations. Subsequent creations are just handed the custom model through its _data_ property. If the **View** does not override the data property getter, then _deserializePersistedData_() is invoked each time on creation. In most cases, the **View**s i create do override the _data_ property in order to persist session data. This creation>de-serialization/destruction>serialization flow can be a little tricky to wrap the head around, and hopefully i have explained it well enough. Once I got it, I got it.

So application state can be maintained both throughout a session (from open to close) and through the life (from install to uninstall) of an application. Just be sure to properly manage the state data of a **View** class through its _serializeData_(), _deserializePersistantData_() method overrides and its _data_ attribute.

I had originally began this article to address how to get away from “code-behind” and use the [SupervisingPresenter](http://martinfowler.com/eaaDev/SupervisingPresenter.html) pattern to drive the logic of a view. This would get away from the notion of subclassing a view-controller for each **View**, and more importantly keep instantiation of the logic controller down by persisting a “presenter” instance within a session of the application. I think i am going to push that to another post, so if interested look for that soon.

I hope i explained this stuff coherently. I really enjoyed [Christophe](http://coenraets.org/)’s session and immediately wanted to poke around under the hood. 

On a side-note [RIAUnleashed](http://riaunleashed.com/) this year was excellent and was [Brian Rinaldi](http://www.remotesynthesis.com/)’s last at running the event. He put together an excellent conference and I don’t think I am alone in thanking him for bringing so much talent out this way.

Posted in [AIR](https://custardbelly.com/blog/category/air/), [Burrito](https://custardbelly.com/blog/category/burrito/), [Flash](https://custardbelly.com/blog/category/flash/), [Flex](https://custardbelly.com/blog/category/flex/), [Flex 4.5](https://custardbelly.com/blog/category/flex-4-5/).
