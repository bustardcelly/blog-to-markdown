---
title: 'Dependency Injection and IoC at BDP'
url: 'https://custardbelly.com/blog/2009/01/20/dependency-injection-and-ioc-at-bdp/'
author:
  name: 'todd anderson'
date: '2009-01-20'
---

Last week I was fortunate enough to be asked by [Doug](http://www.forestandthetrees.com/) and [Sam](http://blog.pixelconsumption.com/) who run the BDP ([Boston Design Patterns](http://www.forestandthetrees.com/designPatterns/) meet-up… NOT [Boogie Down Productions](http://assets.mog.com/pictures/wikipedia/3817/Boogiedownproductions.jpg)) to present on Dependency Injection and Inversion of Control (DI and IoC for those who are down with street acronyms). 

We had a nice turnout and a lively discussion that kept interupting my precious slides. I gave a quick run down of the Dependency Inversion principal and some examples for Factory and Template Method with segued into Dependency Injection and IoC. From there we dove into examples of frameworks out there that target the Flash Platform. Along the way we had some hefty discussion around the benefits and downsides with everyone chiming in. [Tim Walling](http://www.timwalling.com/) also brought up how he addresses DI using MXML and modules which was very intriguing.

As far as runtime IoC frameworks out there targeting the Flash Platform, we discussed [Spring ActionScript](http://www.herrodius.com/blog/157) (nee Prana) and [Parsley](http://www.spicefactory.org/parsley/). I’ve been using Spring ActionScript/Prana for some time and swear by it. But i also did take a second look at Parsley just to refresh my memory and I have to say there are some things that i find very promising, though at times it seems there might be too much to it. So many things i would not use… but the ability to configure custom namespaces looks like an amazing feature. 

As far as compile time IoC, we touched on [Swiz](http://code.google.com/p/swizframework/) and the EventMap of [Mate](http://mate.asfusion.com/). Both have their upsides and Swiz has definitely caught my interest (…may have to find a personal project for me to get into it more) but all in all, I have a tendency to favor external configurations. (For those worried about having to do the static variable array list of classes hack because of that, there is an example in the download zip at the end of this post.)

In any event, it was a good, lively discussion with some smart people and some great beer (thanks again Doug!). It’s no wonder that getting to the meetings more often is top on my resolution list for this year. If you are in the Boston area, think about putting it on your list too.

[Download the slides and examples here](https://custardbelly.com/downloads/BDP.zip). We’ll get them up on at the BMP site too.

Posted in [Flash](https://custardbelly.com/blog/category/flash/), [Flex](https://custardbelly.com/blog/category/flex/), [Prana](https://custardbelly.com/blog/category/prana/).
