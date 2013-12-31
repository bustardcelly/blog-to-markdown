# [Flex 4.5 Hidden Additions*](http://custardbelly.com/blog/2011/07/15/flex-4-5-hidden-additions/)

*Maybe not necessarily _hidden_ per se, but with the main focus on delivering **Flex** to mobile, there are a few things that have snuck into the [Flex 4.5 SDK](http://opensource.adobe.com/wiki/display/flexsdk/Download+Flex+4.5) release that don’t get much coverage. I am not talking about **Molehill**, native **JSON** support, **GC** advice, etc. disclosed in [this announcement](http://www.bytearray.org/?p=3216) – which are very exciting. I wanted to shed some light on some things I found kicking around in the new **SDK** that I have not heard very much about. Truthfully, they may have been a bi-product of getting the framework to be more performant on a mobile device – not sure – but they are things that I (and probably you) have created over and over for projects with varying degrees of functionality and **API** completeness as was deemed fit for the requirements at hand.

They are:

  1. s:Image
  2. ContentCache
  3. LinkedList

read on to find out more about them…

## 1. s:Image

Finally, a **Spark** equivalent of **mx:Image**! And with it comes its own skin – **ImageSkin** – that allows the ability to show loading progress (with its own skin!). I can’t tell you how many times i have made these for client projects. Many – let’s keep it at that. However, the skin contract I would create for these custom “images-with-loading-indicator-components” (as I would call them) defined an **mx:Image** as the graphics container. The reason being a security issue with trying to manipulate bitmap data added to a **BitmapImage**.

Fortunately it looks like some updates to **BitmapImage** have been added as well in [Flex 4.5](http://opensource.adobe.com/wiki/display/flexsdk/Download+Flex+4.5), of which i am assuming clears up the security issues seeing as the skin contract for **s:Image** defines a **BitmapImage** as its graphic layer. Maybe I will dig into it later and come up with more info (or if someone reading knows, please tell), but what immediately pops out are the new **load events and properties** such as _trustedSource_, _contentLoader_ and _bitmapData_ (which returns a clone).

### Usage
    
    <s:Image source="[http://upload.wikimedia.org/wikipedia/commons/archive/4/4e/20090913162821](http://upload.wikimedia.org/wikipedia/commons/archive/4/4e/20090913162821)!Pleiades_large.jpg"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;width="800" height="600"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;enableLoadingState="true"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/>

Remember how i mentioned _contentLoader_ as a new property for **BitmapImage** (and the decorating **s:Image**)? That is typed to an **IContentLoader** interface, of which **ContentCache** is an implementation.

## 2. ContentCache

Many 3rd party libraries have been written for this. I’ve created some in **AS2**, some in **AS3**. Basically just a lookup on file access either remote or embedded so as not to load or generate new content – some with load queues, some with instant request. And that is what **ContentCache** provides – a queueable, cacheable loader for files on a remote resource. Another cool feature is being able to assign a grouping for queued requests and priority in loading – (another property on **s:Image** and **BitmapImage** not addressed previously).

If we look at the _load_() signature on **ContentCache**:
    
    public function load(source:Object, contentLoaderGrouping:String=null):ContentRequest

we can see the grouping designation associated with the load request as the second argument. The first argument can be either a **URLRequest** object or a **String** (well _technically_ you can supply anything there, but it will either be resolved to a **URLRequest** or **String** within the _load_ function). We also see that _load_() returns an instance of **ContentRequest**. That can either be an active request in the queue or currently running or filled and considered _complete_ from cache. 

The _content_ property on **ContentRequest** is typed as an Object and the docs suggest it can be anything. In the instance of the one returned from **ContentCache** it looks as though it is always typed to **LoaderInfo** (the target loader of the request). Pretty cool. So basically, you request **ContentCache** to load your image file, check for _complete_ on the returned **ContentRequest**, if false, assign event handlers for complete. When using **ContentCache**, the _content_ value on the **ContentRequest** (from what i see) will always be **LoaderInfo**. Obviously it is flexible enough to create your own **IContentLoader** implementation to return content of a different type.

### Usage
    
    public var cache:ContentCache;
    
    public var requests:Vector.<ContentRequest>;
    
    &nbsp_place_holder;
    
    protected function requestImages():void
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;cache = new ContentCache();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;cache.prioritize( "walls" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;cache.enableCaching = true;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;cache.enableQueueing = true;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;requests = new Vector.<ContentRequest>();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;requests.push( cache.load( "[http://30.media.tumblr.com/tumblr_loc6v1EmWE1qzpsuoo1_500.jpg](http://30.media.tumblr.com/tumblr_loc6v1EmWE1qzpsuoo1_500.jpg)", "superheros" ) );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;requests.push( cache.load( "[http://26.media.tumblr.com/tumblr_locs8oFznL1qzpsuoo1_400.jpg](http://26.media.tumblr.com/tumblr_locs8oFznL1qzpsuoo1_400.jpg)", "walls" ) );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;requests.push( cache.load( "[http://25.media.tumblr.com/tumblr_loc2ysUcfw1qzpsuoo1_500.jpg](http://25.media.tumblr.com/tumblr_loc2ysUcfw1qzpsuoo1_500.jpg)", "superheros" ) )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;requests.push( cache.load( "[http://24.media.tumblr.com/tumblr_loarags4Du1qzpsuoo1_500.jpg](http://24.media.tumblr.com/tumblr_loarags4Du1qzpsuoo1_500.jpg)", "walls" ) )
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var request:ContentRequest;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var i:int = requests.length;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;while( --i > -1 )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;request = requests[i];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( request.complete )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;requests.splice( i, 1 );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;addImage( (request.content as LoaderInfo).content as Bitmap );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;else
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;addRequestHandlers( request );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    }&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; 
    
    &nbsp_place_holder;
    
    protected function addRequestHandlers( request:ContentRequest ):void
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;request.addEventListener( Event.COMPLETE, handleRequestComplete );
    
    }
    
    protected function removeRequestHandlers( request:ContentRequest ):void
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;request.removeEventListener( Event.COMPLETE, handleRequestComplete );
    
    }
    
    &nbsp_place_holder;
    
    protected function handleRequestComplete( evt:Event ):void
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var request:ContentRequest = ( evt.target as ContentRequest );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var index:int = requests.indexOf( request );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;requests.splice( index, 1 );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removeRequestHandlers( request );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var info:LoaderInfo = request.content as LoaderInfo;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;addImage( info.content as Bitmap );
    
    }
    
    &nbsp_place_holder;
    
    protected function addImage( source:Bitmap ):void
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var img:BitmapImage = new BitmapImage();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;img.width = source.width;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;img.height = source.height;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;img.source = source;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// imageHolder is just some container on the display list.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;imageHolder.addElement( img );
    
    }

