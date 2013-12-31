# [Announcing as3couchdb Library](http://custardbelly.com/blog/2010/04/13/announcing-as3couchdb-library/)

_The library is available on github at [bustardcelly/as3couchdb](http://github.com/bustardcelly/as3couchdb). You can read more detailed information on [the wiki](http://wiki.github.com/bustardcelly/as3couchdb/). Continue reading to hear me blab on and on._

When the new year came and i had finally got in [my last chapter](http://custardbelly.com/blog/?p=132) for [Flex 4 Cookbook](http://www.amazon.com/Flex-Cookbook-Real-world-developing-Applications/dp/0596805616/ref=sr_1_1?ie=UTF8&s=books&qid=1271029122&sr=8-1), it was time to return to my list of things to learn. I started looking into **Capuccino** and **Closure** and bought a book on **Python**. Somewhere along the way i just clicked on some tweet about 5 emerging trends that _i must know about_. Usually i find these lists are a grain-of-salt bandwagon of buzzery – maybe some truth but can’t cut through the true meaning of why this person is writing about them. But one did stick – **NoSQL**. I looked into the different implementations and right away i took a fancy to **[CouchDB](http://couchdb.apache.org/)**. I don’t know why. It seemed quite simple. Working with a database using **REST** calls. Sounds good. And i could write my own map-reduce views in Javascript. Sign me up.

What also was a big draw to me was the concept of document revisions in **CouchDB**. I had worked on a couple projects that required **online/offline synchronization** and it was quite a pain to keep track of last modified entries and cleanup of deleted entries in a SQL database. The revisioning system for documents (entries) is built into **CouchDB** and what is more is that you are not locked into a rigid data structure and ensure your table relations are scalable. That’s not to say that building relational databases isn’t a fine art. It is. And there are many smarter people than me that get paid more money that have that craft. I don’t. The concept of revisions is familiar to me and i am greatly intrigued by the concept of **NoSQL**.

Anyway, i started digging into **[CouchDB](http://couchdb.apache.org/)** and figured the one way for me to see the whole picture was to hook up a client side end to make these requests. See if what i was reading about was something i could use as a different approach to **online/offline synchronization** in my applications. What came out was a whole library for working with databases and documents of a **CouchDB** instance – a library which is now available on **github** at [http://github.com/bustardcelly/as3couchdb](http://github.com/bustardcelly/as3couchdb).

Took me long enough to get talking about the **as3couchdb** library mentioned in the title, didn’t it? Well, you can read more long-winded explanations about the make-up of the library from [the wiki on github](http://wiki.github.com/bustardcelly/as3couchdb/), and browse [some examples that use the library](http://github.com/bustardcelly/as3couchdb/tree/master/examples/flex/) (currently all Flex examples, but AS3 examples are coming soon).

If you are still around, i can give a brief synopsis of the project:

When i set out on creating the [as3couchdb](http://github.com/bustardcelly/as3couchdb) library, i knew i wanted to follow a similar approach to [**Data Access Objects**](http://en.wikipedia.org/wiki/Data_access_object). I wanted to make all my requests through the object i was working with and have an intermediate layer that communicate with the service and updated the object accordingly. To achieve this, i went about creating a _base model_ class that contains a _model entity_. The _model entity_ is really only involved in parsing custom metadata and resolving the information to properties held on the _base model_. Extending the _base model_ are the two core models of **CouchDB** that you interact with: the _Database_ and the _Document_.

So the _Database_ and _Document_ models can be though of as the **Business Objects** and expose methods that related to **CRUD** operations. _Even though **[CouchDB](http://couchdb.apache.org/)** has a **REST** API, i chose using simple **CRUD** method signitures on the models as they seem easier to read and understand._ From these methods, the models interact with a _service mediator_ (similar to **Data Access Object**), which knows how to communicate with the service proxy and has _action handlers_ that know how to modify the model once a successful result is received. To put it in code terms:

_I wanted to have the ease of creating and storing a document as such_

`var contact:ContactDocument = new ContactDocument();  
contact.firstName = "Todd";  
contact.lastName = "Anderson";  
contact.addEventListener(CouchActionType.CREATE, handleContactCreate);  
contact.create();`

_And the ease to simply read in for modification as such:_

`var contact:ContactDocument = new ContactDocument();  
contact.addEventListener(CoachActionType.READ, handleContactRead);  
contact.read( $uid );`

In order to make this all work and auto-wire the models with a _service mediator_, custom annotations were needed. This is where the _model entity_ mentioned earlier comes into play. When extending the core models (as **ContactDocument** does in the previous examples) you add custom metadata that relates to the **CouchDB** instance you intend to work with and the fully qualified classnames of the target _service mediator_ and _request object_.

Now the _request object_ is a different story and was brought into the picture due to the lack of HTTP method types available for the web version of **Flash Player**. As such, there are a couple different _request object_ types available in **as3couchdb**: straight-up devil-may-care requests using **URLRequest** (mainly for **AIR** or you will get RTEs), one that uses **External Interface**, and one that uses [as3httpclientlib](http://github.com/gabriel/as3httpclient). The [as3httpclientlib](http://github.com/gabriel/as3httpclient) allows you to make PUT and DELETE requests using a **Socket** and is the best way to interact with a **RESTful** service when limited to the Flash web player (imho).

So that is a brief rundown of the model and business layer implementation i strove for when creating **as3couchdb**. As i mentioned way back in upward-page-scroll land, the original drive to make **as3couchdb** was to see if i could ease up the pain of developing an application that uses **online/offline synchronization**. That is in the works and maybe this blog will become a little more active as I dive into that task.

If you made it this far, thank you for reading all this. Wow. You are a trooper. Tell your boss i said it is okay and you can bill that time.

Link-link time!  
CouchDB – [http://couchdb.apache.org/](http://couchdb.apache.org/)  
CouchDB: The Definitive Guide – [http://books.couchdb.org/relax/](http://books.couchdb.org/relax/)  
CouchDB: Wiki – [http://wiki.apache.org/couchdb/FrontPage](http://wiki.apache.org/couchdb/FrontPage)  
Planet CouchDB – [http://planet.couchdb.org/](http://planet.couchdb.org/)  
MongoDB, CouchDB and MySQL Compare Grid – [http://www.mongodb.org/display/DOCS/MongoDB,+CouchDB,+MySQL+Compare+Grid](http://www.mongodb.org/display/DOCS/MongoDB,+CouchDB,+MySQL+Compare+Grid)  
as3httpclientlib – [http://github.com/gabriel/as3httpclient](http://github.com/gabriel/as3httpclient)

More information about the custom metadata, and the inner workings of as3couchdb can be found [on the wiki](http://wiki.github.com/bustardcelly/as3couchdb/) for the [project in github](http://github.com/bustardcelly/as3couchdb).

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [CouchDB](http://custardbelly.com/blog/category/couchdb/), [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/), [as3couchdb](http://custardbelly.com/blog/category/as3couchdb/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – April 13, 2010
  *[April 13, 2010]: 2010-04-13T05:15
