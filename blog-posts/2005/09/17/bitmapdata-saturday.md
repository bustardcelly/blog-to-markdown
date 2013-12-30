# [BitmapData saturday](http://custardbelly.com/blog/2005/09/17/bitmapdata-saturday/)

Since i finally got a whole day to fool around, i decided to start learning about the new BitmapData class in flash8.  
I’ve only just begun, and i’m not really sure if what i worked on today is of any benefit in the end, but i like it.  
I set out to eliminate having to create a ton of sprite movieclips in the library for games, and instead store the data from an external spritesheet and just have movieclips change their bitmap data when states change.  
After i banged my desk and racked my brain for an hour to find out why i couldn’t load a bitmap, i decided to actually read the help files instead of going on what i thought should happen ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)  
Turns out attachBitmap is not like loadMovie, but more like attachMovie (i know it makes sense, but it was early) – you can only attach a bitmap if it’s in the library. So i created a class that would load the image, creates a new BitmapData object and draws to it from the loaded movieclip. then it removes that movieclip, passes the new bitmap object onto a character movieclip which has coordinates of how to “cut-up” the bitmap.  
So, basically when states change (like if the user presses SPACE for jump) those coordinates are fed the BitmapData’s copyPixel function.  
I just tried it with the “still” and “jump” states, and it seems to be working pretty well. it will be interesting to see what comes of trying to incorporate a walk-cycle into it. 

Whether or not this is the best thing to do for a game, i’m not quite sure… Whether it takes less time than making movieclips, i don’t know… but it’s another possibility.

As a side note, the png this swf loads was created by using [Patrick Mineault’s pixel tools](http://www.5etdemi.com/blog/archives/2005/03/pixel-tools-v2-available/) (glad they still work in 8!) in the Flash IDE then exported.

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flash8](http://custardbelly.com/blog/category/flash8/).
