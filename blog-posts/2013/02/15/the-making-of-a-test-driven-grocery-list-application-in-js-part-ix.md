# [The Making of a Test-Driven Grocery List Application in JS: Part IX](http://custardbelly.com/blog/2013/02/15/the-making-of-a-test-driven-grocery-list-application-in-js-part-ix/)

_This is the ninth installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

# Introduction

In the [previous article](http://custardbelly.com/blog/2013/01/22/the-making-of-a-test-driven-grocery-list-application-part-viii/), we pretty much wrapped up all the user-based functionality and ended with a working **Grocery List** application that we could start using. There is one little snag though… no persistance. If you made this gloriously elaborate list that detailed everything you needed at the store, then closed the browser and reopened it, the list was gone! That will not do.

There are many factors and paradigms to consider in choosing the level of persistence when it comes to handling session and user based applications. Without introducing a discussion about authentication, when approaching the integration persistence you have to take into account system-based vs user-based persistence, client-side vs server-side storage, and – nowadays, more commonly – the cross pollination of the two: [occasional-connectivity](http://en.wikipedia.org/wiki/Occasionally_connected_computing). (_not to mention browser support in all this_) We won’t be getting into all of that ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) We’ll be using the `localStorage` of today’s modern browser.

The intent of this article in the series is to implement client-side, browser-based persistence for the **Grocery List** application. It would be nice to store our list remotely so it can be accessed by all browsers on all devices, but I feel it would introduce too many new libraries, software and concepts to this series. I will most likely add it personally after this series is over, and I invite you to as well – keeping in mind to do it using TDD ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) The most I can offer at this point, is to keep the code we will write clean enough to support such future endeavours.

# What Tests to Modify to Get Us There?

Good question. Let’s first think about what actions will prompt an update to the list in storage. Actually, if we look at the feature specs we have created throughout this series and separated out into the `/feature` directory itself, we pretty much have all the defined actions that will trigger an update to the stored list:  
![Spec listing](http://custardbelly.com/blog/images/tdd_js/part_ix_1.png)

All of these features are a result from interacting with the `list-controller`. My first inkling is to add responsibility to the `list-controller` so that, along with the other operations it handles in list management, it communicates with a service layer to update the **Grocery List** in storage. However, I think that would add too much burden on the `list-controller` and, when taking into account that requirements around storage may change, the introduction of such complexity into the `list-controller` may quickly make our tests feel chaotic.

As such, I propose that we should start off with the expectation that the `list-controller` will notify of its underlying collection having been modified, not only upon its change in length, but of the items within the collection, as well. We can then capture those events and forward them on to whichever service implementation we have without having to pass that dependency into the `list-controller` and burdening it with such communication.

## New Expectation for Add Item

To start, let’s add a quick spec to the _Add Item_ feature that defines an expectation from the `list-controller` to notify when an item has been added:

_/test/jasmine/spec/feature/additem.spec.js_
    
    async.it('should dispatch a save-item event', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;var newItem;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(listController).on('save-item', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.item).not.toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(listController).off('save-item');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;newItem = listController.createNewItem();
    
    });

In creating this expectation, we have also begun to define the actual make-up of the event we intend to receive: the event type being `save-item` and the access of the `item` that was saved.

Run it and we are red, as expected:  
![Failing test on add item event response](http://custardbelly.com/blog/images/tdd_js/part_ix_2.png)

Taking what we have defined as our expectation when an item is added, we’ll modify the list-controller to get this passing. First we’ll add a factory method to generate `save-item` events:

_/script/controller/list-controller.js_
    
    function createSaveEvent(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;var event = $.Event('save-item');
    
    &nbsp_place_holder;&nbsp_place_holder;event.item = item;
    
    &nbsp_place_holder;&nbsp_place_holder;return event;
    
    }

Fairly straight-forward and similar to other event factory methods declared previously in this series. Since we are addressing an expectation of event notification on add of item, we know where in the list-controller we can add that dispatch – in response to the addition of an item on the collection:

_/script/controller/list-controller.js_
    
    $itemView.appendTo(listController.$view);
    
    rendererList.addItem(itemController);
    
    $(listController).trigger(createSaveEvent(model));
    
    itemController.state = itemControllerFactory.state.EDITABLE;

Back in business.  
![Passing test on add item event response](http://custardbelly.com/blog/images/tdd_js/part_ix_3.png)

## New Expectation for Remove Item

Let’s quickly just do a similar modification to the `list-controller` with regards to the _Remove Item_ feature. First we’ll append a spec in the _removeitem.spec_ suite with an expectation of being notified on `remove-item`:

_/test/jasmine/spec/feature/removeitem.spec.js_
    
    async.it('should dispatch a remove-item event', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;var removedItem;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(listController).on('remove-item', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.item).not.toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(listController).off('remove-item');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;removedItem = listController.removeItem(groceryItem);
    
    });

Sparing you another image of the specrunner turning red, that will fail with the timeout that we saw before. We’ll fix that up by adding a trigger in the removal of an item from the collection handler in `list-controller`. First with the addition of a factory method for the `remove-item` event:

_/script/controller/list-controller.js_
    
    function createRemoveEvent(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;var event = $.Event('remove-item');
    
    &nbsp_place_holder;&nbsp_place_holder;event.item = item;
    
    &nbsp_place_holder;&nbsp_place_holder;return event;
    
    }

And then with an additional line to the `remove` response on the collection:

_/script/controller/list-controller.js_
    
    case EventKindEnum.REMOVE:
    
    &nbsp_place_holder;&nbsp_place_holder;model = event.items.shift();
    
    &nbsp_place_holder;&nbsp_place_holder;itemController = listController.getRendererFromItem(model),
    
    &nbsp_place_holder;&nbsp_place_holder;$itemController = $(itemController);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;if(itemController) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView = itemController.parentView;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView.remove();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController.dispose();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemController.off('remove');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemController.off('commit');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;rendererList.removeItem(itemController);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(listController).trigger(createRemoveEvent(model));
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    break;

Run the tests, and we are back to passing:  
![Passing on removal event from list-controller](http://custardbelly.com/blog/images/tdd_js/part_ix_4.png)

## New Expectation for Save Item

Sort of repetitive, but we are on a roll… let’s go through the similar process to ensure that a notification for `save-item` is dispatched when the user has modified its name and committed it to the list – the _Save Item_ feature we added in the [last article](http://custardbelly.com/blog/2013/01/22/the-making-of-a-test-driven-grocery-list-application-part-viii/).

_/test/jasmine/spec/feature/saveitem.spec.js_
    
    async.it('should dispatch a save-item event', function(done) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(listController).on('save-item', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.item).toEqual(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(listController).off('save-item');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.name = itemName;
    
    &nbsp_place_holder;&nbsp_place_holder;itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    
    });

That’ll put us in the red with the same old timeout issue. Getting back to green, we’ll trigger the `save-item` event upon committal of the item to the list, which if you remember – and is described in the test – is in response to the `list-item-controller` notifying of change to the item model:

_/test/jasmine/spec/feature/list-controller.js_
    
    $itemController.on('commit', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;if(!isValidValue(model.name)) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.removeItem(model);
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;else {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(listController).trigger(createSaveEvent(model));
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    });

Back to green!  
![Passing on commital of item form list-item-controller](http://custardbelly.com/blog/images/tdd_js/part_ix_5.png)

The amount of those little dots just keeps growing. Makes you feel all warm inside. Cherish that, ’cause it will go away…

### Hold Up

Just stepping back, it may seem a little odd that we are calling `save-item` when we add and commit the item to the list; after all they are the same item, we do we need to notify on save multiple times? The reason being is that upon any modification to an item – including its existence – the store needs to be modified. We haven’t gotten into the service layer for storage yet, but it will be abstracted out that a response from save-item will be internally handled as whether to append the item (from add) or to update an item already existant (from commit). Until we get to that service layer implementation for `localStorage`, we’ll go about setting expectations of `save-item` notification on modification to an item.

Which actually brings up a good point… what about marking off an item? We will need to notify on change of an item being marked off, as well.

## New Expectation for Mark-Off Item

We tackled the _Mark-Off Item_ feature a [while back](http://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii/) in this series. Just a quick refresher on the story:

_// story_  
—  
**Story**: Item is marked off on grocery list

**In order to** remember what items have already made it to the cart  
**As a** grocery shopper  
**I want to** mark an item as being attained on the grocery list.  
—

We implemented the feature, and upon user press of the item while in non-edit mode, it toggles its `marked` property on the model and updates the UI to add or remove a <del>strikethrough</del> on the label.

We’ve got a spec suite for the _Mark-Off Item_ feature already, so we’ll append an expectation for `save-item` to it just as we have done with the other feature specs in this article:

_/test/jasmine/spec/feature/markitem.spec.js_
    
    async.it('should dispatch a save-item event', function(done) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var timeout = setTimeout(function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;clearTimeout(timeout);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(listController).off('save-item');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}, jasmine.DEFAULT_TIMEOUT_INTERNAL);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(listController).on('save-item', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(event.item).toBe(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(listController).off('save-item');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.marked = true;
    
    });

… and that will bring us back to failing.  
The `timeout` placed in there is just to ensure that listener(s) to the `save-item` event are removed regardless of the async test timing out.

The resolution to the issue is a trickier one than those of the previous in this article, however. Currently the `list-item-controller` is the only component that actually concerned with this change in marked status. It is not concerned with notifying any other party of the change to its model. The model does, however, notify of any property changes. I see two ways in which we can get back to passing:

  1. Assign a handler for `property-change` on model when it is first created and returned from `listController.createNewItem()`
  2. Dispatch a `commit` event from `list-item-controller` on change to `marked` property on the underlying model

While both options will most likely get us where we need to be, the former adds additional management to the `list-controller`; its already listening in on `commit` from its `list-item-controller` instance, so modifying the `list-item-controller` to notify of change to the `marked` property seems to be the path of least resistance.

We had previously set up the `commit` notification on response from leaving the `EDITABLE` state of the `list-item-controller`:

_/script/controller/list-item-controller.js_
    
    // append state-based item.
    
    if(event.newState === stateEnum.UNEDITABLE) {
    
    &nbsp_place_holder;&nbsp_place_holder;controller.parentView.append(controller.$uneditableView);
    
    &nbsp_place_holder;&nbsp_place_holder;controller.save();
    
    }

That implementation got us to passing previously in which we described the expectation of a user committing an item to the list with a valid name (un-empty string). Our issue at hand is to also invoke the `save()` method on `list-item-controller` when the `marked` property is modified. In thinking about it now, while the committal of an item is tied to the change of state, it runs a validation on the `name` property to ensure that the item can be added/kept in the collection – so, in actuality `commit` can be tied to property updates to the item model.

As such, let’s remove line `48` from the above snippet and insert the invocation of `save()` to the handler in `list-item-controller` for `property-change` on the model:

_/script/controller/list-item-controller.js_
    
    $(this.model).on('property-change', (function(controller) {
    
    &nbsp_place_holder;&nbsp_place_holder;return function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;handlePropertyChange.call(null, controller, event);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;controller.save();
    
    &nbsp_place_holder;&nbsp_place_holder;};
    
    }(this)));

Run the specrunner again…  
![We broke it](http://custardbelly.com/blog/images/tdd_js/part_ix_5_fail.png)

… and we broke it ![:(](http://custardbelly.com/blog/wp-includes/images/smilies/icon_sad.gif)

The reason for those X’s is due to the logic we have held in `list-controller` on save of an item: it checks it’s `name` property and removes it from the list if considered an invalid value – which an empty string is.

I sense some modification to such logic in the future, but for now we can get the tests back to passing by providing a `name` property value to the created item in our mark-item spec:

/tests/jasmine/spec/feature/markitem.spec.js
    
    beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;item = listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;item.name = 'apples';
    
    });

![Passing on model property update](http://custardbelly.com/blog/images/tdd_js/part_ix_6.png)

We’re green!

Tagged **0.1.13**: [https://github.com/bustardcelly/grocery-ls/tree/0.1.13](https://github.com/bustardcelly/grocery-ls/tree/0.1.13)

### Settle Down

We have verified our expectations of `save-item` and `remove-item` events being dispatched from `list-controller` – new and model updates issuing the former, removal issuing the later. The work we have done was to separate concerns and not burden the `list-controller` itself with service communication for persisting the **Grocery List** items across browser sessions, but we have yet to address the actual service layer implementation that will take all these notifications.

## Storage Service

The `storage-service` will provide a service layer for communication with storage – whether that be remote or local. It will serve as a facade to an existing storage of grocery list items persisted somewhere other than the current application session. For the purposes of this article, that persistence layer is going to be the `localStorage` of the browser.

While fleshing out the storage service and its API, we’ll _loosely_ use the technique of [‘TDD as if you meant it’](http://coderetreat.org/facilitating/activities/tdd-as-if-you-meant-it). I say _loosely_ in part because to fully do it and explain each step would be a lot of noise for this article; the main practice point to take away – and I hope I express – is that the component you are testing is actually being built while you make the expectations for it pass.

### Tests

To start, we’ll create a bare-bones module for our service layer:

_/script/service/storage-service_
    
    define(['jquery'], function($) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var store = {};
    
    &nbsp_place_holder;&nbsp_place_holder;return store;
    
    &nbsp_place_holder;
    
    });

And let’s create the beginnings of our test:

_/test/jasmine/spec/storage-service.spec.js_
    
    define(['jquery', 'script/service/storage-service', 'script/model/grocery-ls-item'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, store, modelFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('Grocery List storage-service', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;describe('getItems()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should return of type array', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(false).toEqual(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should return array of grocery-ls-item types', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(false).toEqual(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

In the test we have set up some tests for the `getItems()` method for the service. Prior to any implementation, it should be known that communication with the `storage-service` will be considered asynchronous – meaning all operations will return a [jQuery Deferred](http://api.jquery.com/category/deferred-object/). This will abstract out the storage proxy that will be employed by the `storage-service` and will respond in an asynchronous manner regardless of whether the store is immediately accessible – as in the case of `localStorage` – or remote.

Truthfully, in practice, I should only do one tests at a time, but we are testing the expectations for access of the same item listing; to save you from reading the ramblings of adding another test, I declared them both at the start.

Let’s stub out the API and start testing and building the `storage-service`:

_/test/jasmine/spec/storage-service.spec.js_
    
    describe('getItems()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var items,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemOne = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.beforeEach( function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getStub = sinon.stub().returns(deferred);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve([itemOne, itemTwo]);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems = getStub;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then(function(list) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;items = list;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;//
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should return of type array', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(Array.isArray(items)).toEqual(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.length).toEqual(2);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should return array of grocery-ls-item types', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items[0]).toBe(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items[1]).toBe(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

In the `beforeEach()`, we’re using anonymous stubs from [SinonJS](http://sinonjs.org/), which allow us to stub out methods that may not necessarily already exist on an object. I have used it previously in this series, but we’ll be using it pretty much exclusively while we stub out the API for the `storage-service`.

Staying true to our idea that the service will provide an asynchronous communication layer, `getItems()` returns a deferred which has resolved to a listing of two `grocery-ls-item` instances in our tests.

Sometimes when working with a single feature, I like to isolate it out from my tests for a bit. Here is what the specrunner reports with running just **storage-service.spec**:  
![Passing on succss of getItems() in service](http://custardbelly.com/blog/images/tdd_js/part_ix_7.png)

We could move that implementation to `storage-service` module now, but we are sort of in a [chicken-or-the-egg](http://en.wikipedia.org/wiki/Chicken_or_the_egg) scenario. We’ve canned the resolved `grocery-ls-item` list in the test, but how does the list get filled up in an actual scenario for `storage-service`? It’s an excellent question, and something I often puzzle myself with. I mean, we’ll need a `saveItem()` method no doubt in order to add items to the store. But shouldn’t that method now be stubbed out in a new test? And how do I test that `saveItem()` works without `getItems()` being already tested and verified? I could go in circles…

Let’s just stub out an `saveItem()` method on `storage-service` and, afterward, set expectations in another spec suite:

_/test/jasmine/spec/storage-service.spec.js_
    
    async.beforeEach( function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;var call = 0,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;tempList = [],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred = $.Deferred(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getStub = sinon.stub().returns(deferred),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;saveStub = sinon.stub().callsArgOn(0, store),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;appendItem = function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;tempList.push((call++%2 === 0) ? itemOne : itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;store.saveItem = saveStub;
    
    &nbsp_place_holder;&nbsp_place_holder;store.getItems = getStub;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;store.saveItem(appendItem);
    
    &nbsp_place_holder;&nbsp_place_holder;store.saveItem(appendItem);
    
    &nbsp_place_holder;&nbsp_place_holder;store.getItems().then(function(list) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;items = list;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;deferred.resolve(tempList);
    
    });

With these modifications, we have assigned an anonymous stub – `saveStub` – as the `saveItem` method on the `store` and specified that the function-local `appendItem` method should be invoked, appending items to the list prior to each of our tests. 

A little more work in setup and slightly unrealistic in telling of the arguments to be given to `saveItem()`, but it kept us on green without having to hard code the result; it’s a litte truer to life than the previous setup, and still passes:

![Passing on succss of getItems() in service](http://custardbelly.com/blog/images/tdd_js/part_ix_7.png)

### Implementation

Alright, so I think we should move this out to `storage-service` now and trash the stubbing in the test – we’ve got our expectations:

_/script/service/storage-service.js_
    
    define(['jquery'], function($) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemCache = [],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;saveItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache[itemCache.length] = item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred.resolve(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItems: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;return store;
    
    &nbsp_place_holder;
    
    });

_/test/jasmine/spec/storage-service.spec.js_
    
    describe('getItems()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var items,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemOne = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.beforeEach( function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then(function(value) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;items = value;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;//
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should return of type array', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(Array.isArray(items)).toEqual(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.length).toEqual(2);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;it('should return array of grocery-ls-item types', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items[0]).toBe(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items[1]).toBe(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

Run that, and we are still green!  
![Passing on succss of getItems() in service](http://custardbelly.com/blog/images/tdd_js/part_ix_7.png)

### Tests

Now that we can verify that `saveItem()` is working enough for our `getItem` spec, let’s properly set the expectations for `saveItem`, as well, in our tests:

_/test/jasmine/spec/storage-service.spec.js_
    
    describe('saveItem()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemOne = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;//
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should be grow the length of items', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.length).toEqual(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

Simple enough. Back to the specrunner:  
![Failing on saveItem of storage-service](http://custardbelly.com/blog/images/tdd_js/part_ix_8.png)

Oh noes! Our expectation is that the length of items is only 1. We have only specified one addition of an item in the setup… where did the length of 5 come from!? Put down the abacus – there are better things to throw. But before that, I have an explanation: we haven’t been cleaning up. We have let `afterEach()` just quietly be invoked without a job to do.

To do just enough in getting our tests pass, we can update the `afterEach()` declarations in each spec suite to the following:
    
    async.afterEach( function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;store.getItems().then(function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;items.length = 0;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    });

That will get us back to passing:  
![Passing on saveItem spec.](http://custardbelly.com/blog/images/tdd_js/part_ix_9.png)

I am not particularly fond of that solution, however. Mainly because I think it conveys a usage of the API on `storage-service` that I would not condone: directly mutating the underlying list of `storage-service` from another party. 

I’m not gonna get crazy with the lock-down and privacy of properties and start introducing the latest-and-greatest framework that tries to tout that they really are just a library all in the attempt to stop someone from directly accessing the underlying array of items on `storage-service`. If some developers gonna go crazy and do so, hopefully we can find it in more tests later or they can look at our tests as a guideline of how to do what they want. 

As such, I think we should add a method to `storage-service` that simply allows for emptying the list. First the expectation:

_/test/jasmine/spec/storage-service.spec.js_
    
    describe('empty()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemOne = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should be appended to the list of items', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.empty().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.length).toEqual(0);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

![Failing on empty()](http://custardbelly.com/blog/images/tdd_js/part_ix_10.png)

_/script/service/storage-service.js_
    
    define(['jquery'], function($) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemCache = [],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;saveItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache[itemCache.length] = item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred.resolve(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItems: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;empty: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache.length = 0;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;return store;
    
    });

![Passing on empty()](http://custardbelly.com/blog/images/tdd_js/part_ix_11.png)

Alright! We are passing expectations on three parts of the API for `storage-service`. Now let’s think of what else we need… I think only a `removeItem()` method will suffice. In working as we have previously in this article – stubbing out methods to be added to the `storage-service` implementation – we can add a spec suite for `removeItem()` such as the following:

_/test/jasmine/spec/storage-service.spec.js_
    
    describe('removeItem()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var items,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemOne = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred = $.Deferred(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removeItemFromList = function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(items.splice(0, 1));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.beforeEach( function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var removeItemStub = sinon.stub().returns(deferred).callsArgOn(0, store);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.removeItem = removeItemStub;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(value) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;items = value;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should shorten length of the list', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.removeItem(removeItemFromList).then( function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.length).toEqual(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

![Passing on initial removeItem()](http://custardbelly.com/blog/images/tdd_js/part_ix_12.png)

I think there are more expectations to assert for the `removeItem()` spec suite, but for now we are passing and we’ll move the implementation over to `storage-service`:

_/script/service/storage-service.js_
    
    define(['jquery'], function($) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemCache = [],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;saveItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache[itemCache.length] = item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred.resolve(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removeItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemIndex = itemCache.indexOf(item),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removedItem;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(itemIndex > -1) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache.splice(itemIndex, 1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removedItem = item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred.resolve(removedItem);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItems: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;empty: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache.length = 0;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;return store;
    
    &nbsp_place_holder;
    
    });

Now, we’ll update the spec suite for `removeItem()` and add a few more expectations to ensure the item removal process is correct:

_/test/jasmine/spec/storage-service.spec.js_
    
    describe('removeItem()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemOne = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemOne.name = 'one';
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should shorten length of the list', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.removeItem(itemOne).then( function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.length).toEqual(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should remove item specified from the list', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.removeItem(itemOne).then( function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.indexOf(itemOne)).toEqual(-1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should return the item removed if found', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.removeItem(itemOne).then( function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(item).toEqual(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should return undefined if item not found', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.removeItem(modelFactory.create()).then( function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(item).toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

… and we’re still in business!  
![Complete and passing removeItem specs](http://custardbelly.com/blog/images/tdd_js/part_ix_13.png)

### Revisiting saveItem()

When we setup the `saveItem` stub for our `getItem()` spec suite, we really only focused on getting the expectations to pass. To get back to green – at the time – we were only concerned with appending items to the list. I think this needs to be looked at again.

If we remember back to the notifications we set up for the `list-controller`, it will dispatch a `save-item` event upon the existence of a new item, as well as the modification to an existing item. So we will pass that item through the `storage-service` using `saveItem()` but we don’t want to continually append items that are previously stored to the list – if so, we’d be buying a lot of <del>spinich</del> <del>spinnash</del> spinach.

Normally I wouldn’t cut corners: a feature spec should be written up for what I have described here prior to modifying the tests. To save you some scrolling, however, I decided to not include walking through one and letting the expectations that we define in the following speak for the specification.

_/test/jasmine/spec/storage-service.spec.js_
    
    describe('saveItem()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemOne = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should grow the length of items on new item', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.length).toEqual(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should not grow the length of items on pre-existing item', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemOne.name = 'oranges';
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne).then( function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.length).toEqual(1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

We modified the description of the original expectation to state that the items list should only grow on new existence and added a new expectation that previously stored items do not get appended to the stored list:

![Failing update to saveItem() specs.](http://custardbelly.com/blog/images/tdd_js/part_ix_14.png)

As expected ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) Let’s update `saveItem()` on the `storage-service` to account for this:

_/script/service/storage-service.js_
    
    saveItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;index = itemCache.indexOf(item);
    
    &nbsp_place_holder;&nbsp_place_holder;if(index === -1) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache[itemCache.length] = item;
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;return deferred.resolve(item);
    
    }

![Passing on new expectation for saveItem()](http://custardbelly.com/blog/images/tdd_js/part_ix_15.png)

Not leaving any to chance, let’s add a couple more expectations as to how items are placed and how they remain in their places:

_/test/jasmine/spec/storage-service.spec.js_
    
    describe('saveItem() multiples', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemOne = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemTwo = modelFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should append new items to the end of the list', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items[items.length-1]).toBe(itemTwo);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;async.it('should update existing item at position', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemOne.name = 'oranges';
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.saveItem(itemOne).then( function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store.getItems().then( function(items) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(items.indexOf(itemOne)).toEqual(0);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

I had begun to add these expectations for multiple items in the list to the `saveItem()` spec suite, but I saw a similar setup for them both that differed from the origin setup for the `saveItem()` suite. As such, I moved these expectations to their own spec suite and particular setup.

Without any new modification to `storage-service` implementation, run that and we are still green!  
![Passing with new expectations for saveItem()](http://custardbelly.com/blog/images/tdd_js/part_ix_16.png)

Tagged **0.1.14**: [https://github.com/bustardcelly/grocery-ls/tree/0.1.14](https://github.com/bustardcelly/grocery-ls/tree/0.1.14)

## This Is All Great But We Still Haven’t Done Anything

In other words, what this subsection header is trying to say, the `storage-service` – even after we hook up communication to it from `list-controller` events – will do _nothing_ but keep a session-cache of items: **there still is no persistence across sessions**.

Seeing as this is the case, let’s start integrating communication with `localStorage` into our `storage-service`. I am not going to modify the tests in order to verify the utilization of `localStorage` in relation to the operations available on `storage-service` – I am simply going to modify the `storage-service` and posible change expectations. The reason being that I do not really care about whether the storage-service relies on `localStorage` or a remote resource to read and write items to storage; I am only concerned with communication to `storage-service` being supported. 

In truth, if this were a real world application and had to support occasional connectivity, i’d have two service modules: local-storage-service and remove-storage-service. They would both support the same API and there would be a service layer facade that would manage the ‘live’ instance and sync of both. That is a little too much for this series, so we’ll stick with a proxy to `localStorage` without modifying our tests to assume that the `storage-service` requires communication with it.

### storage-service modification

To begin with, a `String` value is used as a key to read and write to an object held on [localStorage](https://developer.mozilla.org/en-US/docs/DOM/Storage). The API of `localStorage` is fairly simple and we’ll only be concerned with `getItem()` and `setItem()` to read and write to the store, respectively. We’ll use a key that we hope is unique to our application and won’t overwrite any object stored previously by another and use that key to access the stored grocery list items:

_/script/service/storage-service.js_
    
    define(['jquery', 'script/model/grocery-ls-item'], function($, modelFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemCache,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;groceryListKey = 'com.custardbelly.grocerylist',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;parseToCollection = function(json) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var i,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;length,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;list = (json && typeof json === 'string') ? JSON.parse(json) : [];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;length = list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;for(i = 0; i < length; i++) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;list[i] = $.extend(modelFactory.create(), list[i]);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return list;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;saveItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred.resolve(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removeItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemIndex = itemCache.indexOf(item),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removedItem;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(itemIndex > -1) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache.splice(itemIndex, 1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removedItem = item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred.resolve(removedItem);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItems: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(itemCache === undefined) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;try {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache = parseToCollection(window.localStorage.getItem(groceryListKey));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;catch(e) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.reject('Could not access items: ' + e.message);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;else {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;empty: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache.length = 0;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;return store;
    
    &nbsp_place_holder;
    
    });

That will light up our tests in pretty red… but that was expected. Actually, if it didn’t make our tests fail horribly, I would have been worried.  
![Failing on sotrage modification.](http://custardbelly.com/blog/images/tdd_js/part_ix_23.png)

There are a couple things going on in this modification to `storage-service` that we should go over, however – the first being `parseToCollection()`:

_/script/service/storage-service.js_
    
    parseToCollection = function(json) {
    
    &nbsp_place_holder;&nbsp_place_holder;var i,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;length,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;list = (json && typeof json === 'string') ? JSON.parse(json) : [];
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;length = list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;for(i = 0; i < length; i++) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;list[i] = $.extend(modelFactory.create(), list[i]);
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;return list;
    
    }

This method is invoked from `getItems()` and is provided the value of the object held in `localStorage` with the key `com.custardbelly.grocerylist`. We’ll be saving our data down in [JSON](http://www.json.org/) format, and as such, `parseCollection()` is responsible for parsing that data back out; as well, if it is the first time accessing the data it will be coming in as undefined so a new list is created. What is particularly important in this parsing is how the objects on the list held in `localStorage` are converted to instances of our `grocery-ls-item` model: we create a new instance using the `modelFactory` and extend it with the object values from the item held on the list. The reason for this is because `grocery-ls-items` are decorated with getters and setters to allow for `property-change` events to be notified. In serializing down to JSON, this object structure is not perserved – it is just a **POJSO**.

The `parseToCollection()` method is invoked from `getItems()`:

_/script/service/storage-service.js_
    
    getItems: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;if(itemCache === undefined) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;try {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemCache = parseToCollection(window.localStorage.getItem(groceryListKey));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;catch(e) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.reject('Could not access items: ' + e.message);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;else {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(itemCache);
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    }

When `getItems()` is first invoked in a session, it will go about trying to access and parse the data held on `localStorage`; any subsequent invocations will immediately return the currently held reference to the store. In essence, during a session of creating and curating a **Grocery List**, we are working with live and current data so there is no need to keep accessing the list of grocery items from local storage every time – we’ll just return the live record.

Speaking of which, a lot of the failing tests I suspect are due to not actually not saving the list down to `localStorage`. Let’s just modify `storage-service` a little to do so and see where that gets us:

_/script/service/storage-service.js_
    
    define(['jquery', 'script/model/grocery-ls-item'], function($, modelFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var itemCache,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;groceryListKey = 'com.custardbelly.grocerylist',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;parseToCollection = function(json) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var i,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;length,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;list = (json && typeof json === 'string') ? JSON.parse(json) : [];
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;length = list.length;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;for(i = 0; i < length; i++) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;list[i] = $.extend(modelFactory.create(), list[i]);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return list;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;serialize = function(key, data) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;window.localStorage.setItem(key, JSON.stringify(data));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;store = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;saveItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$.when(this.getItems()).then(function(cache) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var index = cache.indexOf(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;try {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(index === -1) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;cache[cache.length] = item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;serialize(groceryListKey, cache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;catch(e) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.reject('Could not save item: ' + e.message);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removeItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// implementation removed to reduce noise
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItems: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// implementation removed to reduce noise
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;empty: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// implementation removed to reduce noise
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;return store;
    
    &nbsp_place_holder;
    
    });

`saveItem()` was modified to access the held list using `getItems()`, operate on that list as it had done previously and then try to serialize the list back to storage. Fairly simple. It’s important to note that we don’t access the `itemCache` directly in saveItem(), the reason being that we can’t ensure that `saveItem()` will only be called after a request to `getItems()`. As such, we need to be sure we’re always working with the same data and do so by requesting that cached list from `getItems()` within `saveItem()`.

That gets us closer to green, but we still have some work to do…  
![Closer to green for storage-service modifications.](http://custardbelly.com/blog/images/tdd_js/part_ix_24.png)

Let’s modify `removeItem()` and `empty()` to work with the cached list returned from `getItems()` just as the modification to `saveItems()` has:

_/script/service/storage-service.js_
    
    removeItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;$.when(this.getItems()).then(function(cache) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var itemIndex = cache.indexOf(item),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removedItem;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;try {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(itemIndex > -1) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;cache.splice(itemIndex, 1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;removedItem = item;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;serialize(groceryListKey, cache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(removedItem);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;catch(e) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;cache.splice(itemIndex, 0, removedItem);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.reject('Could not remove item: ' + e.message);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    }

_/script/service/storage-service.js_
    
    empty: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var deferred = $.Deferred();
    
    &nbsp_place_holder;&nbsp_place_holder;$.when(this.getItems()).then(function(cache) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;try {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;cache.length = 0;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;serialize(groceryListKey, cache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.resolve(cache);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;catch(e) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;deferred.reject('Could not empty cache: ' + e.message);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;return deferred;
    
    }

That oughta do. Basically doing the same as we had done with `saveItem()`: accessing the cached list through `getItems()`, then modifying that list and serializing back done to `localStorage`.

Run those tests again, and we are back to green!  
![Passing storage-service tests after modification!](http://custardbelly.com/blog/images/tdd_js/part_ix_25.png)

… at least for our `storage-service`. Let’s turn on all our tests again and see if our previous expectations are met:  
![Passing tests!](http://custardbelly.com/blog/images/tdd_js/part_ix_26.png)

Whoopie!

Tagged **0.1.15**: [https://github.com/bustardcelly/grocery-ls/tree/0.1.15](https://github.com/bustardcelly/grocery-ls/tree/0.1.15)

We’re not done yet: we have still to hook up `list-controller` notification to `storage-service` operations. However, I want to end this article here on a good note ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

## Conclusion

We have yet to reach our goal of incorporating session persistence within our **Grocery List** application – but that is not to say we have gotten nowhere. We implemented our `storage-service` layer for `localStorage` communication and modified the `list-controller` to notify of change events to its collection related to `grocery-ls-item` existence. Not to shabby. 

I know we want to get a finished product out the door, but we’ll get there… just a few more things to tie up in the next article…

Cheers! 

—-

# Link Dump

## Reference

[Test-Driven JavaScript Development by Christian Johansen](http://tddjs.com/)  
[Introducing BDD by Dan North](http://dannorth.net/introducing-bdd/)  
[TDD as if you Meant it by Keith Braithwaite](http://cumulative-hypotheses.org/2011/08/30/tdd-as-if-you-meant-it/)  
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
