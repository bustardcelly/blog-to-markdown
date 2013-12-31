---
title: 'jquery Mobile + CouchDB: Part 1 – Getting Started'
url: 'http://custardbelly.com/blog/2010/12/08/jquery-mobile-couchdb-part-1-getting-started/'
author:
  name: 'todd anderson'
date: '2010-12-08'
---

## Intro

I have been digging using [CouchDB](http://couchdb.apache.org/) as my back-end choice for personal projects for a while now and truly do believe it is the best solution when choosing a non-relational database management system. While discovering my affinity for **CouchDB**, i started developing [as3couchdb](http://custardbelly.com/blog/?page_id=127) – an open-source library written in **ActionScript 3** that allows **Flash** to communicate to a **CouchDB** instance which can be found on [github](https://github.com/bustardcelly/as3couchdb). I think **as3couchdb** is in a pretty stable place at the moment and have built a couple applications and have been happy with it. I am going to continue developing it, and if you do use it and find problems/suggestions please let me know.

That said, i have never been one to focus on something for too long (without getting paid to, of course ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) ), without getting distracted by wanting to learn something new. I knew **CouchDB** shipped with a [jQuery](http://jquery.com/) [plugin](https://github.com/apache/couchdb/blob/trunk/share/www/script/jquery.couch.js), so i thought i would play around with making a **DHTML** client for some of my projects. Then i thought, why the hell not throw in the [jquery Mobile](http://jquerymobile.com/) framework for the fun of it? If we are gonna do it, let’s do it. 

So that is what i have set out to do. I have finished some basics of an application and am looking to get more into the nitty gritty. I figured what better way to do this than to document it; not only purposed as a storage of how to do something, but *hopefully* a place for some people to chime in and tell me how to do it better ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

This happens to be the first in a series of posts that document building a “simple” **DHTML** application using the [jQuery Mobile](http://jquerymobile.com/) framework and a [CouchDB](http://couchdb.apache.org/) back-end. _Here’s to hoping the intro for subsequent posts are not as long._

## CouchDB

[CouchDB](http://couchdb.apache.org/) is a schema-free document-oriented database HTTP server. If you have not heard the term [NoSQL](http://en.wikipedia.org/wiki/NoSQL), it is used to refer to a database management system (**DBMS**) that differs from the widely-used relational model; started out as meaning a **DBMS** that does not providing a **SQL** interface, but became a term to refer to any non-relational **DBMS**, of which **CouchDB** is often grouped with when talking about **NoSQL**. I won’t go into a lengthy discussion of **CouchDB** – so I will say, in basic terms, **CouchDB** is a document-based **DBMS**. This will make more sense once we start looking at the API for the **CouchDB** **jQuery** plugin.

Before we get into building a front-end for our application, we need to set up a database to play around with. I am assuming here that you have installed **CouchDB** on your local machine and have it running and accessible at [http://127.0.0.1:5984](http://127.0.0.1:5984). If you don’t and want to set it up, [download CouchDB](http://couchdb.apache.org/downloads.html) and peruse the appendix on this link – [http://guide.couchdb.org/draft](http://guide.couchdb.org/draft) – or install from source from this link -[http://guide.couchdb.org/draft/source.html](http://guide.couchdb.org/draft/source.html)

## CouchApp

Though it is not necessary in creating and modifying views and **DHTML** pages served up from **CouchDB**, i tend to use the [CouchApp](http://couchapp.org/page/index) command line tool when working with and managing a **CouchDB** database. 

You can read more about **CouchApp** on their [main wiki](http://couchapp.org/page/index) and checkout the project at [/couchapp/couchapp on github](https://github.com/couchapp/couchapp). **CouchApp** is basically a set of utilities that makes creating and modifying views of a **CouchDB** database instance easy (or i should say _easier_). Not to mention (the best part), you can create all your views, etc locally, make sure you got it right then push replication remotely and you are all set. Beauty.

When pushing design documents to a **CouchDB** database in this and following example posts, I will be using the **couchapp** command line tool as it is quick and easy and a great little utility, but everything done with it can be easily done using [curl](http://curl.haxx.se/docs/manpage.html) if you wish.

## Our Album Database

First things first, let’s set up a database we can start working with. I use [CouchDBX](http://janl.github.com/couchdbx/), which i recommend if you are on a **Mac**. Don’t know if there is an equivalent for **Windows** or **Linux**, so if you do know, leave a comment please. Otherwise, just hitting up [http://127.0.0.1:5984/_utils](http://127.0.0.1:5984/_utils), the **Futon** app, should work in getting started.

Create a new database called _albums_… or whatever you want to call it. I will be building _album_ views in these examples but you could easily make them something else. Once we have our _albums_ database created, lets create a couple _album_ documents since we are going to have a view that shows a list of albums. The make up of an _album_ document is as such:
    
    {
    
        "artist" : {
    
            "type" : "string"
    
        }
    
        "title" : {
    
            "type" : "string"
    
        }
    
        "description" : {
    
            "type" : "string"
    
        }
    
    }

… pretty basic for our purposes. Using that schema, add a couple album documents to the databse. I just threw in the following document entries:
    
    {"artist":"Thin Lizzy", "title":"Fighting", "description":"Bona-fide rock classic."}
    
    {"artist":"David Bowie", "title":"Honky Dory", "description":"Doesn't get much better than this."}

… and now you know a little bit about my musical tastes ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) Any way, we’ve got our database and a few documents residing in it. Lets create a client-side application using [CouchApp](http://couchapp.org/page/index) and push it to the _albums_ database. 

## Our Albums CouchApp

With [CouchApp](https://github.com/couchapp/couchapp) properly installed, we’ll move over to using the command line tools to create our **Albums** application, create views and push the documents to our **CouchDB** database.

### Application

With the terminal open, navigate to a directory that you deem worthy to create applications for **CouchDB** in. For example, on **Mac**, that for me is usually _/Documents/workspace/custardbelly/couchdb_. Enter in the following command to generate an _albums_ application to which we will add some views and later push to the _albums_ database:
    
    couchapp generate app albums

If all goes well, a new folder named _albums_ will be in the target directory and will contain files such as the following:

![couch app application diretory](http://www.custardbelly.com/blog/images/couchapp_one.png)

I won’t cover all of what those files pertain to, but basically those files will be pushed to the _albums_ database and stored based on the __id_ file value – **CouchApp** defaults to __design/${application}_ and for this example will be __design/albums_.

Now, if we were to push this application to our **CouchDB** database as it stands now and visited [http://127.0.0.1:5984/albums/_all_docs](http://127.0.0.1:5984/albums/_all_docs) we would get returned a page that shows the **JSON** object of rows of available documents with the default key/values. Maybe useful to some, but not a good user experience for looking at documents in our database. To do this we can create a view using **CouchApp** that will help in presenting a page that lists the available documents in a nice readable manner.

### View

In the terminal, enter the following command to generate a view for all albums in the database:
    
    couchapp generate view albums albums

With that command, we have used **CouchApp** to create a view named _albums_ (the last argument) in the database _albums_ (argument after **view**). If you take a look at the views directory in the _albums application_ folder, you will see that a new folder called _albums_ has been created containing the _map.js_ and _reduce.js_ files. 

![couch app application diretory](http://www.custardbelly.com/blog/images/couchapp_two.png)

I won’t go over all that is involved in map/reduce in **CouchDB**, so this is some good information if you are interested: [http://wiki.apache.org/couchdb/Introduction_to_CouchDB_views](http://wiki.apache.org/couchdb/Introduction_to_CouchDB_views). For now, we are just going to modify the_ map.js_ file and delete the _reduce.js_ file so it returns a list of the album documents in the database.

### map.js

Open up the _/albums/views/albums/map.js_ file in you favorite text editor and add the following line within the _function()_ statement:
    
    function( doc ) {
    
        emit( doc._id, doc );
    
    }

When you visit [http://127.0.0.1:5984/albums/_design/albums/_view/albums](http://127.0.0.1:5984/albums/_design/albums/_view/albums) a **JSON** object will be returned with a key/value pairing for each document in the database with the key being the __id_ assigned to the document and the value being the full document object. In essence, when you create a view, you are creating a rule of how you want documents from the database returned to you. For this simple example, we are just going to return all the documents trusting that they will all be albums. You can create more views (and more applications) as you see fit. For now, we’ll just work with all the documents and wire up a page to view them.

Let’s go ahead and push the _albums_ application to our albums database:
    
    couchapp push albums http://127.0.0.1:5984/albums

If successful, that should return:
    
    2010-12-06 17:37:24 [INFO] Visit your CouchApp here:
    
    http://127.0.0.1:5984/albums/_design/albums/index.html

If you go and visit [http://127.0.0.1:5984/albums/_design/albums/index.html](http://127.0.0.1:5984/albums/_design/albums/index.html), you will notice that shows absolutely no relevance to our application or our database ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) If you go to [http://127.0.0.1:5984/albums/_design/albums/_view/albums](http://127.0.0.1:5984/albums/_design/albums/_view/albums) you will now see our full **JSON** object that we will use when we modify that _index.html_. 

The index file that you were originally directed to is the _index.html_ file in the _/albums/_attachments_ directory. If you open that file up in a text editor, you will see that it is using the **couch.app** **jQuery** plugin to construct the elements on the default page. We can modify this **HTML** document now and use the **jQuery Mobile** plugin to present our list of albums beautifully (no guarantees on the beautiful part:)).

## Albums Application User Interface

[CouchDB](http://couchdb.apache.org/) ships with a version of [jQuery](http://jquery.com/) and a plugin to interact with a **CouchDB** instance. They (and other scripts for serialization and **futon**) can be found in your installation, which on my make is in the following location:
    
    /opt/local/share/couchdb/www/script

If we look at the default _index.html_ page created for us when we used **CouchApp** to create our _albums_ application, we see that it is using a loader to load in all those necessary scripts:
    
    <html>
    
      <head>
    
        <title>My New CouchApp< itle>
    
        <link rel="stylesheet" href="style/main.css" type="text/css">
    
      </link></title></head>
    
      <body>
    
        <div id="account"></div>
    
     
    
        <h1>Generated CouchApp</h1>
    
     
    
        <div id="profile"></div>
    
        <div id="items"></div>
    
     
    
        <div id="sidebar">
    
          <p>Edit welcome message.</p>
    
          <p>Ideas: You could easily turn this into a photo sharing app, or a grocery list, or a chat room.</p>
    
        </div>
    
      </body>
    
      <script src="vendor/couchapp/loader.js"></script>
    
      <script type="text/javascript" charset="utf-8">
    
        $.couch.app(function(app) {
    
          $("#account").evently("account", app);
    
          $("#profile").evently("profile", app);
    
          $.evently.connect("#account","#profile", ["loggedIn","loggedOut"]);
    
          $("#items").evently("items", app);
    
        });
    
      </script>
    
    </html>

That _loader.js_ file can be found in the _/albums/vendor/couchapp/_attachments_ directory and looks like the following:
    
    function couchapp_load(scripts) {
    
      for (var i=0; i < scripts.length; i++) {
    
        document.write('<script src="'+scripts[i]+'">< \/script>')
    
      };
    
    };
    
     
    
    couchapp_load([
    
      "/_utils/script/sha1.js",
    
      "/_utils/script/json2.js",
    
      "/_utils/script/jquery.js",
    
      "/_utils/script/jquery.couch.js",
    
      "vendor/couchapp/jquery.couch.app.js",
    
      "vendor/couchapp/jquery.couch.app.util.js",
    
      "vendor/couchapp/jquery.mustache.js",
    
      "vendor/couchapp/jquery.evently.js"
    
    ]);

As we intend to use [jQuery Mobile](http://jquerymobile.com/) for our user interface, we will modify this _loader.js_ file to include the latest [jQuery](http://jquery.com/) libray and the [jQuery Mobile](http://jquerymodile.com/) plugin.

### Modifying loader.js

If you have not already done so, download the latest releases of [jQuery](http://jquery.com/) and [jQuery Mobile](http://jquerymobile.com/). As of this writing those are:

  1. jQuery-1.4.4.js 
  2. jQuery.mobile-1.0a2.js 

Copy those files from wherever you downloaded them to into the _/albums/vendor/couchapp/_attachments/_ directory.

Open up _loader.js_ from that same directory in you favorite text editor and make the following changes:
    
    function couchapp_load(scripts) {
    
      for (var i=0; i < scripts.length; i++) {
    
        document.write('<script src="'+scripts[i]+'">< \/script>')
    
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
    
      "vendor/couchapp/jquery.mobile-1.0a2.js"
    
    ]);

Save the changes to _loader.js_. We could probably get rid of the _mustache.js_ and _evently.js_ includes, but we’ll forget about that for now.

Now that we have our loader loading the proper scripts to display a **jQuery Mobile** interface, we need to modify the _index.html_ file to display the list of _album_ documents from our **CouchDB** database.

### Modifying index.html

Firstly, we’ll need to add the necessary css and image files that came with the **jQuery Mobile** download so we get the default look-and-feel. 

Copy the _jquery.mobile-1.0.a2.css_ file and the _images/_ directory from your **jQuery Mobile** download into the _/albums/_attachments/style/_ folder (residing along with the default _main.css_ file generated using **CouchApp**).

Open up the _index.html_ file in the _/albums/_attachments_ directory with your favorite text editor, and start off with a clean slate by removing the inline **JavaScript** and _div_ tags in the body of the **HTML** document. Also declare the _jquery.mobile-1.0a2.css_ file in your stylesheets. The _index.html_ file should now look somewhat like the following:
    
    <html>
    
      <head>
    
        <title>My Albums</title>
    
        <link rel="stylesheet" href="style/main.css" type="text/css">
    
        <link rel="stylesheet" href="style/jquery.mobile-1.0a2.css" type="text/css"/>
    
      </head>
    
      <body>
    
     
    
      </body>
    
      <script src="vendor/couchapp/loader.js"></script>
    
      <script type="text/javascript" charset="utf-8">
    
     
    
      </script>
    
    </html>

### JQuery Mobile Page

This post is already getting pretty long as it is, and i don’t want to discuss the finer parts of [jQuery Mobile](http://jquerymobile.com/) so the following modifications might not have the fullest explanations as to why we are adding some elements, but i will try at times to explain. 

To begin, a **jQuery Mobile** application is comprised of _pages_. You can declare all your _pages_ in a single **HTML** document or load other pages (saved as **HTML** documents) into _divs_. A page is denoted by a **data-role** attribute with the value of _“page”_. The **jQuery Mobile** framework handles this pagination and its browser history for you, so there isn’t much to worry about except for how you want you pages to look… well there is more to worry about, but we won’t for the time being ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

The landing page for our _albums_ application will display the list of album documents. To do so, modify the _index.html_ file by adding a page _div_ to the _body_ of the **HTML** document:
    
    <html>
    
      <head>
    
        <title>My Albums</title>
    
        <link rel="stylesheet" href="style/main.css" type="text/css">
    
        <link rel="stylesheet" href="style/jquery.mobile-1.0a2.css" type="text/css"/>
    
      </head>
    
      <body>
    
        <div data-role="page">
    
              <div data-role="header"><h2>Albums</h2></div>
    
              <div data-role="content">
    
                  <ul id="albums" data-role="listview" data-theme="c" data-dividertheme="b" />
    
              </div>
    
              <div data-role="footer">Footer</div>
    
          </div>
    
      </body>
    
      <script src="vendor/couchapp/loader.js"></script>
    
      <script type="text/javascript" charset="utf-8">
    
     
    
      </script>
    
    </html>

The make up of a **jQuery Mobile** page contains a _content_ div and optional _header_ and _footer_ divs. In this example we have included the _header_ and _footer_ with some very basic information. What is of note is the _content_ div (marked with the **data-role** of “_content_“). The content of our landing page is a list maked with a **data-role** of “_listview_” which will be populated with the document result form our **CouchDB** database query for all album documents.

With our **jQuery Mobile** elements in place, we will add the **JavaScript** to communicate with our **CouchDB** instance and request the _album_ documents from our _albums_ database.

### Communication

As mentioned previously, [CouchDB](http://couchdb.apache.org/) ships with a [jquery](http://jquery.com/) plugin to ease the communication with a **CouchDB** instance. That script (_jquery.couch.js_) along with scripts for serialization are loaded within the _loader.js_.

First things first, we need to assign a handler for when the document has become available and we declare our database reference as the _albums_ database form the **CouchDB** instance:
    
    <html>
    
      <head>
    
        <title>My Albums</title>
    
        <link rel="stylesheet" href="style/main.css" type="text/css">
    
        <link rel="stylesheet" href="style/jquery.mobile-1.0a2.css" type="text/css"/>
    
      </head>
    
      <body>
    
        <div data-role="page">
    
              <div data-role="header"><h2>Albums</h2></div>
    
              <div data-role="content">
    
                  <ul id="albums" data-role="listview" data-theme="c" data-dividertheme="b" />
    
              </div>
    
              <div data-role="footer">Footer</div>
    
          </div>
    
      </body>
    
      <script src="vendor/couchapp/loader.js"></script>
    
      <script type="text/javascript" charset="utf-8">
    
     
    
          $db = $.couch.db("albums");
    
     
    
          function handleDocumentReady()
    
          {
    
              // request album documents...
    
          }
    
     
    
          $(document).ready( handleDocumentReady );
    
     
    
      </script>
    
    </html>

The [$(document).ready()](http://docs.jquery.com/Tutorials:Introducing_$(document).ready()) event hook is a standard part of [jQuery](http://jquery.com/) to recognize when the **DOM** has been loaded and we can begin any operations/transactions. In this example, the _handleDocumentReady()_ method is defined as the handler for that event. Within that handler we will add the communication with the _$db_ instance to request our album documents and add them to the _listview_ of the content.

The following snippet is a full implementation of making a request for those documents and adding them to the _listview_:
    
    <html>
    
      <head>
    
        <title>My Albums</title>
    
        <link rel="stylesheet" href="style/main.css" type="text/css">
    
        <link rel="stylesheet" href="style/jquery.mobile-1.0a2.css" type="text/css"/>
    
      </head>
    
      <body>
    
        <div data-role="page">
    
              <div data-role="header"><h2>Albums</h2></div>
    
              <div data-role="content">
    
                  <ul id="albums" data-role="listview" data-theme="c" data-dividertheme="b" />
    
              </div>
    
              <div data-role="footer">Footer</div>
    
          </div>
    
      </body>
    
      <script src="vendor/couchapp/loader.js"></script>
    
      <script type="text/javascript" charset="utf-8">
    
     
    
          $db = $.couch.db("albums");
    
     
    
          function handleDocumentReady()
    
          {
    
              refreshAlbums();
    
          }
    
     
    
          function refreshAlbums()
    
          {
    
              $("#albums").empty();
    
              $db.view("albums/albums",
    
                { success: function( data ) {
    
                        var i;
    
                        var album;
    
                        var artist;
    
                        var title;
    
                        var description;
    
                        var listItem;
    
                        for( i in data.rows )
    
                        {
    
                            album = data.rows[i].value;
    
                            artist = album.artist;
    
                            title = album.title;
    
                            description = album.description;
    
                            listItem = "<li>" +
    
                                        "<h2 class=\"artist\">gt;" + artist + "<\/h2>" +
    
                                        "<p class=\"title\">gt;" + title + "<\/p>" +
    
                                        "<p class=\"description\">gt;" + description + "<\/p>";
    
                            $("#albums").append( listItem );
    
                        }
    
                        $("#albums").listview( "refresh" );
    
                    }
    
                });
    
          }
    
     
    
          $(document).ready( handleDocumentReady );
    
     
    
      </script>
    
    </html>

To get a deeper view, lets look in detail at the method that handles loading the album documents in the script which is invoked from the _handleDocumentReady(_) handler:
    
    function refreshAlbums()
    
    {
    
        $("#albums").empty();
    
        $db.view("albums/albums",
    
        { success: function( data ) {
    
                var i;
    
                var album;
    
                var artist;
    
                var title;
    
                var description;
    
                var listItem;
    
                for( i in data.rows )
    
                {
    
                    album = data.rows[i].value;
    
                    artist = album.artist;
    
                    title = album.title;
    
                    description = album.description;
    
                    listItem = "<li>" +
    
                                "<h2 class=\"artist\">" + artist + "<\/h2>" +
    
                                "<p class=\"title\">" + title + "<\/p>" +
    
                                "<p class=\"description\">" + description + "<\/p>";
    
                    $("#albums").append( listItem );
    
                }
    
                $("#albums").listview( "refresh" );
    
            }
    
        });
    
    }

First and foremost, as we might use this method in later implementations of the application to refresh the list, we make a call to empty the content of the _listview_:
    
    $("#albums").empty();

Following that, we request the _albums_ view from the database instance by calling **$db.view()** and pointing to the _albums_ view that we created and pushed to the **CouchDB** database using **CouchApp**.
    
    $db.view("albums/albums"

… and then resolve a successful result to a function that handles interpreting each **JSON** object related to to an album document so as to add them as list items to the _listview_:
    
    { success: function( data ) {
    
                var i;
    
                var album;
    
                var artist;
    
                var title;
    
                var description;
    
                var listItem;
    
                for( i in data.rows )
    
                {
    
                    album = data.rows[i].value;
    
                    artist = album.artist;
    
                    title = album.title;
    
                    description = album.description;
    
                    listItem = "<li>" +
    
                                "<h2 class=\"artist\">" + artist + "<\/h2>" +
    
                                "<p class=\"title\">" + title + "<\/p>" +
    
                                "<p class=\"description\">" + description + "<\/p>";
    
                    $("#albums").append( listItem );
    
                }
    
                $("#albums").listview( "refresh" );
    
            }
    
    }

The _for..in_ loop in this example goes reads each document object and appends a list item to the _listview_, after which we make a call to **refresh** the view.

### Deployment

With the _index.html_ file modified and ready to go live, we can use the couchapp utility to push an update to the **CouchDB** instance so we can view our new mobile-based application in a browser:
    
    couchapp push albums http://127.0.0.1:5984/albums

.. if all goes well you should see the following printed out :
    
    2010-12-07 11:46:55 [INFO] Visit your CouchApp here:
    
    http://127.0.0.1:5984/albums/_design/albums/index.html

Now, if you do visit that link, it should redirect you to [http://127.0.0.1:5984/albums/_design/albums/index.html](http://127.0.0.1:5984/albums/_design/albums/index.html) and you should see something like the following:

![couch app mobile application](http://www.custardbelly.com/blog/images/couchapp_three.png)

Pretty, no? No. But maybe in later posts we can modify that. For now its up and running. yay!

## Conclusion

Well, if you made it this far down, you have been a trooper. Hopefully this has been of some help in getting up and started using [CouchDB](http://couchdb.apache.org/), [CouchApp](http://couchapp.org/page/index) and [jQuery Mobile](http://jquerymobile.com/) to provide a mobile-based _User Interface_ for documents in a **CouchDB** database. Since this is the first in a series of posts in working with **jQuery Mobile** and **CouchDB** it is pretty lengthy as it addresses set-up and the beginning of an application of which we can continue to work. Good news is, later posts on this topic will be shorter ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) and address more of the finer details of **jQuery Mobile** and **CouchDB** communication. At least that is the hope ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) .

## Future Topics

I am looking forward to adding more posts for this topic as i go about discovering how to create a mobile-based solution for working with documents from a **CouchDB** database. The tentative list is as follows:

  1. [Getting Started](http://custardbelly.com/blog/?p=244)
  2. [Displaying a page detail of a single album.](http://custardbelly.com/blog/?p=278)
  3. [Templates and Mustache](http://custardbelly.com/blog/?p=297)
  4. [Displaying an editable page of an album.](http://custardbelly.com/blog/?p=318)
  5. [Creating and Adding an album document.](http://custardbelly.com/blog/?p=332)
  6. [Deleting an album document](http://custardbelly.com/blog/?p=344)
  7. [Authorization and Validation – Part 1](http://custardbelly.com/blog/?p=360)
  8. [Authorization and Validation – Part 2](http://custardbelly.com/blog/?p=394)

[Full source for albums couchapp here.](http://custardbelly.com/downloads/couchapp/jqm_couchdb_albums.zip)

As those post go live, this list will be updated with the related links.

_[Note] This post was written against the following software versions:_  
**CouchDB** – 1.0.1  
**CouchApp** – 0.7.2  
**jQuery** – 1.4.4  
**jQuery Mobile** – 1.0a2  
_If you have found this post and any piece has moved forward, hopefully the examples are still viable/useful. I will not be updating the examples in this post in parellel with updates to any of the previously mentioned software, unless explicitly noted._

Posted in [CouchDB](http://custardbelly.com/blog/category/couchdb/), [jquery](http://custardbelly.com/blog/category/jquery/), [jquery-mobile](http://custardbelly.com/blog/category/jquery-mobile/).
