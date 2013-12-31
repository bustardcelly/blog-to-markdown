---
title: 'Particle Policies'
url: 'http://custardbelly.com/blog/2006/03/20/particle-policies/'
author:
  name: 'todd anderson'
date: '2006-03-20'
---

[![click me](http://www.custardbelly.com/blog/images/starjumper.gif)](javascript:MM_openBrWindow('http://www.custardbelly.com/blog/insets/strip.html','strip','resizable=no,width=250,height=130');)

Lately i’ve been obsessed with particle systems and developing life and action policies – mainly from [Joa Ebert’s](http://blog.je2050.de/?p=50) discussion of particles in AS3. I was busy having fun watching different effects with a click of the mouse, when i thought it would be a good time to see what part of my code would break if i took away the emission controls from onMouseDown and applied it to a sort of state-conroller of a moving sprite.

If you click on the above pic you’ll see a little test of this. After setting this up i started thinking, what’s stopping me from adding action policies to the sprite, since it’s essentially just a single particle? Have a little registry of actions and replace them based on type and their time limits. I started something along these lines recently, but wasn’t thinking clearly enough on how to set it up… so i ended up re-thinking my ideas of what a user-controlled sprite is, and stripped out a lot off useless code i had around. much happier. Hopefully i’ll get an example up soon of the actions registry i incoherently just mentioned.

* I also wanted to alert anyone who had previously downloaded the [ImagesLoader](http://custardbelly.com/blog/?p=27) classes (the zip there has the updated classes). I made some minor changes to a few of the classes and how things are stored for a strip image.  
_The change_: The way i was cycling through the states was switching copies of a chopped up bitmap – so say if there were seven states of a sprite, i was holding seven different BitmapData objects and switching copies based on the frame count. I decided that that was not the best solution, and switched to holding onto the strip bitmap offscreen and just cycling through Rectangle objects that described the dimension and location of what i wanted to copy from that strip. If you view the movie above, you’ll see what i’m talking about.

..and of course there’s this [awesome news](http://www.dsfanboy.com/2006/03/13/dont-look-at-these-new-super-mario-screenshots/)… might have to actually go and buy a DS.

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flash8](http://custardbelly.com/blog/category/flash8/).
