---
title: 'An ImagesLoader in Flash8'
url: 'http://custardbelly.com/blog/2005/11/07/an-imagesloader-in-flash8/'
author:
  name: 'todd anderson'
date: '2005-11-07'
---

find the files [here](http://www.custardbelly.com/downloads/ImagesLoader.zip).

Since Flash8 came out, i’ve moved away from the old multi-keyframed movieclip used for sprites in my games. I’ve been playing around with loading images into a movieclip, copying the pixels into a BitmapData instance, then discarding the mc and passing that data onto whoever wants it. After trying a couple different ways on how to manage this process, i was thumbing through [Killer Game Programming](http://www.oreilly.com/catalog/killergame/) by Andrew Davison and thought his ImagesLoader class (written in java) was pretty damn cool and decided i wanted a Flash adaptation of it.

Seeing as Flash doesn’t have a BufferedImage, I drummed up a little implementation of buffering images offscreen and here it is.  
The prominant class file that the different buffers (Single, Strip, Multi) use is the ImageLoader – which does pretty much what i said in the first sentence.  
The different buffers know what to do with the bitmapdata passed from ImageLoader, but perhaps more importantly they have a queue system set up so that you can hit these Singletons with numerous filepaths to images and the loading of one won’t get overwritten by the loading of another.

The ImageLoader and buffers can be used seperately from the ImagesLoader, but the ImagesLoader class is there if you want a sort of buffered image manager. It holds basically an image map from which another class can grab the bitmap data of anything loaded. As well, taking a cue from [Andrew Davison’s](http://fivedots.coe.psu.ac.th/~ad/) ImageLoader.java, ImagesLoader can read a text file that lists all the images you want loaded and buffered in your app, choosing buffers dependant on a preceding signifier (single, strip, group, number).  
I find it helpful and it probably could use some optimization, but hopefully you can get something out of it… And please don’t forget to call ImagesLoader.dispose() when you’re done with it.

In the [zip](http://www.custardbelly.com/downloads/ImagesLoader.zip) are the files, a sample FLA, some images and an image.txt file. I realized that some of the images don’t really illustrate the point because they’re simple and you’d probably use the drawing API instead, but you get the idea of how the ImagesLoader works.

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flash8](http://custardbelly.com/blog/category/flash8/).
