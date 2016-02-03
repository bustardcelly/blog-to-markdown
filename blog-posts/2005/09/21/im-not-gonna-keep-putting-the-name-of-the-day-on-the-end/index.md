---
title: 'i’m not gonna keep putting the name of the day on the end…'
url: 'https://custardbelly.com/blog/2005/09/21/im-not-gonna-keep-putting-the-name-of-the-day-on-the-end/'
author:
  name: 'todd anderson'
date: '2005-09-21'
---

![](https://custardbelly.com/blog/images/bitmap_trial3.gif)

_Following up on my past two posts._

The prior two experiments were done using a png with a transparent background. i made it, so i know what i wanted… but what if the spritesheet you’re using isn’t in a format without an alpha channel?  
I ran a test using a png with a background color to see if i can strip out a specified color and still get the rendered staes i want.  
Yes i can- by using the threshold method of the BitmapData class.

the picture above is a screenshot of my test movie that shows the image loaded in the upper-left corner.

**To recap**: i load an image into a mc, create a BitmapData instance and BitmapData.draw(mc) to capture the bitmap. Then i (aside from here) delete the mc, pass the BitmapData instance onto a “dissector” and render each state dependant on user action.  
In order to remove the offending color (in this case all pixels with a value of 0×00333333), run the following before passing the BitmapData instance on:
    
    // — where  
    
    //              __bmp is my BitmapData instance,  
    
    //              __threshold = 0×00333333,  
    
    //              w and h are the dimesions of the loaded image  
    
    // –  
    
    private function applyThreshold(w:Number, h:height)  
    
    {  
    
    	__bmp.threshold(__bmp, new Rectangle(0, 0, w, h), new Point(0, 0), “==”, __threshold, 0xffff00, 0xffffff, false);  
    
    }

I kept the dropShadow in there to see if it still applied afterward, and lo and behold! excellent.  
One thought… for some reason when i set the color and mask arguments both to white, it didn’t mask- don’t know why, but i didn’t investigate too hard.  
Two thought… if my states held that same offending color (say in the eyes), it will remove it – i’ll have to work on that.

Posted in [Flash](https://custardbelly.com/blog/category/flash/), [Flash8](https://custardbelly.com/blog/category/flash8/).
