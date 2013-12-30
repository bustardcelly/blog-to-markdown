# [Programmatic barberpole](http://custardbelly.com/blog/2006/05/05/programmatic-barberpole/)

Flash8 and AS3 examples – [you can view and download the source here](http://custardbelly.com/blog/insets/ProgressIndicator.html)

I’ve created and used many variations of non-descriptive loaders. The most common one i always go back to is the ‘barberpole’ – each time trying to fine tune it… create a graphic 4/3rd it’s displayed size, place it at at -1/3, throw a mask around it, script to move it a third and, when reached, push it back a third… but it always seemed so clunky to me. i couldn’t dynamically change the colors of the bands, couldn’t resize it accurately, couldn’t warm up to the idea that there is too much stuff in there. 

With the advent of BitmapData, i decided to take a stab at it programmatically. I’m pretty satisfied with the outcome, although it seems that AS3 BitmapData.scroll is kindof skippish in a browser. I tried to make it fool-proof with speed/size/band settings, but it can get a little screwy if you throw some random numbers in there.

It utilizes the matrix param of the BitmapData.draw method, by copying a ‘banded’ bitmapdata instance and skewing it, then scrolling and fillRect’ing based on a scroll limit.  
In the [link](http://custardbelly.com/blog/insets/ProgressIndicator.html) above you’ll see an example of it, and will no longer have to read my terrible method-to-verb sentence combinations. 

…as they say in these parts… [‘it aint no red ball, but it does me just fine’.](http://www.razorberry.com/blog/archives/2006/05/03/i-was-forced-to-post-this/)

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/), [Flash8](http://custardbelly.com/blog/category/flash8/).
