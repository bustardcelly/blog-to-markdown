---
title: 'Viewstack in Flex 4?'
url: 'http://custardbelly.com/blog/2009/09/02/viewstack-in-flex-4/'
author:
  name: 'todd anderson'
date: '2009-09-02'
---

**[UPDATE: April 26th, 2010]**  
This post was originally written after playing around with a nightly build of the Flex SDK many months before it was officially released. Since that release, there has been more traffic to this post from people looking for a Spark Viewstack solution (assuming), however the SDK had changed since the initial example within this post. As such, i have only updated the source and inline code within the post. I am keeping the original wording of the post for prosperity sake.

As well, [Tink](http://www.tink.ws/blog/) has done some [amazing work on bring Spark equivalents (and additions) to containers](http://www.tink.ws/blog/spark-datanavigators/). If you have not done so, please check out some of his work.  
**[/UPDATE]**

I’ll start off by saying that i love what is happening with the Spark architecture in the Flex SDK. When the time comes that we at IR5 are given the green-light to use it in production for clients, i will be giddy. That said, I am aware that a lot of people have gripes about the lack of complete parity between the Halo and Spark sets, and particularly the lack of Spark equivalents for the Halo navigation containers such as Accordion and ViewStack. 

Truth be told, they probably have good reason to not hop on board, and without raising your voice you can’t raise concerns to the owners of the Platform to make informed decisions based on feedback. However, I feel the Platform developed because people started doing things it was never intended to do and (while at times complaining) developers just rolled up their sleeves and bent the code to their will. Now this is going into a whole ‘nother discussion that was the intent of the post, so we’ll just leave the discussion at that and ask, ‘Why not make what is not there?’ The answer is a whole ‘nother discussion and I am fully aware that the SDK is not *perfect* for this, but it is available to make something work somehow… that’s how we all got here.

Enough jibber-jabber… I set apart a couple hours to make a ViewStack for Flex 4 just to see how easy it would be with the Spark architecture. Honestly, I never really use the Halo navigation containers much – maybe some quick prototypes here and there, but have always found that in a medium to large application they provide no benefits that go along with their overhead. But still, I thought i would choose one (and yes i know it is probably the easiest one ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) ) just to see what all the fuss was about.

<del>  
My first step was getting excited about the mxmlContent and mxmlContentFactory properties available on Spark containers. ‘think of the possiblities,’ my mind said, ‘this probably contains all the declared children within the markup!’ Oh with that i can stop instantiation of them and deferred until requested. Case closed. Viewstack done. Until i realized that most everything that handles these values is private. bugger.</del>

