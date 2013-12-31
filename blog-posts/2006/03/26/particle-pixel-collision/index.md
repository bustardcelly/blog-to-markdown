---
title: 'Particle Pixel Collision'
url: 'http://custardbelly.com/blog/2006/03/26/particle-pixel-collision/'
author:
  name: 'todd anderson'
date: '2006-03-26'
---

[![click me](http://www.custardbelly.com/blog/images/ring.gif)](javascript:MM_openBrWindow('http://www.custardbelly.com/blog/insets/ppColl.html','strip','resizable=no,width=250,height=130');)

Well, i said i was gonna get into switching action policies for the user-controlled sprite, but i thought it might be cool if i gave a visual clue if the sprite was disabled ( unable to switch actions ). Then i thought, ‘What better clue than a ring of stars around its head?’. Created a rotating-ring particle system. Done…  
Damn… It rotates, but not around the sprite. I’ve been placing particle systems in their own movieclip – somtimes behind, sometimes atop the sprite… I wasn’t rendering everything in a ‘world’ view with z-buffering, because everything was 2d and i thought ‘…just layer it, jerk’. i still do.

Let’s see… do i throw a particle system in with the sprite class and swap depths based on z position of particles? No i just want a sprite to be a sprite and not worry about managing anything. Should i have a special particle system that sandwiches movieclips around the emission node, then create and dipose based on z-position? Now with AS3, i could fashion something like that because of the DisplayList ( as [Sam](http://blog.pixelconsumption.com/) so [eloquiantly showed](http://www.bfpug.com/?p=19)… though i he didn’t strip off an article clothing after every audience question – which was promised ), but in AS2 that would just be too confusing.

So i went back to my [PixelCollision class](http://custardbelly.com/blog/?p=28) and decided to poke around. Well, i did… and royally screwed up that code (that’s what svn is for!), but came out with a nice solution for replacing pixels in one bitmapdata object based on non-alpha collisions.

In the movie link above you can see what’s happening (well kind of, i made it too small i think). It’s actually a rotating-ring system in a layer above the sprite, and it’s applying alpha transparency to the stars based on collision – and/or also pixel replacement of sprite if you click on the stage (that’s my favorite part). It’s a shame it gets a little skippish in a browser, i’ll have to do a little cleaning and see what happens.

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flash8](http://custardbelly.com/blog/category/flash8/).
