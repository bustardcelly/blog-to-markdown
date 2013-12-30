# [Customizing the Apollo NativeWindow](http://custardbelly.com/blog/2007/04/06/customizing-the-apollo-nativewindow/)

[Daniel Dura](http://www.danieldura.com/) wrote up a [great post](http://www.danieldura.com/archive/apollo-multi-window-support-using-flex) on adding Flex components to NativeWindows. If you are looking to add Flex components to your NativeWindow instance, you will need to follow what Daniel described. As Daniel has mentioned, this is an issue concerning the [alpha version of Apollo](http://www.adobe.com/go/apollo) and may be cleared up in the next release, but if you can’t wait and are looking to add custom ActionScript components that extend Flex components, there is another option. 

I don’t pretend to know enough about the architecture (so someone speak up if i am off track), but adding components to NativeWindows – without Daniel’s or the proceeding example- fails due to the reference to your main ApolloApplication’s stage when displaying components within the Flex framework. You can add all the displays existent in the AS3 library (Sprite, TextField, etc.) to the stage of your NativeWindow instance, but any in the Flex framework need a little push. Adding MXML components to your NativeWindows will still have to follow the formula Daniel laid out using the addChild/removeChild methods, yet there is a workaround to this for ActionScript components by adding an ADDED_TO_STAGE event listener within its constructor.

I have a tendency to try and word things right and it comes out all mush, so i’ll just show some code. _You can alternatively look at[ source view](http://custardbelly.com/downloads/apollo/NativeWindowExample)_. 

The CustomLabel (CustomLabel.as) component that will be added to our NativeWindow:
    
            import flash.events.Event;
    	import flash.text.TextField;
    &nbsp_place_holder;
    	import mx.containers.Canvas;
    &nbsp_place_holder;
    	public class CustomLabel extends Canvas
    	{
    		private var _label:TextField;
    &nbsp_place_holder;
    		public function CustomLabel()
    		{
    			super();
    			addEventListener( Event.ADDED_TO_STAGE, init );
    		}
    &nbsp_place_holder;
    		private function init( evt:Event ):void
    		{
    			createChildren();
    		}
    &nbsp_place_holder;
    		override protected function createChildren():void
    		{
    			super.createChildren();
    &nbsp_place_holder;
    			_label = createField( "HelloWorld" );
    			stage.addChild( _label );
    		}
    &nbsp_place_holder;
    		override protected function updateDisplayList( unscaledWidth:Number, unscaledHeight:Number ):void
    		{
    			super.updateDisplayList( unscaledWidth, unscaledHeight );
    		}
    &nbsp_place_holder;
    		private function createField( txt:String = "" ):TextField
    		{
    			var label:TextField = new TextField();
    			label.text = txt;
    			return label;	
    		}
    	}

… And the main mxml (NativeWindowExample.mxml):
    
    <mx :ApolloApplication 
    	xmlns:mx="http://www.adobe.com/2006/mxml"
    	width="200"
    	height="100" 
    	layout="absolute"
    	applicationComplete="onAppInit();">
    &nbsp_place_holder;
    	</mx><mx :Script>
    		< ![CDATA[
    &nbsp_place_holder;
    			private var _launchWindow:NativeWindow;
    			private var _customWindow:NativeWindow;
    &nbsp_place_holder;
    			private function onAppInit():void
    			{
    				_launchWindow = this.stage.window;
    				_launchWindow.addEventListener( Event.CLOSE, onAppClose );
    			}
    &nbsp_place_holder;
    			private function openCustomWindow( evt:MouseEvent ):void
    			{
    				if( _customWindow != null ) return;
    &nbsp_place_holder;
    				var options:NativeWindowInitOptions = new NativeWindowInitOptions();
    				_customWindow = new NativeWindow( true, options );
    				_customWindow.stage.align = StageAlign.TOP_LEFT;
    				_customWindow.stage.scaleMode = StageScaleMode.NO_SCALE;
    				_customWindow.title = "CustomWindow";
    				_customWindow.stage.addChild( new CustomLabel() );
    				_customWindow.addEventListener( Event.CLOSE, onWindowClose );
    			}
    &nbsp_place_holder;
    			private function onWindowClose( evt:Event ):void
    			{
    				_customWindow = null;
    			}
    &nbsp_place_holder;
    			private function onAppClose( evt:Event ):void
    			{
    				if( _customWindow != null ) _customWindow.close();
    			}
    &nbsp_place_holder;
    		]]>
    	</mx>
    &nbsp_place_holder;
    	<mx :Button id="windowBtn" 
    		top="10" left="10" right="10" bottom="10"
    		label="open custom window"
    		click="openCustomWindow( event );">
    	</mx>

**NOTE:** _the preceding code has some major problems due to mx tags in wordpress, so disregard all affending close tags ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) _

— As well, you could extend NativeWindow and add the AS components to its stage to bypass adding them in the main app. –

In the main app file we are just creating a new NativeWindow instance and adding the custom AS component, CustomLabel, to it’s display.
    
    _customWindow.stage.addChild( new CustomLabel() );

What is happening in the constructor of the CustomLabel is of importance in this example, as it listens for its event of being added to a clients stage. From there we can call the override of UIComponent:createChildren, and add whatever we want to the display. When creating AS components NOT to be added to the NativeWindow, that method (createChildren) would be called as long as you call the super constructor. That is not the case when adding components extending the Flex framework in NativeWindow. Again, if i am missing something crucial or if you have more insight, please leave a comment. So that’s it. Once it has been added to the stage, we can go about our business. Of course, when using ActionScript components you lose the inherent layout capabilities within MXML components, but that is why we’ve added the override of #updateDisplayList.  
Until Flex came around, i know i spent more than my fair share nailing down layouts for applications- so this is like going back home… ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

To find out more about extending ActionScript components, visit[ this post](http://blog.flashgen.com/2006/11/08/base-component-methods-actionscript-20-to-30/) on FlashGen and [this doc](http://download.macromedia.com/pub/documentation/en/flex/2/flex2_createextendcomponents.pdf) from [the labs](http://labs.adobe.com/).

PS. I’ve been a little lacking in the post area, and though i have the usual excuses- family, work, beer… – i could be more on top of it and you should be seeing more Flex and Apollo thoughts in the near future, but no promises because i love those excuses. I also am working on something that i hope to announce here a little later if all goes well…

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Apollo](http://custardbelly.com/blog/category/apollo/), [Flex](http://custardbelly.com/blog/category/flex/).