**[Update 2009-09-03]**  
Event though i did start down the path of mxmlContent and mxmlContentFactory and came up empty, thanks to the brain on [Ash Atkins](http://www.razorberry.com/blog/) for pointing out that i coudl use the [DefaultProperty] metatag to still allow inline declaration of child elements for the ViewStack. The inline code has been updated. Thanks, [Ash](http://www.razorberry.com/blog/)!  
**[/Update]**

Next step was extending SkinnableContainer and just exposing a property on which you can pass an array of IVisualElement instances, along with the standard selectedIndex and selectedChildren. With the new Flex 4 _Declarations_ tag, this solution was made sweeter in that I could declare my children without instantiating them directly and could pass them along for the Flex 4 Viewstack to handle them as seen fit, allowing for deferred instantation. Making sure set selectedIndex and selectedChild work accordingly and dispatch an event on change of index, i called it a day. It took a couple hours and I called it a day… until Keith walked into my office and started yammering about me not working.

Example. Made with Flex 4 SDK build 9864. You will need the latest player:

[![Get Adobe Flash player](http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif)](http://adobe.com/go/getflashplayer)

[view source](http://custardbelly.com/downloads/viewstack/srcview/index.html) . There seems to be bug in the view source code in the nightly builds, so i will post the code here as well if you don’t feel like Right Click> View Source and downloading the zip…

Here is the implementation i came up with:
    
    // -----------------------------------------------------------
    // CBViewStack.as
    // -----------------------------------------------------------
     
    /**
     * Copyright (c) 2009 Todd Anderson. All Right Reserved.
     * 
     * Code provided has not been tested in a production environment
     * and should be used by another party at their own risk. I disclaim any
     * and all responsibility for any loss or damage of property that may occur
     * from using it.
     * 
     * ===================================
     * custardbelly.com
     */
    package com.custardbelly.container
    {
    	import mx.core.IVisualElement;
     
    	import spark.components.BorderContainer;
    	import spark.components.SkinnableContainer;
    	import spark.core.IViewport;
    	import spark.events.IndexChangeEvent;
     
    	/**
    	 * Dispatched on change to selectedIndex property value. 
    	 */
    	[Event(name="change", type="spark.events.IndexChangeEvent")]
     
    	/**
    	 * Basic implementation of a ViewStack container targeting the Spark environment.
    	 * CBViewStack inherently supports deferred instantiation. All methods and properties
    	 * have been made protected in order to subclass and implement any desired creation 
    	 * policy.
    	 * 
    	 * Child content cannot be added in markup due to the black-boxing of the mxmlContent and 
    	 * mxmlContentFactory properties and corresponding methods. As such, supply content to the
    	 * CBViewStack using the <b>content</b> property. The <b>content</b> property is an array
    	 * of declared IVisibleElement instances.
    	 * 
    	 * To enable scrolling of content added to the display list of CBViewStack, it is recommended
    	 * the either programatically control the viewport with an external scrollbar or wrap the 
    	 * container in a <s :Scroller> instance.
    	 * 
    	 * The <b>content</b> and <b>selectedIndex</b> properties can be set in-line in MXML.
    	 * The <b>selectedChild</b> property can only be set within ActionScript.
    	 */
    	[Event(name="change", type="spark.events.IndexChangeEvent")]
    	[DefaultProperty("content")]
    	public class CBViewStack extends BorderContainer
    	{
    		/**
    		 * Represents the collection of IVisualElement instances to be displayed. 
    		 */
    		[ArrayElementType("mx.core.IVisualElement")]
    		protected var _content:Array;
    		/**
    		 * The index within the colleciton of IVisualElements to be added to the display list. 
    		 */
    		protected var _selectedIndex:int = -1;
    		/**
    		 * Represents the current IVisualElement on the display list. 
    		 */
    		protected var _selectedChild:IVisualElement
     
    		/**
    		 * Held value for selectedIndex.
    		 */
    		protected var _pendingSelectedIndex:int = -1;
     
    		/**
    		 * @private 
    		 * 
    		 * Override to update selectedIndex and subsequently content on the display list.
    		 */
    		override protected function commitProperties() : void
    		{
    			super.commitProperties();
    			// if pending change to selectedIndex property.
    			if( _pendingSelectedIndex != -1 )
    			{
    				// commit the change.
    				updateSelectedIndex( _pendingSelectedIndex );
    				// set pending back to default.
    				_pendingSelectedIndex = -1;
    			}
    		}
     
    		/**
    		 * Updates the selectedIndex value and subsequent display. 
    		 * @param index int The value representing the selected child index within the content property.
    		 */
    		protected function updateSelectedIndex( index:int ):void
    		{
    			// store old for event.
    			var oldIndex:int = _selectedIndex;
    			// set new.
    			_selectedIndex = index;
     
    			// remove old element.
    			if( numElements > 0 ) 
    				removeElementAt( 0 );
     
    			// add new element.
    			selectedChild = _content[_selectedIndex];
    			addElement( _selectedChild );
     
    			// dispatch index change.
    			dispatchEvent( new IndexChangeEvent( IndexChangeEvent.CHANGE, false, false, oldIndex, _selectedIndex ) );
    		}
     
    		/**
    		 * Returns the elemental index of the IVisualElement from the content array. 
    		 * @param element IVisualElement The IVisualElement instance to find in the content array.
    		 * @return int The elemental index in which the IVisualElement resides. If not available returns -1.
    		 * 
    		 */
    		private function getElementIndexFromContent( element:IVisualElement ):int
    		{
    			if( _content == null ) return -1;
     
    			var i:int = _content.length;
    			var contentElement:IVisualElement;
    			while( --i > -1 )
    			{
    				contentElement = _content[i] as IVisualElement;
    				if( contentElement == element )
    				{
    					break;
    				}
    			}
    			return i;
    		}
     
    		[Bindable]
    		/**
    		 * Sets the array of IVisualElement instances to display based on selectedIndex and selectedChild.
    		 * CBViewStack inherently supports deferred instantiation, creating and adding only IVisualElements
    		 * that are requested for display. 
    		 * @return Array
    		 */
    		public function get content():Array /*IVisualElement*/
    		{
    			return _content;
    		}
    		public function set content( value:Array /*IVisualElement*/ ):void
    		{
    			_content = value;
    			// update selected index based on pending operations.
    			selectedIndex = _pendingSelectedIndex == -1 ? 0 : _pendingSelectedIndex;
    		}
     
    		[Bindable]
    		/**
    		 * Sets the selectedIndex to be used to add an IVisualElement instance from the content property
    		 * to the display list. 
    		 * @return int
    		 */
    		public function get selectedIndex():int
    		{
    			return _pendingSelectedIndex != -1 ? _pendingSelectedIndex : _selectedIndex;
    		}
    		public function set selectedIndex( value:int ):void
    		{
    			if( _selectedIndex == value ) return;
     
    			_pendingSelectedIndex = value;
    			invalidateProperties();
    		}
     
    		[Bindable]
    		/**
    		 * Sets the selectedChild to be added to the display list form the content array.
    		 * SelectedChild can only be set in ActionScript and will not be properly updated
    		 * if added inline in MXML declaration. 
    		 * @return IVisualElement
    		 */
    		public function get selectedChild():IVisualElement
    		{
    			return _selectedChild;
    		}
    		public function set selectedChild( value:IVisualElement ):void
    		{
    			if( _selectedChild == value ) return;
     
    			// if not pending operation on selectedIndex, induce.
    			if( _pendingSelectedIndex == -1 )
    			{
    				var proposedIndex:int = getElementIndexFromContent( value );
    				selectedIndex = proposedIndex;
    			}
    			// else just hold a reference for binding update.
    			else _selectedChild = value;
    		}
    	}
    }
    </s>

and its usage:
    
    <s :Application 
    	xmlns:fx="http://ns.adobe.com/mxml/2009" 
    	xmlns:s="library://ns.adobe.com/flex/spark" 
    	xmlns:mx="library://ns.adobe.com/flex/mx" 
    	xmlns:container="com.custardbelly.container.*" viewSourceURL="srcview/index.html">
     
    	<fx :Declarations>
    		</fx><fx :String id="lorem">Lorem ipsum dolor sit amet consectetur adipisicing elit.</fx>
     
     
    	<fx :Script>
    		< ![CDATA[
    			private function changeIndex():void
    			{
    				var index:int = viewstack.selectedIndex;
    				index = ( index + 1 > viewstack.content.length - 1 ) ? 0 : index + 1;
    				viewstack.selectedIndex = index;
    			}
    		]]>
    	</fx>
     
    	</s><s :layout>
    		<s :VerticalLayout />
    	</s>
     
    	<container :CBViewStack id="viewstack" width="300" height="300" 
    						   skinClass="com.custardbelly.skin.CBScrollableSkin">
    		<s :Group id="child1" 
    				 width="800" height="100%" 
    				 clipAndEnableScrolling="true">
    			</s><s :layout>
    				<s :VerticalLayout horizontalAlign="justify" />
    			</s>
    			<s :Button label="top" />
    			<s :Button label="bottom" bottom="0" />
     
    		<s :Panel id="child2" 
    				 width="100%" height="200" 
    				 title="Child 2">
    			</s><s :Scroller>
    				</s><s :Group width="100%" height="100%">
    					</s><s :layout>
    						<s :VerticalLayout horizontalAlign="center" />
    					</s>
    					<s :Button label="panel button 1" />
    					<s :Button label="panel button 2" />
     
     
     
    		<s :DataGroup id="child3" 
    					 width="100%" height="100%"
    					 itemRenderer="spark.skins.spark.DefaultItemRenderer">
    			</s><s :layout>
    				<s :VerticalLayout />
    			</s>
    			<s :dataProvider>
    				<s :ArrayCollection source="{lorem.split(' ')}" />
    			</s>
     
    	</container>
     
    	<s :Button label="switch index" click="changeIndex();" />
     
    	<s :HGroup>
    		<s :Button label="select child 1"
    				  enabled="{viewstack.selectedChild != child1}"
    				  click="{viewstack.selectedChild = child1}" 
    				  />
    		<s :Button label="select child 2"
    				  enabled="{viewstack.selectedChild != child2}"
    				  click="{viewstack.selectedChild = child2}" 
    				  />
    		<s :Button label="select child 3"
    				  enabled="{viewstack.selectedChild != child3}"
    				  click="{viewstack.selectedChild = child3}" 
    				  />
    	</s>

So that is basically it. Allow for skinning of the Viewstack by extending SkinnableContainer. Expose content, selectedIndex and selectedChild properties. Dispatch and index change event. Optionally wrap CVBViewStack in a Scroller to enable child content that extends the viewport of the viewstack. I know it probably won’t serve every need, but in a few short hours I made Viewstakc in Flex 4 for the purposes i mainly use it for in prototypes. I haven’t put it through the ringer in testing, but feel free to. There’s no license, completely free. Modify, take, steal, have fun.

*Note: Seems as though the generated ‘View Source’ files in the nightly build from September 1st (of which i mad the example) has some bugs. So feel free to click this link -> [view source](http://custardbelly.com/downloads/viewstack/srcview/index.html) < - but be aware that you won't actually be able to view the class files in the browser. You will need to download the zip file.

Posted in [Flex](http://custardbelly.com/blog/category/flex/), [Flex 4](http://custardbelly.com/blog/category/flex-4/).
