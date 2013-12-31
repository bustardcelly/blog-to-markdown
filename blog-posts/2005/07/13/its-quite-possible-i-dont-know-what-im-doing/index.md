# [it’s quite possible i don’t know what i’m doing](http://custardbelly.com/blog/2005/07/13/its-quite-possible-i-dont-know-what-im-doing/)

i have been testing out my old stuff with the [player 8 beta](http://www.macromedia.com/software/flashplayer/public_beta/). i thought i’d dig around for some poorly coded fractal trials i was heavily into back in the winter when i was addicted to [paul bourke’s](http://astronomy.swin.edu.au/~pbourke/fractals/) work.

these were swfs i made that mostly give me that alert of how my movie is running slow and whether or not i would like to stop running it.

eventually i cleaned them up enough so that it hangs roughly right before i get that alert, but still i would have to wait @ 10 seconds before anything happened.

i was very pleased when i pushed them through 8 and cut my time in more than half… until i got to my mandelbrot swf- it wouldn’t even start iterating.  
so i poked around, set intervals, tried to fill in textboxes with the current iteration- still nothing.

then i went down to the line that started it all…

**onLoad = startMandelbrot;  
//where startManelbrot is a function that does the iteration**

don’t ask me why i used an onLoad for the timeline, i think i picked it from somewhere.  
with this using player 7, what it did was allow the swf to appear in the browser before it did any work. taking this out and replacing it with just** startMandelbrot();** would leave the browser comletely empty until it ran through the iteration.  
with player 8, however, **onLoad **was never triggered. 

now, it could be the case that i never should have done that in the first place ( i certainly haven’t done something like that in a while ), but i wonder why it worked using player 7 and not using player 8.

Posted in [Flash](http://custardbelly.com/blog/category/flash/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – July 13, 2005
  *[July 13, 2005]: 2005-07-13T10:40
