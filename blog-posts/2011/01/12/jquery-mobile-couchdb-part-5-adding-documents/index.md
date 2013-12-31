---
title: 'jQuery Mobile + CouchDB: Part 5 – Adding Documents'
url: 'http://custardbelly.com/blog/2011/01/12/jquery-mobile-couchdb-part-5-adding-documents/'
author:
  name: 'todd anderson'
date: '2011-01-12'
---

In my [previous post](http://custardbelly.com/blog/?p=318), I addressed editing documents using a form in [jQuery Mobile](http://jquerymobile.com/) and updating the document in the [CouchDB](http://couchdb.apache.org/) database using the _jquery.couch_ plugin. So far, if you have been following along, the posts have only addressed the _RU_ of **CRUD** (**C**reate **R**ead **U**pdate **D**elete) from the client application aspect. The list of albums are read upon launch, with a single album read on detail, and last post addressed updating a target document. Its high-time we start throwing **C** & **D** into that mix… but hold on. One at a time. First one will be fun. The second one will make you cry. That’s not true.

In this article I am going to address the ability to create a new album document, which in and of itself is not entirely different from editing. While doing so, I will address adding a button bar as a **footer** using [jQuery Mobile](http://jquerymobile.com/) grid layout and a few tidbits here and there to get things to work, as well as continue to gush over the beauty of using a document-oriented database system… because there’s changes ahead!

**In the following examples, I will assume that you have been following along from previous posts and present updates to existing code**.

## Adding Documents

In the previous posts, I discussed the difference between **internal** and **external** pages in [jQuery Mobile](http://jquerymobile.com/) and made a fair assessment (i hope) to create the pages of our client application as externally-loaded into the **DOM**. This allows us to see the beauty of **templates** and **show functions** and peek a little into how a [CouchDB](http://couchdb.apache.org/) instance, which is an **HTTP** server itself, can be used to serve up a client the communicates with a target [CouchDB](http://couchdb.apache.org/) database.

Well, we are not going to do that for the _album add_ page. Instead, we will declare the page **internally** and not worry about removing it form the **DOM** to prevent page caching. The reason is that, though it will look very similar to the _album edit_ page in mark-up, it differs slightly in its usage. The _album add_ page has no document association and is not served up based on a document **id**. So using a **show function** would essentially return a 404. We could have it as an external page, but I got to thinking… will we need the ability for a user to hit the _album add_ page outside of the context of the client application? Meaning, should we restrict the ability to add documents to a single client? I am choosing to, but you can certainly run with it and make it external. For me it makes more sense to only allow the _index.html_ to be hit and the sole starting point for the **Albums** application.

To start, open up that old _index.html_ file from the _/_attachments_ directory in your favorite text editor. We are initially just going to modify the page declarations in the **body** tag, so the following modifications are a subset of lines from the _index.html_. The whole file will be presented later; for now save the following changes:

__attachments/index.html_
    
    <body>
    
        <div id="home" data-role="page">
    
            <div data-role="header"><h1>Albums</h1></div>
    
            <div data-role="content">
    
                <ul id="albums" data-role="listview" data-theme="c" data-dividertheme="b"></ul>
    
            </div>
    
            <div data-role="footer" class="ui-bar"><h4>a list of albums</h4></div>
    
        </div>
    
        <div id="addAlbum" data-role="page">
    
            <div data-role="header"><h1>Add Album</h1></div>
    
            <div data-role="content">
    
                <form id="albumAddForm" action="#" method="get">
    
                    <div data-role="fieldcontain">
    
                      <label for="artist">Artist:</label>
    
                         <input id="addArtistField" name="artist" type="text" />
    
                  </div>
    
                  <div data-role="fieldcontain">
    
                      <label for="title">Title:</label>
    
                         <input id="addTitleField" name="title" type="text" />
    
                  </div>
    
                  <div data-role="fieldcontain">
    
                      <label for="description">Description:</label>
    
                      <textarea id="addDescriptionField" name="description" cols="40" rows="8"></textarea>
    
                  </div>
    
                  <div class="ui-body ui-body-b">
    
                      <fieldset class="ui-grid-a">
    
                          <div class="ui-block-a">
    
                              <a href="#home" id="addCancelButton" data-role="button" data-theme="d">Cancel</a>
    
                          </div>
    
                          <div class="ui-block-b">
    
                              <a href="#" id="addSubmitButton" data-role="button" data-theme="a">Submit</a>
    
                          </div>
    
                      </fieldset>
    
                  </div>
    
              </form>
    
            </div>
    
        </div>
    
    </body>

As i mentioned earlier, if you have been following along with the previous posts, the **addAlbum** page is very similar to the **external** _album edit_ page (created in the last post); the only difference being that the fields/buttons have different **id**s and the header is left to default in displaying the **Back** button.

There is associated script with the internal **addAlbum** page that handles submitting a new album document to the [CouchDB](http://couchdb.apache.org/) database, and there is no time like the present to shut me up and dive right in. Make the following changes to the previously created _handleDocumentReady_() **JavaScript** method within _index.html_:

__attachments/index.html_
    
    function handleDocumentReady()
    
    {
    
        $("#home").bind( "pagebeforeshow", refreshAlbums );
    
        refreshAlbums();
    
     
    
        $("#addSubmitButton").live( "click", function( event ) {
    
            event.preventDefault();
    
            var document = {};
    
            document.artist = $("input#addArtistField").val();
    
            document.title = $("input#addTitleField").val();
    
            document.description = $("textarea#addDescriptionField").val();
    
            document.creation_date = ( new Date() ).getTime();
    
            $db.saveDoc( document, {
    
                    success: function() {
    
                        $.mobile.changePage( "#home", "slidedown", true, true );
    
                    },
    
                    error: function() {
    
                        alert( "Cannot save new document." );
    
                     }
    
            });
    
            return false;
    
        });
    
    }

Essentially, we add a _click_ event handler to the **submit button**, create a new document object, fill in the proper fields then use the **$db** instance (established on load as the albums databased from the [CouchDB](http://couchdb.apache.org/) instance) to save the new document. You may notice that saving a new document and updating an existing document are both done using the same function from the **jquery.couch** plugin: _saveDoc_(). That function will check for an **_id** on the document object (first argument) and determine if a **POST** or **PUT** is required. That is all handled internally in _saveDoc_() so you don’t have to worry.

### creation_date

You may have also noticed that i said “proper fields” and the document object has a property that was not on the previous documents we created from the first post. Where did this **creation_date** property come from? And why won’t it throw an error on save? Short answer: we are working with a document-oriented database, so we are not tied to a schema and a pre-defined set of fields in a table. So anything can be added to any document?! Isn’t that a little wild-west?! Maybe, but we are making a pretty focused client application here where we know what fields we want to present to the user; but it is a good point and a solid argument to not keep your [CouchDB](http://couchdb.apache.org/) instance in [admin-party](http://guide.couchdb.org/draft/security.html) and to create good [validation functions](http://guide.couchdb.org/draft/validation.html). For now, we are not concerned about security or validation and are having some fun.

OK, so why did we add **creation_date**? The reason is related to the **map function** for _/views/albums_. If you remember way back to the [first article](http://custardbelly.com/blog/?p=244), we created a **map function** for our **albums view** that basically returned a key and value. The key being the **_id** of each document. That key is used to sort the returned array of documents. That key is also automatically generated for us when we create a new document. Hence, a case could be made that the order of added documents will not correlate to the descending order of the sorted key list (**_id** of each document in the database). In order to be able to properly present the list of albums in the order that they were added to the database, the **creation_date** property is now being added to each new document. I use the time in milliseconds as the value for **creation_date** because i feel that most (if not all) client-side languages will know how to use that number and format the date as required.

### Updating albums view

Well… now there is the issue of returning and displaying album documents sorted by **creation_date**. Fortunately it is an easy issue to resolve: we are going to update the key value returned from the **map function** of the **albums view**.

Open up _/views/albums/map.js_ in your favorite text editor and change the previously-saved _emit_() invocation to the following:

/views/albums/map.js
    
    function(doc) {
    
      emit( ( new Date(doc.creation_date) ).getTime(), doc );
    
    }

We are now using the **creation_date** property as the key for each document to return. [CouchDB](http://couchdb.apache.org/) will sort on this key and return a list of documents from the **albums** database in our [CouchDB](http://couchdb.apache.org/) instance. You may notice that we are resolving to a new instance of **Date** using the **creation_date** property value and then returning the same value using _getTime_(). Seems a little superfluous. However, it is just a sort of future-proofing if a requirement comes down the pipe that **creation_date** needs to be saved in some other format. Who knows.

### Sorting

If we were to push our changes and requested the list of album documents, you would notice that the documents are sorted by [CouchDB](http://couchdb.apache.org/) in ascending order (oldest **creation_date** first). Now, we could create a **reduce function** to return the list in descending order, but i don’t think that is the best use of **reduce** seeing as we can easily using **JavaScript** to reverse the array upon response. So, I am going to make you open up _index.html_ again and add one line with the _refreshAlbums_() **JavaScript** method:

_/_attachments/index.html_
    
    function refreshAlbums()
    
    {
    
        $("#albums").empty();
    
        $db.view("albums/albums", {
    
            success: function( data ) {
    
                    var i;
    
                    var album;
    
                    var artist;
    
                    var title;
    
                    var description;
    
                    var listItem;
    
                    var header;
    
                    var albumLink;
    
                    data.rows.reverse();
    
                    for( i in data.rows )
    
                    {
    
                        album = data.rows[i].value;
    
                        artist = album.artist;
    
                        title = album.title;
    
                        description = album.description;
    
                        externalPage = "_show/album/" + album._id;
    
                        listItem = "<li class=\"album\">" +
    
                                    "<a href=\"" + externalPage + "\">" +
    
                                        "<h2 class=\"artist\">" + artist + "<\/h2>" +
    
                                    "<\/a>" +
    
                                    "<p class=\"title\">" + title + "<\/p>" +
    
                                    "<p class=\"description\">" + description + "<\/p>" +
    
                                   "<\/li>";
    
                        $("#albums").append( listItem );
    
                    }
    
                    $("#albums").listview( "refresh" );
    
                }
    
        });
    
    }

That’s it! Just reverse the returned rows of album documents from the view request and we have a descending list of albums we have added to the database based on **creation_date**.

Now the only problem is we have no way of accessing the **addAlbum** page! Don’t fret. We’re going to add a button bar to the **footer** of the **#home** page that will take us there.

## Updating #home Footer

We are going to update the default (**#home**) [jQuery Mobile](http://jquerymobile.com/) page for our application to display a button bar in the **footer**. Originally, we just had some text there as a placeholder, but seeing as we want to ability to add album documents from the list view will replace that text with a **navbar** containing a single button – the **add button** – that will navigate the user to the _album add_ page we created in the previous section of this article. Doing so will involve a couple user experience issues that we will address and uncover a few more [jQuery Mobile](http://jquerymobile.com/) goodies.

Open up _/_attachments/index.html_ in your favorite editor and save the following modifications to the **#home** page:

_/_attachments/index.html_
    
    <div id="home" data-role="page">
    
      <div data-role="header" data-position="fixed"><h1>Albums</h1></div>
    
      <div data-role="content">
    
          <ul id="albums" data-role="listview" data-theme="c" data-dividertheme="b"></ul>
    
      </div>
    
      <div data-role="footer" data-position="fixed">
    
        <div data-role="navbar">
    
            <ul class="ui-grid-a">
    
                <li style="width:100%;"><a href="#addAlbum" data-transition="slideup" data-icon="plus">Add Album</a></li>
    
            </ul>
    
        </div>
    
      </div>
    
    </div>

The first thing you may notice is that we have added a **data-position** attribute to the **header** and **footer**. With a value of “_fixed_“, the[ jQuery Mobile](http://jquerymobile.com/) framework will ensure that they are always in place (**header** at top, **footer** at bottom) without regards to scrolling. This will treat the content list as the scrollable area, so when our list grows with all the new album documents that we create a user will always see and be able to access the **header** and **footer** (with the **add button**).

Aside from the **data-position** attribution, we added a **navbar** as the content for the **footer**. The content of the **navbar** is a list with a single item with its navigational reference to the **addAlbum** [jQuery Mobile](http://jquerymobile.com/) page we created previously. Assigning a [grid](http://jquerymobile.com/demos/1.0a2/#docs/content/content-grids.html) class to the list will layout its items in a sequently manner. We set the **width** style rule directly for the list item because styling of list items for a **navbar** are limited to at least 2 items in the [jQuery Mobile](http://jquerymobile.com/). To get around that and have a single button, we just set it to have the width of the **navbar**. Then we also got all fancy with transitions and icons on the link within the list item ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

The only drawback to this solution is that we dynamically fill our list upon load. Unfortunately this updates the y position of the **footer** by (_n*list item height_). So if we kept our page like this, we’d lose the **footer** off the page once the list is filled ![:(](http://custardbelly.com/blog/wp-includes/images/smilies/icon_sad.gif) Wait, don’t leave… we can easily fix that!

With the _/_attachments/index.html_ file still open in your favorite text editor, add the following line after the list _refresh_():

_/_attachments/index.html_
    
    function refreshAlbums()
    
    {
    
        $("#albums").empty();
    
        $db.view("albums/albums", {
    
            success: function( data ) {
    
                    var i;
    
                    var album;
    
                    var artist;
    
                    var title;
    
                    var description;
    
                    var listItem;
    
                    var header;
    
                    var albumLink;
    
                    data.rows.reverse();
    
                    for( i in data.rows )
    
                    {
    
                        album = data.rows[i].value;
    
                        artist = album.artist;
    
                        title = album.title;
    
                        description = album.description;
    
                        externalPage = "_show/album/" + album._id;
    
                        listItem = "<li class=\"album\">" +
    
                                    "<a href=\"" + externalPage + "\">" +
    
                                        "<h2 class=\"artist\">" + artist + "<\/h2>" +
    
                                    "<\/a>" +
    
                                    "<p class=\"title\">" + title + "<\/p>" +
    
                                    "<p class=\"description\">" + description + "<\/p>" +
    
                                    "<p class=\"date\">" + new Date( album.creation_date ) + "<\/p>" +
    
                                   "<\/li>";
    
                        $("#albums").append( listItem );
    
                    }
    
                    $("#albums").listview( "refresh" );
    
                    $.fixedToolbars.show();
    
                }
    
        });
    
    }

The **fixedToolbars** controller is available from [jQuery Mobile](http://jquerymobile.com/) with several public methods exposed for dealing with the **header** and **footer** toolbars. We are using _show_() to force an update in placement once the list has been refreshed. This will affectively put the **footer** (with its add button) back to the bottom where it belongs and is accessible. Hack? Maybe. But it works for now (see versions at end of post ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) ).

So that is it… except for one thing. 

### Finishing Up

I can be a stickler. The **addAlbum** page is not removed from the **DOM** once navigated away from like the other pages we have created. We did that previously to ensure we were getting the correct returns from the **show function** based on document **_id**; [jQuery Mobile](http://jquerymobile.com/) was caching those pages in the **DOM** so it never went back out with the update **_id**. However, our case here is a little different. 

The **addAlbum** page is not associated with a document upon view. It just saves a document to the [CouchDB](http://couchdb.apache.org/) database using the _jquery.couch_ plugin. As such, if a user navigates away from the page – either from an explicit cancel/close or directed back to **#home** upon save success – we should clear out those input fields. Otherwise, when a user navigates to the **addAlbum** page again, we’ll always see the last input. That shouldn’t be the case. The user should start fresh each time. To do that, we’ll just listen to when the page is hidden in the **DOM** and clear the fields.

With _/_attachments/index.html_ still open in your favorite text editor, save the following modifications to the _handleDocumentReady_() **JavaScript** function:

_/_attachments/index.html_
    
    function handleDocumentReady()
    
    {
    
        $("#home").bind( "pagebeforeshow", refreshAlbums );
    
        refreshAlbums();
    
     
    
        $("#addSubmitButton").live( "click", function( event ) {
    
            event.preventDefault();
    
            var document = {};
    
            document.artist = $("input#addArtistField").val();
    
            document.title = $("input#addTitleField").val();
    
            document.description = $("textarea#addDescriptionField").val();
    
            document.creation_date = ( new Date() ).getTime();
    
            $db.saveDoc( document, {
    
                    success: function() {
    
                        $.mobile.changePage( "#home", "slidedown", true, true );
    
                    },
    
                    error: function() {
    
                        alert( "Cannot save new document." );
    
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

Similarly to how we listened for navigation away from the other **external** pages, we assign an even handler for the “_pagehide_” event and clear the input fields. That will be invoked upon back/cancel and successful commit (via the **$.mobile**._changePage_() method), so we can ensure that the fields are always presented empty upon hitting the **addAlbum** page.

So we are all on the same page (pun… intended?), here is the updated _/_attachments/index.html_ file in all its modified glory:
    
    <!DOCTYPE html>
    
    <html>
    
      <head>
    
        <title>My Albums</title>
    
        <link rel="stylesheet" href="style/main.css" type="text/css">
    
        <link rel="stylesheet" href="style/jquery.mobile-1.0a2.css" type="text/css"/>
    
      </head>
    
      <body>
    
        <div id="home" data-role="page">
    
              <div data-role="header" data-position="fixed"><h1>Albums</h1></div>
    
              <div data-role="content">
    
                  <ul id="albums" data-role="listview" data-theme="c" data-dividertheme="b"></ul>
    
              </div>
    
              <div data-role="footer" data-position="fixed">
    
                <div data-role="navbar">
    
                    <ul class="ui-grid-a">
    
                        <li style="width:100%;"><a href="#addAlbum" data-transition="slideup" data-icon="plus">Add Album</a></li>
    
                    </ul>
    
                </div>
    
              </div>
    
          </div>
    
          <div id="addAlbum" data-role="page">
    
              <div data-role="header"><h1>Add Album</h1></div>
    
              <div data-role="content">
    
                  <form id="albumAddForm" action="#" method="get">
    
                      <div data-role="fieldcontain">
    
                        <label for="artist">Artist:</label>
    
                           <input id="addArtistField" name="artist" type="text" />
    
                    </div>
    
                    <div data-role="fieldcontain">
    
                        <label for="title">Title:</label>
    
                           <input id="addTitleField" name="title" type="text" />
    
                    </div>
    
                    <div data-role="fieldcontain">
    
                        <label for="description">Description:</label>
    
                        <textarea id="addDescriptionField" name="description" cols="40" rows="8"></textarea>
    
                    </div>
    
                    <div class="ui-body ui-body-b">
    
                        <fieldset class="ui-grid-a">
    
                            <div class="ui-block-a">
    
                                <a href="#home" id="addCancelButton" data-role="button" data-theme="d">Cancel</a>
    
                            </div>
    
                            <div class="ui-block-b">
    
                                <a href="#" id="addSubmitButton" data-role="button" data-theme="a">Submit</a>
    
                            </div>
    
                        </fieldset>
    
                    </div>
    
                </form>
    
              </div>
    
          </div>
    
      </body>
    
      <script src="vendor/couchapp/loader.js"></script>
    
      <script type="text/javascript" charset="utf-8">
    
     
    
          $db = $.couch.db("albums");
    
     
    
          function handleDocumentReady()
    
          {
    
              $("#home").bind( "pagebeforeshow", refreshAlbums );
    
              refreshAlbums();
    
     
    
              $("#addSubmitButton").live( "click", function( event ) {
    
                  event.preventDefault();
    
                  var document = {};
    
                  document.artist = $("input#addArtistField").val();
    
                  document.title = $("input#addTitleField").val();
    
                  document.description = $("textarea#addDescriptionField").val();
    
                  document.creation_date = ( new Date() ).getTime();
    
                  $db.saveDoc( document, {
    
                          success: function() {
    
                              $.mobile.changePage( "#home", "slidedown", true, true );
    
                          },
    
                          error: function() {
    
                              alert( "Cannot save new document." );
    
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
    
     
    
          function refreshAlbums()
    
          {
    
              $("#albums").empty();
    
              $db.view("albums/albums", {
    
                success: function( data ) {
    
                        var i;
    
                        var album;
    
                        var artist;
    
                        var title;
    
                        var description;
    
                        var listItem;
    
                        var header;
    
                        var albumLink;
    
                        data.rows.reverse();
    
                        for( i in data.rows )
    
                        {
    
                            album = data.rows[i].value;
    
                            artist = album.artist;
    
                            title = album.title;
    
                            description = album.description;
    
                            externalPage = "_show/album/" + album._id;
    
                            listItem = "<li class=\"album\">" +
    
                                        "<a href=\"" + externalPage + "\">" +
    
                                            "<h2 class=\"artist\">" + artist + "<\/h2>" +
    
                                        "<\/a>" +
    
                                        "<p class=\"title\">" + title + "<\/p>" +
    
                                        "<p class=\"description\">" + description + "<\/p>" +
    
                                        "<\/li>";
    
                            $("#albums").append( listItem );
    
                        }
    
                        $("#albums").listview( "refresh" );
    
                        $.fixedToolbars.show();
    
                    }
    
                });
    
          }
    
          $(document).ready( handleDocumentReady );
    
     
    
      </script>
    
    </html>

### Deployment

We modified our application to utilize a **show function** to serve the _albumadd_ page up within a [jquery Mobile](http://jquerymobile.com/) application. With these changes saved, we can now push to the [CouchDB](http://couchdb.apache.org/) database using the [couchapp](http://couchapp.org/page/index) utility. Open a terminal and navigate to the directory where you create your **CouchApp** applications (for me that is _/Documents/workspace/custardbelly/couchdb_ and in there i have a folder named _albums_ which is the **CouchApp** application directory for these examples). Enter the following command to push the changes to the **CouchDB** instance:
    
    couchapp push albums http://127.0.0.1:5984/albums

If all was successful and you now go to [http://127.0.0.1:5984/albums/_design/albums/index.html](http://127.0.0.1:5984/albums/_design/albums/index.html), we’ll still have our old familiar list and our new **navbar** items in the **footer**. Click the **Add Album** button to open the form and save some information. The document should be saved to the **CouchDB** database and the application will direct you back to the **#home** page with the updated list of albums.

_index.html#addAlbum_  
![](http://www.custardbelly.com/blog/images/couchapp_add_album.png)

_index.html#home_  
![](http://www.custardbelly.com/blog/images/couchapp_new_list.png)

### Conclusion

In this article, we added another important piece to working with documents from a database – **Create**. Along the way we uncovered a little about view maps from [CouchDB](http://couchdb.apache.org/) and how they are sorted. We also found that the **jquery.couch** plugin handles create and update of documents through the same method – _saveDoc_() – on a database instance. As well, as it pertains to visible changes, we employed fixed toolbars, added custom **footer** content and discussed a little about the decision between using **internal** and **external** pages as it pertains to _User Experience_ and application design. Hopefully, it all worked out. 

Next up: we got the **CRU**… we need to the **D**.

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
