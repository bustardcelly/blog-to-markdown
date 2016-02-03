---
title: 'The Making of a Test-Driven Grocery List Application in JavaScript: Part I'
url: 'https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i/'
author:
  name: 'todd anderson'
date: '2012-11-26'
---

# Preface

Over the past year, after having read [Test-Driven JavaScript Development](http://tddjs.com/) by [Christian Johansen](https://twitter.com/cjno), I have become a strong proponent for unit testing. Prior to becoming a total convert, I would start a project with good intentions in writing tests which would end, _at best_, in having a handful of unit tests in which each was focused on a single method and intended only to validate an expected return value or change of state; _at worst_ (and much more commonly), no tests at all. 

That was before the _a-HA_ moment in which I began to realize that unit tests could more importantly verify the design of the application and the requirement of its components. What brings an even larger smile on my face is being able to squash bugs simply by providing different data or changing the impetus of an action in my tests; I can verify the bug and eliminate it, all without having to go through launching the application and going through n-number of User Actions just to see if what I changed fixed the issue at hand. Of course, yes, as a developer you still need to – nay, _must_ – do your own QA before passing to QA, but I can offload the time required to go through all those User steps _after_ I have verified that my modification is a logical fix and all other tests are still passing. Armed with this knowledge, I can now cause colleagues to have involuntary eye-rolls with a response to development issues as either: “What does the test say?” or “Modify the tests to the requirement and work from there.”

In any event, I still consider myself an early convert and haven’t figured everything out and am still tentative in spots and question the validity of writing a test for perhaps an implementation that is not really a requirement. But, it has brought a new level of fun and excitement to my development cycle and that is never a bad thing – especially as I see that it adds value.

# Introduction

If you sat through that jabbering about why i think unit testing brings value to application development, you are very kind, but now I want to address the real intent of this post: I thought it would be interesting to lay it out on the line and build a test-driven application over a series of posts. Writing something that is publicly accessible always drives me to question my knowledge ([ps. buy my books](http://www.amazon.com/Todd-Anderson/e/B0037FMULM)!), but I would also like this series to invite criticism from readers so I can (selfishly) better myself. As well, perhaps I can impart some tidbit of wisdom to anyone following along – no guarantees ![;)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_wink.gif)

# Grocery List Application

I decided to dedicate this series to building a test-driven application that would allow me to create a **Grocery List**. I figured it will be a small enough application to not get muddled down in large, complex requirements and several moving parts but still provide a real-life example of a [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete)-based application. 

A **Grocery List** application is also something I have wanted to make for some time. We still, as a household, create a grocery list with pen and paper and take it in hand to the store. Nothing wrong with that, aside from the general user error of **a)** forgetting the list at home, and the user experience oversight of **b)** not being able to split up and cover parts of the list as a group. So, I thought it may be handy to have a web-based application that my family could add to, remove from and have available on the one thing we never leave the house without: attitudes. No. smartphones.

## Client-side Requirements

Since we are talking web-based, and specifically mobile-web, the current natural choice (barring snarky comments) is to build the application using HTML/JS/CSS. As well, I will assume we are developing against the latest available browsers and APIs; the application won’t (with my current mindset) be doing anything cutting edge, so will not require a specific distribution or OS.

Throughout this series, the presentation layer may take more of a back seat as the implementation of tests will largely revolve around the JavaScript language and associated publicly-available libraries. While I do intend to demonstrate how to use the JS libraries, I hope to also provide a healthy discussion around the practice of test-driven development. That said, I do have a preferred set of libraries and tools I use for web development. If you are unfamiliar with them, hopefully I can provide some insight or interest. As well, if you feel I may be off track – either with the libraries/tools being used, or in the practice of test-driven development – please speak up.

### Libraries Used

The following is a list of libraries that will be used in developing the Grocery List application:

#### RequireJS

I am a huge proponent of [AMD](http://wiki.commonjs.org/wiki/Modules/AsynchronousDefinition) as part of application structure, with [RequireJS](http://requirejs.org/) as my library of choice. I have discussed it in more length in [previous](https://custardbelly.com/blog/2012/03/06/facaded-micro-libraries-and-dependency-management-using-requirejs/) [posts](https://custardbelly.com/blog/2012/02/07/current-workflow-developing-linting-testing-and-distributing-javascript/). I will not really cover the usage of [RequireJS](http://requirejs.org/) or concept of [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) much (if at all) in this series, so if you are unfamiliar I implore you to check them out; I will state that it provides a very convenient mechanism to separate responsibilities and dependencies (ie, modular development).

#### Jasmine

I chose [Jasmine](http://pivotal.github.com/jasmine/) as my unit-test framework. In previous posts, I have supported the use of [QUnit](http://qunitjs.com/). I still love [QUnit](http://qunitjs.com/) and admire its ease of use and set-up. However, over the past half-year, I had fallen in love with[ Jasmine](http://pivotal.github.com/jasmine/) and its [BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)-style syntax. It provides (to me) more of means of defining behaviors of a system over testing attributes of an application’s components and lends to a nicer workflow of defining requirements and designing the application architecture. As well, just like [QUnit](http://qunitjs.com/), it is easy to integrate with [RequireJS](http://requirejs.org/) which is a requirement.

#### Sinon

[Jasmine](http://pivotal.github.com/jasmine/) does come with spies, but every now and then I find I need more when stubbing and mocking objects. I got familiar with [Sinon](http://sinonjs.org/) when writing unit-tests in [QUnit](http://qunitjs.com/). I still continue to use it as it provides no conflicts with [Jasmine](http://pivotal.github.com/jasmine/) and is familiar to me. There is a library out there called[ jasmine-sinon](https://github.com/froots/jasmine-sinon) that provides **Jasmine** matchers for **Sinon** if you are interested; looks good – just trying to keep requirements low for the development of the **Grocery List** application.

If you are unfamiliar with stubs and mocks for testing, have a look at the [Sinon docs](http://sinonjs.org/docs/).

#### Jasmin.Async

[Jasmine.Async](https://github.com/derickbailey/jasmine.async) provides a means of which to do asynchronous testing with Jasmine with ease. I have used it on a couple client-side projects and it really is worth it. Modelled after [Mocha](http://visionmedia.github.com/mocha/)’s async test support, it is miles above the default async testing model available in [Jasmine](http://pivotal.github.com/jasmine/) which basically suspends the test from progression until a flag is flipped in a _watch()_ block.

So those are the libraries you will see being used when developing tests. From that list, [RequireJS](http://requirejs.org/) is the only library that will also be used in developing the actual **Grocery List** client-side application, which will most likely incorporate [jQuery](http://jquery.com) for ease in DOM traversal and AJAX, as well – it’s ubiquitous enough that I will not have to add noise to this series of posts by introducing another suite of libraries.

## Github Repo

I have started a GitHub repo to track the progress of the application in this series: [grocery-ls](https://github.com/bustardcelly/grocery-ls). Each blog post will have an associated tag, or tags, that will represent a snapshot of the repo at that point in time and which are accessible from the GitHub UI. The master branch will represent the current state of the application throughout the whole series.

## Initial Development

I will be using a pre-defined set of terms and language to define a story and specification for a requirement when developing a test. These are mostly gleaned from the excellent article [Introducing BDD](http://dannorth.net/introducing-bdd/) by **Dan North**. I won’t be doing true BDD with the proper tooling, but rather more of a TDD with BDD characteristic and syntax as is provided from [Jasmine](http://pivotal.github.com/jasmine/), and will most likely complete the associated implementation from the specifications addressed in a single post so as to show test-to-implementation, instead of assembling all stories and specifications prior to implementation.

Alright, now that we have the pleasantries of intent and libraries used out of the way, let’s kick this off…

**[edit] **  
I had originally included working through the first story and suite of specifications for the **Grocery List** application in this post, but it got rather lengthy and though it started taking away some of the value (if any) the previous sections in this post provided. As such, I moved it out to the second installment of this series:

[The Making of a Test-Driven Grocery List Application in JavaScript: Part II](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii/)

—-

# Link Dump

[grocery-ls github repo](https://github.com/bustardcelly/grocery-ls)  
[Test-Driven JavaScript Development by Christian Johansen](http://tddjs.com/)  
[Introducing BDD by Dan North](http://dannorth.net/introducing-bdd/)  
[TDD as if you Meant it by Keith Braithwaite](http://cumulative-hypotheses.org/2011/08/30/tdd-as-if-you-meant-it/)  
[RequireJS](http://requirejs.org/)  
[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)  
[Jasmine](http://pivotal.github.com/jasmine/)  
[Sinon](http://sinonjs.org/)  
[Jasmine.Async](https://github.com/derickbailey/jasmine.async)

## Post Series

[grocery-ls github repo](https://github.com/bustardcelly/grocery-ls)  
[Part I – Introduction](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-javascript-part-i)  
[Part II – Feature: Add Item](https://custardbelly.com/blog/2012/11/26/the-making-of-a-test-driven-grocery-list-application-in-js-part-ii)  
[Part III – Feature: Mark-Off Item](https://custardbelly.com/blog/2012/12/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-iii)  
[Part IV – Feature: List-Item-Controller](https://custardbelly.com/blog/2012/12/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-iv)  
[Part V – Feature: List-Controller Refactoring](https://custardbelly.com/blog/2012/12/31/the-making-of-a-test-driven-grocery-list-application-in-js-part-v/)  
[Part VI – Back to Passing](https://custardbelly.com/blog/2013/01/08/the-making-of-a-test-driven-grocery-list-application-in-js-part-vi/)  
[Part VII – Remove Item](https://custardbelly.com/blog/2013/01/17/the-making-of-a-test-driven-grocery-list-application-in-js-part-vii/)  
[Part VIII – Bug Fixing](https://custardbelly.com/blog/2013/01/22/the-making-of-a-test-driven-grocery-list-application-part-viii/)  
[Part IX – Persistence](https://custardbelly.com/blog/2013/02/15/the-making-of-a-test-driven-grocery-list-application-in-js-part-ix/)  
[Part X – It Lives!](https://custardbelly.com/blog/2013/03/06/the-making-of-a-test-driven-grocery-list-application-in-js-part-x/)

Posted in [JavaScript](https://custardbelly.com/blog/category/javascript/), [grocery-ls](https://custardbelly.com/blog/category/grocery-ls/), [jasmine](https://custardbelly.com/blog/category/jasmine/), [unit-testing](https://custardbelly.com/blog/category/unit-testing/).
