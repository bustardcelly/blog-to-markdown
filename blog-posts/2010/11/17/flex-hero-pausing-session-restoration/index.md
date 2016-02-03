---
title: 'Flex 4.5 (Hero) – Pausing Session Restoration'
url: 'https://custardbelly.com/blog/2010/11/17/flex-hero-pausing-session-restoration/'
author:
  name: 'todd anderson'
date: '2010-11-17'
---

While[ Flex 4.5 (Hero)](http://labs.adobe.com/technologies/flashbuilder_burrito/) provides an API for persisting session data within **View** objects, as discussed in my [previous post](https://custardbelly.com/blog/?p=228), **MobileApplication** dispatches events at the initialization and deactivation of the application that allow for you to perform any subsequent custom handling of persistent data – such as re-logging a user back into a service on relaunch of the application.

[**[NOTE]** _It should be noted that this post will be discussing some of the finer points of the persistant data API available, as of this writing, with the free trial download of [Flash Builder “Burrito”](http://labs.adobe.com/technologies/flashbuilder_burrito/) and the included Flex SDK Version 4.5.0 build 17689_]

When the _sessionCachingEnabled_ property of **MobileApplication** is declared as true, the following events are broadcast:
    
    /* dispatched in MobileApplication +initialize() */
    FlexEvent.APPLICATION_RESTORING
    FlexEvent.APPLICATION_RESTORE
    /* dispatched in MobileApplication -applicationDeactivateHandler() */
    FlexEvent.APPLICATION_PERSISTING
    FlexEvent.APPLICATION_PERSIST

In responding to these events, a client can serialize any other custom data to the disk that is relevant between sessions (launch, close, re-launch) of your application – be it as a **Shared Object**, which the **PersistenceManager** writes to, or a file using the **File** API.

When working with persisted data between **View** objects, what essentially is happening is the serialization of the **NavigationStack**. The **NavigationStack** is, in rough terms, a history manager. It holds a list of **ViewHistoryData** objects that pertain to the progression of **View** requests; popping and pushing the **ViewHistoryData** objects from the stack as the user progresses through the application.

When responding to the session-persistent events, you most likely will not be modifying that stack that is being serialized between **View** objects already for you (using the _data_ property and_ serializeData_() and _deserializePersistedData_() methods discuss in my [previous post](https://custardbelly.com/blog/?p=228)). Though you could, you could hijack that **Shared Object** from the **PersistenceManager** and overwrite the work it had previously done, but most likely the serialized **NavigationStack** will be left untouched or at the very least only inspected.

What had originally got me looking into working with these session-persistent events was to have the ability to re-log in a user who had previously been logged into a service in a prior session. It is a common practice and user experience and one the user rarely thinks about. Think about every time you open a [Twitter](http://twitter.com/#!/bustardcelly) client on your device. The session is most-likely not kept alive while you have it closed and are playing [Falling Balls](http://itunes.apple.com/us/app/falling-balls/id301545989?mt=8). But when you re-launch it, you don’t (typically) have to log back in. You can begin sending tweets again. Right away.

This can be achieved in a Flex Hero **MobileApplication**, but you will have to suspend the “restoring” of the application upon initialization in order to read in any custom persisted data and log a user into a service. I’ll touch on that later, but for now let’s look at how you would first serialize custom data when the application is being deactivated:
    
    protected var _currentUser:CustomUser;
    protected var storedUserFilename:String = "currentUser.obj";
    ...
    // Event handler for FlexEvent.APPLICATION_PERSIST of MobileApplication.
    protected function handleApplicationPersist( evt:Event ):void
    {
    	var user:CustomUser = _currentUser;
    	var file:File = File.applicationStorageDirectory.resolvePath( storedUserFilename );
    	var stream:FileStream = new FileStream();
    	stream.open( file, FileMode.WRITE );
    	stream.writeObject( user );
    	stream.close();
    }

Pretty familiar if you have worked with the **File** API. Nothing actually new in regards to 4.5, just writing the serializable **CustomUser** object to the application storage directory. It’s another topic on how to maintain the reference to __currentUser_, so for the purposes of this example we’ll just say that object is available and managed here. If you are familiar with the **File** API, you probably are aware that **CustomUser** needs to be registered with a class alias in order to be properly written to and read back in from the file system as that ActionScript object. That can be achieved by wither declaring a **[RemoteClass]** meta-tag or the _registerClassAlias_() method. _[*Fun fact*: MobileApplication registers the ViewNavigator and NavigationStack classes upon initialization in the __registerPersistenceClassAliases_() method]. Here’s a quick exmaple of using the **[RemoteClass]** meta:
    
    package com.custardbelly.examples.model
    {
    	[RemoteClass(alias="com.custardbelly.examples.model.CustomUser")]
    	public class CustomUser
    	{
    		public var username:String;
    		public var password:String;
     
    		public function CustomUser() {}
    	}
    }

One thing to remember when serializing ActionScript objects, don’t have any non-defaulted constructor parameters. You will get an error when the object is being de-serialized.

Back to the task at hand – logging a user back into the service on relaunch of the application (start of a new session). In order to do that, the “restoring” process of the application needs to be suspended so as to inspect the serialized “history stack” and determine if the user is being brought back to the “login” view or not. If not, the application should log the user back in and resume to the **View** persisted at the top of the stack from a previous session:
    
    // [Sublass of MobileApplication]
     
    // Event handler for FlexEvent.APPLICATION_RESTORING on MobileApplication
    protected function handleApplicationRestoring( evt:Event ):void
    {
    	// Stop any subsequent work so we can determine if we need to log a user back in. 
    	evt.preventDefault();
     
    	// Access the serialized navigator state, maintained between view navigation.
    	var savedState:Object = persistenceManager.getProperty("navigatorState");
    	// Check if the topview from the stack is the view we deliver as the login view.
    	if( topViewIsNotLogIn( savedState ) )
    	{
    		try
    		{
    			// Access a file we serialized to the disk that represents the previously logged-in user.
    			var file:File = File.applicationStorageDirectory.resolvePath( storedUserFilename );
    			var stream:FileStream = new FileStream();
    			stream.open( file, FileMode.READ );
    			var user:CustomUser = stream.readObject() as CustomUser;
    			if( user != null )
    			{
    				// Log user back into service.
    				// Upon complete, make sure to call:
    				// restoreApplicationState();
    			}
    		}
    		catch( e:Error )
    		{
    			// Most likely file does not exist.
    			restoreApplicationState();
    		}
    	}
    	else
    	{
    		// Else continue on our way.
    		restoreApplicationState();
    	}
    }
     
    // Determines if the topView in our perstisted stack is not what we consider to be the log in view.
    protected function topViewIsNotLogIn( savedState:Object ):Boolean
    {
    	if( savedState == null ) return false;
     
    	// The index within our view stack that we consider as the log in view.
    	const loginViewIndex:int = 0;
    	// The serialized stack.
    	var stack:NavigationStack = savedState.navigationStack as NavigationStack;
    	if( stack != null )
    	{
    		use namespace mx_internal;
    		// If we have a stack to inspect.
    		if( stack.source && stack.source.length > 0 )
    		{
    			var topView:ViewHistoryData = stack.topView;
    			var loginView:ViewHistoryData = stack.source[loginViewIndex] as ViewHistoryData;
    			return ( topView != loginView );
    		}
    	}
    	return false;
    }

One point to grasp is that the event object dispatched for **FlexEvent.APPLICATION_RESTORING** needs to be halted so we can do some work before the **MobileApplication** proceeds with business as usual. That is done by calling **event**._preventDefault_(). That actually flips a flag in the -_initialize_() method of **MobileApplication**, telling it to not proceed with restoring.

The other point, is that, once halted, **MobileApplication**:_restoreApplicationState_() must be called at a later time in order to proceed with initialization. In this example, if it is determined that the user is being brought to the “log in” **View** on re-launch, then the stored user is not logged back in and _restoreApplicationState_() is invoked to proceed. If it is determined that the user will be taken to another **View**, then log in to the service must be done and, upon success, then invoke _restoreApplicationState_().

[**Tip**: _If you start working with persistent data and you just want to clear it from time to time while developing in order to know that you are working with it properly, call persistenceManager.clear() in your FlexEvent.APPLICATION_RESTORING handler and all your wishes will come true._]

Since Flex 4.5 is beta, you can’t have an example without seeing use namespace **mx_internal** ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) Half-kidding, but for those unfamiliar with that namespace, some methods and properties in the SDK are declared with the **mx_internal** _access specifier_ to denote that they are in limbo of being given the proper access. So in a later version of the SDK, they may be changed to _public_, _private_, _protected_ or any other custom specifier. For this example, in order to access the _source_ property of **NavigationStack** we needed to resolve to **mx_internal**. Hopefully it will be opened up at a later date, or at least a public accessor for that list.

So there you have it. The best practice on notifying the user that you are logging them back into a service upon relaunch? I haven’t found the best solution that meets my needs yet, but I do not recommend pushing a **View** to the stack of the **ViewNavigator** during that restore suspension. It caused some weird UI glitches. Probably the best bet is to use the **PopUpManager** – but do not use the **ProgressBar** in that… bad things happen. Hopefully a new **ProgressBar** is on the horizon for Flex 4.5.

Posted in [AIR](https://custardbelly.com/blog/category/air/), [Burrito](https://custardbelly.com/blog/category/burrito/), [Flex](https://custardbelly.com/blog/category/flex/), [Flex 4.5](https://custardbelly.com/blog/category/flex-4-5/).
