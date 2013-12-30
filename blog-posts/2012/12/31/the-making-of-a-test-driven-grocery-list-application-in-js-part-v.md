# [The Making of a Test-Driven Grocery List Application in JS: Part V](http://custardbelly.com/blog/2012/12/31/the-making-of-a-test-driven-grocery-list-application-in-js-part-v/)

_This is the fifth installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

## Introduction

The [previous article](http://custardbelly.com/blog/2012/12/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-iv) was prefaced to be a refactoring effort to remove responsibilities of item management from the _list-controller_ to instances of a _list-item-controller_. We designed the list-item-controller through specs, moved the factory to its own AMD and modified not only the _grocery-ls-item_ model, but how the _list-item-controller_ responded to changes of it.

All important and – in my view – much needed changes. However, we fell short on our goal. Sure, the tests still passed, but we modified nothing within the _list-controller_ to reflect this transfer of responsibility. Part of the reason for this is my attempt at not overloading each article in this series with information. The other part is that I wanted a little time to stew over how I actually saw the revision of _list-controller_.

We still want to keep our feature specs of _Add Item_ and _Mark Item_ (and we have a few more features still to address), but I begin to question if it is really necessary to expose that functionality on the API of the _list-controller_. I am starting to see that those features are really part of a collection of _grocery-ls-item_ models, and the controllers are just responders to changes on the collection and models themselves – the basis of MVC design.

Just as we implemented _list-item-controller_ in the previous article with a design to respond to changes on a provided _grocery-ls-item_ model and update its state accordingly, I propose so should we refactor the _list-controller_ to respond to changes on a collection of _grocery-ls-item_ models.

## Collection

A generic collection is basically an object that provides a higher-level API to interact with an array of items. The API can provide a more readable way of adding and removing items on an underlying [Array](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array) instance instead of using methods like _push_ or _splice_ – which are base level and don’t use a nomenclature that is best suited for the action taken – but more importantly, the API provides a facade to operations on an array of items from which it can internally have stricter rules over such actions. 

There are various libraries and frameworks out there that support collections, and even different type of collections – ie, sets, linked lists, etc. As has been mentioned in previous posts, I am trying not to introduce new libraries into this series as it may add unnecessary noise to the task at hand. This also allows for us to keep the _Collection_ implementation lean and customizable for the **Grocery List** application; we’re also going to support event notification from the collection, which is not inherent in the JavaScript [Array](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array) object.

### Tests

We will create the design of a _Collection_ object piecemeal as we write the specs for it. To start, we know that it is to be a wrapper around an Array source:

_/test/jasmine/spec/collection.spec.js_
    
    define( ['jquery'], function($) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var collectionImpl = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemLength: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collectionFactory = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;create: function(source) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var instance = Object.create(collectionImpl, {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"list": {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;value: Array.isArray(source) ? source : [],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;writable: true,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;enumerable: true
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return instance;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('Collection', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;describe('collection factory instance creation', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should create unique instances of collection from create()', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var collectionOne = collectionFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collectionTwo = collectionFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collectionOne).not.toBe(collectionTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should create an empty collection without source array provided', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var collection = collectionFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection).not.toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(0);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should create a collection from source array provided', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var items = ['apples', 'oranges'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection = collectionFactory.create(items);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(2);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

We have defined two specs that involve testing the wrapped Array source for a collection. Upon creation, the array should be empty if no source array supplied or filled with items if source provided. Pretty straight forward.  
Again, we are only concerned with the latest-and-greatest browsers, so you may notice the use of [Array.isArray](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray) when the _list_ property is defined within the check the _source_ argument on the _collectionFactory.create()_ call.

#### aside

We could get into a lengthy discussion about the design of _collectionImpl_, and in particular that the _list_ property is publicly accessible – i mean, after all, are we not defeating the point of providing an API to manipulate the list if some developer could just come along and access it directly? A valid point, and one I struggle with often. We could – and I would recommend, at times – using the functional inheritance pattern to ‘privately’ hold the underlying list within the collection. For example:
    
    var collectionImpl = (function(source) {
    
    &nbsp_place_holder;&nbsp_place_holder;var list = source;
    
    &nbsp_place_holder;&nbsp_place_holder;return {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemLength: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;};
    
    });
    
    var instance = collectionImpl([]);

That would ‘_conveniently_‘ make the underlying array ‘private’, but there are an arguable list of pros and cons to this approach – the biggest con is the creation of a new object with new functions and new properties each call, rather then a shared inheritance. In essence, each new instance of collection created using this pattern could then modify, add and/or remove methods so that the API is not the same across all ‘instances’ of the collection – that’s a big con for me.

For our implementation, let’s just take it with a grain of salt that we don’t expect anyone to maliciously access the source array of the collection and use the API we are defining in our tests ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

#### end aside

Even though in the last spec, we aren’t concerned with the underlying list being strictly equal to the provided source, we should probably check that the list has the correct items and is in the correct order:

_/test/jasmine/spec/collection.spec.js_
    
    var collectionImpl = {
    
    &nbsp_place_holder;&nbsp_place_holder;itemLength: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;getItemAt: function( index ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( index < 0 || (index > this.itemLength() - 1) ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list[index];
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    }

The _getItemAt()_ method first verifies that the supplied index within the range of the wrapped array and returns undefined if not or the item held in the array at the supplied index. We can ensure that method works properly by adding a couple tests to the spec we already have for verifying the source provided on creation:

_/test/jasmine/spec/collection.spec.js_
    
    it('should create a collection from source array', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var itemOne = 'apples',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = 'oranges',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection = collectionFactory.create([itemOne, itemTwo]);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(2);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(collection.getItemAt(0)).toEqual(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(collection.getItemAt(1)).toEqual(itemTwo);
    
    });

Let’s go ahead and add some useful methods that will aid in adding and removing items to and from the collection:

_/test/jasmine/spec/collection.spec.js_
    
    var collectionImpl = {
    
    &nbsp_place_holder;&nbsp_place_holder;itemLength: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;addItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.push(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return item;
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;removeItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var index = this.list.indexOf(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( index > -1 ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.splice(index, 1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;removeAll: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.length = [];
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;getItemAt: function( index ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( index < 0 || (index > this.itemLength() - 1) ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list[index];
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    }

We could add some specs for _addItem()_ to ensure that the list does grow with each item appended to the end:

_/test/jasmine/spec/collection.spec.js_
    
    describe('collection item addition', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var collection;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection = collectionFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should append item to list from addItem()', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var item = 'grapes';
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.getItemAt(0)).toEqual(item);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should maintain order during multiple additions', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var itemOne = 'grapes',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = 'grapefruit';
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(2);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.getItemAt(1)).toEqual(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

… and throw in a spec suite for testing the removal API on the _Collection_:

_/test/jasmine/spec/collection.spec.js_
    
    describe('collection item removal', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var collection,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemOne = 'pineapple',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = 'pear';
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection = collectionFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should remove only specified item and report length of 0 from removeItem()', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.removeItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(0);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should remove specified item from proper index', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.removeItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.getItemAt(0)).toEqual(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should retain items in collection if item provided to removeItem() is not found', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.removeItem('watermelon');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(2);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should empty the list on removeAll()', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.removeAll();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(collection.itemLength()).toBe(0);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

With that, we have roughly designed and verified the API for our custom _Collection_ object. Let’s add it to our list of specs to run:

_/test/jasmine/specrunner.html_
    
    require( ['spec/newitem.spec.js', 'spec/markitem.spec.js',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;'spec/item-controller.spec.js', 'spec/grocery-ls-item.spec.js',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;'spec/collection.spec.js'], function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var jasmineEnv = jasmine.getEnv(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;jasmineEnv.execute();
    
    &nbsp_place_holder;
    
    });

Run it and all is green!  
![Passing collection suite](http://custardbelly.com/blog/images/tdd_js/part_v_1.png)

Whoa. Settle down… we’re not done yet ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

#### Collection Events

If we think back to why we even started down this path of creating a Collection object, we’ll remember that its role in the **Grocery List** application is to serve as the model for the _list-controller_. It is the intention to eventually modify the _list-controller_ to not only offload the responsibility of managing the relationship and interaction between individual _grocery-ls-item_ models to their views, but also to respond to changes on the collection of _grocery-ls-item_s accordingly. As such, we will incorporate event notification into our _Collection_ object, from which the _list-controller_ can assign response delegates to changes on the collection.

Using [jQuery Event](http://api.jquery.com/category/Events/?rdfrom=http%3A%2F%2Fdocs.jquery.com%2Fmw%2Findex.php%3Ftitle%3DAPI%2F1.3%2FEvents%26redirect%3Dno) as we have previously in the development of this application throughout this series, we’ll create a factory method that returns an event object based provided arguments. If you are familiar with collections from the [Flex SDK](http://www.adobe.com/devnet/flex/flex-sdk-download.html), you might notice something similar ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) :

_/test/jasmine/spec/collection.spec.js_
    
    function createEvent(kind, items) {
    
    &nbsp_place_holder;&nbsp_place_holder;var event = new $.Event('collection-change');
    
    &nbsp_place_holder;&nbsp_place_holder;event.kind = kind;
    
    &nbsp_place_holder;&nbsp_place_holder;event.items = items;
    
    &nbsp_place_holder;&nbsp_place_holder;return event;
    
    }

Basically, any event dispatched from the collection object will be of the same type, and its operation can be differentiated from the _kind_ property. The items affected upon the associated operation (_kind_) are provided in an array as some operations may involve multiple items.

With the API we have defined for the collection, there are three operations that can modify the the list of items:

  * add
  * remove
  * reset

The methods associated with add and remove are pretty self-explanatory and we will consider _removeAll()_ as a reset on the collection. With this in mind, let’s append a couple tests to our spec suites for these event notifications:

_/test/jasmine/spec/collection.spec.js_
    
    describe('collection item addition', function() {
    
    ...
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async.it('should notify on addition of item', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var item = 'grapes';
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(collection).on('collection-change', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.kind).toBe('add');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.items.length).toBe(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.items[0]).toEqual(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(collection).off('collection-change');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    ...
    
    });
    
    ...
    
    describe('collection item removal', function() {
    
    ...
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should notify on removal of item', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(collection).on('collection-change', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.kind).toBe('remove');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.items.length).toBe(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.items[0]).toEqual(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(collection).off('collection-change');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.removeItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should notify on reset of collection', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(collection).on('collection-change', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.kind).toBe('reset');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.items.length).toBe(0);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(collection).off('collection-change');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.removeAll();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    ...
    
    });

If you were to run the tests now, you would see a couple execute then hang intermittently as it waits for the async tests to timeout… because we haven’t implemented the dispatching of events from the collection yet ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

_/test/jasmine/spec/collection.spec.js_
    
    var collectionImpl = {
    
    &nbsp_place_holder;&nbsp_place_holder;itemLength: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;addItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.push(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(this).trigger(createEvent('add', [item]));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return item;
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;removeItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var index = this.list.indexOf(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( index > -1 ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.splice(index, 1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(this).trigger(createEvent('remove', [item]));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;removeAll: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.length = [];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(this).trigger(createEvent('reset', this.list));
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;getItemAt: function( index ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( index < 0 || (index > this.itemLength() - 1) ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list[index];
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    }

Now, if you were to run the tests, all should be happy.

### Collection Module Implementation

Just as we have done with the _list-item-controller_ from the [previous article](http://custardbelly.com/blog/2012/12/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-iv/), we are going to take the work we had done in implementing the collection object within our tests and move it to an AMD module. This way, if we _ever_ get around to refactoring the _list-controller_, we’ll be able to utilize the collection module:

_/script/collection/collection.js_
    
    define(['jquery'], function($) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;function createEvent(kind, items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var event = $.Event('collection-change');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;event.kind = kind;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;event.items = items;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return event;
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var _collectionEventKind = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;ADD: 'add',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;REMOVE: 'remove',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;RESET: 'reset'
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemLength: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;addItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.push(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(this).trigger(createEvent(_collectionEventKind.ADD, [item]));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removeItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var index = this.getItemIndex(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( index > -1 ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.splice(index, 1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(this).trigger(createEvent(_collectionEventKind.REMOVE, [item]));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removeAll: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.list.length = 0;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(this).trigger(createEvent(_collectionEventKind.RESET, this.list));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItemAt: function(index) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( index < 0 || (index > this.itemLength() - 1) ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list[index];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItemIndex: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.list.indexOf(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;contains: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.getItemIndex(item) != -1;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;return {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collectionEventKind: _collectionEventKind,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;create: function(source) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var instance = Object.create(collection);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;Object.defineProperty(instance, "list", {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;value: Array.isArray(source) ? source : [],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;writable: true,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;enumerable: true
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return instance;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    });

We have basically ripped the collection and factory out from our test implementation and dropped it into its own file, returning the event kind enumeration object and the _create()_ factory method to generate new collections for this AMD module.

To verify that our _Collection_ module works correctly, let’s replace the implementation in the test with this module reference and run our tests again:

_/test/jasmine/spec/collection.spec.js_
    
    define( ['jquery', 'script/collection/collection'], function($, collectionFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('Collection', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

![Passing collection tests on AMD module](http://custardbelly.com/blog/images/tdd_js/part_v_2.png)

Tagged: **0.1.6** [https://github.com/bustardcelly/grocery-ls/tree/0.1.6](https://github.com/bustardcelly/grocery-ls/tree/0.1.6)

## list-controller Refactoring

Passing tests are great! But currently, they are lying to us. Well… not _really_, but we have gone about all these new additions to our application and have yet still to refactor _list-controller_ to utilize them. However, before we just start chopping out and inserting code from _list-controller_, I want to go over the API and specs currently defined and see if they still hold water – meaning we might be able to cut some tests out. We might not. We might even add more. Let’s see…

### newitem.spec

As we designed the [_list-controller_](https://github.com/bustardcelly/grocery-ls/blob/0.1.3/script/controller/list-controller.js) from a [previous article](http://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii), it oversaw the state of list items, list item views, and sort of supported a quasi-state of _‘editability’_. While this provided an API to create a new item, it was forced into exposing an _editableItem_ that was then mutable based on other parts of its API – ie, _editFocusedItem()_ and _saveFocusedItem()_. All well and good to support the feature requirements at the time, but we have now moved the item and item view management – as well as the editable state – to the latest _list-item-controller_ as can be seen in the repo [tagged at 0.1.5](https://github.com/bustardcelly/grocery-ls/blob/0.1.5/script/controller/list-item-controller.js). As such, I feel not only the _list-controller_, itself, should change to reflect these modifications, but also its API.

We are going to stick with our feature request to be able to add a new item to the **Grocery List** application through the _list-controller_, but will revisit how that is done in accordance to the new functionality of both the _list-item-controller_ and _list-controller_; mainly we want to keep in mind that both should be driven by their respective model: _grocery-ls-item_ and _collection_.

Let’s first revisit the specs we defined for new item feature from [the second post](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii/) in this series:

_// spec_  
—  
**Scenario 1:** Item added to list  
**Given** a user requests to add an item to the list  
**And** has provided a name for the item  
**When** she requests to save the item  
**Then** the list has grown by one item  
**And** the list contains the item appended at the end  
—

_// spec_  
—  
**Scenario 2:** Item not added to list  
**Given** the list has a single item  
**And** a user requests to add an item to the list  
**And** has not provided a name for the item  
**When** she requests to save the item  
**Then** the list has the same items as stored previously  
**And** the list does not add an empty-named item  
—

In looking at them now, I feel that the actual _Add Item_ feature is hidden in the **Given**s. A slight oversight now that we have progressed – perhaps one at the time as well, but we were delivering to features using TDD, so I have no qualms with features and implementations revisited and revised as the functionality of the application is fleshed out. In any event, I feel like these feature specs are more for a _Save Item_ story, especially seeing as a User can edit an existing item. We’ll tackle the _Save Item_ specifications for a later post, for now I want to revise the specifications for the _Add Item_ feature.

#### Tests

The original story does not change, but we want to ensure that a _grocery-ls-item_ model is returned on the API to create a new item from _list-controller _. With such a drastic refactor to the functionality of _list-controller_, I tend to do my thinking and designing within the tests and move to implementation – just as I have done previously with other components. Let’s take a look at the change to _newitem.spec.js_ as a whole and then discuss the specs singularly:

_/test/jasmine/spec/feature.newitem.spec.js_
    
    define(['jquery', 'script/controller/list-controller', 'script/controller/list-item-controller',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;'script/collection/collection', 'script/model/grocery-ls-item'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, listController, itemControllerFactory, collectionFactory, modelFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('New item creation from listController.createNewItem()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var newModel,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;newItemController,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listControllerStub,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$listView = $('<ul/>'),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCollection = collectionFactory.create();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var $itemView = $('<li>');
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;newModel = modelFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;newItemController = itemControllerFactory.create($itemView, newModel);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listControllerStub = sinon.stub(listController, 'createNewItem', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.getItemList().addItem(newModel);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView.appendTo($listView);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return newModel;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.getItemList = sinon.stub().returns(itemCollection);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.setView($listView);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should return newly created model', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var newItem = listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// loosely (duck-ly) verifying grocery-ls-item type.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(newItem).toEqual(jasmine.any(Object));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(newItem.hasOwnProperty('name')).toBe(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(newItem.hasOwnProperty('id')).toBe(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(newItem.id).not.toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should add newly created item to collection', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var newItem = listController.createNewItem(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemList = listController.getItemList();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(itemList.itemLength()).not.toBe(0);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(itemList.getItemAt(itemList.itemLength()-1)).toEqual(newItem);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should add new item controller to view', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect($listView.children().length).toBe(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$listView.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;newModel = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;newItemController = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCollection.removeAll();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.createNewItem.restore();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

First off, you may notice that we are pulling in, as dependencies, every component we have basically created up to this point. Then, within the _beforeEach()_ of the spec suite, using [SinonJS](http://sinonjs.org/) we stub out the redesign and addition(s) to the API of _list-controller_; we are redefining the functionality of _createNewItem()_ (which currently exists on _list-controller_) to return a _grocery-ls-item_ instance and stubbing the _getItemList(_) method which will return the underlying collection model.

You may notice that i am using sinon.stub in two different ways:
    
    listControllerStub = sinon.stub(listController, 'createNewItem', function() {
    
    listController.getItemList = sinon.stub().returns(itemCollection);

The former allows for you to redefine the function invoked upon the public method – in this case ‘_createNewItem_‘. In order to properly define a stub in such a manner without being shown errors in executing the tests, the method must already be available on the object you are stubbing. The latter allows you to stub a method that is not currently on the object. As you may notice, the instantiation of the two different stubs are different in their assignment on the object being stubbed. The operations within these stubs shouldn’t be taken as set in stone – they may change once we get to implementation in _list-controller_ – but they setup our expectations that will be verified in the specifications. The first of which ensures the return of a _grocery-ls-item_ through property assertions:

_/test/jasmine/spec/feature/newitem.spec.js_
    
    it('should return newly created model', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var newItem = listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;// loosely (duck-ly) verifying grocery-ls-item type.
    
    &nbsp_place_holder;&nbsp_place_holder;expect(newItem).toEqual(jasmine.any(Object));
    
    &nbsp_place_holder;&nbsp_place_holder;expect(newItem.hasOwnProperty('name')).toBe(true);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(newItem.hasOwnProperty('id')).toBe(true);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(newItem.id).not.toBeUndefined();
    
    });

The second spec tests that the newly created item is added to the collection exposed on list-controller:  
_/test/jasmine/spec/feature/newitem.spec.js_
    
    it('should add newly created item to collection', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var newItem = listController.createNewItem(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemList = listController.getItemList();
    
    &nbsp_place_holder;&nbsp_place_holder;expect(itemList.itemLength()).not.toBe(0);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(itemList.getItemAt(itemList.itemLength()-1)).toEqual(newItem);
    
    });

And the third spec… well, it starts to address some of the expectations a User may have when using the **Grocery List** application, something we really haven’t tested for as of yet – you have to start somewhere, though, right? We are testing that in addition to a new model added to the collection, there is an associated view in the UI (or at least presumably):  
_/test/jasmine/spec/feature/newitem.spec.js_
    
    it('should add new item controller to view', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;expect($listView.children().length).toBe(1);
    
    });

I think we will start to see more of these type of tests as we start fleshing out the features more. 

Actually, I have started taking steps in moving the separation of _integration tests_ from _feature tests_, if you haven’t already noticed the update to the location of _newitem.spec.js_. In my mind, the difference is between what I consider tests of how a component behaves itself (and with others) and test which describe the actual use of the application, respectively.

Run the tests just as you have before with the updates to the feature spec locations:  
_/test/jasmine/specrunner.html_
    
    require( ['spec/feature/additem.spec.js', 'spec/feature/markitem.spec.js',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;'spec/item-controller.spec.js', 'spec/grocery-ls-item.spec.js',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;'spec/collection.spec.js'], function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var jasmineEnv = jasmine.getEnv(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;jasmineEnv.execute();
    
    &nbsp_place_holder;
    
    });

And all is green! ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

Tagged **0.1.7** – [https://github.com/bustardcelly/grocery-ls/tree/0.1.7](https://github.com/bustardcelly/grocery-ls/tree/0.1.7)

### list-controller Revisted

It’s great that the tests still pass, but we have yet to **still** modify _list-controller_. I can’t put it off any longer. If you have put up with the last couple posts and promises to get somewhere, you are very kind. The wait is over! … but it is also just the tip of the iceberg. sorry to be a downer ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

In looking at the API on _list-controller_ we stubbed out from the _beforeEach()_ of the _newitem.spec_ and the expectations of its functionality verified in the specs, we are basically boiling down the responsibilities of the _list-controller_ to:

  * Create a new item
  * Add item views to a provided element
  * Manage and respond to changes on a collection of _grocery-ls-item_

As a start, we can include the new dependencies and refactor the _list-controller_ component to support these requirements:  
_/script/controller/list-controller.js_
    
    define(['jquery', 'script/controller/list-item-controller', 'script/collection/collection', 'script/model/grocery-ls-item'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, itemControllerFactory, collectionFactory, modelFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var collection = collectionFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$view: undefined,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItemList: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return collection;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;createNewItem: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var model = modelFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(model);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return model;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;setView: function(view) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.$view = (view instanceof $) ? view : $(view);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;return listController;
    
    &nbsp_place_holder;
    
    });

Differing from the stub created for _createNewItem()_ in the _newitem.spec_, the _list-controller_ is only concerned with updating the collection model here. This is because the change to the collection will drive updates to the UI and we don’t want to have the UI operations within the _createNewItem()_ method – that will basically create a doubling-up of efforts. It will be the responsibility of this module to observe changes to the collection and update state. That is done by adding an event handler to _collection-change_ and operating accordingly based on event _kind_:

_/script/controller/list-controller.js_
    
    define(['jquery', 'script/controller/list-item-controller', 'script/collection/collection', 'script/model/grocery-ls-item'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, itemControllerFactory, collectionFactory, modelFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var collection = collectionFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$view: undefined,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItemList: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return collection;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;createNewItem: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var model = modelFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(model);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return model;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;setView: function(view) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.$view = (view instanceof $) ? view : $(view);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;(function assignCollectionHandlers($collection) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var EventKindEnum = collectionFactory.collectionEventKind;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$collection.on('collection-change', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;switch( event.kind ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;case EventKindEnum.ADD:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var model = event.items.shift(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView = $('<li>'),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController = itemControllerFactory.create($itemView, model);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView.appendTo(listController.$view);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController.state = itemControllerFactory.state.EDITABLE;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;case EventKindEnum.REMOVE:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;case EventKindEnum.RESET:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;}($(collection)));
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;return listController;
    
    &nbsp_place_holder;
    
    });

We are calling an **[IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)** with the [jQuery](http://jquery.org) wrapped collection object and assigning an event handler to _collection-change_ on the collection. Depending on the kind of _collection-change_ event that has occurred, defined clauses with specified operations are entered – for the purposes of the current task and tests at hand, that is only the _ADD_ event.

In the _EventKindEnum.ADD_ switch..case you will see the UI modification, with the addition of the list item view and the editability state of its associated _list-item-controller_ set to allow the User to edit the new item.

Now, with the implementation of the _Add Item_ feature moved to _list-controller_, we can clean up our _newitem.spec.js_:  
_/test/jasmine/spec/feature/newitem.spec.js_
    
    define(['jquery', 'script/controller/list-controller'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, listController) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('New item creation from listController.createNewItem()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var $listView = $('<ul/>');
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.setView($listView);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should return newly created model', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var newItem = listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// loosely (duck-ly) verifying grocery-ls-item type.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(newItem).toEqual(jasmine.any(Object));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(newItem.hasOwnProperty('name')).toBe(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(newItem.hasOwnProperty('id')).toBe(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(newItem.id).not.toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should add newly created item to collection', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var newItem = listController.createNewItem(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemList = listController.getItemList();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(itemList.itemLength()).not.toBe(0);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(itemList.getItemAt(itemList.itemLength()-1)).toEqual(newItem);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should add new item controller to view', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect($listView.children().length).toBe(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$listView.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

And we’ll modify the main application module to reflect the change to the _list-controller_ now only governing over a list DOM element and not to manage events from the add button on the DOM:

_/script/grocery-ls.js_
    
    (function(window, require) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;require.config({
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;baseUrl: ".",
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;paths: {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"lib": "./lib",
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"script": "./script",
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"jquery": "./lib/jquery-1.8.3.min"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;require( ['jquery', 'script/controller/list-controller', 'script/collection/collection'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, listController, collectionFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.setView($('section.groceries ul'));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$('section.groceries #add-item-button').on('click', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    }(window, requirejs));

Run the tests… and it will fail! Yay!  
![Failing tests on list-controller refactor](http://custardbelly.com/blog/images/tdd_js/part_v_3.png)

_wait, what?!_

Actually, most will pass – including the _newitem.spec_ tests. It is the _markitem.spec_ tests that will fail. We have modified the _list-controller_ to accomodate the changes to the _Add Item_ feature, but have not addressed the _Mark Off Item_ feature in our refactoring.

![Mark-Off Item failure on list-controller refactor](http://custardbelly.com/blog/images/tdd_js/part_v_4.png)

However, run the application and it will be just as usable as it was before – no change will be perceived by the end-user. The only thing that will change is now I have a nagging feeling knowing my tests are failing. Some naysayers may interject here and half-heartedly tell me to get rid of the tests, then. To them I say, ‘_pfffft_‘ ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

I hate to see the tests in such a state, but this post is rather long as it is. Also, I like to joke that sometimes having failing tests to look at first thing in the morning is the best way to pick up from where you left off. I promise we’ll get these to go green in the next article of this series, and invite you to get them to pass if you are for it.

Tagged **0.1.8** – [https://github.com/bustardcelly/grocery-ls/tree/0.1.8](https://github.com/bustardcelly/grocery-ls/tree/0.1.8)

## Conclusion

We finally got around to refactoring the _list-controller_ to relieve it of item model management and state. In the course of doing so, we created a _Collection_ object that will serve as the model for the _list-controller_. 

This post was a lengthy one, and I appreciate you sticking through my yackity-yack. I think we are in fine shape now to approach previously defined and new features, get our tests passing again, and finalize the **Grocery List** application… in as far as first iteration deliverables go ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

‘Til next time…

—

# Link Dump

## Reference

[Test-Driven JavaScript Development by Christian Johansen](http://tddjs.com/)  
[Introducing BDD by Dan North](http://dannorth.net/introducing-bdd/)  
[RequireJS](http://requirejs.org/)  
[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)  
[Jasmine](http://pivotal.github.com/jasmine/)  
[Sinon](http://sinonjs.org/)  
[Jasmine.Async](https://github.com/derickbailey/jasmine.async)

## Post Series

[grocery-ls github repo](https://github.com/bustardcelly/grocery-ls)  
[Part I – Introduction](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i)  
[Part II – Feature: Add Item](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii)  
[Part III – Feature: Mark-Off Item](http://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii)  
[Part IV – Feature: List-Item-Controller](http://custardbelly.com/blog/2012/12/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-iv)  
[Part V – Feature: List-Controller Refactoring](http://custardbelly.com/blog/2012/12/31/the-making-of-a-test-driven-grocery-list-application-in-js-part-v/)  
[Part VI – Back to Passing](http://custardbelly.com/blog/2013/01/08/the-making-of-a-test-driven-grocery-list-application-in-js-part-vi/)  
[Part VII – Remove Item](http://custardbelly.com/blog/2013/01/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-vii/)  
[Part VIII – Bug Fixing](http://custardbelly.com/blog/2013/01/22/the-making-of-a-test-driven-grocery-list-application-part-viii/)  
[Part IX – Persistence](http://custardbelly.com/blog/2013/02/15/the-making-of-a-test-driven-grocery-list-application-in-js-part-ix/)  
[Part X – It Lives!](http://custardbelly.com/blog/2013/03/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-x/)

Posted in [AMD](http://custardbelly.com/blog/category/amd/), [JavaScript](http://custardbelly.com/blog/category/javascript/), [RequireJS](http://custardbelly.com/blog/category/requirejs/), [grocery-ls](http://custardbelly.com/blog/category/grocery-ls/), [jasmine](http://custardbelly.com/blog/category/jasmine/), [unit-testing](http://custardbelly.com/blog/category/unit-testing/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – December 31, 2012
  *[December 31, 2012]: 2012-12-31T16:13
