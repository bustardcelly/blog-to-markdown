---
title: 'The Making of a Test-Driven Grocery List Application in JS: Part II'
url: 'https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii/'
author:
  name: 'todd anderson'
date: '2012-11-26'
---

_This is the second installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

# Introduction

In the [previous article](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i), I covered the intent of developing a Test-Driven **Grocery List** application using [Jasmine](http://pivotal.github.com/jasmine/), the [BDD](http://dannorth.net/introducing-bdd/) testing framework for JavaScript.

In this article, I want to address a single [User Story](http://en.wikipedia.org/wiki/User_story) with a couple scenarios, using language similar to that describe in [Dan Worth’s _Introducing BDD_ article](http://dannorth.net/introducing-bdd/), that will describe the specifications and expectations of one piece of the **Grocery List** application: adding an item.

# Requirements

Instead of starting with code and project setup, let’s take a bite off the requirements of the **Grocery List** application and discuss a single usability point to start with.

The intended use of the **Grocery List** application is to be able to add, check-off and delete items from a list. We’ll address the difference of checking-off items vs. deleting items in later posts, so for now we’ll be concerned with only adding an item. Let’s start with a simple story:

_// story_  
—  
**Story:** Item is added to grocery list

**In order to** remember what to pick up at the grocery store  
**As a** grocery shopper  
**I want to** add an item to a grocery list accessible when at the store.  
—

With this story, we can define some specification for the application as far as User Requirements. Now, this is where I often have a struggle with my inner ‘_lets-get-to-it!_‘ developer attitude and I have to keep concrete implementations in check for a bit.

_// spec_  
—  
**Scenario 1:** Item added to list  
**Given** a user requests to add an item to the list  
**And** has provided a name for the item  
**When** she requests to save the item  
**Then** the list has grown by one item  
**And** the list contains the item appended at the end  
—

A pretty basic scenario. It is hard for me to not go overboard here and cover every single aspect and moving piece at this stage – ie, how does this all happen? What is involved upon the first request? What UI has changed? How is a name provided? Shouldn’t all these be defined as well? All good questions. In my head, this scenario can be broken out into a handful of other scenarios. But I have to stand back and say that this is the scenario that I consider to be the business requirement at hand. This can be read and agreed upon by a third-party who is unfamiliar with the technology that will fulfill this requirement. If I can prove that this expectation is met successfully, the implementation is a by-product and can have additional test if seen fit. We can also add another scenario to this:

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

Now we are covering the requirements involved in adding an item to the **Grocery List**… and I always like to fill in a scenario of what it _doesn’t_ do, because sometimes what it _doesn’t do_ tells you more about what the system is supposed to do. Again, we can get exhaustive with UI and device event tests, but we don’t want to meddle down the specs at this point with concrete implementations.

What I do find interesting from just these basic scenarios is that it does reveal some aspects of the application that will need to be addressed while creating the tests – mainly, a starter on the grocery item model schema and the API in conversing with a view controller to add and edit an item. 

#### design note

It should be noted that I do prefer the design concept of [Supervising Presenter](http://martinfowler.com/eaaDev/SupervisingPresenter.html) and will employ it within the tests and application, so you are forewarned ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) If you are unfamiliar, a **Supervising Presenter** is knowledgable of the view and model and provides an API that allows for an outside party to affect each, but mostly in affecting the attributes on the model that are observed by the view. Consequently, it will also allow us to not worry to much about the view implementation and User-based events when resolving logical requirements. I don’t plan to incorporate any application framework that provides such a pattern, so a basic view controller (supervising presenter) will essentially be in charge of modifying the view and model in the **Grocery List** application that will be built. 

Architecture, design patterns and the pros and cons of frameworks are things I am more than willing to discuss over beers ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) I just wanted to give you a heads up.

## Test

I suppose we should address some set-up as this is the first post. [Jasmine](http://pivotal.github.com/jasmine/) tests are described in a JavaScript file related to a (typically, single) specification of the application requirements, and those **specs** are run in what is considered a **spec-runner**. The browser-based [Jasmine](http://pivotal.github.com/jasmine/) library comes with support for reporting in an HTML document.

Here is an example of the **specrunner.html** from _/test/jasmine_ directory of the github repo for [grocery-ls](https://github.com/bustardcelly/grocery-ls):
    
    <!DOCTYPE html">
    
    <html>
    
      <head>
    
        <title>grocery-ls Spec Runner</title>
    
        <link rel="stylesheet" type="text/css" href="lib/jasmine-1.2.0/jasmine.css">
    
        <script src="../../lib/require-2.1.1.min.js"></script>
    
        <script src="lib/jasmine-1.2.0/jasmine.js"></script>
    
        <script src="lib/jasmine-1.2.0/jasmine-html.js"></script>
    
        <script src="lib/jasmine.async.min.js"></script>
    
        <script src="lib/sinon-1.5.0.js"></script>
    
     
    
        <script>
    
          (function( window, require ) {
    
     
    
            require.config({
    
              baseUrl: "../..",
    
              paths: {
    
                "spec": "./test/jasmine/spec",
    
                "script": "./script",
    
                "jquery": "./lib/jquery-1.8.3.min.js"
    
              }
    
            });
    
     
    
            require( ['spec/newitem.spec.js'], function() {
    
     
    
              var jasmineEnv = jasmine.getEnv(),
    
                  htmlReporter = new jasmine.HtmlReporter();
    
     
    
              jasmineEnv.updateInterval = 1000;
    
              jasmineEnv.addReporter(htmlReporter);
    
              jasmineEnv.execute();
    
     
    
            });  
    
     
    
          }(window, requirejs));
    
        </script>
    
     
    
    </head>
    
    <body></body>
    
    </html>

In the spec runner, we have included the library scripts described previously in the [previous post](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i). One thing to note, is the use of [RequireJS](http://requirejs.org/). In order to support [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD), we instruct **RequireJS** to load the **Jasmine** specs defined in JavaScript files prior to setting the environment and executing the specs. Normally, when not incorporating **RequireJS**, you would just add the specs as script tags in the head. An important part of using **RequireJS** is setting the proper paths in the configuration. This allows **RequireJS** to find the proper dependencies not only in the spec itself, but in any concrete implementations separate from the specs. In this example we have set the _baseURL_ to the root of the project directory and define the keyword “_spec_” as pointing to the **Jasmine** spec directory we have set up. If you checkout the [project from the repo](https://github.com/bustardcelly/grocery-ls), the directory structure and the **RequireJS** configuration paths hopefully will make things clearer.

That’s just a quick introduction to the spec runner. I may not discuss it further in later posts aside from appending specs to the _require()_ invocation. Without additional headless tooling (which may be covered later), when I run the tests I will simply load the spec runner in a browser.

## New-Item Specifications

Back to the task at hand… we have to verify the adding of an item to our **Grocery List**. The make up of a spec file should be addressed, especially when incorporating [RequireJS](http://requirejs.org) in our application and tests. We need to start off with a _define()_, which is a **RequireJS** method to define an **AMD** module – what we are loading from the spec runner are **Jasmine** spec modules, essentially. Within the **Jasmine** spec file itself, we will be primarily concerned with 3 methods:

  * **describe** : encapsulates a suite of specifications
  * **it** : defines a specification
  * **expect** : executes a test against matchers that verify expectations

That list is hierarchical – expectations are defined in a suite of specifications. I will start off using the basic matchers that come with [Jasmine](http://pivotal.github.com/jasmine/), but may cover creating custom ones if need be while I develop the **Grocery List** application. It is also important to note that suites can be nested and **Jasmine** is knowledgable enough to execute the tree of specifications appropriately.

Along with those methods that involve expectations of a suite of specifications, there are also two helper methods that I will employ often: _beforeEach()_ and _afterEach()_. If you are already familiar with unit testing, these are the **setup** and **teardown** methods and will be executed before and after each specification, respectively. They aide in performing common tasks across a suite of specifications that basically setup and teardown dependencies for expectations.

_Again all of this is a basic overview to actually get to the spec file itself. Definitely checkout the [Jasmine documentation](http://pivotal.github.com/jasmine/) for finer detail._

## Failing

With this knowledge, we can create a basic skeleton of the spec file to cover the scenarios described before:  
/test/jasmine/spec/newitem.spec.js
    
    define( function() {
    
     
    
      describe('User requests to add new item', function() {
    
     
    
        it('should save new item when name supplied', function() {
    
            expect(false).toBe(true);
    
        });
    
     
    
        it('should not save new item when name not supplied', function() {
    
            expect(false).toBe(true);
    
        });
    
     
    
      });
    
     
    
    });

This spec encompasses the story and specifications we defined previously in this post, and has two failing expectations – typically, when setting up a suite of specifications and just defining specifications that I will return to in order to complete, I throw in a failing expectation. We are describing our ‘add item to grocery list’ story with the two specifications: **1)** allowing an item to be added that has a valid name and **2)** not allowing an item to be added without a valid name.

Now, just working through the employment of a view controller/presenter and the API to expose in order to properly define the requirement of adding an item to the list in the specification, we can come to a handful of requirements in order to successfully fulfill these specs:

  * A grocery item model that exposes a “name” property
  * A list view controller/presenter that exposes an API to:
  * add/create a new item
  * modify a newly added/created item
  * save an item to the list

Additionally, we will want to run the request to add at least one item to the list in order to meet expectations in each specification defined. As such, and without any concrete implementations or stubs, we can modify the spec to include the setup and teardown of the controller that will get us to the expectations of the spec:

_/test/jasmine/spec/newitem.spec.js_
    
    describe('User requests to add new item', function() {
    
     
    
        var listController = {
    
                  editableItem: undefined,
    
                  itemList: []
    
              };
    
     
    
        beforeEach( function() {
    
          listController.createNewItem();
    
          listController.editFocusedItem('apples');
    
          listController.saveFocusedItem();
    
        });
    
     
    
        it('should save new item when name supplied', function() {
    
          expect(false).toBe(true);
    
        });
    
     
    
        it('should not save new item when name not supplied', function() {
    
          expect(false).toBe(true);
    
        });
    
     
    
        afterEach( function() {
    
          listController.itemList = [];
    
          listController.editableItem = undefined;
    
        });
    
     
    
      });

Before each spec is entered, the list controller is requested to create a new item, modify it and save it to the list. After each spec, reference to the newly created item is returned to an undefined value and the list is emptied. All this will fail if you run it – even before getting to the specifications; the _listController_ variable only exposes the item and list properties and does not provide the API we have defined in the _beforeEach()_ method. 

Now we could go about stubbing the _listController_ out with an API, like such:
    
    sinon.stub(listController, "createNewItem", function() {
    
        listController.editableItem = {};
    
    });

… but, in instances like such, I’d rather just modify the object directly and then move the implementation to its own **AMD** module. We will get into stubbing and mocking in later posts – as it is very useful – but for now, to keep things a little more simpler, I will define the makeup of the _listController_ on itself directly:

_/test/jasmine/spec/newitem.spec.js_
    
    var itemProperties = function(id) {
    
          return {
    
            "id": {
    
              value: id,
    
              writable: false,
    
              enumerable: true
    
            },
    
            "name": {
    
              value: '',
    
              writable: true,
    
              enumerable: true
    
            }
    
          };
    
        },
    
        listController = {
    
          itemList: [],
    
          editableItem: undefined,
    
          createNewItem: function() {
    
            this.editableItem = Object.create(Object.prototype, itemProperties(new Date().getTime()));
    
          },
    
          editFocusedItem: function(name) {
    
            this.editableItem.name = name;
    
          },
    
          saveFocusedItem: function() {
    
            if( this.editableItem.name.length !== 0 ) {
    
              this.itemList.push(this.editableItem);
    
            }
    
            this.editableItem = undefined;
    
          }
    
        };

The _listController_ now exposes the methods for creation, edit and save of an item and internally updates the property values of _itemList_ and _editableItem_. As well, you will notice how a new item is generated using the _Object.create()_ method and supplying a _defineProperties_ object with an immutable “_id_” property and a mutable “_name_” property. With the _listController_ fleshed out a bit more, we can return to the specs and defined some expectations. Remembering that we instruct the _listController_ to create, modify and save an item to the list in the _beforeEach()_ method fo the spec suite, we can modify the first spec that pertains to the successful add of an item:

_/test/jasmine/spec/newitem.spec.js_
    
    it('should save new item when name supplied', function() {
    
      expect(listController.itemList.length).toBe(1);
    
      expect(listController.itemList[0]).not.toBe(undefined);
    
      expect(listController.itemList[0].hasOwnProperty('name')).toBe(true);
    
      expect(listController.itemList[0].name).toBe('apples');
    
    });

It can be debated about the number of expectations per spec and whether each expectation should be split into their respective spec. I see pros and cons with both styles, but I mainly strive to keep “noise” to a minimum in my tests – meaning i will sacrifice listing a handful of expectations around a single specification in order for the progression and specification suite to be more “readable”. In this case, I am just verifying that an item has been added and retained by the list exposed on _listController_, and that the item that resides in the list matches that which was added.

Likewise, to complete the other specification of not being able to add an item that does not have an name attributed to it:  
_/test/jasmine/spec/newitem.spec.js_
    
    it('should not save new item when name not supplied', function() {
    
      listController.createNewItem();
    
      listController.saveFocusedItem();
    
      expect(listController.itemList.length).toBe(1);
    
      expect(listController.itemList[0].name).toBe('apples');
    
    });

In this specification, we are requesting to create and save a new item through the _listController_ API. Remembering that an item has already been added from the _beforeEach()_ method, after the _saveFocusedItem()_ request, the list should only contain the item added previously.

## Passing

If we ran the spec runner, we would see our specifications pass:  
![new item passing spec](https://custardbelly.com/blog/images/jasmine_1.png)

Whoopee! The following is the whole spec file:

_/test/jasmine/spec/newitem.spec.js_
    
    define( function() {
    
     
    
      var itemProperties = function(id) {
    
            return {
    
              "id": {
    
                value: id,
    
                writable: false,
    
                enumerable: true
    
              },
    
              "name": {
    
                value: '',
    
                writable: true,
    
                enumerable: true
    
              }
    
            };
    
          },
    
          listController = {
    
            itemList: [],
    
            editableItem: undefined,
    
            createNewItem: function() {
    
              this.editableItem = Object.create(Object.prototype, itemProperties(new Date().getTime()));
    
            },
    
            editFocusedItem: function(name) {
    
              this.editableItem.name = name;
    
            },
    
            saveFocusedItem: function() {
    
              if( this.editableItem.name.length !== 0 ) {
    
                this.itemList.push(this.editableItem);
    
              }
    
              this.editableItem = undefined;
    
            }
    
          },
    
          itemName = 'apples';
    
     
    
      describe('List Controller creates a new item', function() {
    
     
    
        beforeEach( function() {
    
          listController.createNewItem();
    
        });
    
     
    
        it('should expose the editableItem upon creation', function() {
    
          var createdItem = listController.editableItem;
    
          expect(createdItem).not.toBeUndefined();
    
          expect(typeof createdItem.name).toBe('string');
    
          expect(createdItem.name.length).toBe(0);
    
        });
    
     
    
        afterEach( function() {
    
          listController.editableItem = undefined;
    
        });
    
     
    
      });
    
     
    
      describe('User requests to add new item', function() {
    
     
    
        beforeEach( function() {
    
          listController.createNewItem();
    
          listController.editFocusedItem(itemName);
    
          listController.saveFocusedItem();
    
        });
    
     
    
        it('should save new item when name supplied', function() {
    
          expect(listController.itemList.length).toBe(1);
    
          expect(listController.itemList[0]).not.toBe(undefined);
    
          expect(listController.itemList[0].hasOwnProperty('name')).toBe(true);
    
          expect(listController.itemList[0].name).toBe(itemName);
    
        });
    
     
    
        it('should not save new item when name not supplied', function() {
    
          listController.createNewItem();
    
          listController.saveFocusedItem();
    
          expect(listController.itemList.length).toBe(1);
    
          expect(listController.itemList[0].name).toBe(itemName);
    
        });
    
     
    
        afterEach( function() {
    
          listController.itemList = [];
    
          listController.editableItem = undefined;
    
        });
    
     
    
      });
    
     
    
    });

You may notice that I snuck in another little specification revolved around the creation and exposure of a new item through the _listController_ – that is because I am anal and additionally wanted to ensure that the _listController_ responded properly as I saw fit upon creation of a new item.

Of course, at this point the design of the controller can be debated – and it is a much welcome discussion. I setup _listController_ as it is with the following requirements:

  * View implementation is abstracted away. _In fact there is absolutely no communication with the DOM to make these specifications pass. It will be the controller’s responsibility on how the view is updated based on the exposed API._
  * Only one item will be editable at any given time within the application session. _This may be later determined as an oversight, but that is the requirement I have set at the moment… and if we need multiple editable items, we’ll modify our tests and refactor!_
  * The list of items is accessible and mutable on the controller. _This is a requirement that will likely change as the addition and removal of items will have some impact on the supervised view, likely leading to the an API to modify the list replacing the direct access._

**Tagged** 0.1.0: [https://github.com/bustardcelly/grocery-ls/tree/0.1.0](https://github.com/bustardcelly/grocery-ls/tree/0.1.0)

### Implementation

Typically, after having passed specifications, I like to move the work to actual implementations of the application. It is similar to the concept of [_TDD like you mean it_](http://cumulative-hypotheses.org/2011/08/30/tdd-as-if-you-meant-it/), but I don’t think I strictly adhere to that principle. In any event, we can move the implementation of the _listController_ from the **newitem.spec** to its own **AMD** module define that as a dependency for our spec.

Very simply, we could rip the object declarations from **newitem.spec.js** and drop them into a new **AMD** module and define the _listController_ export for dependency reference in the spec:

_/script/controller/list-controller.js_
    
    define(function() {
    
      var itemProperties = function(id) {
    
            return {
    
              "id": {
    
                value: id,
    
                writable: false,
    
                enumerable: true
    
              },
    
              "name": {
    
                value: '',
    
                writable: true,
    
                enumerable: true
    
              }
    
            };
    
          },
    
          listController = {
    
            itemList: [],
    
            editableItem: undefined,
    
            createNewItem: function() {
    
              this.editableItem = Object.create(Object.prototype, itemProperties(new Date().getTime()));
    
            },
    
            editFocusedItem: function(name) {
    
              this.editableItem.name = name;
    
            },
    
            saveFocusedItem: function() {
    
              if( this.editableItem.name.length !== 0 ) {
    
                this.itemList.push(this.editableItem);
    
              }
    
              this.editableItem = undefined;
    
            }
    
          };
    
     
    
      return listController;
    
    });

_/test/jasmine/spec/newitem.spec.js_
    
    define( ['script/controller/list-controller'], function(listController) {
    
     
    
      var itemName = 'apples';
    
     
    
      describe('List Controller creates a new item', function() {
    
     
    
        beforeEach( function() {
    
          listController.createNewItem();
    
        });
    
     
    
        it('should expose the editableItem upon creation', function() {
    
          expect(listController.editableItem).not.toBeUndefined();
    
        });
    
     
    
        afterEach( function() {
    
          listController.editableItem = undefined;
    
        });
    
     
    
      });
    
     
    
      describe('User requests to add new item', function() {
    
     
    
        beforeEach( function() {
    
          listController.createNewItem();
    
          listController.editFocusedItem(itemName);
    
          listController.saveFocusedItem();
    
        });
    
     
    
        it('should save new item when name supplied', function() {
    
          expect(listController.itemList.length).toBe(1);
    
          expect(listController.itemList[0]).not.toBe(undefined);
    
          expect(listController.itemList[0].hasOwnProperty('name')).toBe(true);
    
          expect(listController.itemList[0].name).toBe(itemName);
    
        });
    
     
    
        it('should not save new item when name not supplied', function() {
    
          listController.createNewItem();
    
          listController.saveFocusedItem();
    
          expect(listController.itemList.length).toBe(1);
    
          expect(listController.itemList[0].name).toBe(itemName);
    
        });
    
     
    
        afterEach( function() {
    
          listController.itemList = [];
    
          listController.editableItem = undefined;
    
        });
    
     
    
      });
    
     
    
    });

In the modified **newitem.spec.js**, we have defined the dependency on the _list-controller_ module which is then referenced using _listController_. Running that will result in the same successful expectations as before. You may notice that the dependency for the _listController_ is defined as _’script/controller/list-controller’_. The _’script’_ directory is defined in the **RequireJS** configuration in the spec runner file discussed previously in this post – it will know how to resolve its location and load the controller file.

Now is where, typically, as modifications to _list-controller_ are made in response to new requirements and specifications, stubbing comes into play within my specs more. If an addition or change to the API of _list-controller_ is required for a new story, then in the specification test I would implement that API using stubs, then move the implementation to the _list-controller_ module once they pass.

**Tagged**, 0.1.1: [https://github.com/bustardcelly/grocery-ls/tree/0.1.1](https://github.com/bustardcelly/grocery-ls/tree/0.1.1)

### Usability

Because I can’t leave well-enough alone, I want to hook up this functionality to User response ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

Available in the repo at the current revision up to this point (tagged [0.1.1](https://github.com/bustardcelly/grocery-ls/tree/0.1.1)), there is a main index file that I have not addressed in this post:

_/index.html_
    
    <!DOCTYPE html>
    
    <html>
    
      <head>
    
        <title>grocery-ls</title>
    
      </head>
    
      <body>
    
        <header>
    
          <h1>grocery-ls</h1>
    
        </header>
    
        <section class="groceries">
    
          <ul class="grocery-list"></ul>
    
          <button id="add-item-button">add item</button>
    
        </section>
    
        <script src="lib/require-2.1.1.min.js"></script>
    
        <script src="script/grocery-ls.js"></script>
    
      </body>
    
    </html>

The page just defines an unordered list to display grocery items (editable & uneditable) and a button to add an item to the list. As well, we have included the [RequireJS](http://requirejs.org/) library and a main JS file for the **Grocery List** application:

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
    
     
    
      require( ['jquery', 'script/controller/list-controller'], function($, listController) {
    
        listController.setView($('section.groceries'));
    
      });
    
     
    
    }(window, requirejs));

The configuration paths, you are familiar with when we set up the specrunner for our [Jasmine](http://pivotal.github.com/jasmine/) tests. Additionally, we are asking **RequireJS** to load the ‘_jquery_‘ and ‘_list-controller_‘ dependencies, after which, the _list-controller_ is given a reference to the DOM element it will supervise: the **section** element with the **class** attribute value of ‘_groceries_‘.

The _list-controller_ will now have more responsibility in updating the view based on invocations of the API we have previously defined for our specifications:

_/script/controller/list-controller.js_
    
    define(['jquery', 'script/model/grocery-ls-item'], function($, itemModel) {
    
     
    
      var $view,
    
          $item,
    
          $itemList,
    
          itemFragment              = '<li class="grocery-item" />',
    
          editableItemFragment  = '<li class="editable-grocery-item">' +
    
                                    '<input id="editableItem" name="editableItem" ' +
    
                                      'class="editable-item" placeholder="Enter item name...">' +
    
                                    '</input>' +
    
                                  '</li>',
    
          findItemList = function() {
    
            if( typeof $itemList === 'undefined' ) {
    
              $itemList = $('.grocery-list', $view);
    
            }
    
            return $itemList;
    
          },
    
          listController = {
    
            itemList: [],
    
            editableItem: undefined,
    
            setView: function(value) {
    
              var controller = this;
    
              $view = $(value);
    
              $('#add-item-button', this.$view).on( 'click', function(event) {
    
                controller.createNewItem();
    
              });
    
            },
    
            createNewItem: function() {
    
              var $list = findItemList(),
    
                  $input,
    
                  controller = this;
    
     
    
              this.editableItem = itemModel.create();
    
              $item = $(editableItemFragment);
    
              $input = $('input', $item);
    
              $input.first().bind( 'blur', function(event) {
    
                var $this = $(this);
    
     
    
                $this.unbind('blur');
    
                controller.editFocusedItem( $this.val() );
    
                controller.saveFocusedItem();
    
              });
    
     
    
              $item.data('gls-item', this.editableItem);
    
              $list.append($item);
    
              $input.first().focus();
    
            },
    
            editFocusedItem: function(name) {
    
              this.editableItem.name = name;
    
            },
    
            saveFocusedItem: function() {
    
              var $list = findItemList();
    
                  $itemFragment = $(itemFragment);
    
     
    
              $item.remove();
    
              if( this.editableItem.name.length > 0 ) {
    
                $itemFragment.append('p').text(this.editableItem.name);
    
                $itemFragment.data('gls-item', this.editableItem);
    
                $list.append($itemFragment);
    
                this.itemList.push(this.editableItem);
    
              }
    
              this.editableItem = undefined;
    
            }
    
          };
    
     
    
      return listController;
    
     
    
    });

_/script/model/grocery-ls-item.js_
    
    define(function() {
    
     
    
      var properties = function(id) {
    
        return {
    
          "id": {
    
            value: id,
    
            writable: false,
    
            enumerable: true
    
          },
    
          "name": {
    
            value: '',
    
            writable: true,
    
            enumerable: true
    
          }
    
        };
    
      };
    
     
    
      return {
    
        create: function() {
    
          return Object.create(Object.prototype, properties(new Date().getTime()));
    
        }
    
      };
    
     
    
    });

The modifications to the _list-controller_ from it’s previous implementation mainly involve access and modification of the DOM in response to requests on its API. If we ran the [Jasmine](http://pivotal.github.com/jasmine/) spec we previously created – **newitem.spec.js** – it would still pass. If the main **index.html** file is loaded in a browser, you will be able to add an item by clicking the button and as long as you provide a name in the input field, it will be added to the list.

![grocery list app version 0.1.2](https://custardbelly.com/blog/images/jasmine1_app.png)

We could (and perhaps some readers would say that I _should_ have) created more specs that defined the usability and expectations of DOM manipulation on response to API invocations on the _list-controller_. It is a valid point and I totally agree. At this point I don’t want to add noise with the user interface implementations in the specifications; the view implementation is subject to change and the API on the _list-controller_ currently supports the modification of the grocery list. We can be assured at the current moment that the _list-controller_ knows how to manage the list and we should not worry about what User impetus invokes the API.

Perhaps in later posts I will see the error of my ways in letting this go…

**Tagged**, 0.1.2: [https://github.com/bustardcelly/grocery-ls/tree/0.1.2](https://github.com/bustardcelly/grocery-ls/tree/0.1.2)

# Conclusion

We went through the first story, scenarios and specifications of the **Grocery List** application that will be built throughout this series. A tonne of information was covered and if you stayed with me, I appreciate it. In the end we have a passing spec suite for the creation and add of a grocery item through a list view controller. We moved the implementation of the controller and model from the spec to their respective **AMD** modules and allowed for user interaction with the application to perform the creation and add operations.

Thanks for sticking around. I hope this series proves to be helpful in some way.

—-

# Link Dump

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

## Reference

[Test-Driven JavaScript Development by Christian Johansen](http://tddjs.com/)  
[Introducing BDD by Dan North](http://dannorth.net/introducing-bdd/)  
[TDD as if you Meant it by Keith Braithwaite](http://cumulative-hypotheses.org/2011/08/30/tdd-as-if-you-meant-it/)  
[RequireJS](http://requirejs.org/)  
[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)  
[Jasmine](http://pivotal.github.com/jasmine/)  
[Sinon](http://sinonjs.org/)  
[Jasmine.Async](https://github.com/derickbailey/jasmine.async)

Posted in [JavaScript](https://custardbelly.com/blog/category/javascript/), [grocery-ls](https://custardbelly.com/blog/category/grocery-ls/), [jasmine](https://custardbelly.com/blog/category/jasmine/), [unit-testing](https://custardbelly.com/blog/category/unit-testing/).
