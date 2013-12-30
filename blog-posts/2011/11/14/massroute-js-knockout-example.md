# [massroute-js: knockout example](http://custardbelly.com/blog/2011/11/14/massroute-js-knockout-example/)

_I have created a github repository at [http://github.com/bustardcelly/massroute-js](http://github.com/bustardcelly/massroute-js) to explore various JavaScript libraries and frameworks with a focus of delivering a web-based application for [real-time transportation data made available from MassDOT](http://www.eot.state.ma.us/developers/realtime/). This article intends to address my findings in an exploration of one of those libraries or frameworks that have caught my interest. If you have any suggestions for another **JavaScript** library/framework please leave a comment._

_It should also be noted that some explanations may be heavily influenced by my experience in developing for the **Flash Platform** and particularly their relation to the **ActionScript** and the **Flex** mark-up language._

The massroute-js example using Knockout can be found at: [http://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/](http://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/)

The initial draw to test out the [Knockout](http://knockoutjs.com/) library was its basis on the [Model-View-View Model](http://en.wikipedia.org/wiki/Model_View_ViewModel) (MVVM) architectural pattern. I won’t go into to much detail about what MVVM is and what it can provide, as there are already many good explanations out there; I will just quickly point you to [wikipedia](http://en.wikipedia.org/wiki/Model_View_ViewModel) and its [explanation on the Knockout site directly](http://knockoutjs.com/documentation/observables.html#mvvm_and_view_models). If you are not up for clicking those links, MVVM is an architectural design pattern – like [Model-View-Controller](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) (MVC) – but is similar to the [Model-View-Presenter](http://martinfowler.com/eaaDev/uiArchs.html) (MVP) pattern. In basic terms, the ViewModel of MVVM is similar to the Presenter of MVP in so much as the View is responding to changes on an abstraction of the Model rather than directly on the Model. However, they differ in that the ViewModel is an abstraction of not only the properties of the Model but also provides an API that reflects the actions taken by a View that in turn affect the state of the Model; the Presenter from MVP has more of a role in being knowledgable about the View directly – subscribing to events and accessing the View’s API. These are both markedly different from the MVC approach in which the Controller is only responsible for updating the Model in response to user actions on the View – providing an indirect relationship of the View to the Controller in which the state of the View is directly related to the state of the Model.

### Data Binding and Observables

At the heart of [Knockout](http://knockoutjs.com/)’s MVVM implementation is _data binding_. If you stumbled upon here and are coming from the Flex world, the concept of data binding is probably all too familiar. In basic terms, data binding is a process in which one party, bound to a change on another party, is automatically updated to reflect that change when it occurs. Most notably, data binding is utilized in updating UI that is bound to a model representing state. 

In broader terms, data binding utilizes the **Observer Pattern**. If you are familiar with subscribing to events and assigning handlers that respond to change in UI, then you are already aware of using an **Observer**. Within the implementation of the data binding concept, the subscription and publishing mechanisms are hidden away and as a change to the _subject_ (the one subscribed to) occurs, they change is published to a _dependent_ (the subscriber). What i mean by “hidden away” is that you as a developer do not directly establish this relationship by setting up event listeners and implementing the logic in response to a change in state. Libraries that allow for data binding provide a way in which you can establish this relationship which is then wired behind the scenes. Again, if you are coming from the Flex world, this is familiar in the use of curly brackets ({}) in-line in your MXML or (my preference) the methods of the _BindingUtils_ class.

Using Knockout, you define _observables_ which dispatch notifications when changes to a value occur. Properties on a ViewModel are defined with observables to which an element can be bound, creating a dependency that is reflected in the rendering of the UI. Let’s get away from wordy word-words and see an implementation of a ViewModel and how it relates to declarations of elements on the DOM. At the core you will have your model object that defines – among other things – the **observables**:
    
    var model = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;title: ko.observable('Hello World'),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;items: ko.observableArray()
    
    };

If your dependency is on value change to one object – whether it be a string, number, boolean, object, etc. – you use _ko.observable_ as defined in this example for the _title_ property on the **model** object. If you want to detect and notify of changes to a collection of objects, you use _ko.observableArray_. You can also define **dependent observables** which are properties that are updated based on the value of other observables. Just a quick example of dependent observables:
    
    model.greeting = ko.dependentObservable( function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return this.title + ', how are ya?';
    
    }, model );

These observables and their notifications are then managed once you register the model:
    
    ko.applyBindings( model );

On the HTML side, you use the datasets to define the binding definitions. [Knockout](http://knockoutjs.com/) recognizes the **data-bind** attribute on elements of the DOM and – in broad, general terms – evaluates the attribute value as a binding expression. As a quick example of how this would look in using the model from the previous examples, the mark-up would look something like the following:
    
    <header>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<hgroup>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<h1 data-bind="text: title"></h1>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<h2 data-bind="text: greeting"></h2>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</hgroup>
    
    </header>
    
    <section>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<nav>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<ul data-bind='foreach: items'>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<li class='list-item'>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<a data-bind="attr: {href:url}, text: label"></p>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</li>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</ul>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</nav>
    
    </section>

As changes to the _title_ property on the model occur, both items in the header group will be updated on the DOM (_greeting_ because of its dependency on _title_), and as the _item_ collection changes so will the un-order list, with the declared list item serving as the item renderer to be used in adding child elements to the list (more on that in the next section).

Properties are updated by _invoking_ the observable. That may seem a little strange at first, as you are probably more familiar with updating object properties using the = expression. But the properties, once declared as _ko.observables_, are actually not the primitive objects they represent and are functions themselves. So if we were to update the properties on the model in the previous examples, that would be done as in the following:
    
    model.title( 'Hello Again' );
    
    model.items( [
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{label:'foo', url:'[http://foo.com](http://foo.com)'},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{label:'bar', url:'[http://bar.com](http://bar.com)'}
    
    ] );

And that is important to remember, as the same goes for accessing the property value. Accessing **model.title** will actually return the observable function, not the string value. To get the underlying value, you use _ko.utils.unwrapObservable_, as in the following example:
    
    var titleValue = ko.utils.unwrapObservable( model.title() );

You can also subscribe to changes explicitly in JavaScript, and if you are coming from the Flex world, this is pretty much like the BindingUtils:
    
    var itemSubscription = model.items.subscribe( function( collection ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// do something really cool that will win you friends and influence others.
    
    });
    
    ...
    
    // No longer need to win friends and influence others.
    
    itemSubscription.dispose()

That is just a birds-eye-view quick run-down of how the view model plays a part in knockout, and i really encourage you to check out the document on their site to see all of what is capable: [http://knockoutjs.com/documentation/introduction.html](http://knockoutjs.com/documentation/introduction.html).

### Control Flow

If you’ve looked at those examples or are familiar with [Knockout](https://github.com/SteveSanderson/knockout) and have checked out the [massroute-js/knockout example I put on github](https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/knockout), you might see that things are set up a bit different. Indeed they are; I had begun my example using knockout-1.2.1.js, but had found this post toward the end of my finishing the example: [http://blog.stevensanderson.com/2011/08/31/knockout-1-3-0-beta-available/](http://blog.stevensanderson.com/2011/08/31/knockout-1-3-0-beta-available/). I was so taken with the changes to _Control Flow Bindings_, that I moved my example to that. If this is all new to you and that last sentence was complete gibberish, I’ll explain; I just wanted to give a heads up if any of you were curious enough to check out their current examples and look at [my project on github](https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/knockout).

What I take away from the concept of _Control Flow Binding_, is that you can define (and Knockout with manage) the existence of DOM elements based on a ViewModel condition. If you are coming from the Flex world, you can think of it somewhat in terms of the State API and state-based declarations for elements, such as _includeIn_ and _excludeFrom_. But it goes a little farther in that, in so much as it is also allows for and is used in rendering whole graphs of DOM elements based on a condition and model data. A common example is lists, and the UI elements you define are the item renderers – depending on the existence of a collection, graphs of defined HTML elements are rendered, added to the DOM and handed data.

Prior to the current work on [Knockout](http://knockoutjs.com/) that is in beta and [available from the projects github](https://github.com/SteveSanderson/knockout), there was a dependency on an external templating engine – for example, [jquery-tmpl](http://api.jquery.com/category/plugins/templates/) which was commonly the go-to engine since there is already a dependency on [jQuery](http://jquery.com/) -that would allow you to define UI elements to use in deferred rendering within the Control Flow and state of the target ViewModel. In the [latest beta for Knockout](https://github.com/SteveSanderson/knockout/tree/master/build/output), you can now declare those elements inline within the document and the library will handle the existence and rendering based on the defined condition.

To give a quick example, here is the whole section in the [massroute-js/knockout](https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/knockout) project that displays the list of routes available from the real-time MBTA feed:
    
    <section id="routesection" data-bind="visible: routes.visible">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<h1 data-bind="text: routes.title"></h1>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<p data-bind="if: routes.list().length === 0">loading...</p>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<nav data-bind="if: routes.list().length > 0">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<ul data-bind='foreach: routes.list'>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<li class='route-item list-item icon-list-item' style='cursor: pointer;'>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<figure>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<img src='style/image/bus_icon.png' />
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<figcaption data-bind="text: title"></figcaption>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</figure>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</li>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</ul>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</nav>
    
    </section>

If this is example you are seeing that utilizes the [Knockout](http://knockoutjs.com/) library, i will just quickly mention that Knockout recognizes the _data-bind_ attribute and interprets the value as an expression allowing you to associated DOM elements with a ViewModel declaratively. It is too much of a discussion to go into the dataset attribute and their usage, but wanted to give a brief explanation of how it is relevant to this snippet and will now defer you to this documentation: [http://dev.w3.org/html5/spec/Overview.html#embedding-custom-non-visible-data](http://dev.w3.org/html5/spec/Overview.html#embedding-custom-non-visible-data)

To get a clearer picture of _Control Flow_ and element templating, take a look at the <ul> and <li> fragments of this example. A _foreach_ is declared on the binding for the **ul** element, which in turn will render a new instance of the list item declared within the ul for this example. In simpler terms, this allows us to define the item renderer for the list declaratively inline within the control flow definition. A pretty cool addition to the library, and one in which, even though i am just test-driving Knockout, warranted me using [Knockout 1.3.0 beta](https://github.com/SteveSanderson/knockout/tree/master/build/output) to do away with using another dependency on a template engine.

There are also some other additions to the library which I am excited to try out, most notably Binding Providers and Throttling. Check out this post from [Steven Sanders](http://blog.stevensanderson.com/) about [Knockout 1.3.0 Beta](https://github.com/SteveSanderson/knockout/tree/master/build/output): [http://blog.stevensanderson.com/2011/08/31/knockout-1-3-0-beta-available/](http://blog.stevensanderson.com/2011/08/31/knockout-1-3-0-beta-available/).

### Links

I encourage you to check out the Knockout home page at [http://knockoutjs.com/](http://knockoutjs.com/) and the awesome interactive tutorials they have available at [http://learn.knockoutjs.com](http://learn.knockoutjs.com). You can also checkout the latest developments from github – [https://github.com/SteveSanderson/knockout](https://github.com/SteveSanderson/knockout) – and, again, check out what is coming in the next version from this nice article: [http://blog.stevensanderson.com/2011/08/31/knockout-1-3-0-beta-available/](http://blog.stevensanderson.com/2011/08/31/knockout-1-3-0-beta-available/).

You can checkout the rest of my massroute-js/knockout example on github here: [https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/knockout](https://github.com/bustardcelly/massroute-js/tree/master/massroute-examples/knockout). Questions, comments and constructive berating are welcome (though not so much the last one).

Posted in [JavaScript](http://custardbelly.com/blog/category/javascript/), [jquery](http://custardbelly.com/blog/category/jquery/), [knockoutjs](http://custardbelly.com/blog/category/knockoutjs/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – November 14, 2011
  *[November 14, 2011]: 2011-11-14T10:07
