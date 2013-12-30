# [Flex 4: Suspending the first frame](http://custardbelly.com/blog/2010/10/22/flex-4-suspending-the-first-frame/)

Have you ever wanted to add some extra loading process to the first frame so you can utilize the same **download progress bar** for other things beside **RSL** loading and initialization? Take for instance the desire to append the loading of a [Spring ActionScript](http://www.springactionscript.org/) application context to the end of the initial loading process. Well, you can. Or rather, until someone tells me i am a fool, you can.

You can quickly check out the source files for how to do this up on **github** at [http://github.com/bustardcelly/custom-system-manager](http://github.com/bustardcelly/custom-system-manager) and/or you can keep reading to find out more…

The main reason i started looking in to suspending the first frame in **SystemManager** in order to perform some other essential loading tasks is generally my dislike for seeing the download progress bar AND THEN seeing another loading bar once the application is initialized and on the display. Say for instance, your application needed to load some extra configurations or assets or what have you. It always bothered me that, as a user, i see the initial download progress bar of the Flex Application and, when complete, i see another one. The second one is usually designed differently, which is incongruent with my experience BUT if both loaders were designed the same, i am presented _TWO_. I see one, it goes away. I see another. Not a good user experience.

I wanted to hook into that first frame in **SystemManager** and keep loading what was essential for my application to run. From start up.

**Why do you keep talking about frames?**

If you are unfamiliar about the [**SystemManager**](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/managers/SystemManager.html) and the loading and initialization of a **Flex Application**, there is some really [great stuff](http://flexblog.faratasystems.com/2006/08/02/systemmanager-and-application-initialization) out there that describes it. Particularly [this post](http://iamdeepa.com/blog/?p=11) from [Deepa Subramaniam](http://iamdeepa.com/blog). But basically, a **Flex Application** is a two-frame SWF. The first frame is ruled by the **SystemManager** which goes about, among other things, tracking the load progress of the framework **RSL**s and the application code and presenting that (_at least the application code loading by default_) visually in a **SparkDownloadProgressBar** (if using **Spark Application** from Flex 4).

The API allows for customizing the **download progress bar**, and if you are unfamiliar with how that can be done, there are also great articles out there about that. In particular, i will point you to [Jesse Warden’s post](http://jessewarden.com/2007/07/making-a-cooler-preloader-in-flex-part-1-of-3.html), this one by [Renaun Erickson](http://renaun.com/blog/2010/08/using-flex-hero-rsl-enhancements/), and this one by [James Polanco](http://www.developmentarc.com/site/2010/09/rsl-calculations-new-flex-4-preloader). All great stuff and informative reading. And _please, please, please_ make sure you update your custom progress bar to display progress on loading the **RSL**s.

The problem is that i don’t care about customizing the preloader (well actually, I DO, and you should too. Or i will come over there personally and give you the sad-face). The problem is that there are no hooks available to pause the preloader to perform other tasks. Meaning all the protected methods opened up in the **DownloadProgressBar** of the Flex 4 SDK have no way of suspending the first frame by preventing the default action. You can call **event.preventDefault()** and **event.stopPropegation()** all you want in the protected event handlers available, but they won’t keep the **SystemManager** from moving forward when it has finished loading the application code. (At least, i haven’t been able to).

But fear not, there is a way to suspend that frame. The code to do it is up on github at [http://github.com/bustardcelly/custom-system-manager](http://github.com/bustardcelly/custom-system-manager). 

**The basics?**

I created a subclass of **SystemManager** and overrode the **mx_internal** event handler _preloader_completeHandler()_. This method is generally called after all the **RSL**s and framework code is loaded in to the SWF. Within **SystemManager**, this would move on towards initializing all the other goodies available from **SystemManager** (including all the **[Mixin] init()** calls if you defined them in you application) by invoking _kickOff()_. By extending **SystemManager** and overriding _preloader_completeHandler()_ we can suspend that call to _kickOff()_ and notify our custom downloader that the frame is now suspended and we can do some custom loading:
    
    [Event(name="frameSuspended", type="com.custardbelly.application.event.CustomSystemManagerEvent")]
    public class CustomSystemManager extends SystemManager implements ICustomSystemManager
    {
    	protected var _resumable:Boolean;		
    	/**
    	 * Constructor.
    	 */
    	public function CustomSystemManager() { super(); }
    &nbsp_place_holder;
    	/**
    	 * @inherit
    	 */
    	override mx_internal function docFrameHandler( event:Event = null ):void
    	{	
    		// Override to protected flag to recognize to continue kickoff.
    		if( _resumable )
    			kickOff();
    	}
    &nbsp_place_holder;
    	/**
    	 * @inherit
    	 */
    	override mx_internal function preloader_completeHandler( event:Event ):void
    	{
    		// Override to stop super operation and dispatch a frame suspension event for any handling clients.
    		preloader.removeEventListener( Event.COMPLETE, preloader_completeHandler );
    		preloader.dispatchEvent( new CustomSystemManagerEvent( this ) );
    	}		
    &nbsp_place_holder;
    	/**
    	 * @inherit
    	 */
    	public function resumeNextFrame():void
    	{
    		if( currentFrame >= 2 )
    		{
    			_resumable = true;
    			kickOff();
    		}
    	}
    }

Now, it should be noted that it’s not always the best idea to override **mx_internal** methods from the SDK. From my understanding, properties and methods marked as **mx_internal** basically mean they are in limbo of either being removed or declared with their proper access specifier at a later version in the SDK. So be wary. This all works now, but it may no longer work when building against future version of the **Flex SDK**… _unless they open these methods up as protected!_

In any event, this stops the SWF from progress on to displaying the load of the application code and allows any client (most often your custom **DownloadProgressBar**) listening for the event of suspension to do whatever it needs to:
    
    public class CustomPreloader extends SparkDownloadProgressBar
    {
    	protected var _customSystemManager:ICustomSystemManager;
    &nbsp_place_holder;
    	/**
    	 * Constructor.
    	 */
    	public function CustomPreloader() { super(); }
    &nbsp_place_holder;
    	/**
    	 * @inherit
    	 */
    	override public function set preloader( value:Sprite ):void
    	{
    		super.preloader = value;
    		// Add listener for frame suspension from preloader. 
                    // The ICustomSystemManager will dispatch this event through the preloader for stalling the 1st frame.
    		value.addEventListener( CustomSystemManagerEvent.FRAME_SUSPENDED, handleFrameSuspension );
    	}
    &nbsp_place_holder;
    	/**
    	 * @private 
    	 * 
    	 * Abstract method to be override by subclass in order to perform any operations during the suspension of the 1st frame.
    	 * In order to resume movement to the 2nd frame, the subclass must call resumeInitialization().
    	 */
    	protected function onFrameSuspension():void
    	{
    		// abstract method.
    		// Override to perform any other initialization tasks on the first frame.
    	}
    &nbsp_place_holder;
    	/**
    	 * @private 
    	 * 
    	 * Invokes the ICustomSystemManager to resume its loading and movement to the 2nd frame.
    	 */
    	protected function resumeInitialization():void
    	{
    		_customSystemManager.resumeNextFrame();
    	}
    &nbsp_place_holder;
    	/**
    	 * @private
    	 * 
    	 * Event handler for frame suspension from the ICustomSystemManager. 
    	 * @param evt CustomSystemManagerEvent
    	 */
    	protected function handleFrameSuspension( evt:CustomSystemManagerEvent ):void
    	{
    		( evt.target as IEventDispatcher ).removeEventListener( CustomSystemManagerEvent.FRAME_SUSPENDED, handleFrameSuspension );
    		_customSystemManager = evt.manager;
    		onFrameSuspension();
    	}
    }

Now, all this is only possible if we specify the **CustomSystemManager** as the stand-in for the default **SystemManager**… But this is all before the loading of the application code, so we can just define a new **SystemManager** in our application. Well, not directly in a method anyway.

**The [Frame] Metdata**

In general terms the **[Frame]** metdata defines the factory instance used in initialization of your SWF file. By default, this points to the **SystemManager** of the SDK and you can see that declaration if you opened up the **Spark Application** class in any IDE. I won’t go more into detail about **[Frame]** as there are many great articles out there, and in particular, these posts by [Roger Gonzalez](http://blogs.adobe.com/rgonzalez/2006/06/modular_applications_part_2.html) and the always lovable [Keith Peters](http://www.bit-101.com/blog/?p=946). I will however talk about how you need to declare **[Frame]** in your Flex application.

**YOU CAN’T DO IT IN THE MXML.**

Meaning that you can’t define **[Frame]** in the _<Metadata/>_ declaration. You can only define the **[Frame]** in ActionScript else it won’t work. YET, you can only define your preloader in the MXML, else that won’t work. Confusing yet? Any way, that’s the case. Make sure you main application class is in ActionScript and declare the metadata in that file:
    
    [Frame(factoryClass="com.custardbelly.application.CustomSystemManager")]

… and then extend that main AS file in your main MXML view and define the preloader instance:
    
    &lt;Main xmlns="*"
    	xmlns:fx="http://ns.adobe.com/mxml/2009" 
    	xmlns:s="library://ns.adobe.com/flex/spark" 
    	xmlns:mx="library://ns.adobe.com/flex/mx"
    	preloader="com.custardbelly.manager.example.CustomContextPreloader"&gt;

There you go, you are all set. **CustomSystemManager** is now your stand-in for the initialization process and suspends the first frame, notifying the _concrete_ **CustomPreloader** to perform some extra tasks, which in turn tells the **CustomSystemManager** that is okay to continue onto the next frame once it has finished its task(s).

I would have posted an example SWF here, but it would have been a moot point as it would have loaded already by the time you arrived all the way down here ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) So one is available here: [http://www.custardbelly.com/examples/csm/index.html](http://www.custardbelly.com/examples/csm/index.html) with source view here: [http://www.custardbelly.com/examples/csm/srcview/](http://www.custardbelly.com/examples/csm/srcview/).

It’s not terribly exciting, but in that example i am basically loading a [Spring ActionScript](http://www.springactionscript.org/) application context file. I wanted to hook into the initial load progress as the** IoC container** was an essential part of my application. And, as i said before, i hate seeing the initial progress bar and then another progress bar after application create. I just want one.

Once the application code is loaded and the **Flex Application** receives a _CREATION_COMPLETE_ event, a custom style manager defined in the application context is accessed from the **IoC container** and a [Runtime CSS SWF](http://github.com/bustardcelly/flex-runtime-css) is loaded, after which the font-size is updated on the **Label** field. Incredible, no? Not really, but you can see where this example can go, hopefully.

One thing to note, if you will use this to load a [Spring ActionScript](http://www.springactionscript.org/) application context file as i have done, you MUST use the **XMLApplicationContext** class and NOT the **FlexXMLApplicationContext** class from [Spring ActionScript](http://www.springactionscript.org/). The reason is that **FlexXMLApplicationContext** accesses a reference to Application upon initialization. Since we haven’t finished loading the Application code in the **CustomSystemManager**, this access will throw a null pointer exception.

Also, if i am totally off-base on all this, please leave a comment and let me know.

The files for all this, including the example, can be found on github: [http://github.com/bustardcelly/custom-system-manager](http://github.com/bustardcelly/custom-system-manager)

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/), [Flex 4](http://custardbelly.com/blog/category/flex-4/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – October 22, 2010
  *[October 22, 2010]: 2010-10-22T09:31
