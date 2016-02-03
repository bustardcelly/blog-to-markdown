---
title: 'jQuery Mobile + CouchDB: Part 4 – Editing Documents'
url: 'https://custardbelly.com/blog/2011/01/04/jquery-mobile-couchdb-part-4-editing-documents/'
author:
  name: 'todd anderson'
date: '2011-01-04'
---

In the [previous post](https://custardbelly.com/blog/?p=297), I addressed using templates to generate the [jQuery Mobile](http://jquerymobile.com/) external pages. Though it addressed a fundamental (imo) part of serving up **HTML** from the [CouchDB](http://couchdb.apache.org/) instance and had a few nice tricks for [jQuery Mobile](http://jquerymobile.com/), it essentially was organization and cleanup so I could move forward in developing the application without it getting to cluttered for my development and workflow.

In this article, I am going to take the templating structure established in the [previous post](https://custardbelly.com/blog/?p=297) and add another external page to the[ jQuery Mobile](http://jquerymobile.com/) application – one in which I will be able to edit the document served up from the [CouchDB](http://couchdb.apache.org/) database. Along with this, I’ll discuss assigning event handlers to **DOM** elements using [jQuery](http://jquery.com/), adding buttons to footers and headers, and clearing external [jQuery Mobile](http://jquerymobile.com/) pages from cache to ensure a user is looking at the most recent changes to a document.

## Edit Template

In the [previous post](https://custardbelly.com/blog/?p=297), we moved from returning **HTML** from [CouchDB](http://couchdb.apache.org/) using a **show function** and string manipulation to moving mark-up over to a **template** and utilizing [Mustache](https://github.com/janl/mustache.js) to render the served up **jQuery Mobile** external page. We are going to use the same technique to deliver another page that will allow a user to edit a target **CouchDB** document, with the option to either cancel or submit their changes.

Open up your favorite text editor, add the following snippet and save the file as _albumedit.html_ in the _/templates_ directory of your **albums** [couchapp](http://couchapp.org/page/index) (eg. _/Documents/workspace/custardbelly/couchdb/albums/templates/albumedit.html_):

_/templates/albumedit.html_
    
    <div data-role="page" id="albumedit" data-nobackbtn="true">
    
        <div data-role="header" id="albumheader">
    
            <a id="cancelBackButton" href="#" data-icon="delete">Close</a>
    
            <h1 class="albumtitle">{{title}}</h1>
    
        </div>
    
        <div data-role="content" data-theme="c" style="padding:0em;">
    
            <form id="albumform" action="#" method="get" data-identity="{{document}}">
    
                <div data-role="fieldcontain">
    
                    <label for="artist">Artist:</label>
    
                    <input id="artistField" name="artist" type="text" value="{{artist}}" />
    
                </div>
    
                <div data-role="fieldcontain">
    
                    <label for="title">Title:</label>
    
                    <input id="titleField" name="title" type="text" value="{{title}}" />
    
                </div>
    
                <div data-role="fieldcontain">
    
                    <label for="description">Description:</label>
    
                    <textarea id="descriptionField" name="description" cols="40" rows="8">{{description}}</textarea>
    
                </div>
    
                <div class="ui-body ui-body-b">
    
                    <fieldset class="ui-grid-a">
    
                        <div class="ui-block-a">
    
                            <p id="cancelButton" data-role="button" data-theme="d">Cancel</p>
    
                        </div>
    
                        <div class="ui-block-b">
    
                            <p id="submitButton" data-role="button" data-theme="a">Submit</p>
    
                        </div>
    
                    </fieldset>
    
                </div>
    
            </form>
    
        </div>
    
        <div data-role="footer" />
    
    </div>
    
    {{>scripts}}

That is some pretty hefty mark-up in relation to the relatively small (element count-wise) pages we have previously created. What should be familiar are the **{{mustache}}** tokens which will be dynamically filled with content using [mustache.js](https://github.com/janl/mustache.js) in our soon-to-be created **show function** for the _album edit_ page; but there are a few [jQuery Mobile](http://jquerymobile.com/) tidbits in here that we should take a little deeper of a look at.

### Page & Header

_/templates/albumedit.html_
    
    <div data-role="page" id="albumedit" data-nobackbtn="true">
    
        <div data-role="header" id="albumheader">
    
            <a id="cancelBackButton" href="#" data-icon="delete">Close</a>
    
            <h1 class="albumtitle">{{title}}</h1>
    
        </div>

A **data-role** of _page_ is set as usual to declare a [jQuery Mobile](http://jquerymobile.com/) page and an **id** attribute is assigned for a reason that will be discussed shortly. What is of note in the page **div** is the **data-nobackbtn** attribute. If set the a value of _true_, this declaration will remove the default **Back** button from the header and allow us to customize the options. For this case, we have replaced the **Back** button with a **Close** button:

_/templates/albumedit.html_
    
    <a id="cancelBackButton" href="#" data-icon="delete">Close</a>

Without specifying a style **class**, the **Close** button will be positioned to the left in the header. The **href** is set to an empty anchor. Essentially this is just a placeholder for an action defaulted to a link in the header. When we create the controller script for the _album edit_ page later in this article, we will prevent the default behaviour and handle the close manually.

### Content Form

[jQuery Mobile](http://jquerymobile.com/) has some great organization and styling when it comes to **form** elements. Positioning and aligning fields is all handled by the framework and, unless you want to get fancy, you basically just have to declare the desired element or assign the desired role/layout in order to achieve a fairly simple form. What we have done for our _album edit_ page template is pretty basic:

_/templates/albumedit.html_
    
    <form id="albumform" action="#" method="get" data-identity="{{document}}">
    
        <div data-role="fieldcontain">
    
            <label for="artist">Artist:</label>
    
            <input id="artistField" name="artist" type="text" value="{{artist}}" />
    
        </div>
    
        <div data-role="fieldcontain">
    
            <label for="title">Title:</label>
    
            <input id="titleField" name="title" type="text" value="{{title}}" />
    
        </div>
    
        <div data-role="fieldcontain">
    
            <label for="description">Description:</label>
    
            <textarea id="descriptionField" name="description" cols="40" rows="8">{{description}}</textarea>
    
        </div>
    
        <div class="ui-body ui-body-b">
    
            <fieldset class="ui-grid-a">
    
                <div class="ui-block-a">
    
                    <p id="cancelButton" data-role="button" data-theme="d">Cancel</p>
    
                </div>
    
                <div class="ui-block-b">
    
                    <p id="submitButton" data-role="button" data-theme="a">Submit</p>
    
                </div>
    
            </fieldset>
    
        </div>
    
    </form>

The input fields are populated with the dynamic values from our **show function** (discussed later) and two buttons are presented to either **Cancel** or **Submit** any changes to those values. By marking each **div** with a **data-role** of _fieldcontain_, the label/input pair will be styled and aligned with each other **div** with a horizontal bar to delimit them vertically. The **Cancel** and **Submit** buttons are held in a **fieldset** with a grid layout assigned:

_/templates/albumedit.html_
    
    <fieldset class="ui-grid-a">
    
        <div class="ui-block-a">
    
            <p id="cancelButton" data-role="button" data-theme="d">Cancel</p>
    
        </div>
    
        <div class="ui-block-b">
    
            <p id="submitButton" data-role="button" data-theme="a">Submit</p>
    
        </div>
    
    </fieldset>

By assigning a _ui-block_ value to each **div** in the **fieldset**, they will essentially be sized at 50% within the grid and positioned accordingly – **Cancel** to the left of **Submit**. You may notice that the “buttons” are not a link elements nor button elements. The reason being that both of those within a context of a form element were somehow being overridden to always perform a submit action. We will want to trap the user interaction with these elements in order to either **a)** reset the field values or **b)** submit our changes to the [CouchDB](http://couchdb.apache.org/) database. So, they have been declared as **p** elements with a **data-role** of button so as to have the proper styling, but not the default action role of submittal of form without being captured and prevented first. 

We will get into the submission of an edited document in a bit when we discuss the associated script with the _album edit_ page, but until then take notice of the **Partial** inclusion in our _albumedit_ template:

_/templates/albumedit.html_
    
    {{>scripts}}

… and let’s dive into creating our **show function** for editable album pages.

## Edit Show Function

If you have been following along with the [previous post](https://custardbelly.com/blog/?p=297), you will remember that we removed the string-manipulated mark-up from the **show function** for the _album view_ page and replaced it with [Mustache](https://github.com/janl/mustache.js) templating. The **show function** we will create for the _album edit_ page will largely look the same as the one created for the _album view_ page. In fact, the only difference will be the target template and partial include.

Open up your favorite text editor, create a new file, add the following snippet and save the file as _album-edit.js_ in the _/shows_ directory of your albums [couchapp](http://couchapp.org/page/index) (eg. _/Documents/workspace/custardbelly/couchdb/albums/shows/album-edit.js_):

_/shows/album-edit.js_
    
    function(doc, req) {
    
        var Mustache = require("vendor/couchapp/lib/mustache");
    
        var stash = {
    
                artist: doc.artist,
    
                title : doc.title,
    
                description: doc.description,
    
                document: doc._id
    
        };
    
        return Mustache.to_html(this.templates.albumedit, stash, this.templates.partials.albumedit);
    
    }

Again, if you have been following along with previous posts, this would look relatively familiar. Essentially, we are using the [mustache.js](https://github.com/janl/mustache.js) template plugin to deliver **HTML** mark-up of the previously created _albumedit.html_ [jQuery Mobile](http://jquerymobile.com/) page. The associated document is retrieved from the [CouchDB](http://couchdb.apache.org/) database by passing the **_id** of the document in the request (eg. [http://127.0.0.1:5984/albums/_design/albums/_show/  
album-edit/db04eb7e5c845ee0aa791ae1ed001e4d](http://127.0.0.1:5984/albums/_design/albums/_show/album-edit/db04eb7e5c845ee0aa791ae1ed001e4d)). 

The previously created _/templates/albumedit.html_ will be used as the template and is supplied as the first argument in **Mustache**._to_html()_. The **stash** object (second argument) is used to dynamically filled the values of the fields upon load and the specified properties of the **album document** are available for editing: **artist name**, **album title** and **personal description**. The third argument is the **Partial** includes directory that will be substituted in the **{{>}}** declarations of the _/templates/albumedit.html_ document. There is only one **Partial** defined in _albumedit.html_ – **{{>scripts}}** – which will essentially declare a **JavaScript** file with actions associated with the _album edit_ page.

## Scripts Partial

Open up your favorite text editor and save the following snippet as _scripts.html_ in _/templates/partials/albumedit_:

_/templates/partials/albumedit/scripts.html_
    
    <script src="../../script/album-edit-page.js"></script>

If you have followed along with create the **show function**, template and partial for the _album view_ page, this again will look similar. We are essentially loading an associated **JavaScript** file for the _album edit_ page. As explained in the [previous post](https://custardbelly.com/blog/?p=297), the script could be included here and not redirected to a **js** file, but for my own organizational habits I create a separate **JavaScript** file and have it residing in the _/_attachments/script/_ directory of my **albums** [couchapp](http://couchapp.org/page/index) (eg. _/Documents/workspace/custardbelly/couchdb/albums/  
_attachments/script/album-edit-page.js_).

## album-edit-page.js

If we think about the role of our _album edit_ page in the scheme of the application, we want to present the user with the ability to edit the album document from the [CouchDB](http://couchdb.apache.org/) **albums** database. The form will initially be filled with the latest editable values and the user has the ability to either submit changes or cancel any pending changes. A **Cancel** action will return the fields back to the original values and return the user to the _album view_ page. To ensure that the user is presented with the latest changes to the document from the database, we will also need to clear the page from the page cache just as we have done with the _album view_ page. With these requirements in mind, let’s start creating the associated script for the album edit [jQuery Mobile](http://jquerymobile.com/) page served up from the _album-edit_ **show function**.

### AlbumEditPageController

We’ll start by creating a quasi-view-controller for the _album edit_ page in the similar fashion as the one used for the _album view_ page (created in the [previous post](https://custardbelly.com/blog/?p=297)). Initially, it will handle recognizing once the [jQuery Mobile](http://jquerymobile.com/) page **div** is shown and remove it from the page cache once it is hidden (by navigating away from the page).

Open your favorite text editor and save the following snippet as _album-edit-page.js_ in the _/_attachments/script/_ directory:

_/_attachments/script/album-edit-page.js_
    
    var AlbumEditPageController = function() {
    
     
    
        function handleEditPageViewHide()
    
        {
    
            var docId = $("#albumform").data("identity");
    
            var pageCache =  $(document.getElementById("_show/album-edit/" + docId));
    
            pageCache.unbind( "pagehide", handleEditPageViewHide );
    
            pageCache.empty();
    
            pageCache.remove();
    
        }
    
     
    
        function handleEditView()
    
        {
    
            // Watch for bound hide of page to clear from cache.
    
            var docId = $("#albumform").data("identity");
    
            var albumPage = $(document.getElementById("_show/album-edit/" + docId));
    
            albumPage.bind( "pagehide", handleEditPageViewHide );
    
        }
    
     
    
        return {
    
            initialize: function() {
    
                $("div[data-role='page']").live( "pageshow", function() {
    
                    $("div[data-role='page']").die( "pageshow" );
    
                    handleEditView();
    
                });
    
            }
    
        };
    
    }();
    
     
    
    function handleEditPageReady()
    
    {
    
        AlbumEditPageController.initialize();
    
    }
    
    $().ready( handleEditPageReady )

Once the page is loaded, the **AlbumEditPageController** is initialized an a _pageshow_ event handler is assigned to recognize when the _albumedit_ [jQuery Mobile](http://jquerymobile.com/) page is shown. We access the page in the **DOM** using the standard **data-role** attribute value for a **jQuery Mobile** page. I stumbled upon this solution from these two forum posts – [http://forum.jquery.com/topic/force-page-update](http://forum.jquery.com/topic/force-page-update) and [http://forum.jquery.com/topic/binding-events-to-buttons-in-a-dialog](http://forum.jquery.com/topic/binding-events-to-buttons-in-a-dialog) – and seem to be the current agreed upon solution for accessing a loading **jQuery Mobile** page. In the _handleEditView()_ handler, the page in the **DOM** is accessed using **document**._getElementById()_ and assigned an event handler for _pagehide_ to clear it from the page (ie. **DOM**) cache. Aside from the external page **id** used to access the element, this is pretty much identical to the solution from the previous post.

One of the requirements for the _album edit_ page is the ability to cancel and clear any edited fields by the user. In order to do so, we will stored a local object with the provided name/value pairs so the fields can be easily reverted.

With _album-edit-page.js_ open in your favorite text editor, make the following modifications and save the file:

_/_attachments/script/album-edit-page.js_
    
    var AlbumEditPageController = function() {
    
     
    
        var editableAlbum;
    
     
    
        function handleEditPageViewHide()
    
        {
    
            editableAlbum = null;
    
     
    
            var docId = $("#albumform").data("identity");
    
            var pageCache =  $(document.getElementById("_show/album-edit/" + docId));
    
            pageCache.unbind( "pagehide", handleEditPageViewHide );
    
            pageCache.empty();
    
            pageCache.remove();
    
        }
    
     
    
        function handleEditView()
    
        {
    
            // Watch for bound hide of page to clear from cache.
    
            var docId = $("#albumform").data("identity");
    
            var albumPage = $(document.getElementById("_show/album-edit/" + docId));
    
            albumPage.bind( "pagehide", handleEditPageViewHide );
    
     
    
            storeUneditedDocument();
    
        }
    
     
    
        function storeUneditedDocument()
    
        {
    
            var artist = $("input#artistField").val();
    
            var album = $("input#titleField").val();
    
            var description = $("textarea#descriptionField").val();
    
            editableAlbum = {artist:artist, album:album, description:description};
    
        }
    
     
    
        return {
    
            initialize: function() {
    
               $("div[data-role='page']").live( "pageshow", function() {
    
                    $("div[data-role='page']").die( "pageshow" );
    
                    handleEditView();
    
                });
    
            }
    
        };
    
    }();
    
     
    
    function handleEditPageReady()
    
    {
    
        AlbumEditPageController.initialize();
    
    }
    
    $().ready( handleEditPageReady )

An **editableAlbum** member is declared and updated upon _pageshow_ in the _storeUneditedDocument()_ method. With the original values stored in this externally-immutable we can ensure that whenever a user decides to cancel the editing of the **album document** we can revert the field values to the original document values. Let’s hook up the **cancelBackButton** and **cancelButton** elements declared in the _albumedit.html_ template with _click_ event handlers in order to handle the revert action back to the original values.

Save the following modifications to _album-edit-page.js_:

_/_attachments/script/album-edit-page.js_
    
    var AlbumEditPageController = function() {
    
     
    
        var editableAlbum;
    
     
    
        function handleEditPageViewHide()
    
        {
    
            $("#cancelButton").die( "click", handleCancelEdit );
    
            $("#cancelBackButton").die( "click" );
    
            editableAlbum = null;
    
     
    
            var docId = $("#albumform").data("identity");
    
            var pageCache =  $(document.getElementById("_show/album-edit/" + docId));
    
            pageCache.unbind( "pagehide", handleEditPageViewHide );
    
            pageCache.empty();
    
            pageCache.remove();
    
        }
    
     
    
        function handleEditView()
    
        {
    
            // Watch for bound hide of page to clear from cache.
    
            var docId = $("#albumform").data("identity");
    
            var albumPage = $(document.getElementById("_show/album-edit/" + docId));
    
            albumPage.bind( "pagehide", handleEditPageViewHide );
    
     
    
            storeUneditedDocument();
    
        }
    
     
    
        function storeUneditedDocument()
    
        {
    
            var artist = $("input#artistField").val();
    
            var album = $("input#titleField").val();
    
            var description = $("textarea#descriptionField").val();
    
            editableAlbum = {artist:artist, album:album, description:description};
    
        }
    
     
    
        function revertEdits()
    
        {
    
            $("input#artistField").val( editableAlbum.artist );
    
            $("input#titleField").val( editableAlbum.album );
    
            $("textarea#descriptionField").val( editableAlbum.description );
    
        }
    
     
    
        function handleCancelEdit()
    
        {
    
            revertEdits();
    
        }
    
     
    
        return {
    
            initialize: function() {
    
                $("#cancelButton").live( "click", handleCancelEdit );
    
                $("#cancelBackButton").live( "click", function( event ) {
    
                    event.preventDefault();
    
                    handleCancelEdit();
    
                    return false;
    
                });
    
                $("div[data-role='page']").live( "pageshow", function() {
    
                    $("div[data-role='page']").die( "pageshow" );
    
                    handleEditView();
    
                });
    
            }
    
        };
    
    }();
    
     
    
    function handleEditPageReady()
    
    {
    
        AlbumEditPageController.initialize();
    
    }
    
    $().ready( handleEditPageReady )

In this snippet, we have wired the two cancelable button elements up to invoke the _handleCancelEdit()_ method upon a click event. All _revertEdits()_ does is reset the field values based on the stored values in **editableAlbum**. We also take care to kill those event listeners when the page is hidden. Now that we have one requirement fulfilled (cancel-ability) for the _album edit_ page, let’s move on to original intent of the page – submitting document changes.

### Submit

To submit changes to the target album document form the album edit page we will use the database API provided in the_ jquery.couchdb_ library plugin. That library is automatically loaded from the **loader** script created by [couchapp](http://couchapp.org/page/index) if remember back to the first post where we accessed the list of available **album documents** from the **albums** database in our [CouchDB](http://couchdb.apache.org/) instance. We resolved the **$db** member in the _index.html_ to the **albums** database when the page is loaded. When submitting from the _album edit_ page, we will just use that instance to load, modify and save the target document back to the database.

Make the following modifications to _album-edit-page.js_ and save:

_/_attachments/script/album-edit-page.js_
    
    var AlbumEditPageController = function() {
    
     
    
        var editableAlbum;
    
     
    
        function handleEditPageViewHide()
    
        {
    
            $("#cancelButton").die( "click", handleCancelEdit );
    
            $("#cancelBackButton").die( "click" );
    
            $("#submitButton").die( "click" );
    
            editableAlbum = null;
    
     
    
            var docId = $("#albumform").data("identity");
    
            var pageCache =  $(document.getElementById("_show/album-edit/" + docId));
    
            pageCache.unbind( "pagehide", handleEditPageViewHide );
    
            pageCache.empty();
    
            pageCache.remove();
    
        }
    
     
    
        function handleEditView()
    
        {
    
            // Watch for bound hide of page to clear from cache.
    
            var docId = $("#albumform").data("identity");
    
            var albumPage = $(document.getElementById("_show/album-edit/" + docId));
    
            albumPage.bind( "pagehide", handleEditPageViewHide );
    
     
    
            storeUneditedDocument();
    
        }
    
     
    
        function storeUneditedDocument()
    
        {
    
            var artist = $("input#artistField").val();
    
            var album = $("input#titleField").val();
    
            var description = $("textarea#descriptionField").val();
    
            editableAlbum = {artist:artist, album:album, description:description};
    
        }
    
     
    
        function saveDocument( document )
    
        {
    
            $db.saveDoc( document, {
    
                success: function( response )  {
    
                    updateEditableAlbum( document );
    
                },
    
                error: function() {
    
                    alert( "Cannot save document: " + document._id );
    
                }
    
            });
    
        }
    
     
    
        function updateEditableAlbum( document )
    
        {
    
            editableAlbum.artist = document.artist;
    
            editableAlbum.album = document.album;
    
            editableAlbum.description = document.description;
    
        }
    
     
    
        function revertEdits()
    
        {
    
            $("input#artistField").val( editableAlbum.artist );
    
            $("input#titleField").val( editableAlbum.album );
    
            $("textarea#descriptionField").val( editableAlbum.description );
    
        }
    
     
    
        function handleCancelEdit()
    
        {
    
            revertEdits();
    
        }
    
     
    
        return {
    
            initialize: function() {
    
                $("#cancelButton").live( "click", handleCancelEdit );
    
                $("#cancelBackButton").live( "click", function( event ) {
    
                    event.preventDefault();
    
                    handleCancelEdit();
    
                    return false;
    
                });
    
                $("#submitButton").live( "click", function( event ) {
    
                    var docId = $("#albumform").data("identity");
    
                    $db.openDoc( docId, {
    
                        success: function( document ) {
    
                            document.artist = $("input#artistField").val();
    
                            document.album = $("input#titleField").val();
    
                            document.description = $("textarea#descriptionField").val();
    
                            saveDocument( document );
    
                        },
    
                        error: function() {
    
                            alert( "Cannot open document: " + docId );
    
                        }
    
                    });
    
                });
    
                $("div[data-role='page']").live( "pageshow", function() {
    
                    $("div[data-role='page']").die( "pageshow" );
    
                    handleEditView();
    
                });
    
            }
    
        };
    
    }();
    
     
    
    function handleEditPageReady()
    
    {
    
        AlbumEditPageController.initialize();
    
    }
    
    $().ready( handleEditPageReady )

A click event handler is assigned to the **submitButton** element, from which the document is loaded and assigned the associated field values. Upon update to the new values, **$db**._saveDoc()_ is invoked with a **success** handler that updates the privately held **editableAlbum** object. This ensures that the values are properly restored back to any saved changes if the user decides to cancel at any time after the successful save.  
Almost there. We will just finish off our controller by navigating the user to the _album view_ page upon **Cancel** or **Submit**.

The following is the full _album-edit-page.js_ file with the last modifications highlighted. Save the following changes to _album-edit-page.js_:

_/_attachments/script/album-edit-page.js_
    
    var AlbumEditPageController = function() {
    
     
    
        var editableAlbum;
    
     
    
        function handleEditPageViewHide()
    
        {
    
            $("#cancelButton").die( "click", handleCancelEdit );
    
            $("#cancelBackButton").die( "click" );
    
            $("#submitButton").die( "click" );
    
            editableAlbum = null;
    
     
    
            var docId = $("#albumform").data("identity");
    
            var pageCache =  $(document.getElementById("_show/album-edit/" + docId));
    
            pageCache.unbind( "pagehide", handleEditPageViewHide );
    
            pageCache.empty();
    
            pageCache.remove();
    
        }
    
     
    
        function handleEditView()
    
        {
    
            // Watch for bound hide of page to clear from cache.
    
            var docId = $("#albumform").data("identity");
    
            var albumPage = $(document.getElementById("_show/album-edit/" + docId));
    
            albumPage.bind( "pagehide", handleEditPageViewHide );
    
     
    
            storeUneditedDocument();
    
        }
    
     
    
        function navigateToAlbumPage( docId )
    
        {
    
            $.mobile.changePage( "_show/album/" + docId, "slide", true, true );
    
        }
    
     
    
        function storeUneditedDocument()
    
        {
    
            var artist = $("input#artistField").val();
    
            var album = $("input#titleField").val();
    
            var description = $("textarea#descriptionField").val();
    
            editableAlbum = {artist:artist, album:album, description:description};
    
        }
    
     
    
        function saveDocument( document )
    
        {
    
            $db.saveDoc( document, {
    
                success: function( response )  {
    
                    updateEditableAlbum( document );
    
                    navigateToAlbumPage( document._id );
    
                },
    
                error: function() {
    
                    alert( "Cannot save document: " + document._id );
    
                }
    
            });
    
        }
    
     
    
        function updateEditableAlbum( document )
    
        {
    
            editableAlbum.artist = document.artist;
    
            editableAlbum.album = document.album;
    
            editableAlbum.description = document.description;
    
        }
    
     
    
        function revertEdits()
    
        {
    
            $("input#artistField").val( editableAlbum.artist );
    
            $("input#titleField").val( editableAlbum.album );
    
            $("textarea#descriptionField").val( editableAlbum.description );
    
        }
    
     
    
        function handleCancelEdit()
    
        {
    
            revertEdits();
    
            var docId = $("#albumform").data("identity");
    
            navigateToAlbumPage( docId );
    
        }
    
     
    
        return {
    
            initialize: function() {
    
                $("#cancelButton").live( "click", handleCancelEdit );
    
                $("#cancelBackButton").live( "click", function( event ) {
    
                    event.preventDefault();
    
                    handleCancelEdit();
    
                    return false;
    
                });
    
                $("#submitButton").live( "click", function( event ) {
    
                    var docId = $("#albumform").data("identity");
    
                    $db.openDoc( docId, {
    
                        success: function( document ) {
    
                            document.artist = $("input#artistField").val();
    
                            document.album = $("input#titleField").val();
    
                            document.description = $("textarea#descriptionField").val();
    
                            saveDocument( document );
    
                        },
    
                        error: function() {
    
                            alert( "Cannot open document: " + docId );
    
                        }
    
                    });
    
                });
    
                $("div[data-role='page']").live( "pageshow", function() {
    
                    $("div[data-role='page']").die( "pageshow" );
    
                    handleEditView();
    
                });
    
            }
    
        };
    
    }();
    
     
    
    function handleEditPageReady()
    
    {
    
        AlbumEditPageController.initialize();
    
    }
    
    $().ready( handleEditPageReady )

In _navigateToAlbumPage()_ we use **$.mobile**._changePage()_ to navigate the user to the external _album view_ page using the **show function** of our [CouchDB](http://couchdb.apache.org/) application based on the **_id** of the target document that is loaded in the _album edit_ page.

That should be it… aside from one thing. Although (once we push our changes) we can access the page using the **#_show/album-edit/${id}** location, as the application currently stands, there is no way to access the _album edit_ page from any other page in the application. To remedy that, we will make some modifications to the _album.html_ template and the _album-page.js_ script to navigate the user to the _album edit_ page.

## Accessing the Album Edit Page

I am going to assume that you have been following along with [previous posts](https://custardbelly.com/blog/?p=297) here and that you already have the _/templates/album.html_ and _/_attachments/script/album-page.js_ files. We are going to make modifications to them to include an **edit button** in the _album view_ page and assign a _click_ handler to navigate to the _album edit_ page.

### album.html

Open up the _/templates/album.html_ file in your favorite text editor and save the following modifications:

_/templates/album.html_
    
    <div data-role="page" id="albumview" data-position="inline" data-back="true">
    
        <div data-role="header" id="albumheader">
    
            <h1 class="albumtitle">{{title}}</h1>
    
            <a href="#home" data-icon="grid" class="ui-btn-right">Home</a>
    
        </div>
    
        <div data-role="content" id="albumcontent" data-identity="{{document}}">
    
          <h2 class="artist">{{artist}}</h2>
    
          <p class="title">{{title}}</p>
    
          <p class="description">{{description}}</p>
    
          <p id="editbutton" data-role="button" data-theme="a">Edit</p>
    
        </div>
    
        <div data-role="footer" />
    
    </div>
    
    {{>scripts}}

The only modification to the _album.html_ template e have made is the inclusion of an **Edit** button which is a **p** element attributed with the **data-role** of _button_. The [jQuery Mobile](http://jquerymobile.com/) framework will handle styling the **Edit** button to have consistency in look-and-feel with the other buttons throughout the application. Now let’s hook up a _click_ event listener for that button element to take the user to the _album edit_ page.

### album-page.js

Open up _/_attachments/script/album-page.js_ in your favorite text editor and save the following modifications:

_/_attachments/script/album-page.js_
    
    var AlbumPageController = function() {
    
     
    
        function handleView()
    
        {
    
            $("#editbutton").live( "click", handleEdit );
    
     
    
            // Watch for bound hide of page to clear from cache.
    
            var docId = $("#albumcontent").data("identity");
    
            var albumPage = $(document.getElementById("_show/album/" + docId));
    
            albumPage.bind( "pagehide", handlePageViewHide );
    
        }
    
     
    
        function handleEdit( event )
    
        {
    
            // Prevent default link event.
    
            event.preventDefault();
    
            // Access document id from data-identity.
    
            var docId = $("#albumcontent").data("identity");
    
            // Change page.
    
            $.mobile.changePage( "_show/album-edit/" + docId, "slide", false, true );
    
            return false;
    
        }
    
     
    
        function handlePageViewHide()
    
        {
    
            $("#editbutton").die( "click", handleEdit );
    
     
    
            var docId = $("#albumcontent").data("identity");
    
            var albumPageCache =  $(document.getElementById("_show/album/" + docId));
    
            albumPageCache.unbind( "pagehide", handlePageViewHide );
    
            albumPageCache.empty();
    
            albumPageCache.remove();
    
        }
    
     
    
        return {
    
            initialize : function() {
    
                $("div[data-role='page']").live( "pageshow", function() {
    
                    $("div[data-role='page']").die( "pageshow" );
    
                    handleView();
    
                });
    
            }
    
        };
    
    }();
    
     
    
    function handlePageViewReady()
    
    {
    
        AlbumPageController.initialize();
    
    }
    
    $().ready( handlePageViewReady );

The _handleEdit()_ handler navigates to the album edit page using the **$.mobile**._changePage()_ method pointing to the page created by the **show function** using the target document **id** that is used to show the _album view_ page.

Now that we have implemented a way to navigate to the album edit page from the application through the album view page, we can deploy our changes to the [CouchDB](http://couchdb.apache.org/) instance for our **albums** application.

## Deployment

Our **Albums** application has been modified to allow a user to modify properties of an **album document** from an _album edit_ page. That page can be accessed by clicking an **Edit** button from the _album view_ page accessible from a selection of an album from the list presented on the landing _index.html_. With these modifications saved, we can now push to the [CouchDB](http://couchdb.apache.org/) database using the [couchapp](http://couchapp.org/page/index) utility. Open a terminal and navigate to the directory where you create your **CouchApp** applications (for me that is _/Documents/workspace/custardbelly/couchdb_ and in there i have a folder named _albums_ which is the **CouchApp** application directory for these examples). Enter the following command to push the changes to the **CouchDB** instance:
    
    couchapp push albums http://127.0.0.1:5984/albums

If all was successful and you now go to [http://127.0.0.1:5984/albums/_design/albums/index.html](http://127.0.0.1:5984/albums/_design/albums/index.html), click on an album from the list and select to edit that document. From the _album edit_ page you are able to either cancel any edits or submit the changes to the target **album document**. What a thing of beauty ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) Let’s take a look at the current state of the application:

_index.html (aka #home)_:  
![index.html](http://www.custardbelly.com/blog/images/couchapp_six.png)

_album view page_:  
![album view page](http://www.custardbelly.com/blog/images/couchapp_seven.png)

_album edit page_:  
![album edit page](http://www.custardbelly.com/blog/images/couchapp_eight.png)

## Conclusion

This post got a lot longer than I had anticipated… which just goes to show what a wind-bag i am ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) All joking aside, I think we covered some good ground, especially about saving modifications to a document back to the [CouchDB](http://couchdb.apache.org/) database. We also covered, again, how to monitor pages so as to remove them from cache and ensure that the user is always presented with the latest document information. We also delved into assigning event listeners to button elements. All good fun… well, hopefully, it was to you.

_[Note] This post was written against the following software versions:_  
**CouchDB **– 1.0.1  
**CouchApp** – 0.7.2  
**jQuery** – 1.4.4  
**jQuery Mobile** – 1.0a2  
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

[Full source for albums couchapp here.](https://custardbelly.com/downloads/couchapp/jqm_couchdb_albums.zip)

Posted in [CouchDB](https://custardbelly.com/blog/category/couchdb/), [jquery](https://custardbelly.com/blog/category/jquery/), [jquery-mobile](https://custardbelly.com/blog/category/jquery-mobile/).
