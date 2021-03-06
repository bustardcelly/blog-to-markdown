---
title: 'Deferred content for Flex 4 Group using [DefaultProperty]'
url: 'https://custardbelly.com/blog/2011/11/11/deferred-content-for-flex-4-group-using-defaultproperty/'
author:
  name: 'todd anderson'
date: '2011-11-11'
---

Thought i would [share a little gist](https://gist.github.com/1340472) with you about a solution i whipped up with regards to deferred content in a Flex 4 **Group** container. 

If there are numerous children within a container and their style definitions are rather complex, there may be some lag within the rendering cycle. Though it may not cause the **Flash Player** to time-out or even invoke the beachball/hourglass of the user’s system, any perceived lag in rendering that is a considerable amount (to be discussed at a later date) could send the user packing if not in the very least curious as to the reliability of the application; needless to say, most UI heavy applications are those in which a user interacts heavily with the application in order to get something accomplished.

Setting UX/design decisions aside and trusting that optimizations – such as absolute positioning – are being used where appropriate, there still may come a time where the task at hand calls for a lengthly child list within a container, or even a rather small list with a heavy render cycle due to customization. In such a situation, having the ability to defer rendering is a great improvement to the perceived “snappiness” of your application.

Back in the Flex 3 days – well, i shouldn’t say “back” as the **MX** containers are still available in the SDK and i am sure there are still people working on Flex 3 whether grudgingly or not – the **MX** containers had a property called [_creationPolicy_](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/core/Container.html#creationPolicy). This allowed a developer to define the how the container was to render its children – basically, whether it should build its display tree upon creation of the container or defer. If you deferred it by setting the property to _ContainerCreationPolicy.NONE_, you could at anytime within the life of the application call _createComponentsFromDescriptors()_ on that container to have its children be created.

Now it should be noted that this functionality is at parity in Flex 4.x, yet only available to **SkinnableContainers** – and more accurately those that implement [**IDeferredContentOwner**](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/core/IDeferredContentOwner.html#propertySummary). Those containers within the Flex 4 SDK which are considered lighter-weight, such as **Group** and **DataGroup**, do not play host to skins or define style properties for graphical backgrounds but they also do not support deferred content inherently either.

I should stop here and say that even though **Group** and **DataGroup** are in the same boat as not being privy to a _creationPolicy_, the example code should really only be translated to a **Group** container. Deferred content for a **DataGroup** should be left to its defined layout and its properties. That said, there is a way to defer the child element creation of a **Group** rather simply; that is by utilizing the **[DefaultProperty]** metadata.

You can see the full [gist of the moving pieces on my github](https://gist.github.com/1340472), but just to give a quick example and rundown:
    
    package
    
    {
    
        import flash.events.Event;
    
     
    
        import mx.events.FlexEvent;
    
     
    
        import spark.components.Group;
    
     
    
        /**
    
         * Use the deferredElements property as the modifier that is handed the list of IVisualElements defined in MXML.
    
         */
    
        [DefaultProperty("deferredElements")]
    
     
    
        /**
    
         * Group container extension in order to do deferred child element attachment.
    
         */
    
        public class DeferredGroup extends Group
    
        {
    
            protected var _elementAddQuota:int = 10;
    
     
    
            /* IVisualElement[] */
    
            protected var _deferredElements:Array;
    
            protected var _deferredElementsChanged:Boolean;
    
     
    
            protected var _deferredElementAttacher:IDeferredElementAttacher;
    
     
    
            public function DeferredGroup()
    
            {
    
                super();
    
            }
    
     
    
            /**
    
             * @inheritDoc
    
             */
    
            override protected function commitProperties():void
    
            {
    
                super.commitProperties();
    
                if( _deferredElementsChanged )
    
                {
    
                    queueDeferredElements();
    
                    _deferredElementsChanged = false;
    
                }
    
            }
    
     
    
            /**
    
             * Defines and executes the IDeferredElementAttacher implementation used in queue-ing up "packs"
    
             * of IVisualElement instances declared in MXML and assigned as deferredElements.
    
             */
    
            protected function queueDeferredElements():void
    
            {
    
                // Define IDeferredElementAttacher and listen for completion on attach of all elements within deferredElements.
    
                _deferredElementAttacher = new FrameDeferredElementAttacher( this );
    
                _deferredElementAttacher.addEventListener( Event.COMPLETE, handleDeferredAttachmentComplete, false, 0, true );
    
     
    
                // "Chunk" up lists of IVisualElements based on limit quota.
    
                var i:int;
    
                var startIndex:int;
    
                var endIndex:int;
    
                var length:int = _deferredElements.length;
    
                var count:int = Math.ceil(length / _elementAddQuota);
    
                for( i = 0; i < count; i++ )
    
                {
    
                    startIndex = i * _elementAddQuota;
    
                    endIndex = startIndex + _elementAddQuota;
    
                    endIndex = ( endIndex > length ) ? length : endIndex;
    
                    _deferredElementAttacher.addElementPack( _deferredElements.slice( startIndex, endIndex ) );
    
                }
    
                _deferredElementAttacher.start();
    
            }
    
     
    
            /**
    
             * Event handler for completion from the IDeferredElementAttacher instance.
    
             * @param evt Event
    
             */
    
            protected function handleDeferredAttachmentComplete( evt:Event ):void
    
            {
    
                // Kill reference.
    
                _deferredElementAttacher.removeEventListener( Event.COMPLETE, handleDeferredAttachmentComplete, false );
    
                _deferredElementAttacher.dispose();
    
                _deferredElementAttacher = null;
    
     
    
                // -> Do whatever you normally would do in a handler for CREATION_COMPLETE.
    
            }
    
     
    
            /**
    
             * The amount of IVisualElements to "chunk" into packets for deferred queue.
    
             * @return int
    
             */
    
            public function get elementAddQuota():int
    
            {
    
                return _elementAddQuota;
    
            }
    
            public function set elementAddQuota( value:int ):void
    
            {
    
                _elementAddQuota = value;
    
            }
    
     
    
            /**
    
             * The DefaultProperty array of IVisualElements declared in MXML markup.
    
             * @return Array Required to be IVisualElement[]
    
             */
    
            public function get deferredElements():Array
    
            {
    
                return _deferredElements;
    
            }
    
            public function set deferredElements( value:Array ):void
    
            {
    
                if( _deferredElements == value ) return;
    
     
    
                _deferredElements = value;
    
                _deferredElementsChanged = true;
    
                invalidateProperties();
    
            }
    
        }
    
    }

Essentially, I have defined the **[DefaultProperty]** to be the _deferredElements_ property. By default, any Flex container’s **[DefaultProperty]** is the _mxmlContent_ property. If left to default, anything declared in MXML within the container declaration is handed to the _mxmlContent_ property which in turn is used to add the children to the container using ActionScript at a later time within its instantiation cycle. Just as an example, the **Label** and **Button** of the **Group** container defined in this MXML can be considered the array of **IVisualElements** known to the parent **Group** as _mxmlContent_.
    
    <s:Group>
    
        <s:Label text="Hello, World" />
    
        <s:Button label="foo" />
    
    </s:Group>

… and same goes for Flex 3 containers. Not much has changed, aside form non-parity in _creationPolicy_ on Flex 4 containers that don’t implement **IDeferredContentOwner**. However, in the example provided above and in the [gist](https://gist.github.com/1340472), the declared children in MXML aren’t handed to the _mxmlChildren_, but rather the _deferredChildren_. Because of this, we can then check if we have deferred content upon a pass to _invalidationProperties()_ and act accordingly – as is done by invoking _queueDeferredElements_() in the example:
    
    /**
    
     * Defines and executes the IDeferredElementAttacher implementation used in queue-ing up "packs" of IVisualElement instances declared in MXML and assigned as deferredElements.
    
     */
    
    protected function queueDeferredElements():void
    
    {
    
        // Define IDeferredElementAttacher and listen for completion on attach of all elements within deferredElements.
    
        _deferredElementAttacher = new FrameDeferredElementAttacher( this );
    
        _deferredElementAttacher.addEventListener( Event.COMPLETE, handleDeferredAttachmentComplete, false, 0, true );
    
     
    
        // "Chunk" up lists of IVisualElements based on limit quota.
    
        var i:int;
    
        var startIndex:int;
    
        var endIndex:int;
    
        var length:int = _deferredElements.length;
    
        var count:int = Math.ceil(length / _elementAddQuota);
    
        for( i = 0; i < count; i++ )
    
        {
    
            startIndex = i * _elementAddQuota;
    
            endIndex = startIndex + _elementAddQuota;
    
            endIndex = ( endIndex > length ) ? length : endIndex;
    
            _deferredElementAttacher.addElementPack( _deferredElements.slice( startIndex, endIndex ) );
    
         }
    
         _deferredElementAttacher.start();
    
    }

And in that method, an **IDeferredElementAttacher** (non-SDK, part of the [gist](https://gist.github.com/1340472)) implementation is used to queue up smaller arrays of child elements and dequeued to start adding children to the target container. In this example that implementation is a **FrameDeferredElementAttacher** instance which waits a frame to move along in its queue. Included in the [gist](https://gist.github.com/1340472) is also one for timer-based element addition.

This post got rather long as far as just wanting to show off how to defer child content of a **Group** container in Flex 4, but I just wanted to bring light my solution as there is no parity of _creationPolicy_ on non-**IDeferredContentOwner** containers in the SDK.

See the whole gist here: [https://gist.github.com/1340472](https://gist.github.com/1340472).

Posted in [AIR](https://custardbelly.com/blog/category/air/), [AS3](https://custardbelly.com/blog/category/as3/), [Flash](https://custardbelly.com/blog/category/flash/), [Flex](https://custardbelly.com/blog/category/flex/), [Flex 4](https://custardbelly.com/blog/category/flex-4/), [Flex 4.5](https://custardbelly.com/blog/category/flex-4-5/).
