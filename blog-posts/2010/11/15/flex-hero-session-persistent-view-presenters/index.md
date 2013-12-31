---
title: 'Flex 4.5 (Hero) – Session-Persistent View Presenters'
url: 'http://custardbelly.com/blog/2010/11/15/flex-hero-session-persistent-view-presenters/'
author:
  name: 'todd anderson'
date: '2010-11-15'
---

As I had hinted at in my [previous post](http://custardbelly.com/blog/?p=220), before i went down the rabbit-hole of state data with regards to the life-cycle of a **View** object, I had intended to write about persisting [Supervising Presenters](http://martinfowler.com/eaaDev/SupervisingPresenter.html) for **View**s within an application session. Before I go much farther, i do want to note that [Paul Williams](http://blogs.adobe.com/paulw/) has some excellent posts up on different presenter patterns within the context of a Flex application which can be found at [http://blogs.adobe.com/paulw/](http://blogs.adobe.com/paulw/). Specifically, I am taken by the [Supervising Presenter](http://blogs.adobe.com/paulw/archives/2007/10/presentation_pa_2.html), though i am not totally sold… which I hope to address in this post, but my main intent here is to show how I re-use a presenter for a View object to cut down on memory within an application session.

I may touch upon the life-cycle of a **View** and how state data is maintained in this post, but not to the extent in my [previous article](http://custardbelly.com/blog/?p=220). I want to talk more about moving away from “_code behind_” in Flex-based mobile applications and implementing session-persistent presenters for **View**s.

If you want to skip the yammering, you can view the source of an example here: [Mobile (Hero) Supervising Presenter Example](http://www.custardbelly.com/downloads/hero/supervisor/)

### New View instance on each request

Due to the instantiation of a new **View** instance upon each request from the **ViewNavigator** within a **MobileApplication** as discussed in my [previous post](http://custardbelly.com/blog/?p=220), I started really considering my choice to always use what is loosely called [“_code behind_” in Flex](http://ted.onflash.org/2007/02/code-behind-in-flex-2.php). I’ve always had somewhat of a problem with the implementation but just kept at it because it worked – separated logic into AS file from view mark-up in MXML – and (not always a fast and hard rule) don’t utilize another micro-architecture framework in projects. I’m not going to get into an argument about frameworks, but let’s leave it that i don’t always agree on their necessity when weighed against project requirements, deadlines and multi-developer teams.

So “_code behind_” always was a minor sore point, but it got the job done and got it done in an organized fashion. But I am really taking it into consideration when optimizing applications for the mobile paradigm, mainly inheritance chain. To extend **View** for logic and then extend that view-controller for display again just seems like the wrong choice, especially when **View** is an nth extension of **UIComponent** already and taking in the inheritance memory point described here: [http://help.adobe.com/en_US/flash/cs/using/WSD7F8E1A9-680A-4000-9BA9-D7B01FDD7ECD.html](http://help.adobe.com/en_US/flash/cs/using/WSD7F8E1A9-680A-4000-9BA9-D7B01FDD7ECD.html)

I started shopping around for **Presenter** patterns that i felt were the least intrusive (as i mentioned before Paul Williams has some great posts up [here](http://blogs.adobe.com/paulw/)) and settled on the **Supervising Presenter** at the moment.

Yet, seeing as a **View** is instantiated upon each request from **ViewNavigator**, I wanted to keep the overhead low and ensure that only one **Presenter** was created and associated with a view. In other words, upon the first instantiation of a **View** object, a **Presenter** is created and associated with the view. Upon destruction of the view, the **Presenter** reference is notified to stop supervising and is stored in the state data for that **View** object. When another instance of the **View** is instantiated, that data is read in and the **Presenter** is notified to start supervising again. So now we not only have the logic (depends on *how* much logic you determine necessary) separated from the view, but are re-using the same **Presenter** without having to create a new instance each time a user navigates to that View.

Here are some examples:

### ISupervisingPresenter
    
    import flash.events.IEventDispatcher;
    import spark.components.View;
     
    public interface ISupervisingPresenter extends IEventDispatcher
    {
    	function supervise( view:View ):void;
    	function unsupervise():void;
    	function dispose():void;
    }

**ISupervisingPresenter** supervises a single **View** and can be instructed to unsupervise as well as tear down any loose reference to offer itself up for garbage collection.

### ISupervisingPresenter Implementation
    
    import com.custardbelly.example.event.LogInEvent;
    import com.custardbelly.example.views.HomeView;
     
    import flash.events.Event;
    import flash.events.EventDispatcher;
    import flash.events.MouseEvent;
     
    import spark.components.View;
     
    [Event(name="success", type="com.custardbelly.example.event.LogInEvent")]
     
    [RemoteClass(alias="com.custardbelly.example.presenter.HomePresenter")]
    public class HomePresenter extends EventDispatcher implements ISupervisingPresenter
    {
    	protected var _view:HomeView;
     
    	public function HomePresenter() {}
     
    	protected function addHandlers():void
    	{
    		_view.logInButton.addEventListener( MouseEvent.CLICK, handleLogIn, false, 0, true );
    	}
     
    	protected function removeHandlers():void
    	{
    		_view.logInButton.removeEventListener( MouseEvent.CLICK, handleLogIn, false );
    	}
     
    	protected function handleLogIn( evt:Event ):void
    	{
    		dispatchEvent( new LogInEvent() );
    	}
     
    	public function supervise( view:View ):void
    	{
    		_view = ( view as HomeView );
    		addHandlers();
    	}
     
    	public function unsupervise():void
    	{
    		removeHandlers();
    		_view = null;
    	}
     
    	public function dispose():void
    	{
    		if( _view ) unsupervise();
    		// remove any other references to ensure GC of this instance...
    	}
    }

When supervising a view, the **ISupervisingPresenter** implementation essentially assigns event handlers to child controls of that target **View**. Its up to you how much logic the ISupervisingPresenter holds. For instance i could forgo dispatching an event and just access the ViewNavigator from the target view and tell it to go to another screen.

### Supervised View
    
    < ?xml version="1.0" encoding="utf-8"?>
    <s :View xmlns:fx="http://ns.adobe.com/mxml/2009" 
    		xmlns:s="library://ns.adobe.com/flex/spark" 
    		title="home" 
    		creationComplete="handleCreationComplete();">
     
    	<fx :Script>
    		< ![CDATA[
    			import com.custardbelly.example.event.LogInEvent;
    			import com.custardbelly.example.presenter.HomePresenter;
    			import com.custardbelly.example.presenter.ISupervisingPresenter;
     
    			import mx.events.FlexEvent;
     
    			protected var _data:Object;
    			protected var _presenter:ISupervisingPresenter;
     
    			// Listen for deactivate in order to assemble session data accessed from View:data()
    			protected function handleCreationComplete():void
    			{
    				addEventListener( FlexEvent.VIEW_DEACTIVATE, handleDeactivate, false, 0, true );
    			}
     
    			// Is called before navigator.destroy of this instance. Serialize the data property and clear out refs for GC.
    			protected function handleDeactivate( evt:FlexEvent ):void
    			{
    				removeEventListener( FlexEvent.VIEW_DEACTIVATE, handleDeactivate, false );
    				serializeSessionData();
    				disassemblePresenter();
    			}
     
    			// Create the supervising presenter.
    			protected function  establishPresenter( value:Object ):void
    			{
    				if( value && value.hasOwnProperty( "presenter" ) )
    				{
    					_presenter = ( value["presenter"] as ISupervisingPresenter );
    				}
    				else
    				{
    					_presenter = new HomePresenter();
    					if( value ) value["presenter"] = _presenter;
    				}
     
    				_presenter.supervise( this );
    				addPresenterHandlers( _presenter );
    			}
     
    			// Clear refs for GC of this instance.
    			protected function disassemblePresenter():void
    			{
    				removePresenterHandlers( _presenter );
    				_presenter.unsupervise();
    				_presenter = null;
    			}
     
    			protected function addPresenterHandlers( presenter:ISupervisingPresenter ):void
    			{
    				presenter.addEventListener( LogInEvent.SUCCESS, handleLogInSuccess, false, 0, true );
    			}
    			protected function removePresenterHandlers( presenter:ISupervisingPresenter ):void
    			{
    				presenter.removeEventListener( LogInEvent.SUCCESS, handleLogInSuccess, false );
    			}
     
    			// Modify session state data to hold reference to the supervising presenter for re-use.
    			protected function serializeSessionData():void
    			{
    				if( _data == null ) _data = {};
    				_data["presenter"] = _presenter;
    			}
     
    			// Navigate to nother view.
    			protected function handleLogInSuccess( evt:LogInEvent ):void
    			{
    				navigator.pushView( WelcomeView );
    			}
     
    			// Need to override in order to persist state data through session.
    			override public function get data():Object
    			{
    				return _data;
    			}
    			// Override to read in session state data.
    			override public function set data( value:Object ):void
    			{
    				_data = value;
    				establishPresenter( _data );
    			}
     
    		]]>
    	</fx>
     
    	<s :navigationContent />
     
    	</s><s :layout>
    		<s :VerticalLayout paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10" />
    	</s>
     
    	<s :TextInput id="usernameField" width="100%" />
    	<s :TextInput id="passwordField" width="100%" displayAsPassword="true" />
    	<s :Button id="logInButton" label="log in" />

In essence, upon first creation of this **View** instance, the **Supervising Presenter** is created and assigned through a call to the _data_ property setter (invoked by the **ViewNavigator** upon creation of the view). When the view is deactivated (by the **ViewNavigator** before destruction) the view-local __data_ property is updated to hold a reference to the associated supervising presenter for this view. Upon creation of a new instance, it is read in though the _data_ setter and instructed to begin supervising again.

The **Supervising Presenter** reference is persisted through the current session of the application and re-used upon each new instance of the **View**. Though i do hate using **Script** in MXML, this code does address my concerns in re-use, inheritance and separation of logic while utilizing the session-persistent hook-ins now present in the **View** API in Flex Hero.

[Mobile (Hero) Supervising Presenter Example](http://www.custardbelly.com/downloads/hero/supervisor/)

Now… i gotta think about getting that **Script** outta my MXML ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

Posted in [AIR](http://custardbelly.com/blog/category/air/), [Flex](http://custardbelly.com/blog/category/flex/), [Flex 4.5](http://custardbelly.com/blog/category/flex-4-5/).
