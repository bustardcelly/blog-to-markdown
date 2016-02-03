---
title: 'as3flobile ScrollViewport and Flex 4 containers? from yeah to eh.'
url: 'https://custardbelly.com/blog/2011/02/16/as3flobile-scrollviewport-and-flex-4-containers-from-yeah-to-eh/'
author:
  name: 'todd anderson'
date: '2011-02-16'
---

The other day i got an email from [Tom Kordys](http://twitter.com/tomkordys) for a little clarification on the [as3flobile](https://github.com/bustardcelly/as3flobile) project and if the [ScrollViewport](https://github.com/bustardcelly/as3flobile/tree/master/src/com/custardbelly/as3flobile/controls/viewport) could be used to provide touch scrolling to a **DataGroup**. My first thought was _“no”_, then my second thought was _“why not?”_. The third thought i forget. But then the fourth thought was fire up **Flash Builder** and take a break.

When i originally started out creating the [as3flobile](https://github.com/bustardcelly/as3flobile) library, the intent was to provide a suite of controls for an **AS3** project targeting the **Flash Player** on a mobile browser. I intentionally pushed **Flex** to the side for a number of reasons:

  1. **Adobe** is currently [working on and improving **Hero**](http://labs.adobe.com/technologies/flex/mobile/) (nee **Slider**).
  2. It runs like crap on mobile (hence the first line item).
  3. I wanted to dive into a solely **AS3** personal project again (selfish).

Before i got that email, truthfully, the thought never crossed my mind to intermingle parts from the as3flobile library into **Flex**; **Adobe** will deliver their solution in due time and i will then make a decision whether to use **Flex** or **AS3** for my next mobile-web based project. Until then, if need be, i’ll just use **AS3**. That is still my impression, but after i got that email i was just dying to know if i could enable touch scrolling on **Flex 4** containers. 

So you’ve read all the way down to here and i still haven’t given an answer…

[view source enabled]  
[![as3flobile viewport container](http://www.custardbelly.com/blog/images/as3flobile_vp_container.png)](http://www.custardbelly.com/downloads/as3flobile/containerviewport/)  
_ScrollViewport with Group containers._

[view source enabled]  
[![as3flobile viewport datagroup](http://www.custardbelly.com/blog/images/as3flobile_vp_datagroup.png)](http://www.custardbelly.com/downloads/as3flobile/flexviewport/)  
_ScrollViewport with virtualized DataGroup container._

Yes, it is possibile! Would i recommend it? Sure, have fun! Would i put it into production? No. No, i would not. 

From my tests, **Flex** containers in the [as3flobile](https://github.com/bustardcelly/as3flobile/) **ScrollViewport** run pretty smoothly on a desktop browser. If that is your target platform and you are looking for touch-scroll on containers, I say try it out. In **Flash Player** on mobile browser, the scrolling and touch interaction is not smooth enough for my liking, but it may pass your user experience tests… who knows. I believe it is the length of invalidation cycle for **Flex** that is causing the render hiccups, but i am sure there is some optimization that could be done in [as3flobile](https://github.com/bustardcelly/as3flobile/) that may help a little. That said, [as3flobile](https://github.com/bustardcelly/as3flobile/) touch-scroll runs pretty smoothly on an **AS3** project, so i don’t know how much optimization could be done for me to be comfortable with the rendering performance of Flex containers in an [as3flobile](https://github.com/bustardcelly/as3flobile/) **ScrollViewport**. All said, I will explain how you can target a **Flex 4** container as the content for [as3flobile](https://github.com/bustardcelly/as3flobile/) **ScrollViewport**.

## as3flobile ScrollViewport

The **ScrollViewport** control from [as3flobile](https://github.com/bustardcelly/as3flobile/) essentially uses its dimensions as a visible area for child content. Its target child content is typed to an **InteractiveObject**, which is the base display class from which touch/mouse events are received on. **Flex** containers subclass (through a larger inheritance chain) **InteractiveObject** so there was no extra effort or cajoling of the as3flobile library to make **ScrollViewport** work with **Flex** containers.

With its content set to **IntractiveObject**, **ScrollViewport** employs the [Strategy Pattern](http://en.wikipedia.org/wiki/Strategy_pattern) to recognize interactive events on the content and perform scrolling. You can assign custom scroll contexts and strategies to **ScrollViewport**, but the default context reacts to **Mouse** events invoking the default scroll strategy. The scroll behaviour is based on the **width** and **height** dimensions of the target content for the **ScrollViewport**. If the **height** of the content is less than or equal to the **height** property of **ScrollViewport**, then vertical scrolling is turned off. Likewise for the **width** property values and horizontal scrolling.

To set up a viewport for **AS3**, you would do something of the following:
    
    var container:Sprite = new Sprite();
    
    var bitmap:Bitmap = new Bitmap( new BitmapData( 200, 200, false, 0x000000 ) );
    
    container.addChild( bitmap );
    
     
    
    // Direct dimension values
    
    var viewport:ScrollViewport = new ScrollViewport();
    
    viewport.width = 100;
    
    viewport.height = 100;
    
    viewport.content = container;
    
    addChild( viewport );
    
     
    
    // OR - Utility convenience instantiation
    
    var viewport:ScrollViewport = ScrollViewport.initWithScrollRect( new Rectangle( 0, 0, 100, 100 ) );
    
    viewport.content = container;
    
    addChild( viewport );

In this example, the **InteractiveObject** target is the **Sprite** that has a **Bitmap** child. The size of the **Bitmap** (and consequently the parenting size of the **Sprite**) is larger than the designated size for the viewport. In reality this is a terrible example because you won’t really see the scrolling affect due to a single colored bitmap. _An example with a loaded bitmap can be seen at [http://www.custardbelly.com/android/froyo/as3flobile](http://www.custardbelly.com/android/froyo/as3flobile)._

## Targeting Flex 4 containers

The approach to apply the content of the **ScrollViewport** to a **Flex** container is relatively the same as in the **AS3** example. The only caveat is that you need to listen for a change in the **contentWidth** and **contentHeight** properties of the **Flex** container and refresh the **ScrollViewport** instance. As well, the **ScrollViewport** needs to be added as a child of **SpriteVisualElement**, and the target container re-parented to the **ScrollViewport**. Here is a quick example:
    
    <?xml version="1.0" encoding="utf-8"?>
    
    <s:Group xmlns:fx="[http://ns.adobe.com/mxml/2009](http://ns.adobe.com/mxml/2009)"
    
             xmlns:s="[library://ns.adobe.com/flex/spark](library://ns.adobe.com/flex/spark)"
    
             xmlns:mx="[library://ns.adobe.com/flex/mx](library://ns.adobe.com/flex/mx)"
    
             creationComplete="handleCreationComplete();">
    
     
    
        <fx:Script>
    
            <![CDATA[
    
                import com.custardbelly.as3flobile.controls.viewport.ScrollViewport;
    
     
    
                import mx.events.PropertyChangeEvent;
    
     
    
                protected var viewport:ScrollViewport;
    
     
    
                protected function handleCreationComplete():void
    
                {
    
                    container.addEventListener( PropertyChangeEvent.PROPERTY_CHANGE, handleContentPropertyChange, false, 0, true );
    
     
    
                    viewport = new ScrollViewport();
    
                    viewport.width = 100;
    
                    viewport.height = 100;
    
                    viewport.content = container;
    
                    viewportHolder.addChild( viewport );
    
                }
    
     
    
                protected function handleContentPropertyChange( evt:PropertyChangeEvent ):void
    
                {
    
                    if( evt.property == "contentWidth" || evt.property == "contentHeight" )
    
                    {
    
                        viewport.refresh();
    
                    }
    
                }
    
            ]]>
    
        </fx:Script>
    
     
    
        <s:SpriteVisualElement id="viewportHolder" />
    
     
    
        <s:Group id="container" width="200" height="200">
    
            <s:Rect width="200" height="200">
    
                <s:fill>
    
                    <s:LinearGradient>
    
                        <s:entries>
    
                            <s:GradientEntry color="0x000000" ratio="0" />
    
                            <s:GradientEntry color="0xFFFFFF" ratio=".66" />
    
                        </s:entries>
    
                    </s:LinearGradient>
    
                </s:fill>
    
            </s:Rect>
    
        </s:Group>
    
     
    
    </s:Group>

The target content – in this example, a **Group** container with the id of “container” – needs to go through the invalidation cycle within **Flex**. So it is declared in mark-up as a child of the parent **Group**. This is important to note, because the target content container cannot be added from a **Declarations** tag in **Flex**. It needs to have gone through its invalidation in order to be rendered and re-parented to the **ScrollViewport**. Once the container is set as the content for the **ScrollViewport** it is now on the display list of the **ScrollViewport**.

As mentioned early, in this example, i have assigned a **PropertyChangeEvent** listener to pick up the change to **contentWidth** and **contentHeight** of the container. Once caught, the viewport is refreshed. This is needed in order to properly based its scroll bounds in the strategy. Once that is set, you are already to go.

Here is an example of using this approach which shows vertical and horizontal scroll viewports for **Group** containers:

[view source enabled]  
[![as3flobile viewport container](http://www.custardbelly.com/blog/images/as3flobile_vp_container.png)](http://www.custardbelly.com/downloads/as3flobile/containerviewport/)  
_ScrollViewport with Group containers._

## ScrollViewport and virtualized DataGroup renderers

After drumming up a working example with **Group** container as content target for **ScrollViewport**, my mind immediately changed focus to **DataGroups**. And not just **DataGroup**s, but the need for item renderer recycling using virtualization. I_f you are unfamiliar with virualization and **DataGroup**s, **Adobe** has some useful information [here](http://help.adobe.com/en_US/flex/using/WS64909091-7042-4fb8-A243-8FD4E2990264.html)._

That gets a little trickier, but not too much. Fortunately the **contentWidth** and **contentHeight** property values are updated on a **DataGroup** based on the **dataProvider** and the item renderer using _virtualization_, even though every data renderer for an item in the **dataProvider** is not present in the layout display stack since they are recycled. In broad terms, this means our scroll strategy will still be a viable solution, but we will need to update the **verticalScrollPosition** and **y** position of the **DataGroup** during the scroll behaviour.

Here is an example of using **DataGroup** with a virtualized layout:
    
    <?xml version="1.0" encoding="utf-8"?>
    
    <s:Group xmlns:fx="[http://ns.adobe.com/mxml/2009](http://ns.adobe.com/mxml/2009)"
    
             xmlns:s="[library://ns.adobe.com/flex/spark](library://ns.adobe.com/flex/spark)"
    
             xmlns:mx="[library://ns.adobe.com/flex/mx](library://ns.adobe.com/flex/mx)"
    
             creationComplete="handleCreationComplete();">
    
     
    
        <fx:Declarations>
    
            <s:ArrayList id="dp">
    
                <fx:String>hello</fx:String>
    
                <fx:String>world</fx:String>
    
                <fx:String>foo</fx:String>
    
                <fx:String>bar</fx:String>
    
                <fx:String>baz</fx:String>
    
                <fx:String>jello</fx:String>
    
                <fx:String>biafra</fx:String>
    
            </s:ArrayList>
    
        </fx:Declarations>
    
     
    
        <fx:Script>
    
            <![CDATA[
    
                import com.custardbelly.as3flobile.controls.viewport.ScrollViewport;
    
     
    
                import mx.events.PropertyChangeEvent;
    
     
    
                protected var viewport:ScrollViewport;
    
     
    
                protected function handleCreationComplete():void
    
                {
    
                    dataGroup.addEventListener( PropertyChangeEvent.PROPERTY_CHANGE, handleContentPropertyChange, false, 0, true );
    
                    dataGroup.dataProvider = dp;
    
     
    
                    viewport = new ScrollViewport();
    
                    viewport.width = 100;
    
                    viewport.height = 100;
    
                    viewport.content = container;
    
                    viewport.scrollChange.add( handleScrollChange );
    
                    viewportHolder.addChild( viewport );
    
                }
    
     
    
                protected function handleContentPropertyChange( evt:PropertyChangeEvent ):void
    
                {
    
                    if( evt.property == "contentHeight" )
    
                    {
    
                        container.height = dataGroup.contentHeight;
    
                        contentBackground.height = dataGroup.contentHeight;
    
                        viewport.refresh();
    
                    }
    
                }
    
     
    
                protected function handleScrollChange( value:Point ):void
    
                {
    
                    dataGroup.verticalScrollPosition = value.y * -1;
    
                    dataGroup.y = dataGroup.verticalScrollPosition;
    
                }
    
            ]]>
    
        </fx:Script>
    
     
    
        <s:SpriteVisualElement id="viewportHolder" />
    
     
    
        <s:Group id="container" width="100">
    
            <s:Rect id="contentBackground" width="100">
    
                <s:fill>
    
                    <s:SolidColor color="#DDDDDD" />
    
                </s:fill>
    
            </s:Rect>
    
            <s:DataGroup id="dataGroup"
    
                         width="100" height="200"
    
                         clipAndEnableScrolling="true"
    
                         itemRenderer="spark.skins.spark.DefaultItemRenderer">
    
                <s:layout>
    
                    <s:VerticalLayout useVirtualLayout="true" gap="2" />
    
                </s:layout>
    
            </s:DataGroup>
    
        </s:Group>
    
     
    
    </s:Group>

In this example, we are basing our target content container dimensions on change to the contentHeight property of the **DataGroup** child. The **dataProvider** and the item renderer are the basis of the **contentHeight** property, and once we handle that change, we apply the height properties to the container and contentBackground, then refresh the viewport. The **contentBackground** is there to act as a grabbable area within the container so we can scroll without having to touched down on an item renderer in the **DataGroup** directly.

The handler for the **scrollChange** [Signal](https://github.com/robertpenner/as3-signals) then updates the **verticalScrollPosition** of the **DataGroup** and the **y** position within the container. This gives the perceived scrolling display incorporated with item renderer recycling (notice the **useVirtualLayout** property value on the **VerticalLayout** assigned to the **DataGroup**).

Here is an example of this working with the status API of **Twitter** as the data content for a **DataGroup**:

[view source enabled]  
[![as3flobile viewport datagroup](http://www.custardbelly.com/blog/images/as3flobile_vp_datagroup.png)](http://www.custardbelly.com/downloads/as3flobile/flexviewport/)  
_ScrollViewport with virtualized DataGroup container._

You’ll see some lag when each new item renderer is requested to render, but once it has finished and cached the image requests it will get smoother.

## Conclusion

Cheers to [Tom Kordys](http://twitter.com/tomkordys) for looking in to [as3flobile](https://github.com/bustardcelly/as3flobile) and sparking the discussion. In short, yeah is it possible to use ScrollViewport and Flex 4 containers. But if you have looked at the examples on a mobile device that supports **Flash Player**, you may agree with me that it is not production-ready. Maybe there is some optimization i could do one my side, but i feel the lag really is on the **Flex** invalidation cycle. As well, these examples are pretty basic and there might be some other fine-tuning, not to mention maybe swapping out the container with a **Bitmap** snapshot of itself while scrolling… something to think about.

## Attribution

The examples use the [Hi-ReS-Stats component](https://github.com/mrdoob/Hi-ReS-Stats) created by [Mr.doob](http://mrdoob.com/).

as3flobile uses the [as3-signals](https://github.com/robertpenner/as3-signals) library created by [Robert Penner](http://flashblog.robertpenner.com/).

_[as3flobile](https://github.com/bustardcelly/as3flobile) is a set of ActionScript 3 components targeting the Flash Player on mobile devices. [You can read more about the project here](https://custardbelly.com/blog/?page_id=180). To see working examples, visit [http://www.custardbelly.com/android/froyo/as3flobile/](http://www.custardbelly.com/android/froyo/as3flobile/)_

Posted in [AS3](https://custardbelly.com/blog/category/as3/), [Flash](https://custardbelly.com/blog/category/flash/), [Flex](https://custardbelly.com/blog/category/flex/), [Flex 4](https://custardbelly.com/blog/category/flex-4/), [as3flobile](https://custardbelly.com/blog/category/as3flobile/).
