---
title: 'Introducing MUWL'
url: 'https://custardbelly.com/blog/2009/03/09/introducing-muwl/'
author:
  name: 'todd anderson'
date: '2009-03-09'
---

In between work, taming a new puppy and twilighting as an iPhone SDK newbie, i have been busy working on a personal project that has taken way too long to see the light of day. I began working on an [AIR](http://get.adobe.com/air/) application last summer to overcome an incongruency in the middle tier of how i go about finding and purchasing new music… out came a little desktop app i call **MUWL**.

[![M U W L](https://custardbelly.com/blog/badge/Badge.png)](http://www.needlebeamcassette.com/muwl/client/air)

**MUWL** stands for **MU**sic **W**ish **L**ist and allows you to amass a list of albums that you hope one day will make it into your collection. 

You can read more detailed information about **MUWL** from the [custardwiki](http://www.needlebeamcassette.com/mediawiki/index.php/MUWL)… and/or just keep reading.

I am a sucker for record shops. I love flipping through vinyl and jewel cases – sometimes aimlessly, sometimes with a purpose – and bringing home musty and off-the-press platters. Before i created **MUWL**, i would discover music that i was into either online through various blogs and what-nots or from word-of-mouth. Problem was, i would write down titles on any scrap of paper that was near me in the hopes that i would remember to shove it in my pocket when i knew i was going to a shop. 

There was two major flaws in that system: **a)** I hardly EVER remembered to bring my scraps of paper and **b)** Some times i wind up in a record shop without a preconceived notion to go.

To rectify this sorry state of affairs, i thought i could make an app that would allow me to keep that list in one place and could be viewed by any device i might be carrying around with me. Now, i know, i know, why make a application targeting the Flash Platform if you wanted it to be on ANY device… ahem. Well, i just needed a client that i could create fairly quickly that would hook up to an online service. Seeing as i am familiar with the Flex and AIR SDKs, i thought it would get me closer to my goal – plus it would give me a chance to architect an application that supported occasional-activity and offline/remote data synchronization.

Even though i am targeting the Flash Platform for the **MUWL** desktop application, i wanted to stay away from the AMF protocol (which i would normally use in such a case) in order to keep it open to non-Flash clients that i may make in the future… the main one being a companion iPhone app. As such i went with XML over HTTP and created a REST service using [Ruby on Rails](http://rubyonrails.org/).

I built the REST service that MUWL desktop AIR application talks to in Ruby because it has been on my list of things to get familiar with… and it was already installed on my server, so i figured why not. I gotta say i really loved working with Ruby on Rails. We’ll see how much i love i still have for it if more than just me uses the application ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

Other than a companion iPhone app, i have some other ideas on what to add to the client application. If you download and use MUWL and have any thoughts (or god forbid bugs), let me know.

[So here it is, released to the wild if you think it might be of use to you as well.](http://www.needlebeamcassette.com/muwl/client/air/)

Big ups go to [Ash](http://razorberry.com/blog) who did some testing and kept me sane.

Posted in [AIR](https://custardbelly.com/blog/category/air/), [MUWL](https://custardbelly.com/blog/category/muwl/), [Music](https://custardbelly.com/blog/category/music/).
