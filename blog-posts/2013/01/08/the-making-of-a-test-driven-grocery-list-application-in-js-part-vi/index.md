# [The Making of a Test-Driven Grocery List Application in JS: Part VI](http://custardbelly.com/blog/2013/01/08/the-making-of-a-test-driven-grocery-list-application-in-js-part-vi/)

_This is the sixth installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

## Introduction

We left the [previous post](http://custardbelly.com/blog/2012/12/31/the-making-of-a-test-driven-grocery-list-application-in-js-part-v/) with failing tests! 

I don’t necessarily condone leaving a master branch in such a state, so don’t give my name to your managers ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) I, however, have no problem with leaving a feature or developer branch at the end of the day with failing tests – within reason. As long as the errors are from unimplemented behavior and the branch is not being monitored by some CI server feeding reports to your client(s), I see no problem. Sometimes I will write out the tests I plan to resolve the following day at 5:30 just so I can get a refresher the next morning as to the task at hand.

In the article I plan to get your tests all green again by modifying the _Mark Off Item_ tests and possibly add a few new features.

## Mark Off Item Feature

Way back in the [third article in this series](http://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii/), we wrote up a story and some feature specs around the usability of marking off an item already existant in the list of item of the **Grocery List** application. In getting this feature implemented, we added a basic mark-item API to the `list-controller`, which allowed us to pass in a `grocery-ls-item` model to the `list-controller` which would then modify its state. 

In the previous couple posts, we have refactored `list-controller` to not be responsible for item state and to respond to changes on a collection model – this is what led us to failing tests. We still want to keep the _Mark Off Item_ feature, but instead of having specs that tested the mark-item API of the `list-controller`, we’re going to change the specs to verify that the `grocery-ls-item` model that is being modified updates its state and is retained in the collection held by the `list-controller`.

### Tests

When I start creating the tests, I take some time in thinking about the **Given**s. Typically, the **Given**s are what make up the `beforeEach()` setup of a spec suite, but they can also lead to address some design concerns about components involved in getting the tests to pass. Such is the case in modifying our _Mark Off Item_ feature specs.

We are not necessarily going to test the UI changes related to the action of marking off an item from the **Grocery List**. We could, but it is more important to me to test that the `grocery-ls-item` model that holds that state value of being marked is properly retaining that value and accessible from not only the collection, but from the associated `list-item-controller` instance, as well – after all, it is the `list-item-controller` that is responsible for responding to changes to an item being marked-off; i want to ensure that, in the very least, it has the opportunity, not actually what it does with the opportunity. 

That statement may sound foolish, i’ll admit. If it was an expectation that the action of marking off an item was to trigger a reaction that defined another feature specification, then certainly I would write up tests accordingly. But as it stands, it changes a style on the `list-item-controller` view. I am not so concerned with that implementation at the moment – if it becomes a real business issue and it was a requirement to have the text shown with a strike-through, then yes.

Let’s start with the setup and teardown for the _Mark Off Item_ feature specs:

_/test/jasmine/spec/feature/markitem.spec.js_
    
    define(['jquery', 'script/controller/list-controller', 'script/controller/list-item-controller'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, listController, itemControllerFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('Existing item is marked-off', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var item,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getRendererStub;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item = listController.createNewItem();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController = itemControllerFactory.create($('<li/>'), item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getRendererStub = sinon.stub();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getRendererStub.returns(itemController);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.getRendererFromItem = getRendererStub;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getRendererStub = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

In the `beforeEach()`, we’ve stubbed out a new method on `list-controller` that allows us to access the associated `list-item-controller` with a model: `getRendererFromItem()`.

If you remember [from the last article](http://custardbelly.com/blog/2012/12/31/the-making-of-a-test-driven-grocery-list-application-in-js-part-v/), we also did some stubbing of methods before moving to implementation on `list-controller`. We are doing the same here and using the [SinonJS](http://sinonjs.org) `stub` API to stub a method that currently does not exist on `list-controller`. To do so, and not have exceptions thrown in your tests regarding the existence of the method on the object being stubbed, you create an anonymous stub and assign it to the target object:

_/test/jasmine/spec/feature/markitem.spec.js_
    
    getRendererStub = sinon.stub();
    
    getRendererStub.returns(itemController);
    
    listController.getRendererFromItem = getRendererStub;

The stub is sort of a fub, seeing as it is not really accessing the `list-item-controller` created by the `list-controller` in response to change on the collection – but it does provide some basis of design in that `getRendererFromItem()` is expected to return a `list-item-controller` which in turn responds to the provided model. Anyway, once we remove the stub and implement the API on the `list-controller` itself, we’ll certainly have to write more tests for that integration as we are not necessarily concerned in this specification of `getRendererFromItem()` returning the correct `list-item-controller` instance… so you have that to look forward to ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) Right now, we only care about the preservation of state and model existence within the application.

First we’ll test that setting an item as marked is preserved in the model and held on the item controller:  
_/test/jasmine/spec/feature/markitem.spec.js_
    
    it('should denote item as being in possession', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var itemRenderer = listController.getRendererFromItem(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItemSpy = sinon.spy();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;savedItemSpy(itemRenderer.model);
    
    &nbsp_place_holder;&nbsp_place_holder;item.marked = true;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;expect(item.marked).toEqual(true);
    
    &nbsp_place_holder;&nbsp_place_holder;sinon.assert.calledWith(savedItemSpy, sinon.match.hasOwn('marked', true));
    
    });

Then, I want to ensure that marking off an item does not mean that it is removed from the overall collection:  
_/test/jasmine/spec/feature/markitem.spec.js_
    
    it('should retain the item in the grocery list collection', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var itemIndex = listController.getItemList().getItemIndex(item);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.marked = true;
    
    &nbsp_place_holder;&nbsp_place_holder;expect(listController.getItemList().getItemIndex(item)).toEqual(itemIndex);
    
    });

And finally, just to be sure that we can safely toggle the marked off state and it be retained:  
_/test/jasmine/spec/feature/markitem.spec.js_
    
    it('should retain item in renderer listing regardless of marked-off status', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var itemRenderer = listController.getRendererFromItem(item),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemIndex = listController.getItemList().getItemIndex(item);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.marked = true;
    
    &nbsp_place_holder;&nbsp_place_holder;item.marked = false;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;expect(itemRenderer.model.marked).toEqual(false);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(listController.getItemList().getItemIndex(item)).toEqual(itemIndex);
    
    });

Perhaps the last one is out of a little paranoia, but it also describes the behavior of the _Mark Off Item_ feature as being togglable from a User standpoint – meaning, marking off an item is not considered deleting it from the list. Also, a little paranoia sprinkled on some tests can save you from fret when working with the implementation code. 

Speaking of implementation…

### list-controller Implementation

Moving the `getRendererFromItem()` method over to the `list-controller` will involve holding and maintaining a list of `list-item-renderers`. We’ll use the _Collection_ object we created previously for the models and place the job of curation between both collections on the `list-controller`:

_/script/controller/list-controller_
    
    var collection = collectionFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;rendererList = collectionFactory.create(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$view: undefined,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getItemList: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return collection;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;getRendererFromItem: function(item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var i = rendererList.itemLength();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;while( --i > -1 ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(rendererList.getItemAt(i).model === item) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return rendererList.getItemAt(i);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;createNewItem: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var model = modelFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;collection.addItem(model);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return model;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;setView: function(view) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;this.$view = (view instanceof $) ? view : $(view);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};

If an associated `list-item-controller` cannot be found from the provided `grocery-ls-item` model, then undefined is returned. We will ensure this and other expectations in a new integration test for the `list-controller` in a bit, but for now we have a little more work to do in order for the list-controller to behave as described in the _Mark Off Item_ feature specs.

Next step is to have the tests fail by removing the stub for the `getRendererFromItem()` method now on the `list-controller`:  
_/test/jasmine/spec/feature/markitem.spec.js_
    
    define(['jquery', 'script/controller/list-controller'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, listController) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('Existing item is marked-off', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var item;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item = listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should denote item as being in possession', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var itemRenderer = listController.getRendererFromItem(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItemSpy = sinon.spy();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItemSpy(itemRenderer.model);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item.marked = true;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(item.marked).toEqual(true);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;sinon.assert.calledWith(savedItemSpy, sinon.match.hasOwn('marked', true));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should retain the item in the grocery list collection', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var itemIndex = listController.getItemList().getItemIndex(item);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item.marked = true;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(listController.getItemList().getItemIndex(item)).toEqual(itemIndex);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should retain item in renderer listing regardless of marked-off status', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var itemRenderer = listController.getRendererFromItem(item),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemIndex = listController.getItemList().getItemIndex(item);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item.marked = true;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item.marked = false;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(itemRenderer.model.marked).toEqual(false);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(listController.getItemList().getItemIndex(item)).toEqual(itemIndex);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

Run the tests, and we’ll get failures related to the `getRendererFromItem()` method returning undefined with each call:  
![Failing tests on getRendererFromItem invocation](http://custardbelly.com/blog/images/tdd_js/part_vi_1.png)

Good. That sort of assures us that `getRendererFromItem()` works as expected. This little mid-implementation failure won’t save us from writing proper tests for `list-controller`, but it’s a warm feeling for now ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

The reason that `getRendererForItem()` is returning undefined on each call is that we have not modified `list-controller` to add the `list-item-controller` renderer to the underlying `rendererList` collection. Let’s add the maintenance to the _collection-change_ response on the model collection:

_/script/controller/list-controller_
    
    $collection.on('collection-change', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;var model, itemController, $itemView;
    
    &nbsp_place_holder;&nbsp_place_holder;switch( event.kind ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;case EventKindEnum.ADD:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView = $('<li>');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;model = event.items.shift();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController = itemControllerFactory.create($itemView, model);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView.appendTo(listController.$view);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;rendererList.addItem(itemController);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController.state = itemControllerFactory.state.EDITABLE;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;case EventKindEnum.REMOVE:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;case EventKindEnum.RESET:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    });

We’ve moved the variable declarations out of the _switch..case_ for the `ADD` event type; they are hoisted by the interpreter, anyway, but I like a little more clarity. More importantly, we are adding the newly created `list-item-controller` to he `renderList`.

Run the tests and we’ll be back to green!  
![Passing tests on getRendererFromItem implementation](http://custardbelly.com/blog/images/tdd_js/part_vi_2.png)

Hold on! Before you run out the door and down the street singing my praises… you need pants. I don’t know why you are reading this article without pants, but you probably will get a fine. Plus, we really need to add some tests for the `list-controller`.

## list-controller Tests

The _Mark Off Item_ specs we just got to pass are great in describing that feature and the usability, but they don’t necessarily test all the expectations we have of the `list-controller` and its API. Perhaps we should have wrote up the tests for `list-controller` and, specifically, the `getRendererFromItem()` method prior to modifying the _Mark Off Item_ specs and getting them to pass. I would agree with that, but I am also not a stickler… as long as we get some integration tests in for `list-controller`, I won’t hold it against myself ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

There are more tests regarding the `list-controller` API in the repository tagged later in this article, but for now I wanted to create a new spec suite for `list-controller` and test the expectations we had previously described for the `getRendererFromItem()` method:

_/test/jasmine/spec/list-controller.spec.js_
    
    define(['jquery', 'script/controller/list-controller', 'script/model/grocery-ls-item'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, listController, modelFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('Grocery List list-controller', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;describe('getRendererItem()', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should return renderer associated with model', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var itemModel, renderer;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemModel = listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;renderer = listController.getRendererFromItem(itemModel);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(renderer).not.toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(renderer.model).toBe(itemModel);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should return undefined with no associated model', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var itemModel, renderer;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemModel = modelFactory.create();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;renderer = listController.getRendererFromItem(itemModel);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(renderer).toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

We have defined two tests for the `getRendererFromItem()` method on `list-controller` to ensure that it **1)** does return the associated renderer when available and **2)** does return undefined when an associated renderer is not available.

Let’s add that to the specrunner:  
_/test/jasmine/specrunner.html_
    
    require( ['spec/feature/additem.spec.js', 'spec/feature/markitem.spec.js',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;'spec/list-controller.spec.js', 'spec/list-item-controller.spec.js', 'spec/grocery-ls-item.spec.js',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;'spec/collection.spec.js'], function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;var jasmineEnv = jasmine.getEnv(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;jasmineEnv.execute();
    
    &nbsp_place_holder;
    
    });

#### aside

You may be wondering why it seems like I am doubling up on tests; after all, we have verified that the `getRendererFromItem()` method does as expected from within the _Mark Off Item_ specs. This is true. However, I think of this spec suite, _list-controller.spec.js_, as more unit tests in that we are verifying how the component behaves. Within the _Mark Off Item_ specs, I feel it is closer to how the component behaves in the system and reveals more of an expectation of the features of the **Grocery List** application. If I was to do further work in modifying the `list-controller`, I would start with this spec, and if it impacted the _Mark Off Item_ feature, get that passing afterward. Not stuck in my way of thinking on this, but it my current workflow. Let me know if you have any better strategies.

Actually, that brings up a good point. We should revisit the _Add Item_ specs and add a test to ensure that the newly created item returned from `createNewItem()` will return an associated list-item-controller instance from `getRendererFromItem()`…

## Add Item Feature Update

We’ll add a spec to the current suite that verifies that the new created `grocery-ls-item` is properly paired with the `list-item-controller` and that they associated view is the one made available on the **Grocery List** UI:

_/test/jasmine/spec/feature/additem.spec.js_
    
    it('should enable associated item renderer as editable', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var newItem = listController.createNewItem(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemRenderer = listController.getRendererFromItem(newItem);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(itemRenderer).not.toBeUndefined();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(itemRenderer.model).toBe(newItem);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(itemRenderer.state).toEqual(itemControllerFactory.state.EDITABLE);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect($listView.children()[0]).toBe(itemRenderer.parentView.get(0));
    
    });

The last expectation in there utilizes some of the access API from [jQuery](http://custardbelly.com/blog/jquery.org). If you are unfamiliar with it, it is basically testing that the first item in the parent list view is that of the `parentView` managed by the associated `list-item-controller`. If you take a look at the [previous spec](https://github.com/bustardcelly/grocery-ls/blob/0.1.8/test/jasmine/spec/feature/newitem.spec.js), we had already verified that the child list of the list view had been changed to include a new item; now we are ensuring that the new item is the correct one, accessible from `getRendererFromItem()`.

I think that pretty much shores up the proper testing in describing the _Add Item_ and _Mark Off Item_ features. Run the tests and all are green!  
![Passing tests for Add Item and Mark Off Item Features](http://custardbelly.com/blog/images/tdd_js/part_vi_3.png)

Tagged **0.1.9** : [https://github.com/bustardcelly/grocery-ls/tree/0.1.9](https://github.com/bustardcelly/grocery-ls/tree/0.1.9)

## Conclusion

We got the _Mark Off Item_ specs running green again after we had left the application in a failing state from the [last article](http://custardbelly.com/blog/2012/12/31/the-making-of-a-test-driven-grocery-list-application-in-js-part-v/). Hooray! But, we are still only addressing half of the usability features I envision for the **Grocery List** application. Sometimes it is easy to forget that we are still building an application. If you ran it, you would see that it still works as expected, which I think is rather cool; I mean, we have been busying ourselves ensuring that our code will support our understanding of the system, and at the end of the day, it actually does. We have been running the test runner much more than the actual application. That is not to say that we shouldn’t be doing more User testing…

Anyway, in the next article I think we should address a new feature – Removal. Cheers for sticking around!

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

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – January 8, 2013
  *[January 8, 2013]: 2013-01-08T11:31
