---
title: 'A slight obsession over page speed'
author:
  name: 'todd anderson'
date: '2014-01-06'
---
Lately, several projects (both personal and work-related) have ignited an increasing obsession over page load speed and performance. I wanted to highlight a few tools and resources I find useful in analyzing performance and delivering web pages in production with optimal load time.

## Where'd this hat come from?
Over the past decade I primarily have been a client-side application developer. Sometimes my business card changes or personal introductions are made that get 'engineer' and 'architect' thrown in there, but truthfully I spend my days coding applications, regardless of language. I enjoy writing and shipping code under certain practices and methodologies and ocassionally pause to assess my current workflow and modify where bottlenecks are prevelant.

Up until recent years I was primarily concerned with code performance; rendering pipelines and element lifecycles, user-perceived performance cases for remote or off-loaded operations, optimizing algorithms for sorting, mapping, analyzing data, etc. I still am, but I also have become increasingly focused on delivery and load perfomance - especially in today's climate of people viewing web content on handheld devices without WiFi available. 

Perhaps it is due the increasing work of web-based clients over desktop or native applications, but - if I am being honest - I never really paid attention to load time for older web-based application projects for several reasons:

* Flash plugin (preload, skip intro, )
* Desktop browser targets
* Blind naivete

However, as an end-user myself (don't like the term much, either) trying to access web content on my phone while on my bus ride home, my world is consumed with `waiting...`. As such, I wised up rather quick when I started to think about how someone would be absolutely frustrated and move on after 1/4 second without seeing any visible load response from a web application I lovingly crafted to in some way (hopefully) make their life easier.

That's when I started incorporating page load analysis to my deployment workflow.

## Best Practices
There is excellent documentation out there regarding best practices in delivering web pages with optimal performance. Some of the best known ones are below:

Yahoo: [Best Practices for Speeding Up Your Web Site](http://developer.yahoo.com/performance/rules.html)    
Google: [Web Perfomance Best Practices; Google](https://developers.google.com/speed/docs/best-practices/rules_intro)  
Steve Souders: [14 Rules for Faster-Loading Web Sites](http://stevesouders.com/hpws/rules.php)

I won't rehash the tidbits those articles provide, so please visit those links for a wealth of information and follow the following blogs to keep abreast of the latest in research and development of web performance:

* [Steve Souders](http://stevesouders.com/)
* [Perfomance Calendar](http://calendar.perfplanet.com/)  

One aspect I find interesting is that a handful of the preferred optimizations described in those articles - such as concatenation, data-uris and script and styles placement on pages - have actually become part of the build phase of my development workflow, especially with the rise of tools such as [Grunt](http://gruntjs.com) and the developer community creating post-process tasks. 

It is not taken for granted that I can select tools and code under certain architectural principles I perceive as providing a comfortable development environment and have these tools at my disposal to deliver the end product in an optimal fashion. _Another resolution for this year is to contribute more to the libraries and tools I use often - whether through code or monetary donations._

## Manual Performance Analysis
There are a few sites and tools I visit that will perform analysis on a site while in development:

* [WebPageTest](http://www.webpagetest.org/)
* [GTmetrix](http://gtmetrix.com/)
* [pingdom](http://tools.pingdom.com/)
* [PageSpeed Chrome Developer Tool](https://developers.google.com/speed/docs/insights/using_chrome)

Additonally, [feedthebot](http://www.feedthebot.com/tools/) has a handful of neat little tools to test some things - specifically if gzip is working on your site.

They all - along with various other metrics - provide a scoring based on some criteria which, as far as I can tell, are defined either by __Yahoo!__ (via [yslow](http://developer.yahoo.com/yslow/)) or __Google__ (via [PageSpeed](https://developers.google.com/speed/pagespeed/?csw=1)).

Typically I stick to opening and running [PageSpeed](https://developers.google.com/speed/pagespeed/?csw=1) when developing in Chrome to get a overall recommndation of optimizations and then visit [WebPageTest](http://www.webpagetest.org/) when I want some serious analysis and am busy updating my __.htaccess__ file with rewrites and expiries.

## Integrating Performance Reporting in Workflow
Running analysis using tools desribed above is a great way to see some metrics and determine what solutions to take to better the load performance of you site/application, but I like to automate all the things when I can as well as provide reporting to Continuous Integration servers so that we can document progress or failures. To provide such value, I am a strong proponent of using [sitespeed.io](http://www.sitespeed.io/).

I have nothing bad to say about [sitespeed.io](http://www.sitespeed.io/). It's built on top of [PhantomJS](https://github.com/ariya/phantomjs), [yslow](https://github.com/marcelduran/yslow/), [browsertime](https://github.com/tobli/browsertime) and [bootstrap](https://github.com/twbs/bootstrap/). You can alternatively use the [yslow script for PhantomJS](http://yslow.org/phantomjs/) if you want something more stripped down, but [sitespeed.io](http://www.sitespeed.io/) generates a nice set of web documents that provide performance summaries along with being able to produce a __-JUnit](http://www.sitespeed.io/documentation/#junit)__ report for CI.

The documentation for __sitespeed.io__ is thorough and easy to follow along and the [configuration options](http://www.sitespeed.io/documentation/#configuration) are insanely helpful in finding possible pages on your site that may be of issue.

### Grunt integration
I am sure there is some [Grunt](http://gruntjs.com) task out there in the wild that hooks into running __sitespeed.io__ (or I should probably just stop being lazy and make one), but I have yet to find or search for one. I personally just use [grunt-exec](https://github.com/jharding/grunt-exec) to run the command during a build and deploy. With the proper [installation of sitespeed.io](http://www.sitespeed.io/documentation/#installation), I have the following subtask under `exec` task:

```
grunt.initConfig({
  ...
  exec: {
    sitespeed: {
      cmd: 'sitspeed.io -u http://staging.mysite.com -r ./doc/metrics'
    }
  }
}
});

grunt.loadNpmTasks('grunt-exec');
grunt.registerTask('dryrun', 'Build, deploy and analyze.',\ 
  ['build', 'deploy:staging', 'exec:sitespeed']);

```

That generates the JUnit report and summary documentation artifacts that can be consumed and presented by your CI server of choice. I also have a tendency to use the [yslow](https://github.com/marcelduran/yslow/) script for [PhantomJS](https://github.com/ariya/phantomjs) in tandem on the `exec` task as that will print out my perfomance grade in the console after issuing my __grunt__ deployment.

## Conclusion
Sometimes, especially when working with 3rd party libraries, web fonts, etc, it is unrealistic to hit 100 for your performance grading - who am I kidding, it is damn near impossible. I try to stay above 90 and feel satisfied. 

As well, it should be stated that the final test is actually physically visiting the sites on handheld devices over a data plan. As I mentioned previously, I usually do some perceived perfomance testing while on the bus ride home, ensuring that I don't get frustrated with the load time on my own work (and I hope I am more critical of my own stuff than others are ;)).

This is just the tip of the iceberg when it comes to analyzing load performance and with developments coming out of Google, such as [SPDY](http://www.chromium.org/spdy/spdy-whitepaper) and [mod_pagespeed](https://code.google.com/p/modpagespeed/), an exciting space to keep an eye on in order to deliver your content faster and keep end-users happily enjoying your sites and applications.