### The Good?

Clean implementation. Remember that there is a _contentLoader_ property on **s:Image** and **BitmapImage** now. You can use **ContentLoader** if it suits your needs, but you can also roll your own implementation of **IContentLoader**! I like.

### The Bad?

_Not necessarily bad implementations – we can certainly extend ContentLoader and make any modifications – these are more of things to consider when you are using it_:

There is no _add_() and _run_() on the API, or at least an **autostart** argument to _load_(). Invoking _load_() immediately starts loading. I may want to build a queue then kick it off. Plus it kind of kills the prioritize, because say your first two calls are #1) without priority association #2) with priority association. The first one is already in the loading process, so #2 does not take priority.

Even with prioritizing, do not rely on the order in which you call _load_() to be the order in which you will receive complete on the requests. This is mainly due to varying load times, priority, and cacheing. So if you are using **ContentLoader** as a queue loader, maintain the order outside of the **ContentLoader** and as requests come in as complete, fill that order accordingly. In essence, **ContentLoader** should be thought of – in my opinion – more of a cache of requests, rather than a queue loader per se. The _enableQueue_ property does not pertain to “order in, order out” but rather “wait your turn”. The above example utilizes the priority API of **ContentLoader** to just show an example. If you run that a couple times, you will see what i mean about the order of the queue and priority being not what you would expect.

…

