# [Deferred content for Flex 4 Group using [DefaultProperty]](http://custardbelly.com/blog/2011/11/11/deferred-content-for-flex-4-group-using-defaultproperty/)

Thought i would [share a little gist](https://gist.github.com/1340472) with you about a solution i whipped up with regards to deferred content in a Flex 4 **Group** container. 

If there are numerous children within a container and their style definitions are rather complex, there may be some lag within the rendering cycle. Though it may not cause the **Flash Player** to time-out or even invoke the beachball/hourglass of the user’s system, any perceived lag in rendering that is a considerable amount (to be discussed at a later date) could send the user packing if not in the very least curious as to the reliability of the application; needless to say, most UI heavy applications are those in which a user interacts heavily with the application in order to get something accomplished.

Setting UX/design decisions aside and trusting that optimizations – such as absolute positioning – are being used where appropriate, there still may come a time where the task at hand calls for a lengthly child list within a container, or even a rather small list with a heavy render cycle due to customization. In such a situation, having the ability to defer rendering is a great improvement to the perceived “snappiness” of your application.

Back in the Flex 3 days – well, i shouldn’t say “back” as the **MX** containers are still available in the SDK and i am sure there are still people working on Flex 3 whether grudgingly or not – the **MX** containers had a property called [_creationPolicy_](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/core/Container.html#creationPolicy). This allowed a developer to define the how the container was to render its children – basically, whether it should build its display tree upon creation of the container or defer. If you deferred it by setting the property to _ContainerCreationPolicy.NONE_, you could at anytime within the life of the application call _createComponentsFromDescriptors()_ on that container to have its children be created.

Now it should be noted that this functionality is at parity in Flex 4.x, yet only available to **SkinnableContainers** – and more accurately those that implement [**IDeferredContentOwner**](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/core/IDeferredContentOwner.html#propertySummary). Those containers within the Flex 4 SDK which are considered lighter-weight, such as **Group** and **DataGroup**, do not play host to skins or define style properties for graphical backgrounds but they also do not support deferred content inherently either.

I should stop here and say that even though **Group** and **DataGroup** are in the same boat as not being privy to a _creationPolicy_, the example code should really only be translated to a **Group** container. Deferred content for a **DataGroup** should be left to its defined layout and its properties. That said, there is a way to defer the child element creation of a **Group** rather simply; that is by utilizing the **[DefaultProperty]** metadata.

You can see the full [gist of the moving pieces on my github](https://gist.github.com/1340472), but just to give a quick example and rundown:
    
    package
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;import flash.events.Event;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;import mx.events.FlexEvent;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;import spark.components.Group;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/**
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* Use the deferredElements property as the modifier that is handed the list of IVisualElements defined in MXML.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;*/
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;[DefaultProperty("deferredElements")]
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/**
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* Group container extension in order to do deferred child element attachment.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;*/
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;public class DeferredGroup extends Group
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected var _elementAddQuota:int = 10;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/* IVisualElement[] */
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected var _deferredElements:Array;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected var _deferredElementsChanged:Boolean;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected var _deferredElementAttacher:IDeferredElementAttacher;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;public function DeferredGroup()
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;super();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/**
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* @inheritDoc
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;*/
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;override protected function commitProperties():void
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;super.commitProperties();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( _deferredElementsChanged )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;queueDeferredElements();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementsChanged = false;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/**
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* Defines and executes the IDeferredElementAttacher implementation used in queue-ing up "packs"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* of IVisualElement instances declared in MXML and assigned as deferredElements.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;*/
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected function queueDeferredElements():void
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Define IDeferredElementAttacher and listen for completion on attach of all elements within deferredElements.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher = new FrameDeferredElementAttacher( this );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher.addEventListener( Event.COMPLETE, handleDeferredAttachmentComplete, false, 0, true );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// "Chunk" up lists of IVisualElements based on limit quota.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var i:int;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var startIndex:int;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var endIndex:int;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var length:int = _deferredElements.length;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var count:int = Math.ceil(length / _elementAddQuota);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;for( i = 0; i < count; i++ )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;startIndex = i * _elementAddQuota;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;endIndex = startIndex + _elementAddQuota;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;endIndex = ( endIndex > length ) ? length : endIndex;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher.addElementPack( _deferredElements.slice( startIndex, endIndex ) );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher.start();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/**
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* Event handler for completion from the IDeferredElementAttacher instance.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* @param evt Event
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;*/
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected function handleDeferredAttachmentComplete( evt:Event ):void
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Kill reference.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher.removeEventListener( Event.COMPLETE, handleDeferredAttachmentComplete, false );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher.dispose();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher = null;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// -> Do whatever you normally would do in a handler for CREATION_COMPLETE.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/**
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* The amount of IVisualElements to "chunk" into packets for deferred queue.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* @return int
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;*/
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;public function get elementAddQuota():int
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return _elementAddQuota;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;public function set elementAddQuota( value:int ):void
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_elementAddQuota = value;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/**
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* The DefaultProperty array of IVisualElements declared in MXML markup.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;* @return Array Required to be IVisualElement[]
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;*/
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;public function get deferredElements():Array
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return _deferredElements;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;public function set deferredElements( value:Array ):void
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( _deferredElements == value ) return;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElements = value;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementsChanged = true;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;invalidateProperties();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    }

Essentially, I have defined the **[DefaultProperty]** to be the _deferredElements_ property. By default, any Flex container’s **[DefaultProperty]** is the _mxmlContent_ property. If left to default, anything declared in MXML within the container declaration is handed to the _mxmlContent_ property which in turn is used to add the children to the container using ActionScript at a later time within its instantiation cycle. Just as an example, the **Label** and **Button** of the **Group** container defined in this MXML can be considered the array of **IVisualElements** known to the parent **Group** as _mxmlContent_.
    
    <s:Group>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<s:Label text="Hello, World" />
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<s:Button label="foo" />
    
    </s:Group>

… and same goes for Flex 3 containers. Not much has changed, aside form non-parity in _creationPolicy_ on Flex 4 containers that don’t implement **IDeferredContentOwner**. However, in the example provided above and in the [gist](https://gist.github.com/1340472), the declared children in MXML aren’t handed to the _mxmlChildren_, but rather the _deferredChildren_. Because of this, we can then check if we have deferred content upon a pass to _invalidationProperties()_ and act accordingly – as is done by invoking _queueDeferredElements_() in the example:
    
    /**
    
    &nbsp_place_holder;* Defines and executes the IDeferredElementAttacher implementation used in queue-ing up "packs" of IVisualElement instances declared in MXML and assigned as deferredElements.
    
    &nbsp_place_holder;*/
    
    protected function queueDeferredElements():void
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Define IDeferredElementAttacher and listen for completion on attach of all elements within deferredElements.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher = new FrameDeferredElementAttacher( this );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher.addEventListener( Event.COMPLETE, handleDeferredAttachmentComplete, false, 0, true );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// "Chunk" up lists of IVisualElements based on limit quota.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var i:int;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var startIndex:int;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var endIndex:int;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var length:int = _deferredElements.length;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var count:int = Math.ceil(length / _elementAddQuota);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;for( i = 0; i < count; i++ )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;startIndex = i * _elementAddQuota;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;endIndex = startIndex + _elementAddQuota;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;endIndex = ( endIndex > length ) ? length : endIndex;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher.addElementPack( _deferredElements.slice( startIndex, endIndex ) );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_deferredElementAttacher.start();
    
    }

And in that method, an **IDeferredElementAttacher** (non-SDK, part of the [gist](https://gist.github.com/1340472)) implementation is used to queue up smaller arrays of child elements and dequeued to start adding children to the target container. In this example that implementation is a **FrameDeferredElementAttacher** instance which waits a frame to move along in its queue. Included in the [gist](https://gist.github.com/1340472) is also one for timer-based element addition.

This post got rather long as far as just wanting to show off how to defer child content of a **Group** container in Flex 4, but I just wanted to bring light my solution as there is no parity of _creationPolicy_ on non-**IDeferredContentOwner** containers in the SDK.

See the whole gist here: [https://gist.github.com/1340472](https://gist.github.com/1340472).

Posted in [AIR](http://custardbelly.com/blog/category/air/), [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/), [Flex 4](http://custardbelly.com/blog/category/flex-4/), [Flex 4.5](http://custardbelly.com/blog/category/flex-4-5/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – November 11, 2011
  *[November 11, 2011]: 2011-11-11T15:50
