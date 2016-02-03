---
title: 'The Making of a Test-Driven Grocery List Application in JS: Part IV'
url: 'https://custardbelly.com/blog/2012/12/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-iv/'
author:
  name: 'todd anderson'
date: '2012-12-17'
---

_This is the fourth installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

# Introduction

In the [previous](https://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii/) article we developed a new feature for the **Grocery List** application: _Mark Off Item_. In the process of doing so, or at least when we went from the tests to implementation, we added more responsibility to the _list-controller_ as it pertained to individual view and model items.

In this article, we are going to refactor out that responsibility into its own _list-item-controller_ that will be responsible for managing the relationship of a list item view to a single _grocery-ls-item_ model.

## Refactoring

As it stands , I think the design of the _list-controller_ is fine: exposing an API to modify the list. It’s the internals that are starting to bug me. If the current behaviour and responsibilities were all that was needed, I suppose we could walk away and feel confident about our application as is. However, in forward thinking other operations that could involve list items – such as deletion – I feel the responsibilities of the _list-controller_ will quickly outgrow its intent. 

I suppose, some would argue, that if the responsibilities of the list-controller grow to more operations that are tightly coupled with singular pieces of data, then we could just write more tests to verify its soundness. Not entirely a bad argument – i mean that is what we are trying to justify in this series, essentially. But it is not a 1:1 correlation of more tests to better design. It is preferred to separate concerns as much as possible in order to properly test. The maintenance of complex tests can be a bigger burden than the maintenance of complex code – so much so that testing stops all together.

### list-item-controller

Before we dive in to creating a _list-item-controller_, let’s take a look at what concerns within _list-controller_ we want to move out. Looking from the [0.1.3 tagged list-controller](https://github.com/bustardcelly/grocery-ls/blob/0.1.3/script/controller/list-controller.js), we mainly want to cut out the item view creation – so the following node declarations and any associated item creation and item management:

_/script/controller/list-controller.js tagged at 0.1.3_
    
    itemFragment          = '<li class="grocery-item" />',
    
    editableItemFragment  = '<li class="editable-grocery-item">' +
    
                                               '<input id="editableItem" name="editableItem" ' +
    
                                                   'class="editable-item" placeholder="Enter item name...">' +
    
                                              '</input>' +
    
                                            '</li>'

These declarations and management of view will be moved to the _list-item-controller_. The UI and usability of a list item will be driven by the model and should provide an API that is a level of abstraction from the model for any outside parties (ie, the _list-controller_). As well, the model drives the internal state of edit-ability and marked-off-ed-ness (_they’re words, alright_!), and the _list-item-controller_ will dispatch events related to its change of state. Lofty goals, but let’s see if we can’t address them.

#### a bit of uncertainty

We currently created specs for _Add Item_ and _Mark Off Item_ features. These were a little high-level in that they described features using the BDD syntax of [Jasmine](http://pivotal.github.com/jasmine/) but did involve tests around how to interact with the _list-controller_ API; so they do involve integration to some respect – we kind of ignore the whole UI and User Interaction aspect within the tests. 

Now here is where I have an internal struggle with writing specs: should the tests we need for the _list-item-controller_ be added to these specs? Or should a new spec focused on _list-item-controller_ API and usability be born? I ask, because from outside-looking-in, the creation, editability and mark-off of an item will still be feasible through the _list-controller_ and to any other third parties – that API provides a facade to modifying a grocery list. So, the current specs we have serve as a nice example of how to interact with the application from the outside… and if they are passing, we know that from higher-level things _should_* work ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

When we get down to the implementation of the _list-item-controller_, from a design perspective we know that a dependency will be introduced: _list-controller_ will have n-number of _list-item-controller_ instances, and will be responsible for the creation and maintenance of each _list-item-controller_. The state and _grocery-ls-item_ model maintenance which we established in the previous articles as the responsibility of the _list-controller_ will, as well, become the responsibility of the _list-item-controller_.

Knowing this, I start to feel that this is closer to testing the implementation and behaviour of a component, rather then one of the ’system’, and would push for its own spec. But I am very much open to ideas, so please leave a comment.

### list-item-controller design

In my _bit of uncertainty_, I basically described the design of the _list-item-controller_. Now, we’ll flesh out its behaviour and API in a spec and eventually move it to its own AMD implementation. To start out slowly we’ll create a new spec suite and define the _list-item-controller_ attributes:

_/test/jasmine/spec/list-item-controller.spec.js_
    
    define(['jquery', 'script/model/grocery-ls-item'], function($, modelFactory) {
    
     
    
      describe('list-item-controller', function() {
    
     
    
        function createStateEvent(oldState, newState) {
    
            var event = new $.Event('state-change');
    
            event.oldState = oldState;
    
            event.newState = newState;
    
            return event;
    
        }
    
     
    
        var itemControllerFactory = {
    
            create: function(node, model) {
    
              var itemController = Object.create(Object.prototype);
    
     
    
              (function(controller, stateEventCreator) {
    
                var _state = 'normal';
    
                Object.defineProperties(controller, {
    
                  "model": {
    
                    value: model,
    
                    writable: false,
    
                    enumerable: true
    
                  },
    
                  "parentView": {
    
                    value: node,
    
                    writable: false,
    
                    enumerable: true
    
                  },
    
                  "state": {
    
                    set: function(value) {
    
                      var event = stateEventCreator.call(this, this.state, value);
    
                      _state = value;
    
                      $(this).trigger(event);
    
                    },
    
                    get: function() {
    
                      return _state;
    
                    }
    
                  }
    
                });
    
              }(itemController, createStateEvent));
    
     
    
              return itemController;
    
            }
    
          };
    
      });
    
    });

The object declared – _itemControllerFactory_ – is a factory instance that will generate new instances of a _list-item-controller_. The factory pattern should be familiar to you if you look at the _grocery-ls-item_ AMD we created in the second article in the series. When creating an instance of a _list-item-controller_, we have defined that a parent DOM node and a model should be passed in during creation, as can be seen in _itemControllerFactory:create()_. If we look at the _defineProperties_, we have also defined a few characteristics of the _list-item-controller_ here. It has:

  * Parent Node reference – DOM instance of which to modify view state.
  * Model reference – Model of which the View is driven by.
  * State – State of View within the DOM representing the Model.

We have designed the _state_ property a little differently than you may have seen before, at least in this series. We declared the implicit getter/setters so as to keep track of state internally and dispatch an event of _’state-change’_. By ‘_internally_‘, I mean I used an [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/) to enclose a ‘_private_‘ member storing state.

If you know of event-driven design – whether or not you are familiar with [jQuery Events](http://api.jquery.com/category/Events/?rdfrom=http%3A%2F%2Fdocs.jquery.com%2Fmw%2Findex.php%3Ftitle%3DAPI%2F1.3%2FEvents%26redirect%3Dno), which the _state_ property employs – then this will look familiar. Essentially, we want to allow any client who wants to know about the change of state to a _list-item-controller_ instance to be notified through an event of _’state-change’_. This will become more apparent later on in development, but just keep in mind that it is the responsibility of the _list-controller_ to maintain n-number of _list-item-controller_s; and part of that maintenance is being aware of each _list-item-controller_’s state – and since binding is not inherently available in JavaScript, and I don’t want to introduce any new libraries that could handle binding, listening on events is an easy way to go about tracking state. _You feel adventurous enough, we can build a binding mechanism on top of this event system… just make sure it’s got tests ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) _

## Tests

Before we begin creating the tests for the _list-item-controller_, you may be wondering where the feature stories and scenarios are. We could definitely define those, however – and of course, I can always be wrong – I feel those are more business-facing… well, stories at least. They are used to define some type of behaviour that is accepted as part of the software, with scenarios describing the various outcomes of a behaviour. Still valid for the case in hand of integrating the _list-item-controller_, but I tend to think this closer to testing on the implementation of behaviour. It’s a gray area to me, as well, if this all sounds confusing – I invite someone to step in and either clarify my understanding to set me straight. 

Basically, our goal here is to verify the design and implementation of _list-item-controller_. If done properly this will pass, as well as the specs for the _Add Item_ and _Mark Off Item_ features we created in [previous](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii/) [articles](https://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii/).

That said, let’s flesh out some tests that verify:

  1. Factory generates unique instances of list-item-controller
  2. Model is preserved and immutable on list-item-controller
  3. State is mutable through implicit getter/setters
  4. Change to state is dispatched

_/test/jasmine/spec/list-item-controller.spec.js_
    
    describe('Grocery list-item-controller', function() {
    
     
    
      var model,
    
          newController,
    
          async = new AsyncSpec(this);
    
     
    
      beforeEach( function() {
    
        model = modelFactory.create();
    
        newController = itemControllerFactory.create(parentNode, model);
    
      });
    
     
    
      describe('list-item-controller factory creation', function() {
    
     
    
        it('should return a new instance of list-item-controller', function() {
    
          expect(newController).not.toBeUndefined();
    
        });
    
     
    
        it('should return unique instances of list-item-controllers', function() {
    
          var nextController = itemControllerFactory.create(parentNode, model);
    
          nextController.state = 'testing';
    
          expect(nextController).not.toBe(newController);
    
          expect(nextController.state).not.toBe(newController.state);
    
        });
    
     
    
      });
    
     
    
      describe('new list-item-controller instance', function() {
    
     
    
        it('should expose model provided in creation', function() {
    
          expect(newController.model).not.toBeUndefined();
    
          expect(newController.model).toBe(model);
    
        });
    
     
    
        it('should expose non-writable model', function() {
    
          var newModel = modelFactory.create();
    
          newController.model = newModel;
    
          expect(newController.model).not.toBe(newModel);
    
          expect(newController.model).toBe(model);
    
        });
    
     
    
      describe('list-item-controller notifies on state-change', function() {
    
     
    
        async.it('should provide old and new state values on state-change', function(done) {
    
          var previousState = newController.state,
    
              newState = 'editable';
    
     
    
          $(newController).on('state-change', function(event) {
    
            $(newController).off('state-change');
    
     
    
            expect(event.oldState).toBe(previousState);
    
            expect(event.newState).toBe(newState);
    
            expect(newController.state).toBe(newState);
    
            done();
    
          });
    
          newController.state = newState;
    
        });
    
     
    
      });
    
     
    
      });
    
     
    
      afterEach( function() {
    
        model = undefined;
    
        newController = undefined;
    
      });
    
     
    
    });

The last spec declared, as you may notice, runs asynchronously in order to test the state notification:
    
    async.it('should provide old and new state values on state-change', function(done) {

The _AsyncSpec_ object comes from the [jasmine.async library](https://github.com/derickbailey/jasmine.async) we’ve previously included in the specrunner page. By invoking the spec (_it()_) through an instance of _AsyncSpec_, the spec is suspended until either it fails or the _done_ delegate method is invoked. Since notification of state change is event-based, we use it in the spec to verify that the _list-item-controller_ does dispatch that event.

Add that spec to the list:  
_/test/jasmine/specrunner.html_
    
    require( ['spec/newitem.spec.js', 'spec/markitem.spec.js', 'spec/list-item-controller.spec.js'], function() {
    
     
    
      var jasmineEnv = jasmine.getEnv(),
    
         ...
    
      jasmineEnv.execute();
    
     
    
    });

![passing list-item-controller spec](https://custardbelly.com/blog/images/tdd_js/part_iv_1.png)

## list-item-controller implementation

We’ve verified our design for the _list-item-controller_ with passing tests, but we have yet to incorporate it into our system and offload the responsibilities (addressed earlier in this article) from the _list-controller_ to it. Before we get there, however, let’s move the implementation of the _list-item-controller_ (and the factory) out into its own AMD module. To start we’ll just move the _itemControllerFactory_ declaration into a new file:

_/script/controller/list-item-controller.js_
    
    define(['jquery'], function($) {
    
     
    
      function createStateEvent(oldState, newState) {
    
        var event = new $.Event('state-change');
    
        event.oldState = oldState;
    
        event.newState = newState;
    
        return event;
    
      }
    
     
    
      return {
    
        create: function(node, model) {
    
          var itemController = Object.create(Object.prototype);
    
     
    
          (function(controller, stateEventCreator) {
    
            var _state;
    
            Object.defineProperties(controller, {
    
              "model": {
    
                value: model,
    
                writable: false,
    
                enumerable: true
    
              },
    
              "parentView": {
    
                value: node,
    
                writable: false,
    
                enumerable: true
    
              },
    
              "state": {
    
                set: function(value) {
    
                  var event = stateEventCreator.call(this, this.state, value);
    
                  _state = value;
    
                  $(this).trigger(event);
    
                },
    
                get: function() {
    
                  return _state;
    
                }
    
              }
    
            });
    
          }(itemController, createStateEvent));
    
     
    
          return itemController.init();
    
        }
    
      };
    
     
    
    });

With that in place, we could modify the _list-item-controller.spec.js_ file to include the _list-item-controller_ dependency for testing:

_/test/jasmine/spec/list-item-controller.spec.js_
    
    define(['jquery', 'script/model/grocery-ls-item', 'script/controller/list-item-controller'],
    
              function($, modelFactory, itemControllerFactory) {
    
      // moved to script/controller/list-item-controller.js
    
     
    
      describe('Grocery list-item-controller', function() {
    
        ...
    
      });
    
    });

And our tests still pass! But… we want to move all the view and item management out of _list-controller_ and have that handled by a _list-item-controller_. So let’s transfer over those view fragments and flesh out the _list-item-controller_ object that is generated from the factory:

_/script/controller/list-item-controller.js_
    
    define(['jquery'], function($) {
    
     
    
      function createStateEvent(oldState, newState) {
    
        var event = new $.Event('state-change');
    
        event.oldState = oldState;
    
        event.newState = newState;
    
        return event;
    
      }
    
     
    
       var stateEnum = {
    
            UNEDITABLE: 0,
    
            EDITABLE: 1
    
          },
    
          uneditableItemFragment  = '<p class="grocery-item" />',
    
          editableItemFragment    = '<p class="editable-grocery-item">' +
    
                                                      '<input name="editableItem" ' +
    
                                                          'class="editable-item" placeholder="Enter item name...">' +
    
                                                      '</input>' +
    
                                                   '</p>',
    
          listItemController = {
    
            $editableView: undefined,
    
            $uneditableView: undefined,
    
            init: function() {
    
              this.$editableView = $(editableItemFragment);
    
              this.$uneditableView = $(uneditableItemFragment);
    
     
    
              // default to undeditable state.
    
              this.state = stateEnum.UNEDITABLE;
    
              return this;
    
            }
    
          };
    
     
    
      return {
    
        state: stateEnum,
    
        create: function(node, model) {
    
          var itemController = Object.create(listItemController);
    
     
    
          (function(controller, stateEventCreator) {
    
            var _state = 'normal';
    
            Object.defineProperties(controller, {
    
              "model": {
    
                value: model,
    
                writable: false,
    
                enumerable: true
    
              },
    
              "parentView": {
    
                value: node,
    
                writable: false,
    
                enumerable: true
    
              },
    
              "state": {
    
                set: function(value) {
    
                  var event = stateEventCreator.call(this, this.state, value);
    
                  _state = value;
    
                  $(this).trigger(event);
    
                },
    
                get: function() {
    
                  return _state;
    
                }
    
              }
    
            });
    
          }(itemController, createStateEvent));
    
     
    
          return itemController.init();
    
        }
    
      };
    
     
    
    });

The _init()_ method of a new _list-item-controller_ is invoked upon creation and return in order to define the view references and default state. The fragment declarations have changed slightly as well – the list item wrappers have been removed. Basically, even though the name suggest that the view will reside in a list, we don’t want to tie the idea that they need to be _li_ DOM elements since they also have no concept of what type of DOM element the _parentView_ is.

As it stands with [our current work from the previous article](https://github.com/bustardcelly/grocery-ls/blob/0.1.3), the _list-controller_ was responsible for listening on UI events of a list item – such as _‘blur’_ on input and _‘click’_. It is the intent to relive the _list-controller_ of such responsibility so we’ll transfer that over, as well:

_/script/controller/list-item-controller.js_
    
    listItemController = {
    
      $editableView: undefined,
    
      $uneditableView: undefined,
    
      init: function() {
    
        this.$editableView = $(editableItemFragment);
    
        this.$uneditableView = $(uneditableItemFragment);
    
     
    
        // view handlers.
    
        this.$uneditableView.on('click', (function(controller) {
    
          return function(event) {
    
            var toggled = controller.$uneditableView.css('text-decoration') === 'line-through';
    
            controller.model.marked = !toggled;
    
          };
    
        }(this)));
    
        $('input', this.$editableView).on('blur', (function(controller) {
    
          return function(event) {
    
            controller.model.name = $(this).val();
    
            controller.state = stateEnum.UNEDITABLE;
    
          };
    
        }(this)));
    
     
    
        // default to undeditable state.
    
        this.state = stateEnum.UNEDITABLE;
    
        return this;
    
      }
    
    };

Again, we are using an **IIFE**, and in this case to pass in a reference to the controller instance. I could have easily defined a new variable like
    
    var self = this;

but that always makes me cry a little inside. Anyway, so we are listening on click of the uneditable view item in order to update value of the _marked_ property on the model and we have assigned a _blur_ handler on the input of the editable view item that updates the value of the _name_ property of the model and flips the state. Now we have to respond to those changes ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

_/script/controller/list-item-controller.js_
    
    init: function() {
    
      this.$editableView = $(editableItemFragment);
    
      this.$uneditableView = $(uneditableItemFragment);
    
     
    
      // view handlers.
    
      this.$uneditableView.on('click', (function(controller) {
    
        return function(event) {
    
          var toggled = controller.$uneditableView.css('text-decoration') === 'line-through';
    
          controller.model.marked = !toggled;
    
        };
    
      }(this)));
    
      $('input', this.$editableView).on('blur', (function(controller) {
    
        return function(event) {
    
          controller.model.name = $(this).val();
    
          controller.state = stateEnum.UNEDITABLE;
    
        };
    
      }(this)));
    
      // state & model handlers.
    
      $(this).on('state-change',  (function(controller) {
    
        return function(event) {
    
          handleStateChange.call(null, controller, event);
    
        };
    
      }(this)));
    
      $(this.model).on('property-change', (function(controller) {
    
        return function(event) {
    
          handlePropertyChange.call(null, controller, event);
    
        };
    
      }(this)));
    
      // default to undeditable state.
    
      this.state = stateEnum.UNEDITABLE;
    
      return this;
    
    }

The _handleStateChange_ delegate is responsible for updating the view based on a change to state: either _EDITABLE_ or _UNEDITABLE_ from the _stateEnum_ object:
    
    function handleStateChange(controller, event) {
    
      // remove state-based item.
    
      if( typeof event.oldState !== 'undefined') {
    
        if(event.oldState === stateEnum.UNEDITABLE) {
    
          controller.$uneditableView.detach();
    
        }
    
        else if(event.oldState === stateEnum.EDITABLE) {
    
          controller.$editableView.detach();
    
        }
    
      }
    
      // append state-based item.
    
      if(event.newState === stateEnum.UNEDITABLE) {
    
        controller.parentView.append(controller.$uneditableView);
    
      }
    
      else if(event.newState === stateEnum.EDITABLE) {
    
        var inputTimeout = setTimeout( function()  {
    
          clearTimeout(inputTimeout);
    
          $('input', controller.$editableView).focus();
    
        }, 100);
    
        controller.parentView.append(controller.$editableView);
    
      }
    
    }

The _handlePropertyChange_ delegate is responsible for updating the views based on the _model_ property values:
    
    function handlePropertyChange(controller, event) {
    
      if(event.property === "name") {
    
        // update view based on model change.
    
        $('input', controller.$editableView).val(controller.model.name);
    
        controller.$uneditableView.text(event.newValue);
    
      }
    
      else if(event.property === "marked") {
    
        // update view based on model change.
    
        controller.$uneditableView.css('text-decoration', (event.newValue) ? 'line-through' : 'none');
    
      }
    
    }

That pretty much shores up the implementation for the _list-item-controller_ taking on the responsibilities of view creation and management based on state and model updates. But running the tests from this point will fail. The reason being a change to design on the model.

## grocery-ls-item Modification

One particular change to design introduced in the implementation for _list-item-controller_ is response to _‘property-change’_ event from the model. In our work up to this point, the _grocery-ls-item_ is a basic object; we’ll use the same paradigm that we implemented for notification of state for the _grocery-ls-item_ in order to respond to changes on model properties. Although a simple change, we need to first test our design before modifying the code for the _grocery-ls-item_. Lets create a new spec file for our model:

_/test/jasmine/spec/grocery-ls-item.spec.js_
    
    define(['jquery', 'script/model/grocery-ls-item'], function($, modelFactory) {
    
     
    
      describe('Grocery grocery-ls-item model', function() {
    
     
    
        var model,
    
            name = 'grapes',
    
            async = new AsyncSpec(this);
    
     
    
        beforeEach( function() {
    
          model = modelFactory.create();
    
          model.name = name;
    
          model.marked = false;
    
        });
    
     
    
        describe('grocery-ls-item factory model creation', function() {
    
     
    
          it('should generate unique instances of model', function() {
    
            var newModel = modelFactory.create();
    
            expect(model).not.toBeUndefined();
    
            expect(newModel).not.toBeUndefined();
    
            expect(model).not.toBe(newModel);
    
          });
    
     
    
          async.it('should auto generate unique ids on models', function(done) {
    
            var newModel,
    
                creationTimeout;
    
     
    
            // Offload creation because ids are generated based on time.
    
            // This allows for timestamp to progess.
    
            creationTimeout = setTimeout(function() {
    
              clearTimeout(creationTimeout);
    
              newModel = modelFactory.create();
    
              expect(model.id).not.toBeUndefined();
    
              expect(typeof model.id).toBe('number');
    
              expect(model.id).not.toEqual(newModel.id);
    
              done();
    
            }, 100);
    
          });
    
     
    
        });
    
     
    
        describe('grocery-ls-item properties', function() {
    
     
    
          it('should contain an immutable id property, created at instantiation', function() {
    
            var newID = 1234567;
    
            model.id = newID;
    
     
    
            expect(model.id).not.toEqual(newID);
    
          });
    
     
    
        });
    
     
    
        describe('grocery-ls-item property change notification', function() {
    
     
    
          async.it('should notify with \'property-change\' upon change to name property', function(done) {
    
            var oldName = model.name,
    
                newName = 'apples';
    
            $(model).on('property-change', function(event) {
    
              expect(event.property).toEqual('name');
    
              expect(event.oldValue).toEqual(oldName);
    
              expect(event.newValue).toEqual(newName);
    
              $(model).off('property-change');
    
              done();
    
            });
    
            model.name = newName;
    
          });
    
     
    
          async.it('should notify with \'property-change\' upon change to marked property', function(done) {
    
            var oldValue = model.marked,
    
                newValue = true;
    
            $(model).on('property-change', function(event) {
    
              expect(event.property).toEqual('marked');
    
              expect(event.oldValue).toEqual(oldValue);
    
              expect(event.newValue).toEqual(newValue);
    
              $(model).off('property-change');
    
              done();
    
            });
    
            model.marked = newValue;
    
          });
    
     
    
        });
    
     
    
        afterEach( function() {
    
          model = undefined;
    
        });
    
     
    
      });
    
     
    
    });

We have a few suites there to verify:

  1. Model generation from factory produces unique items
  2. Model property immutability for auto-assigned IDs
  3. Event notification on property change

We add that to our spec runner:
    
    require( ['spec/newitem.spec.js', 'spec/markitem.spec.js',
    
              'spec/item-controller.spec.js', 'spec/grocery-ls-item.spec.js'], function() {
    
     
    
      var jasmineEnv = jasmine.getEnv(),
    
         ...
    
      jasmineEnv.execute();
    
     
    
    });

… and it fails. Whoopee! It’s supposed to. Now we just take the knowledge we know of wiring up event notification on state of the _list-item-controller_, and apply it to _property-change_ on the model:

_/script/model/grocery-ls-item.js_
    
    define(['jquery'], function($) {
    
     
    
      var propertyEvent = {
    
          create: function(property, oldValue, newValue) {
    
            var event = $.Event('property-change');
    
            event.property = property;
    
            event.oldValue = oldValue;
    
            event.newValue = newValue;
    
            return event;
    
          }
    
        },
    
        properties = function(id) {
    
          return {
    
            "id": {
    
              value: id,
    
              writable: false,
    
              enumerable: true
    
            },
    
            "name": {
    
              enumerable: true,
    
              set: function(value) {
    
                var oldValue = this._name;
    
                this._name = value;
    
                $(this).trigger(propertyEvent.create('name', oldValue, value));
    
              },
    
              get: function() {
    
                return this._name;
    
              }
    
            },
    
            "marked": {
    
              enumerable: true,
    
              set: function(value) {
    
                var oldValue = this._marked;
    
                this._marked = value;
    
                $(this).trigger(propertyEvent.create('marked', oldValue, value));
    
              },
    
              get: function() {
    
                return this._marked;
    
              }
    
            }
    
          };
    
        };
    
     
    
      return {
    
        create: function() {
    
          return Object.create(Object.prototype, properties(new Date().getTime()));
    
        }
    
      };
    
     
    
    });

The modification to _grocery-ls-item_ was perhaps our first introduction to writing failing tests due to a change in design prior to actually modifying the implementation. That feeling you’re feeling right now… that’s what makes this all worth it ![;)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_wink.gif)

Anyway… hold on to that feeling until the next post, because we are not done and it will go away quickly… just kidding ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

**Tagged**: 0.1.5 [https://github.com/bustardcelly/grocery-ls/tree/0.1.5](https://github.com/bustardcelly/grocery-ls/tree/0.1.5)

## Blinders

If you were to run the tests again… they still pass!  
![passing grocery-ls-item spec](https://custardbelly.com/blog/images/tdd_js/part_iv_2.png)

That is because we have not changed _list-controller_ at all ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

Our _list-item-controller.spec.js_ is happily oblivious to our recent additions and modifications, and the tests we wrote previously for the _Add Item_ and _Mark Off Item_ features still pass. 

Before we just start chopping out and inserting code from _list-controller_, I want to go over the API and specs currently defined and see if they still hold water – meaning we might be able to cut some tests out. We might not. We might even add more… That’s what i plan to address in the next article of this series.

—

# Link Dump

## Reference

[Test-Driven JavaScript Development by Christian Johansen](http://tddjs.com/)  
[Introducing BDD by Dan North](http://dannorth.net/introducing-bdd/)  
[Immediately-Invoked Function Expression (IIFE) by Ben Alman](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)  
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
