---
title: 'AS3 follow up'
url: 'http://custardbelly.com/blog/2005/10/20/as3-follow-up/'
author:
  name: 'todd anderson'
date: '2005-10-20'
---

After studying over some great AS3 examples by [Ralf Bokelberg](http://www.helpqlodhelp.com/blog/archives/000127.html) and [Kevin Luck ](http://kelvinluck.com/article/first-actionscript-3-example), and running through the [AS3 documentation](http://livedocs.macromedia.com/labs/1/flex/langref/index.html )

i eventually drummed up an AS3 representation of [my first Flash8 BitmapData experiment](http://custardbelly.com/blog/?p=19). Whether or not it’s the best solution ( or necessarily a good one ), i thought i’d throw up the source here for any one to comment or question.  
it’s very simple and probably could use some refactoring.  
Basically, what i was contemplating about the removal of attachBitmap and the subsequent use of copyPixels method is resolved in this example by using copyPixels on a source bitmap and storing those in a states array. I then pass along those states, and dependent on the user interaction, employ drawRect on the graphic layer.

one thing i noticed – pressing anywhere in the embedded movie to enable keyboard events (as it is in previous flash players), did not draw that focus in 8.5 – at least i think. To get around it i had to create a sprite the size of the stage and listen for a MOUSE_DOWN event to set the focus again. If anyone’s got some thought on this, please leave a comment. 

you can find the source [here](http://www.custardbelly.com/examples/BitmapSample.htm).

i’d also like to point out another great collection of AS3 resources made possible by franto: 

[http://www.franto.com/blog2/collected-links-to-actionscript-30-examples](http://www.franto.com/blog2/collected-links-to-actionscript-30-examples)

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/).
