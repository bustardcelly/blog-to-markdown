---
title: 'the New New BitmapData'
url: 'https://custardbelly.com/blog/2005/10/18/the-new-new-bitmapdata/'
author:
  name: 'todd anderson'
date: '2005-10-18'
---

In [AS3](http://livedocs.macromedia.com/labs/1/flex/langref/migration.html), the MovieClip method attachBitmap is removed. what does that mean for setPixel, getPixel and copyPixel?  
The documentation roughly states that addChild is the equivalent of attachBitmap… but only display objects can be “attached” using addChild.  
Running addChild(myBitmapData) within a MovieClip or Sprite class throws an error, because it appears that BitmapData is not considered a DisplayObject.

With the previous experiments presentated on this blog, i used the BitmapData.copyPixel method to render states of a sprite. But that was only made possible by loading an image, using BitmapData.draw, (unloading the image), and then passing that BitmapData to a movieclip, attaching a new BitmapData object and copying pixels dependant on user interaction.

There has to be a way to represent this in AS3… but for my first day of trying, i’ve come up empty.

With all the flash 8 experiments out there, has anyone else come across this, and come up with a solution?

_As a side note:_  
I am a huge fan of the new Loader class. Here’s a small sample:  

    
      
    
    import flash.net.URLRequest;  
    
    import flash.display.Loader;  
    
    import flash.util.trace;  
    
    import flash.events.*;
    
    
    
    
    class LoaderTest extends Sprite  
    
    {  
    
    	private var __loader:Loader;  
    
    	private static var IMAGE_URL:String = “myimage.png”;
    
    
    
    
    	public function LoaderTest()  
    
    	{  
    
    		__loader = new Loader();  
    
    		__loader.addEventListener(EventType.COMPLETE, onLoadComplete);  
    
    		var request:URLRequest = new URLRequest(IMAGE_URL);
    
    
    
    
    		__loader.load(request);  
    
    	}
    
    
    
    
    	private function onLoadComplete(evt:Event)  
    
    	{  
    
    		trace(”load that sucker ” + evt);  
    
    	}  
    
    }  
    
    

…. no more loadMovie / onEnterFrame, or MovieClipLoader (which for some reason seems to crash Flash8 for me).

i guess i should get off the double-underscore train too… i don’t know … my head’s about to burst.

Posted in [AS3](https://custardbelly.com/blog/category/as3/), [Flash](https://custardbelly.com/blog/category/flash/).
