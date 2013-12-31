# [jQuery Mobile + CouchDB: Part 6 – Deleting Documents](http://custardbelly.com/blog/2011/01/21/jquery-mobile-couchdb-part-6-deleting-documents/)

In my [previous article](http://custardbelly.com/blog/?p=332), I addressed adding documents to a [CouchDB](http://couchdb.apache.org/) database using the _jquery.couch_ plugin along with a form within the [jQuery Mobile](http://jquerymobile.com/) framework. If you have been following along (and have been using with the application that is being built) that database might be filling up with album documents by now… but with no way to remove them!

_“Why, late on Friday night, did I ever think I needed to catalog Starship’s ‘Knee Deep in the Hoopla’ as ‘my saving grace’?!”_

… is one thing that you may say to yourself because there is currently no way to delete a document from the application we have built within this series. However, we have come to the final piece in basic document operations: the **D** in **CRUD**. Sit back down. I know it is exciting, but I have a lot of long-winded explanations to write so get ready.

In this article I am going to address adding the ability to delete a document from a [CouchDB](http://couchdb.apache.org/) database. While doing so, I will lightly cover the role that dialogs play in [jQuery Mobile](http://jquerymobile.com/) and, in the end, hack it to present a **dialog** (our delete confirmation dialog) as an **external page** styled as a [jQuery Mobile](http://jquerymobile.com/) dialog.

**In the following examples, I will assume that you have been following along from previous posts and will present updates to existing code.**

## Deleting Documents

Before we just dive into adding a **Delete** button somewhere, let’s first think about its context within the application itself. If you have been following along with the previous posts, we have essentially 4 pages in our application:

  * Home – Displays the full list of album documents.
  * Add Album – Provides form to an album document.
  * View Album – Displays information from the album document.
  * Edit Album – Provides form to edit the information on an album document.

From this set of pages we can remove **Home** and **Add Album** as candidates to present a **Delete** button associated with a single document, as they have multiple and no album targets, respectively. So, that leaves us with **View Album** and **Edit Album**. A case can definitely be made that a **Delete** button should be available from the **Edit Album** page, but I think it would start to get crowded on that page with **Save**, **Cancel** and **Delete**… furthermore, it might be confusing to the User what **Cancel** actually referred to; cancel delete? cancel edit? I think the **Delete** button is much more suited to live alongside the **Edit** button in the **View Album** page.

So we know where the **Delete** button is going to reside. The role of the **Delete** button is to open a confirmation **Dialog** so the user can confirm their intent on deleting an album document, or deny it; they may have accidentally hit that button. Now an architectural decision needs to be addressed as to how to present this **Delete** dialog… should we have it as an internal page within the _album view_ page that is served up from our **show function** in [CouchDB](http://couchdb.apache.org/), or should it be an external page completely self manageable?

We can make a case for internal with obvious reasons being that a _delete dialog_ is associated with a single document with which you want to perform an operation and our _album view_ page represents a single album document. We also don’t necessarily need the _dialog page_ to be accessed outside of the flow of the application. Meaning, it is not a requirement that the _delete dialog_ is exposed to any user without having to open the application and select an album from the list. 

So an **internal** dialog page might be a good fit, and in most cases I might push for it. Unfortunately, the current state of [jQuery Mobile](http://jquerymobile.com/) makes the case for an external dialog page an easy one. If we were to add a dialog page to the _album view_ **template** served up from our **show function** for an album, the elements would be all screwed up. I do not know if by design that is expected or if it is just a by-product of the templating and dynamic **DOM** that external pages provides. Either way, things get screwy adding a dialog page along side another page in an external [jQuery Mobile](http://jquerymobile.com/) page. So external dialog page, ahoy!

Wow, if you read that whole ramble, I am flattered and I hope it made sense. If you didn’t, i dont blame you; more code less talk.

## Delete Dialog

We are going to create an **external dialog page** to present the user the ability to cancel out of the action or confim that they would like to delete the album document from the database. Now, typically when working with the [jQuery Mobile](http://jquerymobile.com/) framework, a dialog is assigned for a page anchor link with the **data-rel** attribute value set to “_dialog_“. For example:
    
    <a href="_show/album-delete/12345" data-icon="minus" data-rel="dialog">Delete</a>

In essence, this attribute not only is responsible for the look-and-feel of the page, but also is an indicator that the **url location** should not be updated when the dialog page is loaded in the **DOM**. Makes sense – you shouldn’t have to hit back to get out of a dialog (though **Android** throws that use-case out the window with its context menus, which i think is still intuitive… but whatever).

But… we can’t do that. We need to use the **$.mobile**._changePage_() method to present the delete dialog page from the album view page. The main reason being relative page locations in relation to **show function** requests. Basically we would have to invoke the **show function** to allow for the _delete dialog_ to be presented using a relative path out of the current _album view_ page. An updated example for our application would look like:
    
    <a href="../../_show/album-delete/12345" data-icon="minus" data-rel="dialog">Delete</a>

To me, very ugly and not the correct way to enable this functionality. Furthermore, if we think back to how we implemented the _album view_ page, we decided to clear the page from the **DOM** after navigating away from it. Essentially, within this context, showing the dialog would wipe the **DOM** of the _album view_ page and when we choose to either confirm or deny or cancel deletion of the document, we would be returned to a blank page due to the inherent behaviour assigned to the role of a dialog in [jQuery Mobile](http://jquerymobile.com/) (ie. the previous page is not loaded again using **$.mobile**._changePage_()). Not ideal.

So we’ll just create an external _delete dialog_ maintaining the look and feel by applying styles manually (instead of having the [jQuery Mobile](http://jquerymobile.com/) framework parse the **DOM** and apply them intrinsically). That way we can also encapsulate the logic used in deleting a document from the [CouchDB](http://couchdb.apache.org/) database using a _view-controller_ associated with the dialog page.

### Delete Dialog show function

With our minds made up on externalizing the **Delete Dialog** page, we’ll continue on with how we have made all our pages in this series. First up the **show function**. With your favorite text editor open, create a new document called _album-delete.js_ in the /shows directory of your couchapp application folder (for me that is _/Documents/workspace/custardbelly/couchdb/albums_). Add the following script and save:

_/shows/album-delete.js_
    
    function(doc, req) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var Mustache = require("vendor/couchapp/lib/mustache");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var stash = {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;artist: doc.artist,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;title : doc.title,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;document: doc._id
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return Mustache.to_html(this.templates.albumdelete, stash, this.templates.partials.albumdelete);
    
    }

Very similar to our other **show function**s for the view and edit pages, with just a little less information about the document in the **stash**. We’ve also got our template and partials declared in the [Mustache](https://github.com/janl/mustache.js/) _to_html_() call, so let’s go ahead and create those.

### Delete Dialog template

As I mentioned earlier, since our dialog is external and will be presented using **$.mobile**._changePage_( ) we loose some niceties of styling pages as dialogs within the [jQuery Mobile](http://jquerymobile.com/) framework. As such, we are going to roll-up our sleeves and apply some classes and styles directly inline to fake the appearance of the delete album page as a dialog.

With you favorite text editor open, create and save the following mark-up as _albumdelete.html_ in the _/templates_ directory:

_/templates/albumdelete.html_
    
    <div data-role="page" id="albumdelete" data-backbtn="false" class="ui-dialog ui-body-a">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<div class="ui-header ui-bar-a ui-corner-top ui-overlay-shadow">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<h1 class="ui-title">Delete Album?</h1>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<a id="dialogCloseButton" href="#" data-icon="delete" data-iconpos="notext" style="left: 15px; top: .4em; position: absolute;">Close</a>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</div>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<div data-role="content" id="dialogContent" data-identity="{{document}}" class="ui-body-c ui-corner-bottom ui-overlay-shadow">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<p>Are you sure you want to delete {{artist}}, {{title}}?</p>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<a id="dialogCancelButton" href="#" data-role="button" data-theme="a">no</a>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<a id="dialogConfirmButton" href="#" data-role="button" data-theme="c">yes</a>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</div>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<div data-role="footer" />
    
    </div>
    
    {{>scripts}}

When you request to load an external page into the **DOM**, that page – or rather, i should say, the root **div** with the **data-role** value of _page_ – is actually wrapped in another parent **div** with the **data-role** removed and transfered to the wrapping **div**. So keep that in the back of your mind as we will need to a little more pixel pushing in the _view-controller_. For now, understand that this mark-up is going to be wrapped by a **div**, and the page role of this page will be removed. 

Now, in order to style the content of our page as a **dialog**, we explicitly set the root **div** **class** to _ui-dialog_ which just throws in some margins to present more of a self contained box (like a dialog), and _ui-body-a_ essentially being a base style for color and font treatments. 

You may also notice the **data-backbtn** attribute thrown in there. I have rarely gotten it to work for an **external page** in the current stable release of [jQuery Mobile](http://jquerymobile.com/) (1.0a2), but i threw it in there and crossed my fingers. In any event, we’ll handle the no back button issue manually, as we only want to display a close button just like all other default dialogs do in [jQuery Mobile](http://jquerymobile.com/). 

First step in that process: get rid of the **header**. You may notice that the first **div** in the children is not assigned a **data-role** of _header_ or any other value. Instead, i peaked inside the **JS** and **CSS** of the [jQuery Mobile](http://jquerymobile.com/) framework and assigned in-line the **class** declarations given to a header in the context of a dialog. These classes are responsible for the colorization, size and corner-roundedness (not getting any spell-checking squigglies on that word!) of the **div**, which houses a custom **Close** button. Just as I went through and found the classes assigned to a **header** in a dialog, I went and found the specific styles given to the **Close** button that is added to the **DOM** inherently in [jQuery Mobile](http://jquerymobile.com/) when a dialog is present. I have also done the same for the content, finishing the look-and-feel off with a different background color and bottom rounded corners.

This will look relatively just like any other dialog that is created/modified within the [jQuery Mobile](http://jquerymobile.com/) framework (at the current release, at least!). However, the background will not grow with its parent size (will be wrapped in a **div**), so the background treatment assigned to this page will not flow to the size of the page in the browser. To do that we’ll do some [jQuery](http://jquery.com/) wizardry in the _view-controller_ for this _delete dialog page_. In order to get there, let’s create our **partial** for this **template**.

With you favorite text editor open, create a file named _scripts.html_, add the following mark-up, and save it in _/templates/partials/albumdelete_:

_/templates/partials/albumdelete/script.html_
    
    <script src="../../script/album-delete-dialog.js"></script>

If you haven’t been following along in the series, this partial is just an organizational thing for me. I may be a little anal about where my code resides, and adding the **JavaScript** within the **script** declaration is totally acceptable; i just like having my scripts all in one place in a project.

OK. With that set, let’s get on to creating the _view-controller_ for the _delete dialog page_.

### Delete Dialog View-Controller

Before we jump in and create the script, let’s just make sure we are on the same page for the functionality of our _delete dialog page_. Like most dialogs, it presents the ability to confirm an action or cancel out of that action. So those are two pieces of functionality we need to implement in our _view-controller_ for the page, with the confirmation being a [CouchDB](http://couchdb.apache.org/) transaction. Actually… i think that is about it. Aside from some custom styling we will do in order for the page to be in full, it should be some smooth sailing. I am going to assume that you have been following along in the series and won’t go into the breadth of how the _view-controller_ behaves, but rather the methods which we will implement on it.

With your favorite text editor open, create a new file called _album-delete-dialog.js_, add the following **JavaScript** and save in _/_attachments/script_:

_/_attachments/script/album-delete-dialog.js_
    
    var AlbumDeleteDialogController = function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function handleDialogViewHide()
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#dialogCloseButton").die( "click", handleClose );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#dialogCancelButton").die( "click", handleClose );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#dialogConfirmButton").die( "click", handleDelete );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#dialogContent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var dialogCache =&nbsp_place_holder; $(document.getElementById("_show/album-delete/" + docId));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;dialogCache.unbind( "pagehide", handleDialogViewHide );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;dialogCache.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;dialogCache.remove();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function handleDialogView()
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Watch for bound hide of page to clear from cache.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#dialogContent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var dialogPage = $(document.getElementById("_show/album-delete/" + docId));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;dialogPage.bind( "pagehide", handleDialogViewHide );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function handleClose( event )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;event.preventDefault();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#dialogContent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$.mobile.changePage( "_show/album/" + docId, "slide", true, true );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return false;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function handleDelete( event )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;event.preventDefault();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#dialogContent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// First open doc based on ID in order to get full document.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$db.openDoc( docId, {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;success: function( document ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Then use the opened doc as reference to remove.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$db.removeDoc( document, {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;success: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$.mobile.changePage( "#home", "slide", true, true );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;error: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;alert( "Could not remove document with id: " + docId );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;error: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;alert( "Could not find document with id: " + docId );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return false;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;initialize: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#dialogCloseButton").live( "click", handleClose );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#dialogCancelButton").live( "click", handleClose );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#dialogConfirmButton").live( "click", handleDelete);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Do pagebefore so when it is shown, it is filled correctly.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("div[data-role='page']").live( "pagebeforeshow", function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("div[data-role='page']").die( "pagebeforeshow" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#dialogContent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var dialogPage = $(document.getElementById("_show/album-delete/" + docId));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var dialog = $("#albumdelete");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var h = parseFloat(dialogPage.innerHeight());
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;h -= ( parseFloat(dialog.css("border-top-width")) + parseFloat(dialog.css("border-bottom-width")) );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// define the height based on innerHeight of wrapping parent page and the border styles applied to a dialog.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;dialog.css( "height", h + "px" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("div[data-role='page']").live( "pageshow", function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("div[data-role='page']").die( "pageshow" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;handleDialogView();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    }();
    
    &nbsp_place_holder;
    
    function handleDialogReady()
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;AlbumDeleteDialogController.initialize();
    
    }
    
    $().ready( handleDialogReady )

That might be a lot to digest all at once, but it has the same functionality as the other _view-controllers_ we have created in this series. Essentially, It manages the removal of the page from the **DOM** on navigation away. A user will be navigated to the previous – _album view_ – page on cancel/close or be taken to the **#home** page with the updated list of albums after confirmation of delete and success of the transaction from the [CouchDB](http://couchdb.apache.org/) instance. Let’s take a closer look on how that is done:

_/_attachments/script/album-delete-dialog.js_
    
    function handleDelete( event )
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;event.preventDefault();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#dialogContent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// First open doc based on ID in order to get full document.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$db.openDoc( docId, {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;success: function( document ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Then use the opened doc as reference to remove.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$db.removeDoc( document, {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;success: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$.mobile.changePage( "#home", "slide", true, true );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;error: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;alert( "Could not remove document with id: " + docId );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;},
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;error: function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;alert( "Could not find document with id: " + docId );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return false;
    
    }

We first grab the document id assigned to the **data-identity** attribute of the content **div** and use that to open the document from the [CouchDB](http://couchdb.apache.org/) database using the declared **$db** instance on the _index.html_ (of which this page is loaded into). On success of opening the document, we make a request to remove it from the database using the _removeDoc_() method from the _jquery.couch_ plugin. Upon success of removal from the [CouchDB](http://couchdb.apache.org/) database, we then navigate back to the **#home** page where the list is updated accordingly to reflect the removal of the album document.

Now the fun part! In order to have the original **div** (assigned the **data-role** of _page_ in our **template**) fill its background to its wrapping parent (assigned by [jQuery Mobile](http://jquerymobile.com/) upon load of external page) we need to do some [jQuery](http://jquery.com/) to grab the dimensions of the wrapping page **div** and the assigned styles on the dialog to reset the dimensions of the dialog to fill its background to the page.

_/_attachments/script/album-delete-dialog.js_
    
    // Do pagebefore so when it is shown, it is filled correctly.
    
    $("div[data-role='page']").live( "pagebeforeshow", function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("div[data-role='page']").die( "pagebeforeshow" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#dialogContent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var dialogPage = $(document.getElementById("_show/album-delete/" + docId));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var dialog = $("#albumdelete");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var h = parseFloat(dialogPage.innerHeight());
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;h -= ( parseFloat(dialog.css("border-top-width")) + parseFloat(dialog.css("border-bottom-width")) );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// define the height based on innerHeight of wrapping parent page and the border styles applied to a dialog.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;dialog.css( "height", h + "px" );
    
    });

The **dialogPage** is the parent **div** for the external _delete dialog page_ (the **template** previously created in this article). As mentioned before that is created and wrapped around the external page inherently within the [jQuery Mobile](http://jquerymobile.com/) framework when the page is loaded into the **DOM**. 

That wrapping parent is assigned the **id** of the url location shown in the **hash**, and is accessed using _getElementById_(). There might be some other tricks to access that div using **class*=’ui-page’**. It is also assigned a **class** of _ui-page-active_, but that is only after it has been shown. Since we assign a handler for _pagebeforeshow_, that class has yet to be assigned so we can’t access it that way using [jQuery](http://jquery.com/). Listening and assigning these property during the _pagebeforeshow_ event also has the added benefit of sizing the dialog background correctly before the user sees it.

Alright. So we have faked our external page to be presented as a dialog normally shown through the [jQuery Mobile](http://jquerymobile.com/) framework by assigning the **data-rel** on a page link. Now we have to go about modifying the code so we can show it…

## Modifying Album View Page

Way back in the beginning of this article before i started yammering on about this and that, we resolved that the **Delete** button should be an additional UI piece to the album view page. If you have been following along in this series, we added the **Edit** button a couple articles back to the _album view_ page. It was represented by a **p** element with the **data-role** of _button_ and positioned vertically below the document information fields. Quite ugly, but reasonable for the time.

To get into more of a consistant look and feel, we are going to add a navigation bar to the _album view_ page, just as we have done for the **#home** page in the last article. The **navbar** for the _album view_ page will consists of two buttons – **Edit** and **Delete** – and we’ll also throw in some styling to give them unique enough color treatments.

In your favorite text editor, open the _/templates/album.html_ document and make the following modifications:

_/templates/album.html_
    
    <div data-role="page" id="albumview" data-position="inline" data-back="true">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<div data-role="header" id="albumheader">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<h1 class="albumtitle">{{title}}</h1>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<a href="#home" data-icon="grid" class="ui-btn-right">Home</a>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</div>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<div data-role="content" id="albumcontent" data-identity="{{document}}">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<h2 class="artist">{{artist}}</h2>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<p class="title">{{title}}</p>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<p class="description">{{description}}</p>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</div>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<div id="falseFooter" class="ui-bar-a ui-footer ui-footer-fixed ui-fixed-inline fade" role="content" data-position="fixed">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<div data-role="navbar">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<ul class="ui-grid-a">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<li><a href="#" id="deleteButton" data-icon="minus">Delete</a></li>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<li><a href="#" id="editButton" data-icon="gear" data-theme="b">Edit</a></li>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</ul>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</div>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</div>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<div data-role="footer" data-position="fixed" />
    
    </div>
    
    {{>scripts}}

We got rid of the previous **Edit** button element and added it to a list of buttons in a **navbar**. Alongside the **Edit** button, we have added the **Delete** button. We also added some icons and applied a theme to the **Edit** button to give it a blue color so as to be immediately distinguishable from an action to delete the album document.

You may notice that we actually did not add the **navbar** to the **footer** as we did for the home page. The reason being that there is a bug in the current stable release for [jQuery Mobile](http://jquerymobile.com/) that screwed up the layout if we did that. _Even though I have mentioned bugs in the jQuery Mobile framework, the beauty is we can easily work around most of them by either faking the HTML mark-up or using jQuery to modify properties; that is always a win in my book._ So we created a false footer and assigned it the classes that would normally be assigned to a footer from the [jQuery Mobile](http://jquerymobile.com/) framework, and with a **data-position** of _fixed_, it should always appear at the bottom of the page (it won’t really, but we will modify the _view-controller_ to put it there). 

Now, we needed to leave the **footer** tag in this template because, you guessed it, a bug in [jQuery Mobile](http://jquerymobile.com/). If we omitted that **footer** on an external document, the _ready_ event is never fired – bad news. So we threw it in with a **data-position** of _fixed_ so it is always at the bottom. Woohoo! Our page has been updated. Let’s wired up some operations so we can show our _delete album dialog_.

### Modifying Album View-Controller

Before we get into this, i must profess that we are going to do something gross. I don’t particularly like it, but it is a fast and cheap way to get the result we want. Let’s get into it and see if i can dig myself out…

In your favorite text editor, open the _/_attachments/script/album-page.js_ document and make the following modifications:

_/_attachments/script/album-page.js_
    
    var AlbumPageController = function() {
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/* RIPPED FROM jquerymobile-1.0a2.js */
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function getOffsetTop(ele)
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var top = 0;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if (ele)
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var op = ele.offsetParent, body = document.body;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;top = ele.offsetTop;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;while (ele && ele != body)
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;top += ele.scrollTop || 0;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if (ele == op)
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;top += op.offsetTop;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;op = ele.offsetParent;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;ele = ele.parentNode;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return top;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function setTop(el){
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var fromTop = $(window).scrollTop(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;thisTop = getOffsetTop(el[0]), // el.offset().top returns the wrong value on iPad iOS 3.2.1, call our workaround instead.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;thisCSStop = el.css('top') == 'auto' ? 0 : parseFloat(el.css('top')),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;screenHeight = window.innerHeight,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;thisHeight = el.outerHeight(),
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;useRelative = el.parents('.ui-page:not(.ui-page-fullscreen)').length,
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;relval;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( el.is('.ui-header-fixed') ){
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;relval = fromTop - thisTop + thisCSStop;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( relval < thisTop){ relval = 0; }
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return el.css('top', ( useRelative ) ? relval : fromTop);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;else{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;//relval = -1 * (thisTop - (fromTop + screenHeight) + thisCSStop + thisHeight);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;//if( relval > thisTop ){ relval = 0; }
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;relval = fromTop + screenHeight - thisHeight - (thisTop - thisCSStop);
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return el.css('top', ( useRelative ) ? relval : fromTop + screenHeight - thisHeight );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;/* END RIPPED FROM jquerymobile-1.0a2.js */
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function handleView()
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;setTop( $("#falseFooter") );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#editButton").live( "click", handleEdit );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#deleteButton").live( "click", handleDelete );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Watch for bound hide of page to clear from cache.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#albumcontent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var albumPage = $(document.getElementById("_show/album/" + docId));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;albumPage.bind( "pagehide", handlePageViewHide );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function handleEdit( event )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Prevent default link event.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;event.preventDefault();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Access document id from data-identity.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#albumcontent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Change page.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$.mobile.changePage( "_show/album-edit/" + docId, "flip", false, true );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return false;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function handleDelete( event )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Prevent default link event.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;event.preventDefault();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Access document id from data-identity.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#albumcontent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Change page.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$.mobile.changePage( "_show/album-delete/" + docId, "slideup", false, false );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return false;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;function handlePageViewHide()
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#editButton").die( "click", handleEdit );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("#deleteButton").die( "click", handleDelete );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var docId = $("#albumcontent").data("identity");
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;var albumPageCache =&nbsp_place_holder; $(document.getElementById("_show/album/" + docId));
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;albumPageCache.unbind( "pagehide", handlePageViewHide );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;albumPageCache.empty();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;albumPageCache.remove();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;initialize : function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("div[data-role='page']").live( "pageshow", function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;$("div[data-role='page']").die( "pageshow" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;handleView();
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;});
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;};
    
    }();
    
    &nbsp_place_holder;
    
    function handlePageViewReady()
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;AlbumPageController.initialize();
    
    }
    
    $().ready( handlePageViewReady );

You notice those first two methods? Yeah, i just copied and pasted them from the [jQuery Mobile](http://jquerymobile.com/) script. They are private methods of the “_fixedHeaderFooter_” plugin of the framework. We needed them to position our false footer **navbar**, so i ripped ‘em. Wait! Don’t leave. I am not happy about it either. Hopefully they will be exposed utilities in a later release of the framework, or we could go about creating our own so they are accessible outside of this page, but for now you gotta do what you gotta do.

Upon show of the page we use those methods to position the false footer **navbar** at the bottom. Sure, in the real world a client – our rather your team since you know about it! – would log a bug, but we’re just having fun right? I hope so.

The other modification was to wire up the **Delete** button to show the _delete album dialog_ page we previously created. We employed the same operations we have done throughout this series to navigating to a page: access the document **id** and call **$.mobile**._changePage_() to serve up the filled template form [CouchDB](http://couchdb.apache.org/). Done and done. Let’s get all **Salt-N-Pepa** up in here and Push It.

### Deployment

We modified our application to have the ability to delete an album document from the database by adding a new _delete dialog_ page and updating the UI of the album view page. With these changes saved, we can now push to the [CouchDB](http://couchdb.apache.org/) database using the [couchapp](http://couchapp.org/page/index) utility. Open a terminal and navigate to the directory where you create your **CouchApp** applications (for me that is _/Documents/workspace/custardbelly/couchdb_ and in there i have a folder named _albums_ which is the **CouchApp** application directory for these examples). Enter the following command to push the changes to the **CouchDB** instance:
    
    couchapp push albums http://127.0.0.1:5984/albums

If all was successful and you now go to [http://127.0.0.1:5984/albums/_design/albums/index.html](http://127.0.0.1:5984/albums/_design/albums/index.html). Select an album from the the list on the landing page, and click the **Delete** button from the _album view_ page. Choose to delete, cancel or close and you should be navigated to the correct page: **#home** if delete, album view if cancel/close. These updated and new pages should look somewhat like the following:

_updated album view_  
![](http://www.custardbelly.com/blog/images/couchapp_album_view2.png)

_delete album dialog_  
![](http://www.custardbelly.com/blog/images/couchapp_delete_dialog.png)

### Conclusion

In this article, we finished off having the basic operations for handling documents in our application. We can now create, read, update and delete documents from the [CouchDB](http://couchdb.apache.org/) database. Along the way, we covered a few ways to hack things together for an application utilizing the [jQuery Mobile](http://jquerymobile.com/) framework; some were work-arounds due to bugs, some were just design decisions. In any event, I hope it was informative if not fun.

Next up: I am wavering between authentication or attachments… you’ll have to wait and see!

_[Note] This post was written against the following software versions:_  
**CouchDB **– 1.0.1  
**CouchApp** – 0.7.2  
**jQuery** – 1.4.4  
**jQuery Mobile** – 1.0a2  
_If you have found this post and any piece has moved forward, hopefully the examples are still viable/useful. I will not be updating the examples in this post in parellel with updates to any of the previously mentioned software, unless explicitly noted._

**Articles in this series:**

  1. [Getting Started](http://custardbelly.com/blog/?p=244)
  2. [Displaying a page detail of a single album.](http://custardbelly.com/blog/?p=278)
  3. [Templates and Mustache](http://custardbelly.com/blog/?p=297)
  4. [Displaying an editable page of an album.](http://custardbelly.com/blog/?p=318)
  5. [Creating and Adding an album document.](http://custardbelly.com/blog/?p=332)
  6. [Deleting an album document](http://custardbelly.com/blog/?p=344)
  7. [Authorization and Validation – Part 1](http://custardbelly.com/blog/?p=360)
  8. [Authorization and Validation – Part 2](http://custardbelly.com/blog/?p=394)

[Full source for albums couchapp here.](http://custardbelly.com/downloads/couchapp/jqm_couchdb_albums.zip)

Posted in [CouchDB](http://custardbelly.com/blog/category/couchdb/), [jquery](http://custardbelly.com/blog/category/jquery/), [jquery-mobile](http://custardbelly.com/blog/category/jquery-mobile/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – January 21, 2011
  *[January 21, 2011]: 2011-01-21T11:38
