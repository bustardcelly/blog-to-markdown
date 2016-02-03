---
title: 'jQuery Mobile + CouchDB: Part 7.2 – Authorization and Validation'
url: 'https://custardbelly.com/blog/2011/03/04/jquery-mobile-couchdb-part-7-2-authorization-and-validation/'
author:
  name: 'todd anderson'
date: '2011-03-04'
---

In my [previous post](https://custardbelly.com/blog/?p=360), I covered authorization and validation on the [CouchDB](http://couchdb.apache.org/) side. We set up an administrator, created a user or two and established a **user-role** for our **albums** database that will be used in validation on document operations based on the user context of a session. We got to write some code – our **validate_doc_update** – but mainly it was all clicking around and filling in fields in [Futon](http://127.0.0.1:5984/_utils/). Necessary stuff, mind you… but let’s get back to code. More importantly, let’s get back to our [jQuery Mobile](http://jquerymobile.com/) application. We didn’t even touch it in the last mini-series in a series.

In this article I am going to address showing a **Log In/Sign Up** dialog in our [jQuery Mobile](http://jquerymobile.com/) application. Instead of forcing a user to log in upon first landing on our application (as we saw when setting up **Security** on our database in the past article), we are going to present the dialog when a user tries to perform an operation that requires session and user validation. The way we have set up the **albums** database in [CouchDB](http://couchdb.apache.org/) is that everyone can view all the **album** documents, but only users of the **albums** database (those assigned with a **user-role** of “_albums-user_“) are allowed to add new **album** documents and only those associated users of a document are allowed to edit and delete their **album** document. So, from a client-side perspective, the dialog will be shown on **Add**, **Edit** and **Delete** if a previous session for the user has not been established.

Actually, it is probably a little misleading to say we will be doing all this in [jQuery Mobile](http://jquerymobile.com/). I am actually going to incorporate [jQuery](http://jquery.com/) concepts into our [jQuery Mobile](http://jquerymobile.com/) application. We are going to present the dialog as a [jQuery](http://jquery.com/) **widget** and manage the communication through a [jQuery](http://jquery.com/) **plugin** for our application. So as far as the [jQuery Mobile](http://jquerymobile.com/) framework is concerned, we won’t be learning anything new per se – we’ll be learning how to incorporate [jQuery](http://jquery.com/) **widgets** and **plugins** into our application. In previous articles, the main bulk of [jQuery](http://jquery.com/) we have employed has been using accessors and modifiers for elements/events within our [jQuery Mobile](http://jquerymobile.com/) application. We have also gotten familiar with the _jquery.couch_ plugin that comes with [CouchDB](http://couchdb.apache.org/) and handles most (if not all) the communication points we need for our application. So working with the [jQuery](http://jquery.com/) library is not all that unfamiliar.

Right. Didn’t i say there will be more coding in this article? What am i doing yammering on? Its time to put your [jQuery](http://jquery.com/) hats on, because its about to get a whole lot more fun*!

_*guarantees not included._

## Template

We are going to create a **login dialog** pretty much as your standard form with the option to either “_log in_” or “_sign up_” (if i ever don’t use the space in those and it bothers you, i apologize. its become a little habit). In our planning, we currently want the dialog to appear in at least 3 places based on an operation that requires session and user validation – **Add**, **Edit** and **Delete**. Down the road, there could be more. We could add a login button to some or every page to allow to login at any time within the application. We’ll stick to the 3 operations for now, but in knowing that the same visual piece will be used in multiple places throughout the application, it makes for a good case to use a template for the UI of our login dialog.

We learned about templates on the [CouchDB](http://couchdb.apache.org/) side previously – using [Mustache](https://github.com/janl/mustache.js/) and **Partials** to create our views. Same concept. We want to be able to declare some mark-up in one place that will be rendered in the **DOM** upon request from anywhere in the application. To do that, we’ll use the [jquery.tmpl](http://github.com/jquery/jquery-tmpl) plugin available at: [http://github.com/jquery/jquery-tmpl](http://github.com/jquery/jquery-tmpl). Why jquery.tmpl? It is simple to use and – though still in beta – is considered an [official jQuery plugin](http://www.borismoore.com/2010/10/jquery-templates-is-now-official-jquery.html), so documentation can be found on the [jQuery](http://jquery.com/) site at: [http://api.jquery.com/jquery.tmpl/](http://api.jquery.com/jquery.tmpl/). In any event, make sure to download the jquery.tmpl plugin from [http://github.com/jquery/jquery-tmpl](http://github.com/jquery/jquery-tmpl) as we are going to use it for our login dialog.

With _jquery.tmpl_ downloaded and added to the _/vendor/couchapp/_attachments/_ folder of our **albums** [coucapp](http://couchapp.org/page/index) directory (in following the examples within this series, for me that directory is _/Documents/workspace/custardbelly/couchdb/albums_), open up the _loader.js_ file from that same directory and save the following modification to include the _jquery.tmpl_:

_/vendor/couchapp/_attachments/loader.js_
    
    function couchapp_load(scripts) {
    
      for (var i=0; i < scripts.length; i++) {
    
        document.write('<script src="'+scripts[i]+'"><\/script>')
    
      };
    
    };
    
     
    
    couchapp_load([
    
      "/_utils/script/sha1.js",
    
      "/_utils/script/json2.js",
    
      "vendor/couchapp/jquery-1.4.4.js",
    
      "/_utils/script/jquery.couch.js",
    
      "vendor/couchapp/jquery.couch.app.js",
    
      "vendor/couchapp/jquery.couch.app.util.js",
    
      "vendor/couchapp/jquery.mustache.js",
    
      "vendor/couchapp/jquery.evently.js",
    
      "vendor/couchapp/jquery.mobile-1.0a2.js",
    
      "vendor/couchapp/jquery.tmpl.js"
    
    ]);

Pretty straight forward; just adding the _jquery.tmpl_ **plugin** to be loaded into the **DOM**. Now we need to declare the mark-up for our **login dialog**. We’ll just add it to our main page and its usage will be revealed later. For now, open up the _/_attachments/index.html_ file and save the following script tag and content between the previously declared script tags for the _loader.js_ and our application script:
    
    <script src="vendor/couchapp/loader.js"></script>
    
    <script id="loginSignupDialog" type="text/x-jquery-tmpl">
    
        <div role="dialog" data-backbtn="false" class="ui-dialog ui-body-a">
    
          <div class="ui-header ui-bar-a ui-corner-top ui-overlay-shadow">
    
        <h1 class="ui-title"></h1>
    
        <a id="dialogCloseButton" href="#" data-icon="delete" data-iconpos="notext" style="left: 15px; top: .4em; position: absolute;" />
    
          </div>
    
          <div data-role="content" class="ui-body-c ui-corner-bottom ui-overlay-shadow">
    
            <p>You need to be logged in to do that!</p>
    
            <form action="#" method="post">
    
              <label for="username">Username:</label>
    
              <input type="text" name="username" id="username" value=""  />
    
              <label for="password">Password:</label>
    
              <input type="password" name="password" id="password" value="" />
    
              <a id="submitButton" href="#" type="submit" data-role="button" data-theme="b">Submit</a>
    
              <hr/>
    
              <a id="optionLinkButton" href="#" />
    
            </form>
    
          </div>
    
          <div data-role="footer" />
    
        </div>
    
    </script>
    
    <script type="text/javascript" charset="utf-8">
    
         $db = $.couch.db("albums");

The **loginSignupDialog** template looks pretty familiar if you have been following along in this series. It is just a hacked up [jQuery Mobile](http://jquerymobile.com/) page dialog with a form – looks pretty much what our _albumdelete.html_ **template** we created before but with a form in it. You may notice that the header and **optionLinkButton** have no textual content. That will be updated based on the state of the dialog (login or signup). We’ll get to that later. What is important is to know that this template declaration can be rendered using the following:
    
    $("#loginSignupDialog").tmpl()

Once it has been rendered it can be added to the **DOM** as you normally would with [jQuery](http://jquery.com/) (eg, _appendTo_()), but since we are developing in the context of a [jQuery Mobile](http://jquerymobile.com/) application, we will treating it as a page in the application. Things to remember and will act upon later.

Also important to note is the type attribute of the **template** declaration – _text/x-jquery-tmpl_. That is so the **HTML** parser knows to treat that markup as a string and not try to parse and add to the **DOM**. Without that type, you likely will get a parse error when viewing your application in a browser. The plugin does not search for the explicit type value of _text/x-jquery-tmpl_ in order to due its rendering, it just needs to have some denotation for the browser engine to recognize not to render the content to the **DOM** – _text/x-jquery-tmpl_ is just easier to recognize what is being reserved as a [jQuery](http://jquery.com/) template by human readers.

## Organization and Re-use

Up to this point in the series, if you have been following along, the extent of our working with [jQuery](http://jquery.com/) has been in accessing and modifying the **DOM**. We’ve used the [jQuery Mobile](http://jquerymobile.com/) API mainly to listen for events and change pages. The extent of working with the [jQuery Mobile](http://jquery.com/) framework has been more under the hood – which i believe is the intent – though we have employed some hacks to get things to work as we would like. So, the **JavaScript** we have done up until this point has been to manipulate the **DOM** associated with a particular view – we created our **Partials** as quasi-view controllers and we have some script related to the [jQuery Mobile](http://jquerymobile.com/) pages we have defined in _index.html_.

That’s fine. I might do some things a little different if this was going to get my seal of approval, but we were having fun. I’m gonna get a little more organized now, however, and use some great functionality and **API** available to us just by loading [jQuery](http://jquery.com/) and [jQuery Mobile](http://jquerymobile.com/) that we have been foolishly ignoring. Not really ignoring… we just never had a really strong use case to address it until now.

We are going to employ two architectural concepts of jQuery in order to present our login dialog and authenticate session with our [CouchDB](http://couchdb.apache.org/) instance: **widgets** and **plugins**.

Before we dive into some code, perhaps I should clarify how I interpret each concept as really they can be somewhat interchangeable and used in the same fashion. For instance they both can target an element like so:
    
    $("#myElement").something();

It is typically the _something_() invocation, for me, that sets them apart (aside from the code behind the _something_()). If it is a directive to manipulate the element or its ancestry in the **DOM**, then it is a plugin. If it is a call to decorate the element in such a way that it looks and behaves in a manner usually not associated with that element, then i consider it a **widget** _(in fact, as we will discuss later, there is more to this in terms of a factory/builder plugin for widgets)_. Say for instance: **$(”#myElement”)**._slider_() would manipulate the contents of **#myElement** to behave like a slider control.

And then of course, plugins can declare a global access variable and define an **API**, as we have seen with **$.mobile** (_jquery-mobile-1.0a2.js_) and **$.couch** (_jquery.couch.js_), which takes the **plugin** concept from being more of a “utility” method on element(s) to that of a library.

Of course, I could be totally off-base in how i interpret these concepts and am open to discussion. If you have different interpretations or more insight please leave a comment.

## Widget

Truthfully, a **widget** is more tied with the [jQuery UI](http://jqueryui.com/) library. Included in the development-bundle source for [jQuery UI](http://jqueryui.com/) is a _jquery.ui.widget_ script that defines the **widget** factory/builder and the defined UI **widget** elements with the **jquery.ui.*** namespaced file name. We are not going to load the [jQuery UI](http://jqueryui.com/) library as well, since [jQuery Mobile](http://jquerymobile.com/) basically contains that script from _jquery.ui.widget_ and extends it to **mobile.widget** to preform some string manipulation on the data attribute. In fact, most of the controls (and even page!) that are “mobilized” are widgets.

So we have **$.widget** at our disposal (thanks to [jQuery Mobile](http://jquerymobile.com/)). We’ll use the **$.widget** factory to create a **login dialog** widget to provide functional logic to our **login template** create previously in this article. In this sense, you can think of the **login dialog widget**, itself, as a sort of presenter. We can go about mucking around with the layout and such of our template and wire up our widget to respond to events from elements in our view.

Before we dive right in to some code, I wanted to touch on some finer points so when we take a look at how our **login dialog widget** is created we might have a clearer understanding of its construction. **$.widget** is considered a factory method to create custom widgets and is an extension of **$.Widget** (capital W). **$.Widget** itself acts as sort of a builder. Upon widget-ization of an element, __init_() and __create_() hook methods are invoked and available for override in our custom **widget**. There are also some methods for options, enablement, and for triggering events (__trigger_()) to name a few. But most importantly, there is a _destroy_() method. To squash any memory leaks, we must tidy up our mess. 

So, to break it down, **$.Widget** provides a lifecycle method template and is the builder of our **widget**. **$.widget** is a factory method for creating custom widgets and allows us to widget-ize elements based on the name of our widget. _What the hell does that mean?_ If we create a widget using the **$.widget** factory and provide it a name of “_albums.loginDialog_“, we can widget-ize our template as such:
    
    $("#loginSignupDialog").tmpl().loginDialog()

In fact, that is essentially what we are going to do… but we first lets cover how we’re going to do it. For some extra reading, this is a great article form [jQuery UI](http://jqueryui.com/) explaining the widget factory: [http://jqueryui.com/docs/Developer_Guide](http://jqueryui.com/docs/Developer_Guide). There is also this excellent write up i found by [Eric Hynds](http://www.erichynds.com): [http://www.erichynds.com/jquery/tips-for-developing-jquery-ui-widgets/](http://www.erichynds.com/jquery/tips-for-developing-jquery-ui-widgets/).

Less talk. More code. Open up your favorite editor and save the following snippet as _jquery.albums.loginDialog.js_ in the _/_attachments/script_ directory of the **albums** [couchapp](http://couchapp.org/page/index) (for me that directory is _/Documents/workspace/custardbelly/couchdb/albums_):

_/_attachments/script/jquery.albums.loginDialog.js_
    
    (function( $ ) {
    
     
    
      $.widget( "albums.loginDialog", {
    
     
    
        options: {
    
          state: 0, // 0 - log in state. 1 - sign up state.
    
          loginText: "Log In",
    
          signUpText: "Sign Up"
    
        },
    
     
    
        _create: function() {
    
          var ops = this.options;
    
          var $element = this.element;
    
     
    
          // Current page reference.
    
          var currentPage = $.mobile.activePage;
    
          var pageLink = currentPage.attr( "id" );
    
          // It is an internal page link.
    
          if( pageLink.indexOf( ".html" ) == -1 ) pageLink = "#" + pageLink;
    
          var closeButton = $element.find( "div[class*='ui-header'] a#dialogCloseButton" )
    
                                    .attr( "href", pageLink );
    
          // Hold reference in custom data expando.
    
          $element.data("previous", pageLink );
    
     
    
          // Wrap the content in a dialog page.
    
          var wrapper = this._wrapDialog( $element );
    
          // Wire interactions.
    
          this._wire();
    
          this._changeState( ops.state );
    
          // For some reason, i have to add it to the DOM in order to changePage() to it.
    
          $("body[class*=\"ui-mobile-viewport\"]").append(wrapper);
    
          $.mobile.changePage( [currentPage, wrapper], "pop", false );
    
        },
    
     
    
        _setOption: function( key, value ) {
    
          this._changeState( ( key == "state" ) ? value : this.options.state );
    
          jQuery.Widget.prototype._setOption.apply( this, arguments );
    
        },
    
     
    
        _wrapDialog: function( dialogElement ) {
    
          // Page wrapper usually created on external page.
    
          var dialogPage = $("<div data-role=\"page\">");
    
          dialogPage.append( dialogElement );
    
          dialogPage.page();
    
     
    
          dialogPage.bind( "pagebeforeshow", function() {
    
              dialogPage.unbind( "pagebeforeshow" );
    
              var h = parseFloat(dialogPage.innerHeight());
    
              h -= ( parseFloat(dialogElement.css("border-top-width")) + parseFloat(dialogElement.css("border-bottom-width")) );
    
              // define the height based on innerHeight of wrapping parent page and the border styles applied to a dialog.
    
              dialogElement.css( "height", h + "px" );
    
          });
    
          dialogPage.bind( "pagehide", function() {
    
              dialogPage.unbind( "pagehide" );
    
              dialogPage.empty();
    
              dialogPage.remove();
    
          });
    
          return dialogPage;
    
        },
    
     
    
        _changeState: function( state ) {
    
          var mainText = ( state == 0 ) ? this.options.loginText : this.options.signUpText;
    
          var optionText = ( state == 0 ) ? this.options.signUpText : this.options.loginText;
    
          var $element = this.element;
    
          var header = $element.find( "div[class*='ui-header']" );
    
          var page = $element.find( "div[data-role='content']" );
    
          var title = header.find( "[class*='ui-title']" );
    
          var optionLinkButton =  page.find( "#optionLinkButton" );
    
          var submitButton = page.find( "a[aria-label='submit']" );
    
          title.html( mainText );
    
          optionLinkButton.html( optionText + "?" );
    
          submitButton.html( mainText );
    
          submitButton.buttonMarkup();
    
        },
    
     
    
        _wire: function() {
    
          var ref = this;
    
          var $element = ref.element;
    
          var ops = ref.options;
    
          var page = $element.find("div[data-role='content']");
    
          var optionLinkButton = page.find( "#optionLinkButton" );
    
     
    
          optionLinkButton.bind( "click", function(event) {
    
            event.preventDefault();
    
            // toggle state.
    
            ref._setOption( "state", ( ops.state == 1 ) ? 0 : 1 );
    
            return false;
    
          });
    
     
    
          $element.bind( "submit", function(event) {
    
            event.preventDefault();
    
            var username = $element.find( "input#username" ).val();
    
            var password = $element.find( "input#password" ).val();
    
            var uievent = ( ops.state == 0 ) ? "login" : "signup";
    
            var ui = {name:username, password:password};
    
            ref._trigger( uievent, {type:uievent}, ui );
    
            return false;
    
          });
    
        },
    
     
    
        _unwire: function() {
    
          var $element = this.element;
    
          var page = $element.find( "div[data-role='content']" );
    
          var optionLinkButton =  page.find( "#optionLinkButton" );
    
          optionLinkButton.unbind( "click" );
    
          $element.unbind( "submit" );
    
        },
    
     
    
        close: function() {
    
          var $element = this.element;
    
          this._trigger( "close", {type:"close"} );
    
          $.mobile.changePage( $element.data("previous"), undefined, false );
    
        },
    
     
    
        destroy: function() {
    
          this._unwire();
    
          // jQuery Mobile keeps adding a Submit button substitue to the template upon show,
    
          // Lets remove it here.
    
          var $element = this.element;
    
          var page = $element.find( "div[data-role='content']" );
    
          var submitButton = page.find( "a[aria-label='submit']" );
    
          submitButton.remove();
    
          // super destroy.
    
          jQuery.Widget.prototype.destroy.call( this );
    
          this.element = null;
    
        }
    
     
    
      });
    
     
    
    })(jQuery)

You wanted code? You got it ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) I am not going to go into explaining the under-workings of **$.widget** or **$.Widget** but more the work we have here that relates to [jQuery Mobile](http://jquerymobile.com/) and our application. Again, if you are curious, [jQuery UI](http://jqueryui.com/) has some great documentation at [http://jqueryui.com/docs/Developer_Guide](http://jqueryui.com/docs/Developer_Guide) and you can also look at the **JavaScript** source for [jQuery Mobile](http://jquerymobile.com/). That is chock full of widgets. And then there is this awesome write up by [Eric Hynds](http://www.erichynds.com): [http://www.erichynds.com/jquery/tips-for-developing-jquery-ui-widgets/](http://www.erichynds.com/jquery/tips-for-developing-jquery-ui-widgets/).

Now, let’s step through it… If you are being introduced to [jQuery](http://jquery.com/) by this article series: **a)** i hope i have not mislead you in my explanations and **b)** this might be the first time you have seen this anonymous function declaration:
    
    (function( $ ) {
    
    ...
    
    })(jQuery)

There is more going on here (conflict resolution) than i will explain, but in essence this is a self-executing method that has a reference to [jQuery](http://jquery.com/). Basically, upon load any code within this anonymous function will be run and have access to [jQuery](http://jquery.com/) using the **$** token; once _jquery.albums.loginDialog.js_ is loaded, we invoke the **$.widget** factory method to create a **widget** accessible via _loginDialog_() on an element reference:

_/_attachments/script/jquery.albums.loginDialog.js_
    
    $.widget( "albums.loginDialog", {
    
    ...
    
    } );

The second argument to **$.widget** – the whole big object – is basically the meat of our **widget**; its got some declared default options, overidden inherited methods and some other private and public methods to make our **loginDialog** work. Our options are just some default values to set the initial state (either to _login_ or _signup_) and the textual content associated with the state. Our **login dialog** isn’t going to be very pretty or contain much content other than a form and a way to switch between _login_ and _signup_.

_/_attachments/script/jquery.albums.loginDialog.js_
    
    options: {
    
      state: 0, // 0 - log in state. 1 - sign up state.
    
      loginText: "Log In",
    
      signUpText: "Sign Up"
    
    },

When it enters __create_() (inheritance call from **$.Widget**), is when we do some real magic:

_/_attachments/script/jquery.albums.loginDialog.js_
    
    var $element = this.element;
    
     
    
    // Current page reference.
    
    var currentPage = $.mobile.activePage;
    
    var pageLink = currentPage.attr( "id" );
    
    // It is an internal page link.
    
    if( pageLink.indexOf( ".html" ) == -1 ) pageLink = "#" + pageLink;
    
    var closeButton = $element.find( "div[class*='ui-header'] a#dialogCloseButton" )
    
                              .attr( "href", pageLink );
    
    // Hold reference in custom data expando.
    
    $element.data("previous", pageLink );

The target element (the one widget-ized by calling **$(”#myElement”)**._loginDialog_()) is accessed using the this keyword and is available through the life of the **widget**. In order to get a reference to the current page prior to opening the **loginDialog**, we access the id value of **$.mobile**._activePage_ and determine if it is an external or internal page. We then pass that as the href value for the close button on the **loginDialog** and add a **data-previous** attribute to the target element. 

After the previous page has been determined to return to after login or signup, we then wrap the **dialog template** element in a page **div** listen for events, change the state to the default defined in options and change the page to the **loginDialog**:

_/_attachments/script/jquery.albums.loginDialog.js_
    
    // Wrap the content in a dialog page.
    
    var wrapper = this._wrapDialog( $element );
    
    // Wire interactions.
    
    this._wire();
    
    this._changeState( ops.state );
    
    // For some reason, i have to add it to the DOM in order to changePage() to it.
    
    $("body[class*=\"ui-mobile-viewport\"]").append(wrapper);
    
    $.mobile.changePage( [currentPage, wrapper], "pop", false );

You see that funky append before **$.mobile**._changePage_()?

_/_attachments/script/jquery.albums.loginDialog.js_
    
    $("body[class*=\"ui-mobile-viewport\"]").append(wrapper);

The comment above that line explains it, but for some reason i couldn’t just switch to this dynamically created page. Instead i had to add it quickly at the end of the body (accessed by the _ui-mobile-viewport_ class) and then was able to switch from the previous page to show a **loginDialog**. No big deal, just something to look out for. 

Most of what is in _jquery.albums.loginDialog_, if you have been following along, may be pretty familiar to you. We do the same sizing on _pagebeforeshow_ and emptying on _pagehide_, and change values based on state using [jQuery](http://jquery.com/). Your basic fanfare. I just wanted to touch on two more methods in _jquery.albums.loginDialog_: _close_ and _destroy_:

_/_attachments/script/jquery.albums.loginDialog.js_
    
    close: function() {
    
    var $element = this.element;
    
    this._trigger( "close", {type:"close"} );
    
    $.mobile.changePage( $element.data("previous"), undefined, false );
    
    },
    
     
    
    destroy: function() {
    
      this._unwire();
    
      // jQuery Mobile keeps adding a Submit button substitue to the template upon show,
    
      // Lets remove it here.
    
      var $element = this.element;
    
      var page = $element.find( "div[data-role='content']" );
    
      var submitButton = page.find( "a[aria-label='submit']" );
    
      submitButton.remove();
    
      // super destroy.
    
      jQuery.Widget.prototype.destroy.call( this );
    
      this.element = null;
    
    }

The _close_() method we have exposed and is not part of **$.Widget**. That just allows access to anyone with a reference to the created **loginDialog** to directly close it (as opposed to explicitly closing it within the dialog). You can see that we change the page by using the previous data value set on the element within __create_(). We also dispatch a “_close_” event using __trigger_(). The __trigger_() method is part of **$.Widget** and can be bound to like other events, yet the type is slightly different within the context of a **widget**. The type value is actually appended to the **widget** name, so if you were to listen for close on this:
    
    $("#loginSignupDialog").tmpl().loginDialog().bind( "logindialogclose", handleLoginDialogClose );

That’s one way to do it, though i often assign handlers by passing in a **callback** object like so:
    
    $("#loginSignupDialog").tmpl().loginDialog( {
    
            close: function( evt, ui ) {
    
                ...
    
            }
    
    });

We actually trigger two other events within our **loginDialog** – “_login_” and “_signup_” – which are dispatched upon submit based on current state. We’ll see how all this is handled a little later on in more code, but i quickly wanted to touch on something that looks odd in the _destroy_() override:

_/_attachments/script/jquery.albums.loginDialog.js_
    
    var $element = this.element;
    
    var page = $element.find( "div[data-role='content']" );
    
    var submitButton = page.find( "a[aria-label='submit']" );
    
    submitButton.remove();

When a form is added top the **DOM** through [jQuery Mobile](http://jquerymobile.com/), it actually duplicates and hides the originally declared **submit** button and decorates a that duplicate for display. In that decoration, it is given the **aria-label** attribute for accessibility. Not entirely a huge issue, but if you were to show the template form more than once, you would start to see n+ times the amount of submit buttons! So we just remove it in our _destroy_ override and move on.

Alright. Hopefully you are still with me. You may or may not have created your first [jQuery](http://jquery.com/) **widget**. Isn’t it glorious or not glorious, respectively? With our **template** and **widget** defined, now begs the question: _When do we show this thing?_

## Plugin

So you thought introducing two new concepts ([jQuery](http://jquery.com/) **templates** and **widgets**) was enough for one article? Well, in the words of television’s **Emeril**, ‘_We’re going to kick it up a notch!_‘ That’s actually probably a paraphrase. I don’t know the exact words he said and i don’t feel like googling it. I was just pandering to the developer crowd who enjoys watching cooking shows… Its a low point in this article and i am not proud of it. Let’s keep going.

If we step back and remember why we started doing all this business in this mini-series, we wanted to use validation on operations to our database documents. In the previous article we spoke of **user context**s, and updated our **album** document to require a user field. So, our main intent with this **loginDialog** is to verify a current session and then either login or signup a user. If the session is valid (user previously logged in) then, the user reference is stored and – dependent on the action – used in further transactions.

Now, we could just open the **loginDialog** all willy-nilly, here and there, and try to track down the persisted user across actions, but a saner approach (for me at least) is to encapsulate this logic in a **plugin**. You may be familiar with [jQuery](http://jquery.com/) **plugins**… actually we have been using them throughout this whole series. We just haven’t directly looked at how they are made or work. Like I did with our **widget** example, I am not going to go into a discussion of [jQuery](http://jquery.com/) **plugins** per se – I am going to try and focus on the task at hand and provide explanations as to how it pertains to our application as a whole. That said, to read more about [jQuery](http://jquery.com/) **plugins**, this is always a great place to start: [http://docs.jquery.com/Plugins/Authoring](http://docs.jquery.com/Plugins/Authoring).

Alright, we are going to take a little piecemeal approach to fleshing out our **plugin**, explaining as we go along, and I’ll provide it in its entirety afterward. To start, open up your favorite editor, create a file named _jquery.albums.app.js_ and save it in the _/_attachments/script_ folder of our **albums** [couchapp](http://couchapp.org/page/index) directory. Add the following:

_/_attachments/script/jquery.albums.app.js_
    
    (function($) {
    
     
    
      $.albums = $.albums || {};
    
      $.extend( $.albums, {
    
      });
    
     
    
    })(jQuery)

That is the start of our **albums** **plugin** which will be accessible by **$.albums**. We’re extending our (hopefully) newly created **$.albums** object to flesh out its public **API**. **$.albums** will serve as a facade/adaptor to the **$.couch** plugin and handle the display and event from the **loginDialog**. So there are roughly five main functions of out **$.albums** plugin:

  * Log In – Direct log in request.
  * Log Out – Direct log out request
  * Save Document – Request to Create or Update a document.
  * Delete Document – Request to Delete a document.

The **Log In** and **Log Out** methods mainly interface directly with **$.couch** and won’t deal with any UI. They are just facades to track the logged in user so we can properly send user data when creating or updating documents. The **Save Document** and **Delete Document** methods are more adaptors for **$.couch** communication – checking session and presenting the **loginDialog** if necessary. Update the _jquery.albums.app.js_ with the following:

_/_attachments/script/jquery.albums.app.js_
    
    (function($) {
    
     
    
      $.albums = $.albums || {};
    
      $.extend( $.albums, {
    
     
    
        dialog: undefined,
    
        database: undefined,
    
     
    
        logIn: function( name, password, options ) {
    
          doLogIn( name, password, options );
    
        },
    
     
    
        logOut: function( options ) {
    
          doLogOut( options );
    
        },
    
     
    
        saveDocument: function( document, options ) {
    
          checkSession( {
    
            available: function( userCtx ) {
    
              document.user = user;
    
              $.albums.database.saveDoc( document, options );
    
            },
    
            unavailable: function() {
    
              showDialog( options );
    
            }
    
          });
    
        },
    
     
    
        deleteDocument: function( document, options ) {
    
          checkSession( {
    
            available: function( userCtx ) {
    
              $.albums.database.removeDoc( document, options );
    
            },
    
            unavailable: function() {
    
              showDialog( options );
    
            }
    
          });
    
        }
    
     
    
      });
    
     
    
    })(jQuery)

So there we have our 4 public methods of **$.albums**. We have also added to public properties: **dialog** and **database**. These two will be the targets to the **loginDialog** template and a reference to our **albums** database, respectively. This is so we don’t rely so heavily on globally declared variables to do what we need in our nice little encapsulated **plugin**. In any event, if you have looked at the contents of these methods, they all call other functions that we haven’t declared yet. Lets start with _checkSession_() in **saveDocument** and **deleteDocument**. Add the following after the **$.extend** declaration and prior to close of _function_():

_/_attachments/script/jquery.albums.app.js_
    
    function checkSession( options ) {
    
        options = options || {};
    
        $.couch.session( {
    
          success: function( response ) {
    
            var context = response.userCtx;
    
            if( context.name == null ) {
    
              if( options.unavailable ) options.unavailable();
    
            }
    
            else{
    
              if( options.available ) options.available( context );
    
            }
    
          },
    
          error: function( status, error, reason ) {
    
            if( options.unavailable ) options.unavailable();
    
          }
    
        });
    
    }

The _checkSession_() does just that: request the current session established by our client through the **$.couch** plugin. If the **userCtx** comes back as null, there is no session and no logged in user on our end. We can try this out using **curl** on the command line:
    
    > curl -vX GET http://127.0.0.1:5984/_session
    
    < {"ok":true,"userCtx":{"name":null,"roles":[]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"]}}

Depending on the value of **userCtx**, _checkSession_() will invoke an _available_() or _unavailable_() **callback** method on the anonymous options argument. The available responder on _saveDocument_() and _deleteDocument_() is different – one saves, the other deletes – but if unavailable is entered, they both call _showDialog_(). Append the following script to _jquery.albums.app.js_ after the _checkSession_() declaration:

_/_attachments/script/jquery.albums.app.js_
    
    function showDialog( options ) {
    
        $.albums.dialog.loginDialog( {
    
          login: function( evt, ui ) {
    
            doLogIn( ui.name, ui.password, {
    
              success: function( response ) {
    
                $.albums.dialog.loginDialog( "close" );
    
              },
    
              error: function( status, error, reason ) {
    
                alert( "Error: " + error + ", " + reason );
    
              }
    
            });
    
          },
    
          signup: function( evt, ui ) {
    
            doSignUp( ui.name, ui.password, {
    
              success: function( response ) {
    
                $.albums.dialog.loginDialog( "close" );
    
              },
    
              error: function( status, error, reason ) {
    
                alert( "Error: " + error + ", " + reason );
    
              }
    
            });
    
          }
    
        });
    
    }

Hey! That’s using our **widget**! I don’t know why i seriously get excited when i see that… In any event, there it is in all its glory. The **login template** will be handed to **$.albums** and we’ll widget-ize it within the _showDialog_() invocation:
    
    $.albums.dialog.loginDialog( {
    
    ...
    
    });

If you remember back when we created the **widget**, it will dispatch two events when submitted based on state: _login_ and _signup_. Here we have added the **callbacks** to those events which in turn call either _doLogIn_() or _doSignUp_(). We’ll get to that in a bit, but i wanted to point out the success responders in the anonymous **callback** objects we pass to those methods:
    
    success: function( response ) {
    
        $.albums.dialog.loginDialog( "close" );
    
    }

If we have passed being logged in/signed up, we close the **loginDialog**. We exposed the _close_() method in _jquery.albums.loginDialog.js_, but its important to note that you cannot call _close_() using dot-notation like a property. The reason is that we are not holding a reference to the **loginDialog**. Calling **$(”#myElement”)**._loginDialog_() just decorates the target element on the **DOM**. We can still interface with **$(”#myElement”)** but those methods associated with the **widget** are not then accessible on the target element. So we call a public method through _loginDialog_().

OK. So _doLogin_(), _doLogout_() and _doSignUp_() are yet to be covered. For some reason i have this convention where if it is considered an internal response to a public invocation i prepend ‘_d_o’ to the public method name. Some people prefer “___“. To each his own. Just if you are wondering… Let’s tackle the login and logout first, as they are easy. Add the following script to _jquery.albums.app.js_ somewhere after the **$.extend** declaration and prior to the end of the _function_() block:

_/_attachments/script/jquery.albums.app.js_
    
    var user; /* _user > document.name */
    
     
    
    function doLogIn( name, password, options ) {
    
        options = options || {};
    
        var loginObj = {
    
          name:name,
    
          password:password,
    
          success: function( response ) {
    
            user = response.name;
    
            if( options.success ) options.success( response );
    
          },
    
          error: function( status, error, reason ) {
    
            if( options.error ) options.error( status, error, reason );
    
          }
    
        };
    
        $.couch.login( loginObj );
    
    }
    
     
    
    function doLogOut( options ) {
    
        options = options || {};
    
        $.couch.logout( {
    
          success: function( response ) {
    
            user = undefined;
    
            if( options.success ) options.success( response );
    
          },
    
          error: function( status, error, reason ) {
    
            if( options.error ) options.error( status, error, reason );
    
          }
    
        })
    
    }

Again, we are just interfacing with the **$.couch** plugin to perform the _login_() and _logout_(). The only reason we go through **$.albums** instead of **$.couch** directly is to maintain the **user**, which we have privately declared. That user value is the one assigned to the user field of a document when a new **album** document will be created and saved through **$.albums** using _saveDocument_().

Alright, **Sign Up** is where the magic happens. Signing a user up through **$.couch** is a little trickier. In [Futon](http://127.0.0.1:5984/_utils) it is all easy-peasy as we saw in the last article in this mini-series in a series. Now that we have taken our [CouchDB](http://couchdb.apache.org/) instance out of **Admin Party** mode, the **$.couch**._signUp_() method won’t work unless we are logged in as an admin. We don’t want to take the approach of [Futon](http://127.0.0.1:5984/_utils) for the User Experience for our little application here. Our application shouldn’t act as an admin console to the [CouchDB](http://couchdb.apache.org/) database as well as its current function of just adding, updating and deleting **album** documents. 

We going to secretly log in as an admin behind the scenes and set our new user up for gold and start adding documents. So, **Sign Up** is actually going to be a series of commands just to sign someone up, assign their proper **user-role** and create their session to allow them to start working with **album** documents. That sequence in readable terms is:

  1. Log In as Admin
  2. Sign Up new User
  3. Open new User document
  4. Add “albums-user” User Role to new User
  5. Log Out as Admin
  6. Log In as new User

Maybe the _jquery.couch_ plugin has changed since the last revision i checked out, but that is the order of things to _signup_ and _login_ a new user as far as i understand. The signature for **$.couch**._signUp_() method has no arguments for administration to do this more streamlined, so we are going to create a chain of commands to signup a new user a little more efficiently. Now, in actuality, i would turn to a server-side developer and ask pretty-please that they implement a proxy in whatever language to do this and not handle it all in **JavaScript** (especially since we are going to expose our admin credentials – _HIDE YOUR CHILDREN_!), but we’re having fun and not going to production with this, right? We’re taking some liberties to explore what we have…

Now, if you have not figured out yet in following these articles, i can get a little anal. But it isn’t about everything. I seem to get focused on one thing that really irks me. And one of those things is deeply nested anonymous **callbacks**. Sure i am guilty of doing it and when i do it i feel dirty, but i usually let it go if its not nesting too deep. This sequence of actions for **Sign Up**, however, i can foresee being really ugly if we just went with anonymous **callback** objects down the line. So what i did was create **Queue** and **Command** “classes” to keep my sanity. The following is the script for that. Open a new document in your favorite editor (we’ll get back to _jquery.albums.app.js_ in a bit) and save the following script as _command_queue.js_ in _/_attachments/script_:

_/_attachments/script/command_queue.js_
    
    (function(window) {
    
     
    
        function Commandable() {}
    
        Commandable.prototype.execute = function( data ){};
    
     
    
        function Queue( ops ) {
    
            this.options = ops || {};
    
            this.list = [];
    
            this.command;
    
     
    
            this.addCommand = function( command ) {
    
                var length = this.list.length;
    
                if( length > 0 ) {
    
                    this.list[length-1].nextCommand = this;
    
                }
    
                this.list.push( command );
    
            }
    
        }
    
        var q = Queue.prototype = new Commandable();
    
        q.options = undefined;
    
        q.list = undefined;
    
        q.command = undefined;
    
        q.constructor = Queue;
    
        q.execute = function( data ) {
    
            if( this.list.length > 0 ) {
    
                this.command = this.list.shift();
    
                this.command.execute( data );
    
            }
    
            else {
    
                this.command = undefined;
    
                if( this.options.complete ) {
    
                    this.options.complete();
    
                }
    
            }
    
        }
    
     
    
        function Command( target, args, ops ) {
    
            this.target = target;
    
            this.args = args || [];
    
            this.options = ops || {};
    
            this.nextCommand = undefined;
    
        }
    
        var c = Command.prototype = new Commandable();
    
        c.constructor = Command;
    
        c.getCommandOptions = function( options, nextCommand ) {
    
            var responder = {
    
                ops: options,
    
                success: function( response ) {
    
                    if( options && options.success ) options.success( response );
    
                    if( nextCommand ) {
    
                        nextCommand.execute( response );
    
                    }
    
                },
    
                error: function( status, error, reason ) {
    
                    if( options && options.error ) options.error( status, error, reason );
    
                }
    
            };
    
            return $.extend( {}, this.options, responder );
    
        }
    
        c.execute = function( data ) {
    
            this.args.push( this.getCommandOptions( this.options, this.nextCommand ) );
    
            this.target.apply( this, this.args );
    
        }
    
     
    
    window.Queue = Queue;
    
    window.Command = Command;
    
     
    
    }(window));

I’m not going to say it’s sophisticated by any means, but this is a simple implementation to allow us to chain commands together. That is done by adding **Commands** to the **Queue** using _addCommand_(), which then appends a command using the _nextCommand_ property of the previous (if available) **Command**. Both **Queue** and **Command** have a method called _execute_() (as extensions of **Commandable**). Executing a **Queue** will start the chain of commands; executing a **Command** will invoke whatever **target** method supplied in the constructor. If this needs more explanation, please leave a comment. We’ll see how we use this by implementing our _doSignUp_() method in _jquery.albums.app.js_. Open up _jquery.albums.app.js_ in your favorite editor and add the following script somewhere after the **$.execute** declaration and before the end of the _function_() block:

_/_attachments/script/jquery.albums.app.js_
    
    function doSignUp( name, password, options ) {
    
        options = options || {};
    
        var queueOptions = {
    
          complete: function() {
    
            if( options.success ) options.success();
    
          }
    
        }
    
        var queue = new Queue( queueOptions );
    
        queue.addCommand( new Command( $.albums.logIn, ["toddanderson", "admin123"] ) );
    
        queue.addCommand( new Command( $.couch.signup, [{name:name}, password] ) );
    
        queue.addCommand( new OpenUserDocCommand() );
    
        queue.addCommand( new AssignRoleCommand() );
    
        queue.addCommand( new Command( $.albums.logOut ) );
    
        queue.addCommand( new Command( $.albums.logIn, [name, password], options ) );
    
        queue.execute();
    
    }

There we have our sequence of command described earlier. You can see how we pass the target method and arguments to the **Command** to be executed and the queue of commands is assembled using **Queue**:_addCommand_(). Again, our admin credentials are exposed and available to all – I do not recommend this practice in real life. Its just us here. So, there are two commands there in the middle that we haven’t discussed and aren’t declared in _command_queue.js_. They are specific to our **albums** application, so we will define them in _jquery.albums.app.js_. With the file still open, add the following script after (or before) the _doSignUp_() declaration:

_/_attachments/script/jquery.albums.app.js_
    
    function OpenUserDocCommand( target, args, options ) {}
    
    OpenUserDocCommand.prototype = new Command();
    
    OpenUserDocCommand.prototype.execute = function( data ) {
    
          var $userDB = $.couch.db("_users");
    
          $userDB.openDoc( data.id, this.getCommandOptions( this.options, this.nextCommand ) );
    
    }
    
     
    
    function AssignRoleCommand( target, args, options ) {}
    
    AssignRoleCommand.prototype = new Command();
    
    AssignRoleCommand.prototype.execute = function( data ) {
    
          data.roles = ["albums-user"];
    
          var $userDB = $.couch.db("_users");
    
          $userDB.saveDoc( data, this.getCommandOptions( this.options, this.nextCommand ) );
    
    }

Nothing too crazy going on in **OpenUserDocCommand** or **AssignRoleCommand**, just needed to do some work with the **_users** database of our [CouchDB](http://couchdb.apache.org/) instance as an admin.

Guess what? That’s it! We’re done with _jquery.albums.app.js_. Whew! If you have stuck around, i am quite humbled. Seriously. A lot of code and rambling on. I don’t know if i would have made it. Anyway, here is _jquery.albums.app.js_ in full:

_/_attachments/script/jquery.albums.app.js_
    
    (function($) {
    
     
    
      $.albums = $.albums || {};
    
      $.extend( $.albums, {
    
     
    
        dialog: undefined,
    
        database: undefined,
    
     
    
        logIn: function( name, password, options ) {
    
          doLogIn( name, password, options );
    
        },
    
     
    
        logOut: function( options ) {
    
          doLogOut( options );
    
        },
    
     
    
        saveDocument: function( document, options ) {
    
          checkSession( {
    
            available: function( userCtx ) {
    
              document.user = user;
    
              $.albums.database.saveDoc( document, options );
    
            },
    
            unavailable: function() {
    
              showDialog( options );
    
            }
    
          });
    
        },
    
     
    
        deleteDocument: function( document, options ) {
    
          checkSession( {
    
            available: function( userCtx ) {
    
              $.albums.database.removeDoc( document, options );
    
            },
    
            unavailable: function() {
    
              showDialog( options );
    
            }
    
          });
    
        }
    
     
    
      });
    
     
    
      var user; /* _user > document.name */
    
     
    
      function OpenUserDocCommand( target, args, options ) {}
    
      OpenUserDocCommand.prototype = new Command();
    
      OpenUserDocCommand.prototype.execute = function( data ) {
    
          var $userDB = $.couch.db("_users");
    
          $userDB.openDoc( data.id, this.getCommandOptions( this.options, this.nextCommand ) );
    
      }
    
     
    
      function AssignRoleCommand( target, args, options ) {}
    
      AssignRoleCommand.prototype = new Command();
    
      AssignRoleCommand.prototype.execute = function( data ) {
    
          data.roles = ["albums-user"];
    
          var $userDB = $.couch.db("_users");
    
          $userDB.saveDoc( data, this.getCommandOptions( this.options, this.nextCommand ) );
    
      }
    
     
    
      function checkSession( options ) {
    
        options = options || {};
    
        $.couch.session( {
    
          success: function( response ) {
    
            var context = response.userCtx;
    
            if( context.name == null ) {
    
              if( options.unavailable ) options.unavailable();
    
            }
    
            else{
    
              if( options.available ) options.available( context );
    
            }
    
          },
    
          error: function( status, error, reason ) {
    
            if( options.unavailable ) options.unavailable();
    
          }
    
        });
    
      }
    
     
    
      function doLogIn( name, password, options ) {
    
        options = options || {};
    
        var loginObj = {
    
          name:name,
    
          password:password,
    
          success: function( response ) {
    
            user = response.name;
    
            if( options.success ) options.success( response );
    
          },
    
          error: function( status, error, reason ) {
    
            if( options.error ) options.error( status, error, reason );
    
          }
    
        };
    
        $.couch.login( loginObj );
    
      }
    
     
    
      function doLogOut( options ) {
    
        options = options || {};
    
        $.couch.logout( {
    
          success: function( response ) {
    
            user = undefined;
    
            if( options.success ) options.success( response );
    
          },
    
          error: function( status, error, reason ) {
    
            if( options.error ) options.error( status, error, reason );
    
          }
    
        })
    
      }
    
     
    
      function doSignUp( name, password, options ) {
    
        options = options || {};
    
        var queueOptions = {
    
          complete: function() {
    
            if( options.success ) options.success();
    
          }
    
        }
    
        var queue = new Queue( queueOptions );
    
        queue.addCommand( new Command( $.albums.logIn, ["toddanderson", "admin123"] ) );
    
        queue.addCommand( new Command( $.couch.signup, [{name:name}, password] ) );
    
        queue.addCommand( new OpenUserDocCommand() );
    
        queue.addCommand( new AssignRoleCommand() );
    
        queue.addCommand( new Command( $.albums.logOut ) );
    
        queue.addCommand( new Command( $.albums.logIn, [name, password], options ) );
    
        queue.execute();
    
      }
    
     
    
      function showDialog( options ) {
    
        $.albums.dialog.loginDialog( {
    
          login: function( evt, ui ) {
    
            doLogIn( ui.name, ui.password, {
    
              success: function( response ) {
    
                $.albums.dialog.loginDialog( "close" );
    
              },
    
              error: function( status, error, reason ) {
    
                alert( "Error: " + error + ", " + reason );
    
              }
    
            });
    
          },
    
          signup: function( evt, ui ) {
    
            doSignUp( ui.name, ui.password, {
    
              success: function( response ) {
    
                $.albums.dialog.loginDialog( "close" );
    
              },
    
              error: function( status, error, reason ) {
    
                alert( "Error: " + error + ", " + reason );
    
              }
    
            });
    
          }
    
        });
    
      }
    
     
    
    })(jQuery)

Now before you run off, kiss your significant other and tell him/her that you will soon be billionaires, we have a little more work to do to get this up and running in our **Albums** application.

## Loader and Index

We kind of went off the deep-end there and dove right into code that code stand on its own outside of our current design of the **Albums** application. That’s good, but now we gotta reel it back in and wire it up. To start, lets add our new scripts in the _loader_. Open up _/vendor/couchapp/_attachments/loader.js_ and save the following modifications:

_/vendor/couchapp/_attachments/loader.js_
    
    function couchapp_load(scripts) {
    
      for (var i=0; i < scripts.length; i++) {
    
        document.write('<script src="'+scripts[i]+'"><\/script>')
    
      };
    
    };
    
     
    
    couchapp_load([
    
      "/_utils/script/sha1.js",
    
      "/_utils/script/json2.js",
    
      "vendor/couchapp/jquery-1.4.4.js",
    
      "/_utils/script/jquery.couch.js",
    
      "vendor/couchapp/jquery.couch.app.js",
    
      "vendor/couchapp/jquery.couch.app.util.js",
    
      "vendor/couchapp/jquery.mustache.js",
    
      "vendor/couchapp/jquery.evently.js",
    
      "vendor/couchapp/jquery.mobile-1.0a2.js",
    
      "vendor/couchapp/jquery.tmpl.js",
    
      "script/command_queue.js",
    
      "script/jquery.albums.app.js",
    
      "script/jquery.albums.loginDialog.js"
    
    ]);

We’ve just added the last three files we have been working on: the _command_queue_ script and our **$.albums** plugin and **loginDialog** widget. Now we’re going to make some modifications to the inline script on our _index.html_ document. In a [previous article](https://custardbelly.com/blog/?p=332) we hooked up the saving of a new album document to the internal [jQuery Mobile](http://jquerymobile.com/) **addAlbum** page, and were using the _jquery.couch_ plugin directly to save the document. Now we are just going to go through our **$.albums** plugin to perform that action which will open the **loginDialog** if a session is currently not available on our client. Open the _/_attachments/index.html_ file in your favorite editor and save the following modifications in the _handleDocumentReady_() function:

_/attachments/index.html_
    
    function handleDocumentReady()
    
    {
    
        $("#home").bind( "pagebeforeshow", refreshAlbums );
    
        refreshAlbums();
    
     
    
        // Set database reference and dialog template on albums.
    
        $.extend( $.albums, {
    
            database: $db,
    
            dialog:  $("#loginSignupDialog").tmpl()
    
        });
    
     
    
        $("#addSubmitButton").live( "click", function( event ) {
    
            event.preventDefault();
    
            var document = {};
    
            document.artist = $("input#addArtistField").val();
    
            document.title = $("input#addTitleField").val();
    
            document.description = $("textarea#addDescriptionField").val();
    
            document.creation_date = ( new Date() ).getTime();
    
            $.albums.saveDocument( document, {
    
                success: function() {
    
                    $.mobile.changePage( "#home", "slidedown", true, true );
    
                },
    
                error: function( status, error, reason ) {
    
                    alert( "Cannot save new document.\n" + status + ", " + reason + ", " + error );
    
                }
    
            });
    
            return false;
    
        });
    
     
    
        $("#addAlbum").bind( "pagehide", function() {
    
            $("input#addArtistField").val( "" );
    
            $("input#addTitleField").val( "" );
    
            $("textarea#addDescriptionField").val( "" );
    
        });
    
    }

Not that much to change. First we assign the default properties for the dialog **template** and database reference for our **$.albums** plugin and then we replace the call to save the document using _jquery.couch_ to that of our **$.albums** plugin. Ta-da! Now we can add new documents as a logged in user.

There is, however, two more places that we need to interact with our **$.albums** plugin: the **edit** page and the **delete** page. Without modifying those and with the new authorization and validation we have introduced, we’d only be able to create and read documents… 

_Oh nos! There are tons of albums that i entered in late at night in a different state of mind! I am second guessing my decision on wanting **Hall & Oates**‘_ War Babies! 

These are the type of exclamations i am assuming are going through your head… because i would never…

## album-delete and album-edit

If you go way back in this article series and have been following along, you may remember that we create quasi-view controllers for our [couchapp](http://couchapp.org/page/index) **template** pages and included the as **partials** in the **show function**. There are two that we need to modify with our recent changes to using the **$.albums** plugin to verify session: _/_attachments/script/album-delete-dialog.js_ and _/_attachments/script/album-edit-page.js_. They will be small changes, but once deployed will give our application a little more security on who can perform modifications on **album** documents.

Open up _/_attachments/script/album-delete-dialog.js_ in your favorite editor and save the following change to the _handleDelete_() function:

_/_attachments/script/album-delete-dialog.js_
    
    function handleDelete( event )
    
    {
    
        event.preventDefault();
    
        var docId = $("#dialogContent").data("identity");
    
        // First open doc based on ID in order to get full document.
    
        $db.openDoc( docId, {
    
            success: function( document ) {
    
                // Then use the opened doc as reference to remove.
    
                $.albums.deleteDocument( document, {
    
                    success: function() {
    
                        $.mobile.changePage( "#home", "slide", true, true );
    
                    },
    
                    error: function() {
    
                        alert( "Could not remove document with id: " + docId );
    
                    }
    
                });
    
            },
    
            error: function() {
    
                alert( "Could not find document with id: " + docId );
    
            }
    
        });
    
        return false;
    
    }

Open up _/_attachments/script/album-edit-page.js_ in your favorite editor and save the following change to _saveDocument_():

_/_attachments/script/album-edit-page.js_
    
    function saveDocument( document )
    
    {
    
        $.albums.saveDocument( document, {
    
            success: function( response )  {
    
                updateEditableAlbum( document );
    
                navigateToAlbumPage( document._id );
    
            },
    
            error: function( status, error, reason ) {
    
                alert( "Cannot save document: " + document._id + "\n" + reason );
    
            }
    
        });
    
    }

That’s all! basically moved away from actions through the reference to our **albums** database to using the **$.albums** plugin. Finally. Now let’s push all this to our [CouchDB](http://couchdb.apache.org/) instance so we can play around with it.

## Deployment

If you remember from the last article when we introduced authorization, we need to pass our credentials when we push our couchapp to the [CouchDB](http://couchdb.apache.org/) instance:
    
    couchapp push albums http://toddanderson:admin123@127.0.0.1:5984/albums

You’ll will have to replace to username and password, but once we have pushed we can now checkout our application at [http://127.0.0.1:5984/albums/_design/albums/index.html](http://127.0.0.1:5984/albums/_design/albums/index.html). If you visit your application and try to either add, edit or delete a document and have not previously logged in, you will see something on the following:

![Log In](http://www.custardbelly.com/blog/images/couchapp_7_2_2.png)  
_[Log In]_

![Log In](http://www.custardbelly.com/blog/images/couchapp_7_2_1.png)  
_[Sign Up]_

## Conclusion

We have come a long way! We now have authorization and user validation in our [jQuery Mobile](http://jquerymobile.com/) **albums** application ensuring that a user must be logged in to create a new **album** document and that the owner of a document is the only one that can make modifications or delete the document from the database. Fun stuff.

I think this is going to be the last article of this series. Of course if this application were to go live, it would need a lot more work. For instance, the ability to log in and log out persisted on every page and information about who is logged in, etc. – but i will leave that up to you if you want to keep going. Hope you had fun and gleaned some useful information that i hope is not misleading.

Thanks again if you have actually took the time to follow along in this series. I am truly humbled if you sat through it all.

Cheers!

_[Note] This post was written against the following software versions:_  
**CouchDB **– 1.0.1  
**CouchApp** – 0.7.2  
**jQuery** – 1.4.4  
**jQuery Mobile** – 1.0a2  
**jQuery Templates Plugin** 1.0.0pre  
_If you have found this post and any piece has moved forward, hopefully the examples are still viable/useful. I will not be updating the examples in this post in parellel with updates to any of the previously mentioned software, unless explicitly noted._

**Articles in this series:**

  1. [Getting Started](https://custardbelly.com/blog/?p=244)
  2. [Displaying a page detail of a single album.](https://custardbelly.com/blog/?p=278)
  3. [Templates and Mustache](https://custardbelly.com/blog/?p=297)
  4. [Displaying an editable page of an album.](https://custardbelly.com/blog/?p=318)
  5. [Creating and Adding an album document.](https://custardbelly.com/blog/?p=332)
  6. [Deleting an album document](https://custardbelly.com/blog/?p=344)
  7. [Authorization and Validation – Part 1](https://custardbelly.com/blog/?p=360)
  8. [Authorization and Validation – Part 2](https://custardbelly.com/blog/?p=394)

[Full source for albums couchapp available here](https://custardbelly.com/downloads/couchapp/jqm_couchdb_albums.zip)

Posted in [CouchDB](https://custardbelly.com/blog/category/couchdb/), [jquery](https://custardbelly.com/blog/category/jquery/), [jquery-mobile](https://custardbelly.com/blog/category/jquery-mobile/).
