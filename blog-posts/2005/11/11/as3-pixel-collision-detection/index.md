---
title: 'AS3 Pixel Collision Detection'
url: 'https://custardbelly.com/blog/2005/11/11/as3-pixel-collision-detection/'
author:
  name: 'todd anderson'
date: '2005-11-11'
---

check it out [here](javascript:MM_openBrWindow('http://www.custardbelly.com/AS3/PixelCollision.html','coll_trial','resizable=no,width=150,height=110');) _(requires 8.5)_

It’s the same code as the prior post, just a different implementation for sending the data to check the collision because it’s in AS3.

One thing i found that may be helpful to others… i spent about 10 minutes trying to figure out why i couldn’t “press” on the sprite. Turns out i could have all along, but since i didn’t see the hand cursor on rollover, i just figured my code was wrong…

I guess i have some new visual learning to go along with the new code.

Here’s a little snippet of how you do startDrag/stopDrag in AS3. It can be found in the online docs… if i had bothered to read them ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) .  
If you want to see the hand cursor, you have to set buttonMode to true (as far as i know)- which will turn on useHandCursor with the default value of true.
    
      
    
    import flash.display.Sprite;  
    
    import flash.events.Event;  
    
    import flash.events.MouseEventType;
    
    
    
    
    public class SpriteExample extends Sprite  
    
    {  
    
    	public function SpriteExample()  
    
    	{  
    
    		buttonMode = true;  
    
    		addEventListener(MouseEventType.MOUSE_DOWN, onMouseDown);  
    
    		addEventListener(MouseEventType.MOUSE_UP, onMouseUp);  
    
    	}
    
    
    
    
    	private function onMouseDown(evt:Event):Void  
    
    	{  
    
    		this.startDrag();  
    
    	}
    
    
    
    
    	private function onMouseUp(evt:Event):Void  
    
    	{  
    
    		this.stopDrag();  
    
    	}  
    
    }  
    
    

i’m looking to put up the code for the Pixel Collision Detection for both Flash8 and AS3, still running some test and cleaning up.

[Here’s a “30-Colby at 30FPS” trial](javascript:MM_openBrWindow('http://www.custardbelly.com/flash8/PixelHit.html','coll_trial','resizable=no,width=415,height=415');) in flash8, but it seems to take a huge hit on a Mac for all browsers… don’t know what’s up with that. Does drop about 10 frames on a PC even with a proximity detector, but as i said in the previous post, i probably wouldn’t use this detection for large amounts of objects.

Posted in [AS3](https://custardbelly.com/blog/category/as3/), [Flash](https://custardbelly.com/blog/category/flash/).
