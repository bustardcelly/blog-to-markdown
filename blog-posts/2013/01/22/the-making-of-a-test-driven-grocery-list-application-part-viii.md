# [The Making of a Test-Driven Grocery List Application: Part VIII](http://custardbelly.com/blog/2013/01/22/the-making-of-a-test-driven-grocery-list-application-part-viii/)

_This is the eighth installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

# Introduction

In the past several articles we have sort of have been living in the spec runner. We fiddled about making it turn red and green, and – until [the last article](http://custardbelly.com/blog/2013/01/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-vii/) – we never really ran the **Grocery List** application we were building to give it a proper _User Testing_. If you did play around with the actual application we have been busy writing tests for, you may have found a bug. An unexpected result from supplying no grocery item name before saving it to the list:

![Image for bug ticket with empty item.](http://custardbelly.com/blog/images/tdd_js/part_viii_1.png)

As you can see from the screenshot, there is an empty item in the third entry of the list. While I do think the act of walking into a store and picking up nothing is an accomplishment at times, this _Empty Item_ bug is not an intended feature. In this article, I want to squash that bug… but – in keep with the theme of this series – we are going to do it through tests! Calm down. It is hard to read when you jump up and down like that.

# Bug Ticket

Before we begin fixing the bug, let’s get it down in writing what we think the problem is and how we think the intended behavior should be. To start, we don’t want empty items added to the **Grocery List**. We are currently able to add them – and rather easily – so let’s list out the steps that allows us to do so:

_Empty Item Added to List_  
—  
**Steps to Reproduce**

  1. Launch the Grocery List application
  2. Click ‘add item’ button
  3. In focused input field, type the name of a grocery item, ie. ‘apples’ (sans quotes)
  4. Click the Tab button to save to list
  5. Click ‘add item’ button
  6. Leave the focused input field blank
  7. Click the Tab button

**Result**  
Empty item is added to the list

**Expected Result**  
An item without any name value provided is not added to the list

**Additional Notes**  
It is not a requirement to first have a valid item added to the list in order to reproduce the issue. Steps 1-4 are intended to show expected behavior with a non-empty item.  
—

If you are out there reading this and file bug tickets, please, for the love of software, log a ticket with a structure similar to this. Most modern bug tracking systems have fields like this, but you’d be surprised (or maybe not) how tickets come in sometimes. My least favorite is explained bug in the title. I can only imagine that they are the same people who write the whole email in the Subject field.

Alright, so now we know what we are dealing with. We have clear steps to reproduce the issue we think is a bug and have explained the difference between the actual result and the intended/expected result. Let’s tackle it.

# Tests

As the developer of the application, we probably know exactly where this is happening. Our initial response is to go write to the source and resolve this issue. But we’re not going to do that. Don’t give me that look. I know, I know. The less we have to be in bug-fixing-mode, the happier developer we be, but I think if we have a test that supports the validity of this claim then, when we do make changes to the application code and it still passes, we know we have not committed a regression. I think it is a confidence builder in relying on my code to work properly and takes away some stress when refactoring comes into play.

Before we begin, let’s think about where we will add the tests. We could append another spec suite to the _Add Item_ specs – after all, this bug occurs upon the completion of the _Add Item_ feature. But in thinking about how to reproduce the issue, it seems like it may be another feature, or at least could be discovered in a feature we haven’t addressed – _Edit Item_. Essentially, when we get to the 3rd step – _In focused input field, type the name of a grocery item, ie. ‘apples’ (sans quotes)_ – we have already added the item to the list. It has entered an edit mode, from which we need to ensure the validity of the value provided before saving it to the list. 

Now, a true **TDD**‘er probably would stop me right now and tell me I am thinking too much to get this resolved. And, in part, they would be correct in doing so. But it is not my intent to start dreaming up new features during bug fixing. I just want to properly think about where the tests make the most sense. I don’t think they belong as an addendum to the _Add Item_ specs and should live in there own spec suite in a separate file:

_/test/jasmine/spec/feature/saveitem.spec.js_
    
    define(['jquery', 'script/controller/list-controller', 'script/controller/list-item-controller'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, listController, itemControllerFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('Save item to grocery list', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should not save an empty item to the list') {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(true).toEqual(false);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    }

Given the steps provided in the bug ticket, we could easily translate that into the setup for the spec suite:

_/test/jasmine/spec/feature/saveitem.spec.js_
    
    define(['jquery', 'script/controller/list-controller', 'script/controller/list-item-controller'],
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function($, listController, itemControllerFactory) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('Save item to grocery list', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var item,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemName = 'apples',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;invalidName = '',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemRenderer,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;async = new AsyncSpec(this);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item = listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemRenderer = listController.getRendererFromItem(item);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;it('should not save an empty item to the list', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(true).toEqual(false);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;item = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemRenderer = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

In the `beforeEach()` setup, we have progressed the application – or at least a list item – to essentially the 3rd step in the _Steps to Reproduce_: we have added a new item to the list, and internally upon addition of an item in the `list-controller`, it has entered edit-mode for that item. In the variable declarations, we have also defined what we know of as being valid and invalid item entry names: _‘apples’_ and _”_, respectively. 

We should be ready to go in our specs now to define the rest of the steps and expected results:

_/test/jasmine/spec/feature/saveitem.spec.js_
    
    it('should not save an empty item to the list', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var listLength = listController.getItemList().itemLength();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.name = invalidName;
    
    &nbsp_place_holder;&nbsp_place_holder;// save item... ?
    
    &nbsp_place_holder;&nbsp_place_holder;expect(listController.getItemList().itemLength()).toEqual(listLength);
    
    });

Oh, boy. How do we actually save an item? There is no API on the `list-controller` that saves an item. There used to be, but we refactored that out when we handed over item management to the `list-item-controller`. Furthermore, an item is added and kept on the list since its request for creation – the actual reason for the bug, I suppose. I am fine with such functionality internally to the `list-controller` as it stands now and don’t intend to change the item creation. I think an additional event should be dispatched from a `list-item-controller` signifying a request to commit the item to the list after being edited. Let’s finish up this spec under such assumptions, then work our way through the failing test:

_/test/jasmine/spec/feature/saveitem.spec.js_
    
    async.it('should not save an empty item to the list', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;var listLength = listController.getItemList().itemLength();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(itemRenderer).on('commit', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(listController.getItemList().itemLength()).toEqual(listLength-1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.name = invalidName;
    
    &nbsp_place_holder;&nbsp_place_holder;itemRenderer.save();
    
    });

We marked the spec as asynchronous to support events from the `list-item-controller` and placed the expectation within the _‘commit’_ event handler.

Run that, and we’ll be waiting for about 5 seconds until we are told that save() is not a method on the `list-item-controller` instance:

![Failing save item test with timeout](http://custardbelly.com/blog/images/tdd_js/part_viii_2.png)

I have temporarily commented out the other tests in order to remove any noise and focus solely on resolving this bug. This is for local testing and would not commit the spec runner in such a state when committing back to the repo and running latest on a CI server.

To resolve that, let’s open up `list-item-controller` and add that method:

_/script/controller/list-item-controller.js_
    
    listItemController = {
    
    &nbsp_place_holder;&nbsp_place_holder;$editableView: undefined,
    
    &nbsp_place_holder;&nbsp_place_holder;$uneditableView: undefined,
    
    &nbsp_place_holder;&nbsp_place_holder;init: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this;
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;save: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;dispose: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    };

Run that again, and now we are down to just the timeout failure:

![Timeout failure on list-item-controller save](http://custardbelly.com/blog/images/tdd_js/part_viii_3.png)

To resolve that, we’ll first create a new event factory method and invoke it from `save()` to dispatch the _commit_ event, of which we have assigned a handler for in the test:

_/script/controller/list-item-controller.js_
    
    function createSaveEvent(controller) {
    
    &nbsp_place_holder;&nbsp_place_holder;var event = $.Event('commit');
    
    &nbsp_place_holder;&nbsp_place_holder;event.controller = controller;
    
    &nbsp_place_holder;&nbsp_place_holder;return event;
    
    }

and…
    
    save: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;$(this).trigger(createSaveEvent(this));
    
    },

No more timeout!

![Failing expectation on list-item-controller save.](http://custardbelly.com/blog/images/tdd_js/part_viii_4.png)

But still failing. Reason is that the item had not been removed from the collection. In previous tests we have verified its addition to the collection from the `createNewItem()` method on `list-controller`. Now that we are saving the `list-item-controller` with a modified model that has an invalid name, we are expecting such an action to remove the item from the collection – the crux of our _Empty Item_ bug.

Let’s modify the `list-controller` in order to handle the commit event from a `list-item-controller`:

_/script/controller/list-controller.js_
    
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
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(itemController).on('remove', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.removeItem(model);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(itemController).on('commit', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(!isValidValue(model.name)) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.removeItem(model);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;case EventKindEnum.REMOVE:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;model = event.items.shift();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController = listController.getRendererFromItem(model);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(itemController) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView = itemController.parentView;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$itemView.remove();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;itemController.dispose();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(itemController).off('remove');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$(itemController).off('commit');
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;rendererList.removeItem(itemController);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;case EventKindEnum.RESET:
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;break;
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    });

We’ve added another event listener to the `list-item-controller` when it is added to the collection to handle the _commit_ event. Within the handler we check for its validity – which we have predetermined as not being an empty string – and if it does not pass, then we remove it.  
Note: In shipped code I would hold a single reference to a wrapped non-jQuery object and not wrap it multiple times as is shown here when adding and removing event handlers. I left it in this example to not add extra noise to the task at hand.

Run that, and we are back to green!  
![Passing test on commit event form list-item-controller](http://custardbelly.com/blog/images/tdd_js/part_viii_5.png)

## User Test

Let’s run the application and see if the issue is resolved:  
![Non-resolution of bug in live test](http://custardbelly.com/blog/images/tdd_js/part_viii_6.png)  
I think that picture says it all…

The bug is still there because `save()` is not being called on the `list-item-controller`. In our test, we explicitly called it after a change to the model, but in the application itself it is not being invoked upon change to the model. 

But before we start adding calls to `save()` in our code, let’s think about the steps to reproduce the bug… or at least the fourth step – _Click the Tab button to save to list_. The tab keystroke, internally to the `list-item-controller`, causes a blur to the input field. If we look at the code from `list-item-controller`, that _blur_ event performs a change to state:

_/script/controller/list-item-controller.js_
    
    $('input', this.$editableView).on('blur', (function(controller) {
    
    &nbsp_place_holder;&nbsp_place_holder;return function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;controller.model.name = $(this).val();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;controller.state = stateEnum.UNEDITABLE;
    
    &nbsp_place_holder;&nbsp_place_holder;};
    
    }(this)));

This snippet is taken from the event handler assignment in the `init()` function. When in edit mode of the `list-item-controller`, once focus is lost from the input field – which happens upon tab – the model is updated and state changed to non-edit mode. My first inkling is to put it here. It is true that, in doing so, it will pass and get rid of the bug… but the real commit of changes to the `list-item-controller` and its underlying model I feel lie in its change from edit mode to non-edit mode. I would argue that `save()` should be called from that occurrence. But before we add that to the code, let’s write up an expectation of that behavior.

## More Tests

_‘WHAT?!? The bug was in our sights. We know how to get rid of it, and you want to write more tests?!?’_  
That is the voice in my head most of the time when I decide to go back to tests. It has lessened, and the swearing really has decreased. And when I finally do get around to passing tests, it goes away and is replaced with: _‘Nice job! You deserve a raise.. or at least an egg sandwich!’_

Anyway, let’s get to _Egg Sandwich Status_ and add another test to ensure that upon change to non-edit mode, if the model properties are not valid, that the item is not saved:

_/test/jasmine/spec/feature/saveitem.spec.js_
    
    async.it('should not save an empty item upon change to non-edit mode', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var listLength = listController.getItemList().itemLength();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(itemRenderer).on('commit', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(listController.getItemList().itemLength()).toEqual(listLength - 1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.name = invalidName;
    
    &nbsp_place_holder;&nbsp_place_holder;itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    
    });

We have already verified the expectation that a `list-item-controller` is entered into an `EDITABLE` state from our _additem.spec.js_ tests, so we don’t need to test for that here – just know that setting the `list-item-controller` instance to an `UNEDITABLE` state will trigger it to go into non-edit mode.

Run that, and we get the timeout failure from that test:  
![Timeout failure on non-edit mode commit](http://custardbelly.com/blog/images/tdd_js/part_viii_7.png)

Good! Before you slap me… save that hand for modifying the `list-item-controller` to invoke the save() method from its state-change handler:

_/script/controller/list-item-controller.js_
    
    function handleStateChange(controller, event) {
    
    &nbsp_place_holder;&nbsp_place_holder;// remove state-based item.
    
    &nbsp_place_holder;&nbsp_place_holder;if( typeof event.oldState !== 'undefined') {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if(event.oldState === stateEnum.UNEDITABLE) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;controller.$uneditableView.detach();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;else if(event.oldState === stateEnum.EDITABLE) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;controller.$editableView.detach();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;// append state-based item.
    
    &nbsp_place_holder;&nbsp_place_holder;if(event.newState === stateEnum.UNEDITABLE) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;controller.parentView.append(controller.$uneditableView);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;controller.save();
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;else if(event.newState === stateEnum.EDITABLE) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var inputTimeout = setTimeout( function()&nbsp_place_holder; {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;clearTimeout(inputTimeout);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$('input', controller.$editableView).focus();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}, 100);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;controller.parentView.append(controller.$editableView);
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    }

One little addition. Now run the tests:  
![Passing tests on change to non-edit mode and save.](http://custardbelly.com/blog/images/tdd_js/part_viii_8.png)

_Hooray!_ Now use that hand you were gonna slap me with and high-five yourself. Now look at yourself… you look silly. Run the application you crazy solo-high-fiver:  
![Application does not save empty item](http://custardbelly.com/blog/images/tdd_js/part_viii_9.png)

That picture doesn’t say much, but – if all has gone well – it conveys that we are no longer able to save an item to the list when nothing has been provided in the input field and we can close the bug.

### Can’t Stop. Won’t Stop

I would normally stop there, but I do like to sew things up nicely and verify all expectations. Such as:

1. Item controller view is not retained in list view if not valid:  
_/test/jasmine/spec/feature/saveitem.spec.js_
    
    async.it('should not add an empty item to list view upon change to non-edit mode', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var listViewLength = $listView.children().length;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(itemRenderer).on('commit', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect($listView.children().length).toEqual(listViewLength - 1);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.name = invalidName;
    
    &nbsp_place_holder;&nbsp_place_holder;itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    
    });

2. When going from edit to non-edit mode, valid items are retained:  
_/test/jasmine/spec/feature/saveitem.spec.js_
    
    async.it('should save a valid item upon change to non-edit mode', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var listLength = listController.getItemList().itemLength();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(itemRenderer).on('commit', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect(listController.getItemList().itemLength()).toEqual(listLength);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.name = itemName;
    
    &nbsp_place_holder;&nbsp_place_holder;itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    
    });
    
    &nbsp_place_holder;
    
    async.it('should add a valid item to list view upon change to non-edit mode', function(done) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var listViewLength = $listView.children.length;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;$(itemRenderer).on('commit', function(event) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;expect($listView.children().length).toEqual(listViewLength);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;done();
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;item.name = itemName;
    
    &nbsp_place_holder;&nbsp_place_holder;itemRenderer.state = itemControllerFactory.state.UNEDITABLE;
    
    });

Those additional specs will pass with flying colors and without having to modify any more application code:  
![Finishing up all expectations for Save Item feature](http://custardbelly.com/blog/images/tdd_js/part_viii_10.png)

Tagged **0.1.12**: [https://github.com/bustardcelly/grocery-ls/tree/0.1.12](https://github.com/bustardcelly/grocery-ls/tree/0.1.12)

# Conclusion

In this article we tested our way to closing a bug.

Just as we had done in the [previous article](http://custardbelly.com/blog/2013/01/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-vii/), we adhered more closely to the principles of **TDD** and trudge along making things turn red before green – even when we found the reason and knew the resolution for the _Empty Item_ bug. In doing so, we sort of verified and documented in test a _Save Item_ feature. Now we know where to add or modify tests if the usability in committing an item to the list is changed in our requirements.

## Todd can’t leave well enough alone

The application is pretty much ready to use as is to boot! There is just one more thing that is nagging me – persistence. No pun intended. We can create a list of all the items we need at the grocery store just fine, but if we close the browser window… oh-noes. It’s lost. I gotta fix that… next.

Cheers for sticking around!

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
