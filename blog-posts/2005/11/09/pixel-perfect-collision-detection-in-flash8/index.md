---
title: 'Pixel Collision Detection in Flash8'
url: 'http://custardbelly.com/blog/2005/11/09/pixel-perfect-collision-detection-in-flash8/'
author:
  name: 'todd anderson'
date: '2005-11-09'
---

In my last post i talked about an ImagesLoader that holds a map of the bitmapdata copied from any images loaded into an offscreen buffer. Well, i thought that was well and good, but i started thinking about collision detection between two bitmaps. Take for instance the “load and chop” of a strip of sprite states. Since it does a check on the dimensions of the image loaded and just divides by the number of states (columns and rows) specified, each state has the same width and height.  
That’s fine if you’re running a collision detection based on movieclip bounds, but the state of a sprite can have a fair amount of empty (tranparent) pixels within the bounding rectangle detected from the movieclip it’s attached to (using mc.getBounds()). What if you want to run a collision of something hitting any opaque pixels in the sprite and not use the bounding box of the mc?

Well, i whipped up a quick little class that will do that.[  
You can view it here](javascript:MM_openBrWindow('http://www.custardbelly.com/flash8/CollisionTest.html','coll_trial','resizable=no,width=170,height=150');)  
(just click and drag the little colbys).  
Sorry i couldn’t put it on the page, there seems to be a problem with loading images into a flashObject embedded in this page.

This is a pretty “lite” example since it’s only checking three objects during onMouseMove, but you can see how it works, and in theory you wouldn’t run this detection process unless sprites were in a certain area of each other.

After i clean up my code and make a better example i’ll throw the source up here, but i’ll show you some things it’s doing.

Before it goes into the process of checking pixel transparencies between two sprites, it runs the age old  

    
      
    
    if(	ay2 < by1 ||  
    
    	ay1 > by2 ||  
    
    	ax2 < bx1 ||  
    
    	ax1 > bx2)  
    
    {  
    
    	return false;  
    
    }  
    
    

operation (where ay1 is mc1._y, ay2 is mc1._height, and the b’s are the same but with other movieclip). If that returns, the two sprites being checked don’t overlap, so we don’t even bother going on to check if it’s only transparent pixels that are overlapping.

If that doesn’t return, it goes on to determine the rectangle of intersection, from which it derives what pixels to check in each bitmapdata instance.  
It runs the alpha check with this operation:  

    
      
    
    var aVal:Number = ((bmpData.getPixel32(x, y) >> 24) & 0xFF);  
    
    

If that shows up as 0, it’s transparent. I stink at techinical explanations, so if you want to learn about this visit this article by Grant Skinner – [Using Bitwise Operators to Manipulate Bits and Colors](http://www.macromedia.com/devnet/flash/articles/bitwise_operators.html), but it’s basically checking for any similar bits between the alpha channel of the pixel and 0xFF.

I’d also like to point out Grant Skinner’s great example of [Shape-Based Collision Detection](http://www.gskinner.com/blog/archives/2005/10/source_code_sha.html), if you haven’t already seen it. 

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flash8](http://custardbelly.com/blog/category/flash8/).
