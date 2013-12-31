# [AS3 2D Tilescroller](http://custardbelly.com/blog/2006/05/31/as3-2d-tilescroller/)

[![click me](http://www.custardbelly.com/AS3/MapScroll/tilescroller.gif)](javascript:MM_openBrWindow('http://www.custardbelly.com/AS3/MapScroll/index.html','til_scroller','resizable=no,width=400,height=200');)click me.

During the port of my AS2 classes into AS3, i thought i might take a stab at a tile scrolling engine. I never got into making one before, and since I’ve been delving into the magic that is BitmapData, i decided to give it stab. I need to do a little house cleaning, but i plan to throw up the code here soon…

In previous versions of Actionscript it was common to do variations of ‘move and replace’ based on movieclip positions and key strokes ( see [TonyPa](http://www.tonypa.pri.ee/tbw/index.html), [Strille](http://www.strille.net/tutorials/part1_scrolling.php), [Outside of Society](http://oos.moxiecode.com/tut_10/index.html), [André Michelle](http://recycle.andre-michelle.com/), etc ). There was some great implementations and they worked well, but i figured with BitmapData it could be boiled down to a smoother and less intensive process – kind of what [Keith](http://www.bit-101.com/blog/) has been[ labbing with](http://www.bit-101.com/lab/?p=18).

What’s going on-  
The layers ( there are 3 in the example but you can add however many before your graphics card yells at you ) are just a grid of Bitmap objects – the amount based on the ‘visable’ area divided by the tile size of the graphics.  
They don’t move at all – instead they are offscreen and are updated based on the characters ‘x’ and ‘y’ velocity divided by tile size, of which its remainders are parameters supplied to the scroll method of a BitmapData instance that is redawing the layers upon key press.

In the coming days, i hope to strip out a little code and throw the source ( and maybe some drawings that will clear up my terrible explanation ) up here… just wanted to do a quick post for proof of concept.

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – May 31, 2006
  *[May 31, 2006]: 2006-05-31T07:21
