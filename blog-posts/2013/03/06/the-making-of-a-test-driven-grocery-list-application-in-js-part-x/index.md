---
title: 'The Making of a Test-Driven Grocery List Application in JS: Part X'
url: 'http://custardbelly.com/blog/2013/03/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-x/'
author:
  name: 'todd anderson'
date: '2013-03-06'
---

_This is the tenth installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

## Introduction

When we last left, we properly modified `list-controller` to support event notification upon change to its collection as well as created a `storage-service` communication layer with `localStorage`. That gave us some great passing tests, but nothing to show off as the service was not integrated into the **Grocery List** application. In this article, we’ll do just that, but…

## Before we hook up list-controller events to storage-service operations…

We need a way to supply the `list-controller` with the stored items. The `list-controller` has a `createNewItem()` method, but no methods to provide a previously created item. Since we are not burdening the `list-controller` in communicating with the `storage-service` directly, we’ll need to open up the API to allow items to be added – at least at the onset.

### Tests

First we’ll include all our tests in our _specrunner_ again as changes to `list-controller` may impact tests across multiple specs. And while we are poking around, let’s add a spec suite for `setItems()` on the `list-controller` and watch it fail:

_/test/jasmine/spec/list-controller.spec.js_
    
    describe('setItems()', function() {
    
     
    
      var itemOne = modelFactory.create(),
    
          itemTwo = modelFactory.create();
    
     
    
      beforeEach( function() {
    
        itemOne.name = 'apples';
    
        itemTwo.name = 'oranges';
    
        listController.setItems([itemOne, itemTwo]);
    
      });
    
     
    
      afterEach( function() {
    
        listController.getItemList().removeAll();
    
      });
    
     
    
      it('should fill list with provided items', function() {
    
        var items = listController.getItemList();
    
        expect(items.itemLength()).toEqual(2);
    
        expect(items.getItemAt(0)).toBe(itemOne);
    
        expect(items.getItemAt(1)).toBe(itemTwo);
    
      });
    
     
    
    });