Now what caught my eye as I was checking out **ContentCache** is that is used linked lists, and more over that **LinkedList** was now available in the **SDK**! I’ll be it, in the **mx.utils** package (_why_?!) but still.

## 3. LinkedList

If you are unfamiliar with the concept of [linked lists](http://en.wikipedia.org/wiki/Linked_list), they are – in real simple terms – a great way to traverse a set of data using a node structure; unlike an array that stores data accessible from element index, a linked list really is more of an access point to nodes that have the knowledge of the next node and – depending on the type of linked list – at times, the previous node. 

In the case of the **LinkedList** from the [Flex SDK](http://opensource.adobe.com/wiki/display/flexsdk/Download+Flex+4.5) – which is a doubly linked list – each item in the list points to the previous and next item if existant. So you can imagine, if you want to traverse the list from the first element to the last, you just point the next node from the current node. Not only does each node hold a reference to the next and previous node, but also the data which you are storing. So basically when you add data to a linked list, you are requesting the data be wrapped in a node and hold reference to the previous and next node depending on where you insert it.

There have been some great implementations out there – such as ones found in [polygonal’s data structures](http://lab.polygonal.de/as3ds/) – and i have built a couple in my day for clients with varying functionality based on requirements. 

I should say that it is a great exercise to create your own linked list and I recommend that you should do so. The one included in the **SDK** is good, but in my opinion very limited (or maybe i should say “lightweight”) and its implementation is a little different than how I would have handled. But, implementation aside, there is a **LinkedList** in the **SDK** now. It’s bare bones. No iterator, no traversal **API** on the list itself, and you traverse by accessing the nodes directly through the list.

### Usage:
    
    var list:LinkedList = new LinkedList();
    
    list.push( "foo" );
    
    list.push( "bar" );
    
    list.push( "baz" );
    
    &nbsp_place_holder;
    
    var node:LinkedListNode = list.head;
    
    while( node.next )
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;trace( "Node value: " + node.value );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;node = node.next;
    
    }
    
    &nbsp_place_holder;
    
    // <<outputs>>
    
    // Node value: foo
    
    // Node value: bar
    
    // Node value: baz

### The Good?

If i need a simple linked list, i dont have to create a new one again… yay!

### The Bad?

_Again, not necessarily bad in implementation but things i may have done differently:_

One thing i would prefer is that you don’t have access the **LinkedListNode** directly. I think that the node wrapper for your data should be hidden or only accessible from the linked list (or iterator). This means that access to the data is provided through another layer of **API** and when you call things like _head_(), _next_(), or _previous_() you would actually be returned the **data** you sent to store – not the **node**. And typically this would be resolved by exposing access to an **iterator** that provides an API to traverse the linked list. So, the linked list has an API on how to store the data (ie. _push_(), _insertAt_(), _remove_(), etc.) and the iterator has the traversal API (ie. _next_(), _previous_(), etc.). But that would just be my way of working with a linked list and I see nothing stopping me from adding that layer myself to this lightweight doubly linked list from the **SDK**.

Is it fast? I’ll leave that to [Jackson Dunstan](http://jacksondunstan.com/articles/548) to find out… I am guessing no – or rather not as fast as it could be if it were part of the player globals like **Array** and **Vector**. And why oh why is it stuck in the **mx** package?!? I don’t mean to complain, but it seems like there is no reason to have **LinkedList** stuck in the **Flex** framework. There’s no binding. Its not even in **MX** collections. Whatever. Maybe it was just a quick implementation to use in request of icon images for speed on **Flex mobile**.

So in any event, I would say it is a great exercise to roll your own linked list so you have it for any **ActionScript**-only AND **Flex** projects. But you can also find some really useful implementations out there.

## Conclusion

Nothing really to conclude. I just found these while digging around and became intrigued as they were fairly common things that i implemented over and over with varying functionality on projects based on requirements and now they are available in the Flex 4.5 SDK. If you have found some that you really like, let me know.

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/), [Flex 4.5](http://custardbelly.com/blog/category/flex-4-5/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – July 15, 2011
  *[July 15, 2011]: 2011-07-15T09:08
