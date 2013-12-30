# [The Making of a Test-Driven Grocery List Application in JS: Part III](http://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii/)

_This is the third installment in a series of building a Test-Driven Grocery List application using [Jasmine](http://pivotal.github.com/jasmine/) and [RequireJS](http://requirejs.org). To learn more about the intent and general concept of the series please visit [The Making of a Test-Driven Grocery List Application in JavaScript: Part I](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/)_  
—

# Introduction

In the [previous article](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii/), I addressed adding the first feature to the **Grocery List** application: _Add Item_. Trying my best to adhere to the TDD/BDD philosophy, a story and a couple scenarios were drummed up prior to implementation development using language similar to that described in [Dan Worth’s Introducing BDD article](http://dannorth.net/introducing-bdd/). Once passing, the code written within the test was moved to its own file(s) with dependencies updated in the specs and tests run again to confirm passing against the implementations.

I will take the same approach in adding a new feature in this article: _Mark-Off Item_. 

I suspect, however, that I may actually end up creating stories for more of what can be considered _integration_. Since the last post, I stumbled upon a [great blog from Chris Parsons](http://chrismdp.com) that covers BDD (with a bend toward Cucumber), and in particular the article [Cucumber: the integration test trap](http://chrismdp.com/2012/11/the-integration-testing-trap/) provided some great insight into the difference between acceptance and integration testing. In the previous article, I suppose more of what was done could be considered acceptance testing. Some implementation details are testing against in the _Add-Item_ feature (for instance, the item API on the list-controller), but I sort of threw in extra code and UX/UI implementation details at the end just so I could make sure the code was actually usable in a real-life scenario. At the time, I felt that writing specs for the integration of features – what i consider more fine-grained in testing that an element is added to the DOM upon an API call – would muddle down the intent of this series. I might take back that assumption. That may lead to longer posts… you have been forewarned ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

# Mark-Off Feature

There are basically 3 states to an item in the grocery store: 

  1. unpossessed
  2. unpurchased
  3. owned

Once owned… well it either gets eaten or is freed into the wild – through those seemingly impenetrable automatic doors of unpurchased state, into the world of natural lighting. As well, prior to own-ed-ship, the item is in limbo as to whether or not it can reach that state – it might be placed back on the shelf to be forever unpossessed again. (You don’t want me to go over the possessed state.) Not unlike the life a a loaf of bread in a store, so too are the states of the grocery list items of the **Grocery List** application.

By adding an item – the feature completed in the [previous article](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/) – a User has essentially identified an item not in possession, with the end goal of being owned. As a User of the application, we want to be able to denote the item as being in possession, but not purchased. The unpurchased state will notify other Users of the list that it no longer needs to be obtained. However, it will still be allowed to be unmarked and back to unpossessed – say if someone got **Miracle Whip** mayo instead of **Helmann’s** (whole ‘nother argument).

So we have essentially defined the feature for this post in the series: being able to mark and unmark an item added to the grocery list.

_// story_  
—  
**Story:** Item is marked off on grocery list

**In order to** remember what items have already made it to the cart  
**As a** grocery shopper  
**I want to** mark an item as being attained on the grocery list.  
—

Similarly, since the item will still be available from the **Grocer List** application and only considered marked off, we could write up another story of being able to unmark an item from the list. For brevity’s sake, I should probably do that and if we were actually incorporating DSLs and tools that would facilitate in BDD testing, I probably would. But for the sake of this article, we’ll leave that as an added scenario to this feature.

_// spec_  
—  
**Scenario 1:** Item is marked off on grocery list  
**Given** a user has saved an item to the list  
**When** she requests to mark off the item  
**Then** the item is presented differently to the user, denoting in possession  
**And** the item is not removed from the list  
—

Okay. I’ll admit. The desired outcome from that scenario is a little vague. But the scenarios I am writing – as discussed before, after having read [this article from Chris Parsons](http://chrismdp.com/2012/11/the-integration-testing-trap/) – are more loosely acceptance criteria. As a developer, it makes me squirm a little because I know there is much more that can be described in this scenario, especially as it pertains to UI and UX. Aspects such as those can be considered more as integration points and I may circle back for more scenarios involving more of what we, as developers, are affirming in our tests (ie, design and functionality).

Anyway, undoing as well:

_// spec_  
—  
**Scenario 2:** Item is un-marked off on grocery list  
**Given** a user has saved an item to the list  
**And** she has marked off an item  
**When** she requests to un-mark off the item  
**Then** the item is presented to the user as not being in possession  
**And** the item is not removed from the list  
—

Basically, we are defining an item of the **Grocery List** application as a toggle control. Now, I can sum that up in a tiny single sentence and wave my hand, but I think we will find that there is a lot more to that statement as we start writing our tests and ultimately will change the design of the application – fo the better, I hope!

## Test

To start, the story in question and described above adds to the API of the _list-controller_ we defined and created in the [previous article](http://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii). The _list-controller_ will need to expose a way to mark off an item that is saved to the list, and a way to unmark an item that was previously marked. As I see it, that’s two new methods – let’s call them _markOffItem_ and _unmarkOffItem_. Let’s flesh them out and their signatures in a new spec for this feature:

_/test/jasmine/spec/markitem.spec.js_
    
    define(['script/controller/list-controller'], function(listController) {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;describe('User Requests to mark-off existing item', function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var name = 'apples',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItem,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;markOffSpy,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;unmarkOffSpy;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;beforeEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.createNewItem();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.editFocusedItem(name);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.saveFocusedItem();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItem = listController.itemList[listController.itemList.length-1];
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;markOffSpy = spyOn(listController, "markOffItem").andCallThrough();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;unmarkOffSpy = spyOn(listController, "unmarkOffItem").andCallThrough();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;afterEach( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItem = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;markOffSpy.reset();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;unmarkOffSpy.reset();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.itemList = [];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;listController.editableItem = undefined;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;
    
    });

I wanted to start off this test example with just showing to setup and teardown for the feature as it introduces the concept of spies. The _beforeEach()_ of the above specification suite starts off similarly to the other spec we created for the _Add Item_ feature – create, edit and save an item on the _list-controller_. Following that, and specifically on line 17 and 18, we create spies for the API modifications we are making on the _list-controller_ in order to add the _Mark Off Item_ feature – _markOffItem()_ and _unmarkOffItem()_. Spies, in as far as they are used in this instance, are essentially wrappers on a function that can record invocation calls and provide another API to facilitate in affirming expectations of how a method should be used. If you are unfamiliar with spies, both [Jasmine](https://github.com/pivotal/jasmine/wiki/Spies) and [Sinon](http://sinonjs.org/docs/#spies) have some great documentation.

The spies are defined to “call through” to the function implementation on the _list-controller_, as well. This will allow for the benefit of recording invocation and defining expectations of the actual implementation. Before we get into the real implementation, let’s take a look at the first spec for this test – marking off an item:

_/test/jasmine/spec/markitem.spec.js_
    
    it('should denote item as being in possession', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var previouslySavedItem = savedItem,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItemID = savedItem.id,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItemSpy = sinon.spy();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;savedItemSpy(previouslySavedItem);
    
    &nbsp_place_holder;&nbsp_place_holder;listController.markOffItem(savedItemID);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;// spy expectations.
    
    &nbsp_place_holder;&nbsp_place_holder;expect(markOffSpy).toHaveBeenCalled();
    
    &nbsp_place_holder;&nbsp_place_holder;expect(markOffSpy).toHaveBeenCalledWith(savedItemID);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;// model expectations.
    
    &nbsp_place_holder;&nbsp_place_holder;expect(previouslySavedItem.hasOwnProperty('marked')).toBe(true);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(previouslySavedItem.marked).toBe(true);
    
    &nbsp_place_holder;&nbsp_place_holder;// OR >
    
    &nbsp_place_holder;&nbsp_place_holder;sinon.assert.calledWith(savedItemSpy, sinon.match.hasOwn('marked', true));
    
    });

With this spec, we are affirming the signature of _markOffItem()_ method on the _list-controller_, as well as revealing the need for modifications to the attributes on the model of a grocery list item. I wanted to highlight how the _markOffSpy()_ is being used in expectations, and – though not technically needed – also maybe provide some intrigue (hopefully not confusion) in using spies from [SinonJS](http://sinonjs.org) as well.

The following expectations, taken from the above spec, facilitate more in describing how _listController.markOffItem()_ is to be used in the application, particularly that the method should be called with only one argument and that being an ID of an item from the list :
    
    expect(markOffSpy).toHaveBeenCalled();
    
    expect(markOffSpy).toHaveBeenCalledWith(savedItemID);

Some may say that such expectations are superfluous, and in some ways I do agree. Essentially, this line already defines its usage:
    
    listController.markOffItem(savedItemID);

If the test didn’t cough at that line, that we can relatively assume the expectations called into question. To each his own, however. In fact, part of me thinks I should go _even more_ overboard – ensuring only one argument was called, that it was of the same type as the id attribute on the model, etc. Anyway, after the expectations on the spy, we verify an update to the model on an attribute we have yet to define as well. From this test, we have defined it as being a boolean value and accessible on the _marked_ property. I included a spy created using [SinonJS](http://sinonjs.org) as well, just to show off it’s capabilities and compare and contrast testing on the new attribute of the model:
    
    var previouslySavedItem = savedItem,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItemSpy = sinon.spy();
    
    savedItemSpy(previouslySavedItem);
    
    ...
    
    sinon.assert.calledWith(savedItemSpy, sinon.match.hasOwn('marked', true));

A spy is created on the model object, and after marking it off through the _list-controller_ API, it is verified as being of type boolean and value of true using a sinon assert. Neat stuff. In this case, I probably would have just stuck with the **Jasmine** expectations, but I wanted to show you the power of **SinonJS** as it can provide a more robust testing API.

Rambling on. There’s still two other specifications we need to cover in this suite:

_/test/jasmine/spec/markitem.spec.js_
    
    it('should retain the item in the grocery list', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;listController.markOffItem(savedItem.id);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;expect(listController.itemList.length).toBe(1);
    
    &nbsp_place_holder;&nbsp_place_holder;expect(listController.itemList.indexOf(savedItem)).toBe(0);
    
    });
    
    &nbsp_place_holder;
    
    it('should have marked-off item available to unmark-off', function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var previouslySavedItem = savedItem,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;savedItemID = savedItem.id;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;listController.markOffItem(savedItem.id);
    
    &nbsp_place_holder;&nbsp_place_holder;listController.unmarkOffItem(savedItem.id);
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;// stubbed expectations.
    
    &nbsp_place_holder;&nbsp_place_holder;expect(unmarkOffSpy).toHaveBeenCalled();
    
    &nbsp_place_holder;&nbsp_place_holder;// model expectations.
    
    &nbsp_place_holder;&nbsp_place_holder;expect(previouslySavedItem.marked).not.toBe(true);
    
    });

These specs define the expectations of the list remaining unmodified when marking off an item, and that the model is updated appropriately when unmarking off an item through the _list-controller_ API, respectively. 

  
[note]  
_I am using Array.prototype.indexOf in the first spec from the previous example. That didn’t make [an appearance until JavaScript 1.6](https://developer.mozilla.org/en-US/docs/JavaScript/New_in_JavaScript/1.6) and as such is not implemented in some older browsers (i have no <3 for IE<9). As I mentioned in the first article of this series, I am taking for granted that the application will be viewed on modern browsers, and in particular modern mobile browsers._  


### Failing

If you added this spec to the spec runner like so:

_/test/jasmine/specrunner.html_
    
    require( ['spec/newitem.spec.js', 'spec/markitem.spec.js'], function() {
    
    &nbsp_place_holder;&nbsp_place_holder;var jasmineEnv = jasmine.getEnv(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;...
    
    &nbsp_place_holder;&nbsp_place_holder;jasmineEnv.execute();
    
    });

> it will fail. miserably. But that’s okay! That’s expected. Spies require an actual implementation on the object you are spying, and if you recall from the first spec described, we actually request a call through on the implementation in order to verify expected functionality. 

Let’s get to the _list-controller_ and _grocery-ls-item_ model, as those are the two items addressed in the latest spec suite as needing modifications to pass.

## Implementation

In our Mark Off Item spec suite, we identified two additions to the API of the list-controller. Those methods are:

  * + markOffItem( itemID )
  * + unmarkOffItem( itemID )

The first instinct is to just add these to the _list-controller_ object and add an internal method that traverses the held _itemList_ array to locate models that have the passed _itemID_ value. Not a bad instinct, and something of the following would get the tests passing:

_/script/controller/list-controller.js_
    
    markOffItem: function(itemID) {
    
    &nbsp_place_holder;&nbsp_place_holder;var item = findItemByID(itemID, this.itemList),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;renderer = findRendererByItem(item, $itemList.children());
    
    &nbsp_place_holder;&nbsp_place_holder;item.marked = true;
    
    &nbsp_place_holder;&nbsp_place_holder;$(renderer).css('text-decoration', 'line-through');
    
    },
    
    unmarkOffItem: function(itemID) {
    
    &nbsp_place_holder;&nbsp_place_holder;var item = findItemByID(itemID, this.itemList),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;renderer = findRendererByItem(item, $itemList.children());
    
    &nbsp_place_holder;&nbsp_place_holder;item.marked = false;
    
    &nbsp_place_holder;&nbsp_place_holder;$(renderer).css('text-decoration', 'none');
    
    }

_> where findByItemID() locates the model associated with the itemID within the itemList array and findRendererByItem() locates the DOM element associated with the model._

If you were to run that, the tests would pass. Well, technically, if you left that bit in there where a [SinonJS](http://sinonjs.org) spy was asserting on the model, it would not pass. But if you took that out, all green. Even without modifying the _grocery-ls-item_ model… such is the dynamic nature of JavaScript. For brevities sake, let’s add the marked property to the Object.defineProperties object upon creation of a new model:

_/script/model/grocery-ls-item.js_
    
    var properties = function(id) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"id": {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;value: id,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;writable: false,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;enumerable: true
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"name": {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;value: '',
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;writable: true,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;enumerable: true
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;"marked": {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;value: false,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;writable: true,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;enumerable: true
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;&nbsp_place_holder;};

![passing mark-off item spec](http://custardbelly.com/blog/images/tdd_js/part_iii_1.png)  
![grocery list app with mark off](http://custardbelly.com/blog/images/tdd_js/part_iii_app_1.png)

**Tagged**: 0.1.3 [https://github.com/bustardcelly/grocery-ls/tree/0.1.3](https://github.com/bustardcelly/grocery-ls/tree/0.1.3)

## Before you leave!

I am not satisfied with the current state of the _list-controller_; it has far too much responsibility in managing list item renderers and models and lacks the finer details to properly keep the 1:1 relationship that renderers have to their models. We could just throw more code in there, more tests and let it grow into this gross beast, but I really think it is up for a good refactor.

So, that is what I have planned for the next article. We’ll refactor the _list-controller_ to have less responsibility in managing each _grocery-ls-item_ model and pass that off to a new _list-item-controller_. In fact, I already have started upon such a refactor and had included most of it in this article, but I felt it was getting too long (as usual) and taking away from the _Mark Off Item_ feature presented here.

Until then, you have passing tests and a functioning **Grocery List** application to play with if you [check it out of the repo](https://github.com/bustardcelly/grocery-ls).

—

# Link Dump

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

## Reference

[Test-Driven JavaScript Development by Christian Johansen](http://tddjs.com/)  
[Introducing BDD by Dan North](http://dannorth.net/introducing-bdd/)  
[Cucumber: the integration test trap by Crhis Parsons](http://chrismdp.com/2012/11/the-integration-testing-trap/)  
Testing spies for [Jasmine](https://github.com/pivotal/jasmine/wiki/Spies) and [Sinon](http://sinonjs.org/docs/#spies)  
[RequireJS](http://requirejs.org/)  
[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)  
[Jasmine](http://pivotal.github.com/jasmine/)  
[Sinon](http://sinonjs.org/)  
[Jasmine.Async](https://github.com/derickbailey/jasmine.async)  
the [infamous](http://www.flickr.com/photos/unitzeroone/4721521533/) [eye-roller](http://bit-101.com)

Posted in [JavaScript](http://custardbelly.com/blog/category/javascript/), [RequireJS](http://custardbelly.com/blog/category/requirejs/), [grocery-ls](http://custardbelly.com/blog/category/grocery-ls/), [jasmine](http://custardbelly.com/blog/category/jasmine/), [unit-testing](http://custardbelly.com/blog/category/unit-testing/).