This simple first spec tells us that an array of items can be provided to the `list-controller` using `setItems()` and should be accessible by its collection. And we fail with no surprises:  
![Failing on setItems of list-controller](http://custardbelly.com/blog/images/tdd_js/part_ix_17.png)

### list-controller modification

Throughout this series I have employed a quasi-[_“TDD as if you mean it”_](http://coderetreat.org/facilitating/activities/tdd-as-if-you-meant-it) approach when creating new components and modifying the API on existing ones. With this modification to the `list-controller`, I am going to stick to getting the tests to pass by modifying the `list-controller` directly as I feel it is going to get a little more involved and will require some refactoring that would be better suited by focusing on true implementation.

With that said, let’s modify `list-controller` to get that new spec passing:

_/script/controller/list-controller.js_
    
    listController = {
    
      $view: undefined,
    
      getItemList: function() {
    
        return collection;
    
      },
    
      getRendererFromItem: function(item) {
    
        var i = rendererList.itemLength(),
    
            renderer;
    
        while( --i > -1 ) {
    
          renderer = rendererList.getItemAt(i);
    
          if(renderer.model === item) {
    
            return renderer;
    
          }
    
        }
    
        return undefined;
    
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
    
      },
    
      setItems: function(items) {
    
        collection = collectionFactory.create(items);
    
      }
    
    };

Well, that was easy enough!  
![Passing on setItems() of list-controller](http://custardbelly.com/blog/images/tdd_js/part_ix_18.png)

### Tests

Not so fast… I think our single spec may be deceiving our expectations. Let’s add a few more and make sure we are on the right path. To start, we expect changes to these new models to propagate events when it is modified – such as in the work we have done previously.

_/test/jasmine/spec/list-controller.spec.js_
    
    async.it('should dispatch events of property-change from provided items', function(done) {
    
      var items = listController.getItemList(),
    
          itemOne = items.getItemAt(0);
    
      $(listController).on('save-item', function(event) {
    
        $(listController).off('save-item');
    
        expect(event.item).toBe(itemOne);
    
        done();
    
      });
    
      itemOne.marked = true;
    
    });

This spec tells us that changes to an item should be notified through the `list-controller` – basically the work we had done previously in getting the `list-controller` to dispatch events related to its underlying collection so as to be captured by observing parties.  
![Failing on async timeout of event from item](http://custardbelly.com/blog/images/tdd_js/part_ix_19.png)

This test actually reveals some refactoring that is required within the `list-controller`. In essence, creating a new collection from the provided items in `setItems()` is not enough to have the application work as expected – each individual item needs to be managed by a `list-item-controller` which responds and notifies of changes accordingly. We had previously paired an item with a item controller within the `collection-change` event handler of the collection in `list-controller`:

_/script/controller/list-controller.js_
    
    (function assignCollectionHandlers($collection) {
    
     
    
      var EventKindEnum = collectionFactory.collectionEventKind,
    
          isValidValue = function(value) {
    
            return value && (value.hasOwnProperty('length') && value.length > 0);
    
          };
    
     
    
      $collection.on('collection-change', function(event) {
    
        var model,
    
            itemController,
    
            $itemController,
    
            $itemView;
    
        switch( event.kind ) {
    
          case EventKindEnum.ADD:
    
            $itemView = $('<li>');
    
            model = event.items.shift();
    
            itemController = itemControllerFactory.create($itemView, model);
    
            $itemController = $(itemController);
    
     
    
            $itemView.appendTo(listController.$view);
    
            rendererList.addItem(itemController);
    
            $(listController).trigger(createSaveEvent(model));
    
            itemController.state = itemControllerFactory.state.EDITABLE;
    
     
    
            $itemController.on('remove', function(event) {
    
              listController.removeItem(model);
    
            });
    
            $itemController.on('commit', function(event) {
    
              if(!isValidValue(model.name)) {
    
                listController.removeItem(model);
    
              }
    
              else {
    
                $(listController).trigger(createSaveEvent(model));
    
              }
    
            });
    
            break;
    
          case EventKindEnum.REMOVE:
    
            model = event.items.shift();
    
            itemController = listController.getRendererFromItem(model),
    
            $itemController = $(itemController);
    
     
    
            if(itemController) {
    
              $itemView = itemController.parentView;
    
              $itemView.remove();
    
              itemController.dispose();
    
              $itemController.off('remove');
    
              $itemController.off('commit');
    
              rendererList.removeItem(itemController);
    
              $(listController).trigger(createRemoveEvent(model));
    
            }
    
            break;
    
          case EventKindEnum.RESET:
    
            break;
    
        }
    
      });
    
     
    
    }($(collection)));

That [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) was run in the module prior to returning the `list-controller` instance. Now, we could just copy that code from the `EventKindEnum.ADD` case and shove it into `setItems()`, applying it to each item in a loop, but that wouldn’t be very efficient, not to mention a cry-inducing solution for anyone (including yourself) which need to revisit your code.

### list-controller refactor

I think we are going to have to get rid of this **IIFE**, but let’s do that modification in piecemeal; first, let’s strip out the item management when added to a collection:

_/script/controller/list-controller.js_
    
    var collection = collectionFactory.create(),
    
        rendererList = collectionFactory.create(),
    
        manageItemInList = function(item, listController) {
    
          var $itemView = $('<li>'),
    
              itemController = itemControllerFactory.create($itemView, item),
    
              $itemController = $(itemController),
    
              isValidValue = function(value) {
    
                return value && (value.hasOwnProperty('length') && value.length > 0);
    
              };
    
     
    
          $itemView.appendTo(listController.$view);
    
          rendererList.addItem(itemController);
    
     
    
          $itemController.on('remove', function(event) {
    
            listController.removeItem(item);
    
          });
    
          $itemController.on('commit', function(event) {
    
            if(!isValidValue(item.name)) {
    
              listController.removeItem(item);
    
            }
    
            else {
    
              $(listController).trigger(createSaveEvent(item));
    
            }
    
          });
    
          return itemController;
    
        },
    
        listController = {
    
          $view: undefined,
    
          ...
    
        };

Most of what was held in the `EventKindEnum.ADD` case of the `collection-change` handler has been moved to its own function expression – `manageItemInList()`. If we look at how this case is modified we see that we have left state initialization and event dispatching:

_/script/controller/list-controller.js_
    
    case EventKindEnum.ADD:
    
      model = event.items.shift();
    
      itemController = manageItemInList(model, listController);
    
      itemController.state = itemControllerFactory.state.EDITABLE;
    
      $(listController).trigger(createSaveEvent(model));
    
      break;

When an item is added to the collection and the list-controller is notified, it creates a new `list-item-controller` using `manageItemInList()`, sets the controller’s state to `EDITABLE` and notifies of its addition. The last two operations are of note, as they only pertain to _new_ additions to the collection – we don’t want such things for existing items being added to the list from `setItems()`.

_/script/controller/list-controller.js_
    
    setItems: function(items) {
    
      var i, length = items.length;
    
      collection = collectionFactory.create();
    
      for( i = 0; i < length; i++ ) {
    
        manageItemInList(items[i], this);
    
        collection.addItem(items[i]);
    
      }
    
    }

Now if we run the tests again:  
![Passing on modifications to item management in list-controller](http://custardbelly.com/blog/images/tdd_js/part_ix_20.png)

Passing! 

### Tests

I don’t think we are out of the woods yet, however… Let’s continue to add more expectations about setting the collection through `setItems() `on `list-controller`:

_/test/jasmine/spec/list-controller.spec.js_
    
    async.it('should dispatch event of remove-item from collection', function(done) {
    
      $(listController).on('remove-item', function(event) {
    
        $(listController).off('remove-item');
    
        expect(event.item).toBe(itemOne);
    
        done();
    
      });
    
      listController.removeItem(itemOne);
    
    });

This test ensures that the `list-controller` should still be responding to and notifying of changes to the new collection created through `setItems()` just as it should if the `list-controller` was only being instructed to modify the collection through calls to `createNewItem()`.

### list-controller refactoring

To save you some time in downloading more images, believe me when I tell you I just put us back in red ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) The reason being that dang `assignCollectionHandlers` [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/). The collection that is created in `setItems()` is not being observed. The **IIFE** to assign events handlers is only run upon load of the module and only targets the collection instantiated in its declaration. In other words, any new collections will not be observed.

I say we move that **IIFE** out into its own expression:

_/script/controller/list-controller.js_
    
    var collection = collectionFactory.create(),
    
        rendererList = collectionFactory.create(),
    
        assignCollectionHandlers = function($collection) {
    
          var EventKindEnum = collectionFactory.collectionEventKind;
    
          $collection.on('collection-change', function(event) {
    
            var model,
    
                itemController,
    
                $itemController,
    
                $itemView;
    
            switch( event.kind ) {
    
              case EventKindEnum.ADD:
    
                model = event.items.shift();
    
                itemController = manageItemInList(model, listController);
    
                itemController.state = itemControllerFactory.state.EDITABLE;
    
                $(listController).trigger(createSaveEvent(model));
    
                break;
    
              case EventKindEnum.REMOVE:
    
                model = event.items.shift();
    
                itemController = listController.getRendererFromItem(model),
    
                $itemController = $(itemController);
    
     
    
                if(itemController) {
    
                  $itemView = itemController.parentView;
    
                  $itemView.remove();
    
                  itemController.dispose();
    
                  $itemController.off('remove');
    
                  $itemController.off('commit');
    
                  rendererList.removeItem(itemController);
    
                  $(listController).trigger(createRemoveEvent(model));
    
                }
    
                break;
    
              case EventKindEnum.RESET:
    
                break;
    
            }
    
          });
    
        },
    
        manageItemInList = function(item, listController) {
    
          // implementation removed to reduce noise
    
        },
    
        listController = {
    
          // implementation removed to reduce noise
    
        }

We basically took what was the named `assignCollectionHandlers` **IIFE** and added it to the variable declarations within the `list-controller` module. That changes the code between those declarations and the return of the `listController` instance to:

_/script/controller/list-controller.js_
    
    var collection = collectionFactory.create(),
    
        rendererList = collectionFactory.create(),
    
        assignCollectionHandlers = function($collection) {
    
          // implementation removed to reduce noise
    
        },
    
        manageItemInList = function(item, listController) {
    
          // implementation removed to reduce noise
    
        },
    
        listController = {
    
          // implementation removed to reduce noise
    
        };
    
     
    
    assignCollectionHandlers($(collection));
    
     
    
    return listController;

With those changes we are still failing on the last spec we created, but more importantly we have not caused any other tests to fail!  
![Still failing, but failing well!](http://custardbelly.com/blog/images/tdd_js/part_ix_21.png)

Let’s get that last spec to pass:

_/script/controller/list-controller.js_
    
    setItems: function(items) {
    
      var i, length = items.length;
    
      collection = collectionFactory.create();
    
      for( i = 0; i < length; i++ ) {
    
        manageItemInList(items[i], this);
    
        collection.addItem(items[i]);
    
      }
    
      assignCollectionHandlers($(collection));
    
    }

Hurrah!  
![Passing again!](http://custardbelly.com/blog/images/tdd_js/part_ix_22.png)

Tagged **0.1.13**: [https://github.com/bustardcelly/grocery-ls/tree/0.1.13](https://github.com/bustardcelly/grocery-ls/tree/0.1.13)

## Hooking it all together

We have created our `storage-service` to communicate with `localStorage`, modified `list-controller` to dispatch events and accept initial items for its collection and all our tests are still passing! It’s a wonderous feeling. Now let’s get to actually hooking them up so that the `storage-service` is told how to handle changes to the list by responding to `list-controller` events.

Normally, in such situations I would create another component to the application that would serve as an mediator for such integration, receiving events from `list-controller` and invoking the `storage-service`. Naturally, that would also call for more tests in assuring that the mediator did its job correctly. I am not going to do that here. This is a small application meant for our own personal use and this series has gotten quite long; I don’t want to scare you away by adding more dependencies, but I would encourage you to do so on your own if you feel so…. just don’t forget the tests!

I think modifying the main JavaScript file (_/script/grocery-ls.js_) that defines the module dependencies and initializes the **Grocery List** application is fine enough for the task at hand:

_/script/grocery-ls.js_
    
    (function(window, require) {
    
     
    
      require.config({
    
        baseUrl: ".",
    
        paths: {
    
          "lib": "./lib",
    
          "script": "./script",
    
          "jquery": "./lib/jquery-1.8.3.min"
    
        }
    
      });
    
     
    
      require( ['jquery', 'script/controller/list-controller', 'script/service/storage-service'],
    
                function($, listController, storageService) {
    
     
    
        var $listController = $(listController);
    
        listController.setView($('section.groceries ul'));
    
     
    
        storageService.getItems().then(function(items) {
    
          listController.setItems(items);
    
        });
    
        $listController.on('save-item', function(event) {
    
          storageService.saveItem(event.item).then(function(item) {
    
            console.log('Item saved! ' + item.name);
    
          }, function(error) {
    
            console.log('Item not saved: ' + error)
    
          });
    
        });
    
        $listController.on('remove-item', function(event) {
    
          storageService.removeItem(event.item).then(function(item) {
    
            console.log('Item removed! ' + item.name);
    
          }, function(error) {
    
            console.log('Item not removed: ' + error);
    
          });
    
        });
    
        $('#add-item-button').on('click', function(event) {
    
          listController.createNewItem();
    
        });
    
     
    
      });
    
     
    
    }(window, requirejs));

Just a slight modification to the main file. We added `storage-service` as an initial dependency, request and supply stored items to the list-controller and respond to `save-item` and `remove-item` events, forwarding actions along to the `storage-service` appropriately.

If we run the application now, we can add, mark-off, remove items from the list. Same as before, but now, if we refresh the page, items and their state a persisted!

![Grocery list application](http://custardbelly.com/blog/images/tdd_js/part_ix_27.png)

It may look a little different than your if you have been following along in the code. I added some nice styling and committed it to the repo.

Tagged **0.2.0** : [https://github.com/bustardcelly/grocery-ls/tree/0.2.0](https://github.com/bustardcelly/grocery-ls/tree/0.2.0)

## Conclusion

We have completed our **Grocery List** application and have it fully tested (well, hopefully ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) ). We now have a grocery list that we can curate and is persisted in the browser. It should be noted that it is not persistent across browser**s**, plural – so make sure to open it in the same browser on your mobile device when creating the list and shopping. I am most likely going to whip up a little server to persist the list remotely, but am not going to document that in this series. It may end up in the [github repo](https://github.com/bustardcelly/grocery-ls) eventually, however, so keep an eye out.

Thanks for sticking around in this long series (_ten parts!_) of building an application by trying to adhere to **TDD**. I may have gone off course here and there, but I hope it was informative in any way.

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

Posted in [AMD](http://custardbelly.com/blog/category/amd/), [JavaScript](http://custardbelly.com/blog/category/javascript/), [RequireJS](http://custardbelly.com/blog/category/requirejs/), [grocery-ls](http://custardbelly.com/blog/category/grocery-ls/), [jasmine](http://custardbelly.com/blog/category/jasmine/).
