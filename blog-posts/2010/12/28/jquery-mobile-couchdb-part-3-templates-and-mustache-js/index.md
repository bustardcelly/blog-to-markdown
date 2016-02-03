---
title: 'jQuery Mobile + CouchDB: Part 3 – Templates and Mustache.js'
url: 'https://custardbelly.com/blog/2010/12/28/jquery-mobile-couchdb-part-3-templates-and-mustache-js/'
author:
  name: 'todd anderson'
date: '2010-12-28'
---

In the [previous post](https://custardbelly.com/blog/?p=278), I covered displaying a document from a [CouchDB](http://couchdb.apache.org/) database in the context of a [jQuery Mobile](http://jquerymobile.com/) page. A difference between **local** vs **external** [jQuery Mobile](http://jquerymobile.com/) pages was discussed, and it was concluded that external pages was beneficial for the client-side application. In finding this happy medium, I also talked about _show functions_ in **CouchDB** and how they serve up documents upon request.

In this article, I am going to cover another aspect of delivering **HTML** content from **CouchDB** – _templates_. While doing so, I will modify the current document views to provide a cleaner solution (imo) for delivering and rendering document-based [jQuery Mobile](http://jquerymobile.com/) pages. Hopefully, this will set the basis for creating additional views for the application…

## Templates

In the previous post, I covered using **show function**s to deliver **HTML** content as a [jQuery Mobile](http://jquerymobile.com/) page from a [CouchDB](http://couchdb.apache.org/) instance. From the previous **show function** example for the **Albums** application, I basically constructed a string that would be interpreted as **HTML** mark-up using the values from the document. While this is a perfectly valid solution, its probably not the best if we want to reuse parts of that **HTML** or if the mark-up gets a little too unwieldy for string manipulation based on the request. To provide a little sanity as we start making more page documents for the application, we going to start using **templates** to stub out the mark-up of an **HTML** document and fill content dynamically from the **show function**s.

### [mustache.js](https://github.com/janl/mustache.js)

If you have been following along in the tutorials, you may remember that in the _loader.js_ script there were a few **JavaScript** files being loaded that were not being referenced within the current application. One of those was _mustache.js_. I didn’t talk about it at the time and I said we could probably get rid of it for now, but might as well leave it in… hopefully you left it in. If not, you’re screwed. Kidding ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

I don’t want to go into a [mustache](https://github.com/janl/mustache.js) explanation as there are already some great articles out there – especially this one from [CouchOne](http://blog.couchone.com/post/622014913/mustache-js) – but I will say that _mustache.js_ is a templating engine for rendering any type of content. For our purposes, we are going to use the _to_html_() function of **Mustache** to marry our dynamic album document values with an **HTML** template and deliver pages from our respective **show function**s from the [CouchDB](http://couchdb.apache.org/) database.

### Album Page Template

Our previous version of _album.js_ from the _/show_ directory of our **Albums** [couchapp](http://couchapp.org/page/index) looked like the following:

_/show/album.js_
    
    function(doc, req) {
    
      var html = "<div data-role=\"page\" id=\"albumview\">" +
    
                           "<div data-role=\"header\" id=\"albumheader\">" +
    
                               "<h2 class=\"albumtitle\">" + doc.title + "<\/h2>" +
    
                           "<\/div>" +
    
                           "<div data-role=\"content\" id=\"albumcontent\">" +
    
                               "<h2 class=\"artist\">" + doc.artist + "<\/h2>" +
    
                               "<p class=\"title\">" + doc.title + "<\/p>" +
    
                               "<p class=\"description\">" + doc.description + "<\/p>" +
    
                           "<\/div>" +
    
                           "<div data-role=\"footer\" \/>" +
    
                       "<\/div>";
    
      return html;
    
    }

That served our purpose at the time, but such string manipulation for each page we are going to serve up makes my eyes bleed ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) As such, we will use _mustache.js_ to populate document values in an **HTML** template. First order of business: Remove that string construct from _/shows/album.js_ and put it into a **template**, replacing the values with **{{mustache}}** directives.

Create a new directory called _templates_ in your [couchapp](http://couchapp.org/page/index) directory for the **Albums** application (for me that is at _/Documents/workspace/custardbelly/couchdb/albums_). Create a new **HTML** document in your favorite text editor and save the following as _album.html_ in the _/templates_ directory:

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
    
        </div>
    
        <div data-role="footer" />
    
    </div>

Essentially, we have just moved our mark-up from one document to another; the difference being that we are now employing **{{mustache}}**s as placeholders for dynamic content values. You may notice that the names used in the mustaches are just the property names of the document – similar to the previous _albums.js_ example. In fact there are the property names of the object that will be passed to the [Mustache](https://github.com/janl/mustache.js) engine to generate our page.

Some added [jQuery Mobile](http://jquerymobile.com/) element content has been added to the new _album_ page document, as well. We added the **data-position** and **data-back** attributes to the _page_ **div** in order to preserve the back button and add a **Home** page button to the header. This will allow us to always be able to get back to the _index.html_ **Home** page from an _album page_.
    
    <a href="#home" data-icon="grid" class="ui-btn-right">Home</a>

We will need to modify the _page_ **div** in _index.html_ to have an **id** value of “home”, but setting that hash as the **href** for the **Home** button in the header of our _album page_ will, essentially, enable that link to direct the user back to the page content of the parenting document -_index.html_.

In _album.html_ we have also declared a **data-identity** for the content **div** and provided a _{{document}}_ value. This will be the _document._id_ from the _album.js_ **show function** and we will later see how it will be used. Back to our _album.js_ document…

### Album Page Show Function

Open up the _/show/album.js_ document in your favorite text editor and make replace the current content with the following:

_/show/album.js_
    
    function(doc, req) {
    
        var Mustache = require("vendor/couchapp/lib/mustache");
    
        var stash = {
    
            artist: doc.artist,
    
            title : doc.title,
    
            description: doc.description,
    
            document: doc._id
    
        };
    
        return Mustache.to_html(this.templates.album, stash);
    
    }

As mentioned previously, [CouchApp](http://couchapp.org/page/index) includes the [Mustache](https://github.com/janl/mustache.js) **JavaScript** file automatically when generating a new **couchapp** application. In this example we first assign a reference to the **Mustache** module through a _require()_ call for the file in the _vendor/couchapp/lib_ directory. A generic _stash_ object is created to assign property values that are dynamically populated into the _album.html_ template (previous snippet) using the **Mustache**:_to_html_ method.

I am not entirely clear on how it is possible to reference files and directories with the **this** keyword in a **show function**, but i can only assume that [couchapp](http://couchapp.org/page/index) has generated an object tree based on the file structure from which one can access values. If you do know, please leave a comment. In any event, the template file and the defining object are the first two arguments for **Mustache**:_to_html_. Upon request for an _album_ document, this will return the _album.html_ page dynamically populated with the values for the document related to the _id_ in the request **URL** (eg. [http://127.0.0.1:5984/albums/_design/albums/index.html#_show  
/album/db04eb7e5c845ee0aa791ae1ed000fe8](http://127.0.0.1:5984/albums/_design/albums/index.html#_show/album/db04eb7e5c845ee0aa791ae1ed000fe8)).

### Hiccup

There may be a slight problem in this solution however…. Though [CouchDB](http://couchdb.apache.org/) does request-cacheing based on header **ETag**s on documents, [jQuery Mobile](http://jquerymobile.com/) also does cacheing of pages (or rather it accesses ‘pages’ already loaded into the **DOM**). So there may be a time that an album has been edited during the application session and **jQuery Mobile** serves up old information as it never went back out the make a **GET** request to **CouchDB**, utilizing this **show function**. We could make a request for the document each time the page is shown in the **DOM** using the _jquery.couch_ library, but that may be unnecessary overhead; not to mention a waste of the templating engine.

Another solution, and one I think is viable and worth consideration, is to remove the page from the [jquery Mobile](http://jquerymobile.com/) page cache when this page is hidden in the view (when you navigate to another page). In order to do so, we will need to access the cached page in the **DOM** using **JavaScript**. Instead of adding this **JavaScript** directly in the **HTML** template file, we will use another templating feature available in [Mustache](https://github.com/janl/mustache.js) – **Partials**.

## Partials

**Partials** are, essentially, just a way to include common mark-up or code or what have you into the target **template** page. It’s important to remember that partials are rendered in first so any **{{mustache}}**s in the partial file will also be filled. For the purposes of our example application, we are just going to include mark-up to load a script. It may be a little overkill at the moment, but I wanted to show the use of partials as they can be very handy.

Open up your favorite text editor and save the following snippet as _scripts.html_ in _/templates/partials/album_.

_/templates/partials/album/scripts.html_
    
    <script src="../../script/album-page.js"></script>

_[**02-06-2010**: Thank you to Steve and Stacy Braxton for leaving a comment noting that the filepath to scripts.html for the album page was incorrectly shown in italics. The correct filepath is now displayed. Thanks!]_

Real boring stuff and not using the full breath of what **Partials** can do. Basically we are just loading in an associated **JavaScript** file with our page from the **show function**. Great. Now we have to create another file. I know, I know. It may appear convoluted, but in my head it is much cleaner and organized. The script we are about to create, could be included in this **partial** or in the **template**, but i prefer to work with another separate **JavaScript** file whose purpose I know based on its extension – its got script in it.

### album-page.js

You may have looked at the path in the **src** attribute value from the **Partial** we just created and noticed that it is a relative path that goes out a couple directories. That is going back to the __attachments_ directory to access the _album-page.js_ file from the _script_ folder. The __attachments_ directory also houses the style folder in which we added the [jQuery Mobile](http://jquerymobile.com/) styles in the first post.

We’re going to create an add the _album-page.js_ file to the _/_attachments/script_ directory and it will provide the ability to access and clear the page from the page cache of **jQuery Mobile** so as to always serve up a the page from [CouchDB](http://couchdb.apache.org/) (based on its own cacheing mechanism) using the show function. Open up your favorite text editor and save the following snippet as _album-page.js_ in _/_attachments/script_:

_/_attachments/script/album-page.js_
    
    var AlbumPageController = function() {
    
     
    
        function handleView()
    
        {
    
            // Watch for bound hide of page to clear from cache.
    
            var docId = $("#albumcontent").data("identity");
    
            var albumPage = $(document.getElementById("_show/album/" + docId));
    
            albumPage.bind( "pagehide", handlePageViewHide );
    
        }
    
     
    
        function handlePageViewHide()
    
        {
    
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

In essence, we are just creating a view controller for our [jQuery Mobile](http://jquerymobile.com/) page served up from the **show function**. Once the page is recognized as part of the **DOM**, the controller is initialized and an event handler is assigned to the _pageshow_ event for the current page – the _album.html_ served up. We access the page in the **DOM** using the standard **data-role** attribute value for a **jQuery Mobile** page. I stumbled upon this solution from these two forum posts – [http://forum.jquery.com/topic/force-page-update](http://forum.jquery.com/topic/force-page-update) and [http://forum.jquery.com/topic/binding-events-to-buttons-in-a-dialog](http://forum.jquery.com/topic/binding-events-to-buttons-in-a-dialog) – and seem to be the current agreed upon solution for accessing a loading **jQuery Mobile** page. 

Now, it should be noted that setting that handler will actually set a handler on all **div**s with the **data-role** attributed as “page”. But since we are only concerned with the _pageshow_ event, we know that the current target is the _album page_. Once that event is captured, we remove the handler and assign a _pagehide_ event handler to clear the page from the [jQuery Mobile](http://jquerymobile.com/) (ie. **DOM**) cache and remove the elements from the **DOM**.

Since the _album page_ is an external page (defined in the script in _index.html_ when building the list items), its registered in the **DOM** and accessed using the __show_ path based on the document ID. So, when the page is fully loaded we access that page recognized in the **DOM** using the _getElementById_() method:
    
    var docId = $("#albumcontent").data("identity");
    
    var albumPage = $(document.getElementById("_show/album/" + docId));

Accessing the page as such, we can empty all its elements and remove it once the page has been fully hidden from the view in the page transition of jQuery Mobile:
    
    var docId = $("#albumcontent").data("identity");
    
    var albumPageCache =  $(document.getElementById("_show/album/" + docId));
    
    albumPageCache.unbind( "pagehide", handlePageViewHide );
    
    albumPageCache.empty();
    
    albumPageCache.remove();

That essentially will make a request each time to [CouchDB](http://couchdb.apache.org/) for the album document page and not rely on the cacheing of pages within [jQuery Mobile](http://jquerymobile.com/). This will also open up the ability to assign and manage handlers for other events, such a requesting pages for editing a document… but we’ll broach that subject in another post ![;)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_wink.gif) For now, let’s go back and update our _album.js_ and _album.html_ documents to include the **partial**.

_[**01-28-2010**: Thank you to IR for leaving a comment alerting me to the fact that i totally missed out on updating the neccessary files after creating the partial]_

### Modifying album.js and album.html

Open up _/shows/album.js_ in your favorite text editor and make the following modification to pass the **partial** directory in **Mustache**._to_html_():

_/shows/album.js_
    
    function(doc, req) {
    
        var Mustache = require("vendor/couchapp/lib/mustache");
    
        var stash = {
    
            artist: doc.artist,
    
            title : doc.title,
    
            description: doc.description,
    
            document: doc._id
    
        };
    
        return Mustache.to_html(this.templates.album, stash, this.templates.partials.album);
    
    }

That last argument in _to_html_() will allow you to stub out the documents included in the _/album_ folder of the **partials** directory in the _album.html_ template. We’ll need to update that document as well for our _scripts_ **partial** to be included.

Open up _/templates/album.html_ and make the following modification:

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
    
        </div>
    
        <div data-role="footer" />
    
    </div>
    
    {{>scripts}}

A slight modification to the syntax on how you would include object property values, the **partial** is included by appending the name of the **partial** document to include with a _greater than_ character. That will essentially write the content of the document inline in the **template** where it is declared.

Now we just need to make a small modification to the _index.html_ file and then deploy our modified application to the **CouchDB** instance so we can view our wonderful changes (which won’t look like we changed a thing).

### Modifying index.html

We added a **Home** button to the header bar of the _album page_ so we could always navigate back to the **Home** page. Currently the _album page_ is accessible from the album list on the **Home** page, but who knows, maybe that won’t always be the case in the future. In any event, we made the change and assigned the **href** value for the **Home** page button with the _#home_ anchor. Currently that will go nowhere. We’ll set that as the div id on the main [jQuery Mobile](http://jquerymobile.com/) page in _index.html_.

Open up the _/_attachments/index.html_ file in your favorite text editor and make the following modifications the #home **page div**:

_/_attachments/index.html_
    
    <div id="home" data-role="page">
    
        <div data-role="header"><h1>Albums</h1></div>
    
        <div data-role="content">
    
            <ul id="albums" data-role="listview" data-theme="c" data-dividertheme="b"></ul>
    
        </div>
    
        <div data-role="footer" class="ui-bar"><h4>a list of albums</h4></div>
    
    </div>

_[**02-05-2010**: Thank you to Otetz for leaving a comment about the missing call to refresh the list prior to shoe on the index.html file]_  
With _index.html_ still open in your favorite text editor, add the following line to the _handleDocumentReady_() method in the inline **JavaScript**:
    
    function handleDocumentReady()
    
    {
    
        $("#home").bind( "pagebeforeshow", refreshAlbums );
    
        refreshAlbums();

Save that, and now we can add a **Home** button to any page and will always be directed back to that **div** with the list of albums from our **CouchDB** database. Cool. Time to deploy.

## Deployment

We modified our show function to use templates and created a script to empty the page and its elements from the **DOM** upon hide within the [jQuery Mobile](http://jquerymobile.com/) context and are assured that each access of an album document will contain the latest changes. With these modifications saved, we can now push to the [CouchDB](http://couchdb.apache.org/) database using the [couchapp](http://couchapp.org/page/index) utility. Open a terminal and navigate to the directory where you create your **CouchApp** applications (for me that is _/Documents/workspace/custardbelly/couchdb_ and in there i have a folder named _albums_ which is the **CouchApp** application directory for these examples). Enter the following command to push the changes to the **CouchDB** instance:
    
    couchapp push albums http://127.0.0.1:5984/albums

If all was successful and you now go to [http://127.0.0.1:5984/albums/_design/albums/index.html](http://127.0.0.1:5984/albums/_design/albums/index.html), we’ll still have our old familiar list and still access each album by clicking on a list item. Basically it performs exactly as it had before, but we cleaned up a little on our end… a benefit to us as the developer and a benefit to the user though not visually noticeable… it still looks rather ugly ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

## Conclusion

We delved a little deeper into how to serve up pages from [CouchDB](http://couchdb.apache.org/) using **templates** and **partials** (thanks to [Mustache](https://github.com/janl/mustache.js)!) and also touched on accessing pages from **DOM** cache in the context of [jQuery Mobile](http://jquerymobile.com/) framework. All nice stuff, but nothing really has changed in how the application worked for the end user. We ensured that _album page_s always had the correct and latest content, but we haven’t opened up the possibility to edit the document and commit changes. That’s to come ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) Just wanted to lay the groundwork for easing into adding more pages to our application. Hopefully you found some of this useful.

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
