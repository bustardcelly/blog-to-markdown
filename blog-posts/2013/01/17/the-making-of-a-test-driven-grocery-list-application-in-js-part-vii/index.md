---
title: 'The Making of a Test-Driven Grocery List Application in JS: Part VII'
url: 'https://custardbelly.com/blog/2013/01/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-vii/'
author:
  name: 'todd anderson'
date: '2013-01-17'
---

_This is the seventh installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

## Introduction

In the [previous article](https://custardbelly.com/blog/2013/01/08/the-making-of-a-test-driven-grocery-list-application-in-js-part-vi/) we resolved tests for the _Mark Off Item_ feature that were left in a failing state after refactoring the list-controller. The test are all green now and the application usable, but we are not done with implementing the required features. In this article I plan to address another – the _Remove Item_ feature.

Before we begin, let’s drum up a quick story and scenario(s) for the _Remove Item_ feature. I know the feature seems a little simple – just remove an item from the list – and going through and adding stories and scenarios may appear like adding complexity to the situation, but since I have begun to incorporate such a workflow, I feel like it actually gives me more time to think about not only the necessity of the feature but the design; in result, _hopefully*_ cutting down on the complexity of the code.

_// story_  
**Feature:** remove item from grocery list

**In order to** not buy an item previous on a grocery list  
**As a** grocery shopper  
**I want to** remove the existence of the item on the grocery list  
—

That may be worded rather harshly, but I shop angry. It’s how I keep the cantelope in check. _‘I see you looking at me, you lousy melon.’_ All kidding aside, I tend to be a little more terse in describing stories so as not to mince words (no pun intended) and leave as little vagueness as possible. Sometimes, I’ll admit, there is no avoiding having the story lead to a lot of assumptions – but that is where scenarios come in.

_// spec_  
**Scenario 1:** Item removed from grocery list  
**Given** an item has been added to the list  
**When** a user requests to remove the item  
**Then** the list decreases in size by one

Hmm. Pretty straight forward. Well, it all seems rather easy going to implement this feature. Looks like it might be a short blog post, for once; we’ll see how much rambling I can pack in. At least we have something to show somebody who doesn’t want/need to read code when they ask, _‘But, what does it do?’_.

## Tests

As always, before we get into adding code to the components of the application to implement the new feature, let’s get some failing tests to pass. We’ll start of with defining a new spec suite for the _Remove Item_ feature, with the setup (`beforeEach()`) being the **Given** describe above:

_/test/jasmine/spec/feature/removeitem.spec.js_
    
    define(['jquery', 'script/controller/list-controller'], function($, listController) {
    
     
    
      describe('Remove item', function() {
    
     
    
        var $listView = $('<ul/>'),
    
            groceryItem;
    
     
    
        beforeEach( function() {
    
          listController.setView($listView);
    
          groceryItem = listController.createNewItem();
    
        });
    
     
    
        it('should remove existing item from the collection', function() {
    
          expect(false).toEqual(true);
    
        });
    
     
    
        afterEach( function() {
    
          groceryItem = undefined;
    
        });
    
     
    
      });
    
     
    
    });

Don’t mind the expectation declared in the spec. [Jasmine](http://pivotal.github.com/jasmine/) does not check empty specs and automatically fail them. In fact, if we ran it without any expectations defined, it would be all green. So, I usually drop a failing expectation in quickly when creating new specs in cases where someone/thing comes and interrupts me, I know where to pick back up when i come back. It’s habit. Maybe a little paranoia. Don’t know if it’s right or wrong ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)  
  
If you have been following along in the articles of this series, I typically do my implementation in the tests then move them to their respective modules. It’s a nice workflow for me, and in most cases I feel it gets me more focused on design. In this case, I am just going to declare my expectations, see them fail and move over to implementing the code right in the module, running the spec runner as we go until we see green.  


Anyway, first on the agenda is to verify that the Remove API from `list-controller` is expected to remove the item from the underlying collection of grocery list items:

_/test/jasmine/spec/feature/removeitem.spec.js_
    
    it('should remove existing item from the collection', function() {
    
      var collection = listController.getItemList(),
    
          removedItem;
    
     
    
      removedItem = listController.removeItem(groceryItem);
    
     
    
      expect(removedItem).toBe(groceryItem);
    
      expect(collection.getItemIndex(groceryItem)).toBe(-1);
    
    });

Add the new spec to the spec runner:  
_/test/jasmine/specrunner.html_
    
    require( ['spec/feature/additem.spec.js', 'spec/feature/markitem.spec.js', 'spec/feature/removeitem.spec.js',
    
              'spec/list-controller.spec.js', 'spec/list-item-controller.spec.js', 'spec/grocery-ls-item.spec.js',
    
              'spec/collection.spec.js'], function() {
    
     
    
      var jasmineEnv = jasmine.getEnv(),
    
          ...
    
      jasmineEnv.execute();
    
     
    
    });

Run that, and we have a big honking failure:  
![Failing remove spec on collection.](https://custardbelly.com/blog/images/tdd_js/part_vii_1.png)  
Good!

In looking at the expectations of the `removeItem()` method on `list-controller`, we are expecting that the item is removed from the collection and returned on invocation. Let’s implement `removeItem` on `list-controller` with this understanding:

_/script/controller/list-controller.js_
    
    listController = {
    
      $view: undefined,
    
      getItemList: function() {
    
        return collection;
    
      },
    
      getRendererFromItem: function(item) {
    
        var i = rendererList.itemLength();
    
        while( --i > -1 ) {
    
          if(rendererList.getItemAt(i).model === item) {
    
            return rendererList.getItemAt(i);
    
          }
    
          return undefined;
    
        }
    
      },
    
      createNewItem: function() {
    
        var model = modelFactory.create();
    
        collection.addItem(model);
    
        return model;
    
      },
    
      removeItem: function(item) {
    
        return collection.removeItem(item);
    
      },
    
      setView: function(view) {
    
        this.$view = (view instanceof $) ? view : $(view);
    
      }
    
    };

Run it, and we pass!  
![Passing tests on remove from collection.](https://custardbelly.com/blog/images/tdd_js/part_vii_2.png)  
Well, that was sort of easy and anti-climatic. No drama. A little boring, if I may say so.

But… there’s more! The `list-controller` isn’t just some dumb facade to the underlying **Grocery List** collection – it also manages the associated renderers to the `grocery-ls-item` models. Let’s get back to our tests and add a new spec:

_/test/jasmine/spec/feature/removeitem.spec.js_
    
    it('should remove item renderer from view', function() {
    
      listController.removeItem(groceryItem);
    
     
    
      expect($listView.children().length).toEqual(0);
    
    });

Just as we had done for the _Add Item_ feature specification, we are inspecting the view reference held by list-controller that is updated based on change to the model. In this case, we are expecting that the list item renderer is removed upon `removeItem()` as well.

Run that, and failure!  
![Failure of test on removl of item views.](https://custardbelly.com/blog/images/tdd_js/part_vii_3.png)  
It might be important to note the actual print out from the failing expectation. It says that the length of children on the list view is 2 – that is because we now have 2 specs that are defining the expectations of `removeItem()` that are failing to remove the item view from the list.

Let’s switch over the list-controller and get this sorted and back to green. But before we do, let’s think about the relationship of the `list-controller` and its underlying collection. The `list-controller` responds to collection event for `EventKindEnum.ADD` in order to modify the view. So, we will respond to `EventKindEnum.REMOVE` accordingly to modify the view on removal of an item as well, instead of adding more logic to the `removeItem()` method on `list-controller`:

_/script/controller/list-controller.js_
    
    $collection.on('collection-change', function(event) {
    
      var model, itemController, $itemView;
    
      switch( event.kind ) {
    
        case EventKindEnum.ADD:
    
          $itemView = $('<li>');
    
          model = event.items.shift();
    
          itemController = itemControllerFactory.create($itemView, model);
    
     
    
          $itemView.appendTo(listController.$view);
    
          rendererList.addItem(itemController);
    
          itemController.state = itemControllerFactory.state.EDITABLE;
    
          break;
    
        case EventKindEnum.REMOVE:
    
          model = event.items.shift();
    
          itemController = listController.getRendererFromItem(model);
    
     
    
          if(itemController) {
    
            $itemView = itemController.parentView;
    
            $itemView.remove();
    
            rendererList.removeItem(itemController);
    
          }
    
          break;
    
        case EventKindEnum.RESET:
    
          break;
    
      }
    
    });

In the `EventKindEnum.REMOVE` case, we are grabbing the model provided on the event, using it to access the associated `list-item-controller` instance, and – if defined – removing the list item renderer view from the DOM and the controller from the renderer collection.

Run that, and we are back to green!  
![Passing tests on removal of item from view.](https://custardbelly.com/blog/images/tdd_js/part_vii_4.png)

Tagged **0.1.10**: [https://github.com/bustardcelly/grocery-ls/tree/0.1.10](https://github.com/bustardcelly/grocery-ls/tree/0.1.10)

## Back to Reality

We’ve got test for the removal of a grocery list item working. We are currently feature complete. Let’s ship it! But hold up, does the **Grocery List** application – the thing we are actually building for someone like myself to Use in real life – actually use the new Remove API. We defined a business feature that was a requirement to have, and met that expectation, but we really didn’t address how an item is removed, or under what circumstances…

Without getting to crazy on discussing how to handle swipe gestures and implementing press-and-hold menu actions, let’s just start with saying that the `list-item-controller` will dispatch a new event – `remove`. How we decide on the usability of an item being deleted could easily be another whole discussion on User Experience. For now, we want to verify that when a `list-item-controller` dispatches a `remove` event, that it is handled properly.

### Tests

We’ll start with the specs for the `list-controller`. We are not going to be adding any new specs to the _Remove Item_ feature to accomplish the implementation of `list-item-controller` notifying of a `remove` event; it seems a little odd to me as well, but we have already established that the _Remove_ API performs as expected. We need to verify that the `list-controller` uses that API in response to a `list-item-controller` – less of a feature and more of an integration point.

_/test/jasmine/spec/list-controller.spec.js_
    
    describe('list-item-controller remove event response', function() {
    
     
    
      it('should invoke list-controller:removeItem()', function() {
    
        var newItem = listController.createNewItem(),
    
            itemRenderer = listController.getRendererFromItem(newItem);
    
     
    
        spyOn(listController, 'removeItem');
    
        $(itemRenderer).trigger('remove');
    
        expect(listController.removeItem).toHaveBeenCalledWith(newItem);
    
      });
    
     
    
    });

In this spec, we set up a [spy](https://github.com/pivotal/jasmine/wiki/Spies) to verify that the `removeItem()` method is invoked upon dispatch of `remove` from a `list-item-controller` instance.

Run that and we are back to red, with a message letting us know that `removeItem()` was never called.  
![Failing implementation of remove event.](https://custardbelly.com/blog/images/tdd_js/part_vii_5.png)  
Good. Let’s open up `list-controller` and implement a `remove` event response:

/script/controller/list-controller.js
    
    $collection.on('collection-change', function(event) {
    
      var model, itemController, $itemView;
    
      switch( event.kind ) {
    
        case EventKindEnum.ADD:
    
          $itemView = $('<li>');
    
          model = event.items.shift();
    
          itemController = itemControllerFactory.create($itemView, model);
    
     
    
          $itemView.appendTo(listController.$view);
    
          rendererList.addItem(itemController);
    
          itemController.state = itemControllerFactory.state.EDITABLE;
    
          $(itemController).on('remove', function(event) {
    
            listController.removeItem(model);
    
          });
    
          break;
    
        case EventKindEnum.REMOVE:
    
          model = event.items.shift();
    
          itemController = listController.getRendererFromItem(model);
    
     
    
          if(itemController) {
    
            $itemView = itemController.parentView;
    
            $itemView.remove();
    
            itemController.dispose();
    
            $(itemController).off('remove');
    
            rendererList.removeItem(itemController);
    
          }
    
          break;
    
        case EventKindEnum.RESET:
    
          break;
    
      }
    
    });

We added the remove handler delegation in the `ADD` case when the collection changes, along with the other implementation of item renderer establishment. And, for good measure and memory management, we are sure to remove the event handler in the `REMOVE` case from the collection change, as well.

Run the test now and we are back to green!  
![Passing remove event response.](https://custardbelly.com/blog/images/tdd_js/part_vii_6.png)

### list-item-controller Modification

That’s great, but we are still glazing over the usability aspect: _How does a User delete an item?_

Again, we could go into a lengthy discussion of UX and code implementations, but to save yourself from scrolling just to read me ramble off topic, we’ll keep it simple: _add a delete button_! I don’t know why I got excited there. I’ll show the implementation in piecemeal just to see how it all comes together. First we’ll start with the markup we declared for the `list-item-controller` views:

_/script/controller/list-item-controller.js_
    
    uneditableItemFragment  = '<p class="grocery-item">' +
    
                                                 '<span class="grocery-item-label" />' +
    
                                                 '<button class="delete-item-button">delete</button>' +
    
                                               '</p>',
    
    editableItemFragment    = '<p class="editable-grocery-item">' +
    
                                                '<input name="editableItem" ' +
    
                                                  'class="editable-item" placeholder="Enter item name...">' +
    
                                                '</input>' +
    
                                             '</p>'

The `uneditableItemFragment` markup has changed slightly to support a label and a button. It was previously just a `p` element all by its lonesome, but with several references for modification and event `click` event handling. We’ll need to update those, as well as add another event handler for the `button` element:

_/script/controller/list-item-controller.js_
    
    init: function() {
    
      this.$editableView = $(editableItemFragment);
    
      this.$uneditableView = $(uneditableItemFragment);
    
     
    
      // view handlers.
    
      $('span.grocery-item-label', this.$uneditableView).on('click', (function(controller) {
    
        return function(event) {
    
          var toggled = $(this).css('text-decoration') === 'line-through';
    
          controller.model.marked = !toggled;
    
        };
    
      }(this)));
    
      $('button.delete-item-button', this.$uneditableView).on('click', (function(controller) {
    
        return function(event) {
    
          $(controller).trigger(createRemoveEvent(controller));
    
        };
    
      }(this)));
    
      ...
    
    }

As seen previously, we are using [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)s here as a factory method in order to pass in a reference to the `list-item-controller` instance instead of declaring the old:
    
    var self = this;

and then passing `self` around which always makes me cringe. In any event (no pun intended), we have transferred the _click_ handling previously assigned to the `p` element over the `span` element in order to support the usability of marking off an item. As well, we added handling of delete `button` _click_ to trigger a new event:

_/script/controller/list-item-controller.js_
    
    function createRemoveEvent(controller) {
    
      var event = $.Event('remove');
    
      event.controller = controller;
    
      return event;
    
    }

Pretty straight forward in how we have create factory methods for our [jQuery](http://jquery.org) events previously in this series. Next we need to modify the references that respond to model changes, such as the `marked` property value:

_/script/controller/list-item-controller.js_
    
    function handlePropertyChange(controller, event) {
    
      if(event.property === "name") {
    
        // update view based on model change.
    
        $('input', controller.$editableView).val(controller.model.name);
    
        $('span.grocery-item-label', controller.$uneditableView).text(event.newValue);
    
      }
    
      else if(event.property === "marked") {
    
        // update view based on model change.
    
        $('span.grocery-item-label', controller.$uneditableView)
    
            .css('text-decoration', ( event.newValue ) ? 'line-through' : 'none');
    
      }
    
    }

Alright. That should just about do it. Now you may be saying to yourself, _‘Why haven’t we modified any tests in order to support this change in UI and event handling?’_ To which I will respond, _‘Stop bringing that up!’_ In all seriousness, we perhaps should be writing tests to support these changes, however those will get pretty fine grained on the UI design aspect of the application. As you can see, it is constantly changing at this time and we are more concerned with the logical points of how the **Grocery List** application should behave. 

Like with most of my code, future me may look back and shake his head at past me for such a statement – but for right now, present me will live with it ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

### Using the Grocery List Application

Let’s actually _run_ the application and use it. We spend all this time making our tests turn red and green, we barely get to use what we are building.  
![Grocery list application](https://custardbelly.com/blog/images/tdd_js/part_vii_7.png)

Oh my… that is ugly to look at. But it works! And it’s backed by tests!

Because I can’t leave well enough alone, I added some quick styling just to make it a little more pleasant on the eyes. I am not designer, so it might not be any more pleasant to you ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) I won’t go into the styling of the application as that could be a whole ‘nother article and discussion of box model, but feel free to mess around with the styling on your own…  
![Prettier Grocery List application](https://custardbelly.com/blog/images/tdd_js/part_vii_8.png)

Tagged **0.1.11**: [https://github.com/bustardcelly/grocery-ls/tree/0.1.11](https://github.com/bustardcelly/grocery-ls/tree/0.1.11)

## Conclusion

In this article of the series, we took more of a traditional approach to [TDD](http://en.wikipedia.org/wiki/Test-driven_development) and went along making things turn red before they turn green, one spec at a time, and all the while implementing the _Remove Item_ feature. 

The **Grocery List** application is also coming along pretty nicely and, as always, is easy and ready to use. But I can’t leave well enough alone and there are a few more items on my list (no pun intended) that I wish to address before ending this series, most importantly persistence. Our grocery list only last within the session of the page – once closed, our list is gone. We’ll get to that, but there might be some other things to address beforehand.

Cheers for sticking around!

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
[Part I – Introduction](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i)  
[Part II – Feature: Add Item](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii)  
[Part III – Feature: Mark-Off Item](https://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii)  
[Part IV – Feature: List-Item-Controller](https://custardbelly.com/blog/2012/12/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-iv)  
[Part V – Feature: List-Controller Refactoring](https://custardbelly.com/blog/2012/12/31/the-making-of-a-test-driven-grocery-list-application-in-js-part-v/)  
[Part VI – Back to Passing](https://custardbelly.com/blog/2013/01/08/the-making-of-a-test-driven-grocery-list-application-in-js-part-vi/)  
[Part VII – Remove Item](https://custardbelly.com/blog/2013/01/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-vii/)  
[Part VIII – Bug Fixing](https://custardbelly.com/blog/2013/01/22/the-making-of-a-test-driven-grocery-list-application-part-viii/)  
[Part IX – Persistence](https://custardbelly.com/blog/2013/02/15/the-making-of-a-test-driven-grocery-list-application-in-js-part-ix/)  
[Part X – It Lives!](https://custardbelly.com/blog/2013/03/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-x/)

Posted in [AMD](https://custardbelly.com/blog/category/amd/), [JavaScript](https://custardbelly.com/blog/category/javascript/), [RequireJS](https://custardbelly.com/blog/category/requirejs/), [grocery-ls](https://custardbelly.com/blog/category/grocery-ls/), [jasmine](https://custardbelly.com/blog/category/jasmine/), [unit-testing](https://custardbelly.com/blog/category/unit-testing/).
