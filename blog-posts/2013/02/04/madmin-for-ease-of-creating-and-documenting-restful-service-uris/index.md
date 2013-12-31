---
title: 'madmin: for ease of creating and documenting RESTful service URIs'
url: 'http://custardbelly.com/blog/2013/02/04/madmin-for-ease-of-creating-and-documenting-restful-service-uris/'
author:
  name: 'todd anderson'
date: '2013-02-04'
---

My company, [Infrared5](http://infrared5.com), recently released an Open Source project called [madmin](https://github.com/infrared5/madmin), which I had the great pleasure of being a main part of. 

**madmin** is a node-based application that allows for generating immediately accessible RESTful URIs. Though it is possible to communicate with command line tools like cURL, **madmin** also provides a client-side console to easily create the URIs and structure of JSON response(s). It was originally intended to solve a front-end development problem in maintaining two sets of code – a _fake_ service layer and _production-level_ service layer – during development, but has grown to be a proven way to facilitate communication between the server-side and client-side teams in discussing the requirements of the services for a project. It also proved to be pretty handy documentation, to boot, which could be easily discussed with clients.

Anyway, you can read a more detailed description of the project and how it came to fruition over at the [Infrared5 blog](http://blog.infrared5.com): [http://blog.infrared5.com/2013/01/introducing-madmin-an-admin-console-for-generating-mock-services-with-restful-uris/](http://blog.infrared5.com/2013/01/introducing-madmin-an-admin-console-for-generating-mock-services-with-restful-uris/)

If you check it out, I hope you find it useful in any way and please log issues for requests or fork it to add features! I intend to get more basic instructions up on the wiki at its [github location](https://github.com/infrared5/madmin) and perhaps write a few blog posts as well.

Posted in [Infrared5](http://custardbelly.com/blog/category/infrared5/), [JavaScript](http://custardbelly.com/blog/category/javascript/), [madmin](http://custardbelly.com/blog/category/madmin/), [node](http://custardbelly.com/blog/category/node/).
