# [AS3 2d tilescroller source](http://custardbelly.com/blog/2006/06/09/as3-2d-tilescroller-source/)

[view swf and source here.](http://www.custardbelly.com/downloads/as3/TileScroller/index.html)

I trimmed down some processes and stripped any excess so the classes included focus just on the tile scroller. In [my previous post](http://custardbelly.com/blog/?p=47) the movement was based upon the position of the sprite- here it’s based soley on keystrokes. It also utilizes some of [my ImagesLoader](http://custardbelly.com/blog/?p=43) classes. 

The real meat is in the updateScroll method of the MapScrollLayer class. That handles all the update of bitmapdata to the gridded tiles, and redraw/scroll of the displayed bitmap.  
One thing i found exciting was creating custom namespaces. If you take a peek at com.custard.as3.models.TileLayerMap, in the constructor it creates a 2d array based on the data type.

I had planned to make a fuller presentation with some tutorial-like explanations, but my time is pretty thin right now. If enough people are interested in that, i’d definitely get on top of it. A basic understanding of OOP may be needed to gather something from the code. i don’t really plan to go that much into it, but if you are a little rusty, unfamiliar with the concept, or want to learn more, [Ben Stucki](http://blog.benstucki.net/) is going into that this month on his blog.

…also…

every time i go back home to my parents’, there’s some more boxes of ‘junk’ that have been sitting in the basement, stuck in some dark corner, since my room was turned into an office.  
this past weekend i went through another said box, and pulled out this bounty!

![game&watch](http://custardbelly.com/blog/images/gamewatch.gif)

had forgotten all about these guys…

i’m waiting for the box that had my old [etch-a-sketch animator gadget](http://en.wikipedia.org/wiki/Image:Etch-A-Sketch_Animator.jpg). man, i loved that thing.

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/).
