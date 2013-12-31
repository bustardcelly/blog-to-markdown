---
title: 'Errata or just a helpful hint?'
url: 'http://custardbelly.com/blog/2008/09/03/errata-or-just-a-helpful-hint/'
author:
  name: 'todd anderson'
date: '2008-09-03'
---

For those of you who have a copy of the [Adobe Air Create-Modify-Reuse book](http://www.amazon.com/Adobe-AIR-Create-Modify-Programmer/dp/0470182075/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1220490556&sr=8-1) that myself and [Marc Leuchner and Matt Wright (of NoBien fame)](http://blog.nobien.net/) authored, we hope you are enjoying it and i also may have a bit of errata for Chapter 1 if you are running Leopard. For those of you who don’t have a copy of the [book](http://www.amazon.com/Adobe-AIR-Create-Modify-Programmer/dp/0470182075/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1220490556&sr=8-1) (go buy it) and/or are running Leopard and want to use the Flex SDK command line tools, this may be of interest…

In Chapter 1 of the Adobe AIR Create-Modify-Reuse book, _The Development Environment_, it states that in order to set a PATH variable for your command line tools that you should:

**1.** Open the Terminal and type **> open -e .profile**  
**2.** Add the path to the /bin folder of your SDK installation (I paraphrased… but you get the idea)

In Tiger this is all well and good, and if you are running in Tiger you can drop off or read on if you intend to upgrade to Leopard. Setting system paths in Leopard has changed and you no longer have a _.profiles_ file in your User directory to which you can add/append paths. The following steps are what i took to add a path to the Flex SDK command line tools under Leopard:

**1.** Open the Terminal and navigate to /etc/paths.d  
**2.** Create a file named ‘flex’ – (sans quotes)  
**3.** Enter the following command: **> pico flex**  
**4.** Enter: **/Applications/flex_sdk_3/bin**  
**5.** Exit and Save

You will need to restart your computer.

_*Note: /Applications/flex_sdk_3/bin points to the /bin directory of my Flex 3 SDK installation, change as you see fit to your installation._

I can’t go into the long and short of why this needs to take place in Leopard, but that will get you up and running with the command line tools if running under Leopard; i can however tell you i used the following to set me on the right path (no pun intended):

[here](http://littlesquare.com/2008/01/24/upgraded-to-leopard-making-use-of-etcpathsd-and-path_helper/) and [ here](http://old.blog.elliottcable.name/articles/2007/10/leopard-paths)

I apologise if anyone had purchased [the book](http://www.amazon.com/Adobe-AIR-Create-Modify-Programmer/dp/0470182075/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1220490556&sr=8-1) and tried to go through Chapter 1 with a Leopard installation. I did not know that setting PATH variables had changed and I was running Tiger when written and up until about a couple weeks ago when my HD went on the lam and i was greeted by a series of ‘Do Not Enter’ and ‘Missing File’ icons on start-up… all is well though, and they replaced my HD and installed Leopard for free!

For those of you have a copy of the book, i hope you are enjoying it. For those who are trying to get the tools up and running and just switched to Leopard i hope this is useful.

Posted in [AIR](http://custardbelly.com/blog/category/air/), [Books](http://custardbelly.com/blog/category/books/), [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/).
