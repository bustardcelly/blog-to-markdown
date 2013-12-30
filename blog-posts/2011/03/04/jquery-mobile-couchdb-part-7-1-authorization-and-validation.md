# [jQuery Mobile + CouchDB: Part 7.1 – Authorization and Validation](http://custardbelly.com/blog/2011/03/04/jquery-mobile-couchdb-part-7-1-authorization-and-validation/)

In my [previous article](http://custardbelly.com/blog/?p=344) I addressed deleting documents from the **albums** database within [CouchDB](http://couchdb.apache.org/) using the _jquery.couch_ plugin and hacked around [jQuery Mobile](http://jquerymobile.com/) a bit to get an external page to act as a dialog without updating the hash location. All great stuff, and we ended off having an application that provided the basics when working with documents – **C**reate **R**ead **U**pdate and **D**elete. After that post, I decided it was high time to throw a wrench into the mix and lock down the **admin party** we have been having. It’s been a good run…

_Wait… so what’s with the versioning of **Part 7** in the title?! Its a multipart article of an article series. Barring i don’t break the space-time continuum for breaking up an article into sections, introducing authorization and validation will be spread over a couple posts. There is a lot of information involving set-up and development, plus we will jump into some new concepts – such as **jQuery widgets and plugins** – that may be a little too much information to digest in a single article._

In the first installment of this multi-part article I intend to address authorization and validation of our document operations so as to not let any old joey-bagadonuts hit the application and start adding, deleting and modifying our precious album list we have been painstakingly curating. If you have been following along, you may have noticed that we have thrown security and user-permitted actions out the window. This article won’t address the real breadth of security that your [CouchDB](http://couchdb.apache.org/) instance should employ, but I will cover moving away from our **admin party** (anybody can do anything) and introduce the concept of user contexts, as well as how they can be used to validate operations requested for documents in the **albums** database of our [CouchDB](http://couchdb.apache.org/) instance.

## Light Reading

Before I start, there are two excellent articles out there that address authorization and validation in [CouchDB](http://couchdb.apache.org/) that are indespensible. I read them before I started this series while working on another project, but came back to them as a refresher. I recommend you go check them out as they provide a more concise explanation of the work we are about to do (i’ll just touch on the finer points to get this application up and running). They are:

[CouchOne](http://blog.couchone.com/) – [What’s new in CouchDB 1.0 — Part 4: Security’n stuff: Users, Authentication, Authorisation and Permissions](http://blog.couchone.com/post/1027100082/whats-new-in-couchdb-1-0-part-4-securityn-stuff)  
[CouchDB _The Definitive Guide_](http://guide.couchdb.org/index.html) – [Validation Functions](http://guide.couchdb.org/draft/validation.html)

While those articles are an excellent resource for the task at hand, the sites themselves have a wealth of information which I highly suggest perusing, as well. Alright, armed with a little knowledge, lets dig in.

## Fix This

_If you have already taken your [CouchDB](http://couchdb.apache.org/) instance out of admin party, you can skip this section or read on._

If you have been following along in this series and have only been using the command line to interact with [CouchDB](http://couchdb.apache.org/), there is a utility application called [Futon](http://wiki.apache.org/couchdb/Getting_started_with_Futon) that ships with [CouchDB](http://couchdb.apache.org/). I actually browse my [CouchDB](http://couchdb.apache.org/) instance using [Futon](http://wiki.apache.org/couchdb/Getting_started_with_Futon) in [CouchOne (neé CouchDBX for Mac)](http://www.couchone.com/get). If you have ever visited [http://127.0.0.1:5984/_utils](http://127.0.0.1:5984/_utils), that’s **Futon**. If you have a version of [CouchOne](http://www.couchone.com/get) running on your machine, that shows **Futon** within the browse window. I recommend using [CouchOne](http://www.couchone.com/get) for local development as it makes it easier to start and stop the service as well as pretty prints out the http calls (not as verbose as i would like, but still useful).

So if you’ve visited [Futon](http://127.0.0.1:5984/_utils) and have been running our application that we have built along in the series under **admin party** (ie. all access), then you may see something of the sort on the right hand side of [Futon](http://127.0.0.1:5984/_utils). Notice the bottom portion:

![Futon side panel](http://www.custardbelly.com/blog/images/couchapp_7_1_1.png)  
_[Futon side panel]_

We intend to Fix this.

Click that link, and a dialog should appear looking like the following:

![Create Server Admin](http://www.custardbelly.com/blog/images/couchapp_7_1_2.png)  
_[Create Server Admin]_

Make sure to read what is in that dialog as it is useful and i will not reiterate its information here… we’re just trying to get back to coding people! Enter in whatever **username** and **password** you choose. For the purposes of this article series (as the information will be used later) I entered:
    
    u: toddanderson
    
    p: admin123

Click _Create_ to create the **admin** user and relax. What just happened is that you created an **admin** that can now do everything everybody used to be able to do. That **username** and **hashed password** are now saved in _/etc/couchdb/local.ini_ of your [CouchDB](http://couchdb.apache.org/) instance and is viewable in [Futon](http://127.0.0.1:5984/_utils) when you go to **Configuration**:

![Configuration Panel](http://www.custardbelly.com/blog/images/couchapp_7_1_3.png)  
_[Configuration panel]_

I have to admit, I am doing this all backtracking. Meaning I took my [CouchDB](http://couchdb.apache.org/) instance off of **admin party** some time ago. So I am trusting this is still the way to go about it. And I am hoping that since [CouchDB](http://couchdb.apache.org/) 1.0+ there has been a __users_ database. To check if there is within [Futon](http://127.0.0.1:5984/_utils), go to **Overview** and one of the first databases listed should be __users_. If its there, great! It should probably even have its authentication validation view included so we are all set, and the **admin** you just created may or may not be automatically entered as a user (i have on mine).

If __users_ is not available for you… leave a comment and we can work something out.

## Creating Users

Remember that rush of power you had when [CouchDB](http://couchdb.apache.org/) was running under **admin party**? That light may have gone out once you created an **admin**… but think of it – now you possess the control to create/update/delete as many users as you want. Isn’t it glorious. Now we are going to reign it in a bit and create a new user.

The easiest way to set up a new user is through [Futon](http://127.0.0.1:5984/_utils). If you are still logged in as the **admin** you just created, log out from the right hand panel and use the **Signup** link:

![Futon Sign Up](http://www.custardbelly.com/blog/images/couchapp_7_1_4.png)  
_[FutonSign Up]_

That will open up the **Sign Up** dialog allowing you to enter a **username** and **password**:

![Create User Dialog](http://www.custardbelly.com/blog/images/couchapp_7_1_5.png)  
_[Create User Dialog]_

I am creating a new user named _custardbelly_ with a super-secret password that will be salted using **sha1**. That is all handled by the_ jquery.couch_ plugin (the same one we have been using in the examples in this series) employed by [Futon](http://127.0.0.1:5984/_utils). If we open up the new user from the __users_ database we should see the following:

![User Entry](http://www.custardbelly.com/blog/images/couchapp_7_1_6.png)  
_[User Entry]_

There are a couple things to note here. First off, I took that screen shot after i already assigned a role (_“albums-user”_) to it. My bad. To do that for you new user, just click on the roles value field and enter _“albums-user”_ (with quotes). That role assignment will be used later when validating documents, so don’t think too hard about it right now.

The other things of note are the auto-generated **type** field with a value of _“user”_, and the **password_sha** and **salt** fields – auto-generated and populated with values created through the _jquery.couch_ plugin during signup. The **_id** for a user also has to have the form of reverse-domain for a couchdb user: _org.couchdb.user:custardbelly_. It must be in that format to be a valid user id so if you ever go about creating a new User manually, either from the __user_ database **New Document** option or from the command line, keep that in mind. Last, but not least, the **name** field is populated with the value of the _username_ (the one entered in the **Sign Up** dialog through [Futon](http://127.0.0.1:5984/_utils) and the value at the end of the **_id** property). The name property is commonly used in validating documents against a user context which we will get into a little later.

That said, you could create a new user using the database controls in [Futon](http://127.0.0.1:5984/_utils) or the command line, but some extra work would be needed to create that **sha1** encrypted password. It would be neat to have a script that would do that and output a **json** file that can be passed in the command line creation of a User, but i won’t go into that right now. Just so you can see what that would look like, the following is an example of how to create a user using the command line:
    
    curl -vX PUT http://toddanderson:admin123@127.0.0.1:5984/_users/org.couchdb.user:custardbelly -d '{"name":"custardbelly", "roles":["albums-user"], "type":"user", "password-sha":"39bc3d994b6a0ce19cb60726b630237d494ae928", "salt":"312b9eb84105e322eb508a559b0000d3"}'

The **-d** argument takes a valid **json** string and you could alternatively point to a file using:
    
    -d @custardbelly_user.json

So yeah, a script would be awesome to perform the password encryption and generate that **json** file with the proper fields. If you have one, let me know. Otherwise it might be a little project for me at a later date. For now, I just use [Futon](http://127.0.0.1:5984/_utils) to create new users.

## Adding User to Documents

Great. Now we have to associate a user with each album in the **albums** database. Technically, becaaue we are working with a document-based DMS, we don’t have to go and add a **user** field to all the **album** documents we currently have entered. Not having a **user** field on an **album** document – though we will include on in all future creates and updates to albums – will not break either party: client or server. But it will be needed for validation on operations. And because we are working with a lovely document-based DMS, its not pulling teeth. For the **album** documents i currently have in my **albums** database, i have gone and added a **user** field with the value of the user _name_ previously created:

![Document Update](http://www.custardbelly.com/blog/images/couchapp_7_1_7.png)  
_[Document Update]_

It is important to not that the **user** field value of an **album** document must match a **name** field value from a __user_ database document. This property will be assigned to the _user_ attribute of a **user context** and be used for comparison on validation. So… human error and misspelling are high at stake in this case when done manually, unfortunately – i’ve definitely been guilty of it and spent hours cursing and pointing at mouses and monitors when only to finally say, “_oh… missed the ‘t’ in there. huh_“.

Alright. Now we have our album(s) associated with user(s) from the __user_ database. Let’s take a peek at how validation will occur when performing operations on albums with our client-side [jQuery Mobile](http://jquerymobile.com/) application. _(ah, [jQuery Mobile](http://jquerymobile.com/). not much of it in this article of the series, unfortunately. But hold on to your hats… there’s a ton of it in the next!)_

## Validation

When operations to a document are requested, [CouchDB](http://couchdb.apache.org/) performs, or rather invokes, validation based on the presence of a **validate_doc_update** script in each _/_design_ document of a database. If the script is not present, there is no validation and anyone (barring the security level assigned to the database) can do whatever they want. So we took [CouchDB](http://couchdb.apache.org/) out of **admin party**, but that only puts restrictions on operations that require admin credentials once an **admin** is stored – operations like user creation, user role assignment, database creation, etc, essentially administrative tasks for your [CouchDB](http://couchdb.apache.org/) instance. However, without a **validate_doc_updates** script in the _/_design_ of our **albums** [CouchApp](http://couchapp.org/page/index), anyone can still update an **album** document however they see fit.

Truthfully, i spend my days as a client-side architect/developer. So i can’t speak well enough about how [CouchDB](http://couchdb.apache.org/) invokes the **validate_doc_update** and why we are allowed to use **JavaScript**. There is some type of interpreter that intercepts a create or update (/delete) operation and invokes the **validate_update_doc** script. If no exception is thrown from that script, it continues along with the operation. Easy concept to grasp and a beautiful design by the [CouchDB](http://couchdb.apache.org/) team… someday i will dig more into how all this comes to happen…

So, we can use good ol’ familiar **JavaScript** for our validation. When the **validate_doc_update** is invoked, it is passed two document objects – the “if-all-goes-well” new document and old document – and the **user context**. The **user context** object is representative of the current user logged into a session and has property values that can be used for validation on document operations.

To keep you even further from creating the **validate_update_doc** ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) , let’s take a look at what is returned when you create a session:
    
    > curl http://toddanderson:6s0jo772c0kcnwg@127.0.0.1:5984/_session
    
    > {"ok":true,"userCtx":{"name":"toddanderson","roles":["_admin","admin"]},"info":{"authentication_db":"_users","authentication_handlers":["oauth","cookie","default"],"authenticated":"default"}}

So that **userCtx** object is essentially what is passed during invocation of **validation_doc_update**. On to the code! Open up your favorite text editor, add the following script and save the file as _validate_doc_update.js_ in the root of your **albums** [couchapp](http://couchapp.org/page/index) directory (for me, in following with this series, is: _/Documents/workspace/custardbelly/couchdb/albums/_):

_/validate_doc_update.js_
    
    function( newDoc, oldDoc, userCtx ) {
    
    &nbsp_place_holder;&nbsp_place_holder;// Load validation script.
    
    &nbsp_place_holder;&nbsp_place_holder;var v = require("vendor/couchapp/lib/validate").init( newDoc, oldDoc, userCtx );
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;// Create method to test if valid user.
    
    &nbsp_place_holder;&nbsp_place_holder;v.isAlbumsUser = function() {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return v.isAdmin() || userCtx.roles.indexOf("albums-user") != -1;
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;// Ensure that a current session exists for editing.
    
    &nbsp_place_holder;&nbsp_place_holder;if( !userCtx.name ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;v.unauthorized( "You need to be logged in order to do that." );
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;else if( !v.isAlbumsUser() ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;v.forbidden( "You do not have proper access to edit this document." );
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;// Ensure that any updates need to match user.
    
    &nbsp_place_holder;&nbsp_place_holder;var isDeletingWithoutPermission = ( newDoc._deleted && ( oldDoc.user != userCtx.name ) );
    
    &nbsp_place_holder;&nbsp_place_holder;var isUpdatingWithoutPermission = ( newDoc.user != userCtx.name ) || ( oldDoc && ( newDoc.user != oldDoc.user ) );
    
    &nbsp_place_holder;&nbsp_place_holder;// If either non-permission criteria is met, checking delete first...
    
    &nbsp_place_holder;&nbsp_place_holder;if( !v.isAdmin() && isDeletingWithoutPermission ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;v.forbidden( "Only the creator of this document has permission to delete." );
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;else if( !v.isAdmin && ( !newDoc._deleted && isUpdatingWithoutPermission ) ) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;v.forbidden( "Only the creator of this document has permission to update." );
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;else {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// If it is being deleted, we are all set.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( newDoc._deleted ) return true;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Require a user field.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;v.require( "user" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Ensure the assigned user is not changed.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;v.unchanged( "user" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;// Ensure that user does not have value of undefined.
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;v.assert( (newDoc.user != "undefined"), "New documents must have an associated user." );
    
    &nbsp_place_holder;&nbsp_place_holder;}
    
    }

First off, when you create a [CouchApp](http://couchapp.org/page/index), you get a bunch of scripts available to you in the _/vendor_ directory. We seen and used some of these, most notably in the _loader.js_ from _/vender/couchapp/_attachments_ that is loaded by the _index.html_ document of our [jQuery Mobile](http://jquerymobile.com/) application. In the first line of our **validate_doc_update** we require another **JavaScript** provided through [CouchApp](http://couchapp.org/page/index) – the _validate.js_. The _validate.js_ script essentially exposes helper methods for determining user roles and validating document updates as well as convenience methods for throwing exceptions (as forbidden or unauthorized). The _init_() method is a utility method to access a new instance of this validation object and call these methods against the **newDoc**, **oldDoc** and **userCtx** objects.

We add a new method to our validation object to check if the user has a role of is an _“albums-user”_ or is an **admin**:

_/validate_doc_update.js_
    
    v.isAlbumsUser = function() {
    
    &nbsp_place_holder;&nbsp_place_holder;return v.isAdmin() || userCtx.roles.indexOf("albums-user") != -1;
    
    }

That is then used to verify that we can go forward in our validation of the document based on the **userCtx** and documents. It is important to note that a document that is in the process of being deleted is assigned a __deleted_ property before being passed to the **validate_doc_update**. That is important to our validation as it will not necessarily be filled with a _“user”_ property, nor is the _“user”_ property necessary on the **newDoc** to validate the operation. We need to check if a delete operation is valid by comparing the **oldDoc** to the **userCtx**:

_/validate_doc_update.js_
    
    var isDeletingWithoutPermission = ( newDoc._deleted && ( oldDoc.user != userCtx.name ) );
    
    var isUpdatingWithoutPermission = ( newDoc.user != userCtx.name ) || ( oldDoc && ( newDoc.user != oldDoc.user ) );
    
    // If either non-permission criteria is met, checking delete first...
    
    if( !v.isAdmin() && isDeletingWithoutPermission ) {
    
    &nbsp_place_holder;&nbsp_place_holder;v.forbidden( "Only the creator of this document has permission to delete." );
    
    }
    
    else if( !v.isAdmin && ( !newDoc._deleted && isUpdatingWithoutPermission ) ) {
    
    &nbsp_place_holder;&nbsp_place_holder;v.forbidden( "Only the creator of this document has permission to update." );
    
    }

If our validation passes through that, then all that is left is to make sure that we have the correct fields and their values are valid:

/validate_doc_update.js
    
    else {
    
    &nbsp_place_holder;&nbsp_place_holder;// If it is being deleted, we are all set.
    
    &nbsp_place_holder;&nbsp_place_holder;if( newDoc._deleted ) return true;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;// Require a user field.
    
    &nbsp_place_holder;&nbsp_place_holder;v.require( "user" );
    
    &nbsp_place_holder;&nbsp_place_holder;// Ensure the assigned user is not changed.
    
    &nbsp_place_holder;&nbsp_place_holder;v.unchanged( "user" );
    
    &nbsp_place_holder;&nbsp_place_holder;// Ensure that user does not have value of undefined.
    
    &nbsp_place_holder;&nbsp_place_holder;v.assert( (newDoc.user != "undefined"), "New documents must have an associated user." );
    
    }

If we are simply deleting the document, return true to pass the validation, else we ensure that a **user** field is present, that it has not changed and that it is not undefined. If none of those checks throws an exception, the validation will be complete and the update (create or update) will pass.

What’s cool about [Futon](http://127.0.0.1:5984/_utils) is that it will use that validation script when working on documents within [Futon](http://127.0.0.1:5984/_utils)… pretty meta. So if you have shut down validation to no-one-at-all-ever, and go and try to update a document in your database, you’ll get an alert and will have to log in as an admin and change your **validate_doc_update**.

### Push Validation to our Albums CouchApp

Alright, with our **validate_doc_update** script ready to go, its time to push it live. If you have been following along in this series, you are familiar with how we push updates using [couchapp](http://couchapp.org/page/index). However, with our new privileges that we implemented in this article, we have to do it a little differently. Whoa whoa whoa! Calm down… its not that bad. We just have to pass our admin credentials in the command:
    
    couchapp push albums http://toddanderson:admin123@127.0.0.1:5984/albums

All we did was use [basic access authentication](http://en.wikipedia.org/wiki/Basic_access_authentication) to push an update to our [couchapp](http://couchapp.org/page/index) with the credentials of the **admin** we created previously. Now you have authority. Can you feel the power? Sometimes i think i feel the power, but it could be gas. Not this time, though. I swear.

## Security

If you have been playing around with [Futon](http://127.0.0.1:5984/_utils) and looked at your **albums** database, you may have seen a **Security…** option in the list of actions:

![Security Option](http://www.custardbelly.com/blog/images/couchapp_7_1_8.png)  
_[Security Option]_

If you log in as the **administrator**, click option and fill in the credentials with the admin and roles we created previously in this article, you will enforce a login prior to viewing the application:

![Security Dialog](http://www.custardbelly.com/blog/images/couchapp_7_1_9.png)  
_[Security Dialog]_

If you save that and logout of Futon then try to access the **albums** database, you will get the following alert:

![Security Alert](http://www.custardbelly.com/blog/images/couchapp_7_1_10.png)  
_[Security Alert]_

Likewise, if we now browse to our application at [http://127.0.0.1:5984/albums/_design/albums/index.html](http://127.0.0.1:5984/albums/_design/albums/index.html) you’ll be presented with this page on landing:

![Application Landing](http://www.custardbelly.com/blog/images/couchapp_7_1_11.png)  
_[Application Landing]_

That is the _session.html_ shipped with [CouchDB](http://couchdb.apache.org/) that provides an easy way to present a login or signup gateway page for your application. We don’t want that. It breaks the User Experience for our **albums** application. We are going to present a login/signup only when a user tries to perform an operation that requires session validation. So, if you went ahead and added security, go and roll that back be emptying the fields… just wanted to show you a little more about security.

## Now Your Stuck

![Uh-oh](http://www.custardbelly.com/blog/images/couchapp_7_1_12.png)  
_[Uh-oh]_

LOL. You fell for it. What a ruse! If you have visited your application and tried to either create, update or delete a document, you can’t! That’s the end of this series. See you around!

No, no. Come back. Lower your fists. We’re going to add a login/signup dialog to our [jQuery Mobile](http://jquerymobile.com/) application so we can go about our business as we had done previously, but this time using user credentials and validation. This post has already gotten rather long, so that will come in the next installment of this mini-series. Just sit back for a bit and feel your <del>gas</del> power rise.

## Conclusion

In this first installment of **Part 7** mini-series within a series, we address user credentials, validation and security for our database and albums application. All fun stuff, and prior to [CouchDB](http://couchdb.apache.org/) 0.11 a sore point. I won’t go into how I had done it previously, but it boiled down to giving in and keeping the admin party. Maybe i wasn’t smart enough. But thankfully the intelligent people leading [CouchDB](http://couchdb.apache.org/) made me look smart again in later releases.

Next up in the mini-series within a series within **Part 7** within this blog within these series of tubes, we will use the information gathered in this article along with our validation script and modify our [jQuery Mobile](http://jquerymobile.com/<br />
http://jquerymobile.com/http://jquerymobile.com/) application to present a login/signup dialog when an operation is requested that requires session authentication and user credentials. Hurrah!

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
