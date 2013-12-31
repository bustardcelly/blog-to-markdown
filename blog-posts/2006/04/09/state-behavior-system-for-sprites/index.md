---
title: 'State behavior system for sprites'
url: 'http://custardbelly.com/blog/2006/04/09/state-behavior-system-for-sprites/'
author:
  name: 'Administrator'
date: '2006-04-09'
---

[![click me](http://www.custardbelly.com/blog/images/states.gif)](http://www.custardbelly.com/blog/insets/states.html)

Here’s a little example of what i’ve progressed to since i went down the path of changing my thought process of what a user-controlled sprite is.  
Hit the block to produce a bonus ( or the hammer-fountain ) and collect the bonus by running into it. You can become big, a racoon or a frog. When you’re the racoon, once you reach max acceleration, the screen will display “tap spacebar” – tap that spacebar fast and you’ll be able to fly.

What’s happening:  
My implementation of a user-controlled sprite has been reduced to a simple particle with a display movieclip inside and reacts to key controls. Upon pixel collision of a “bonus” not of current sprite type, the display bitmap is updated with a different graphics source, and the sprite model is changed accordingly.  
Each sprite model has a set of behaviors that respond to key controls – and in the case of the racoon, those behaviors are switch out on recognition of maximum acceleration; meaning you can fly if you tap the space bar fast enough once you are at max speed. Another neat thing is that the Fly Behavior is on a timer, so after about 5 seconds, it’s switched back to your previous behavior. The frog is interesting to see the difference in behaviors – when you move left or right, the hop behavior is called, as opposed to the basic roam ( or walk/run ) behavior of the others.

I’m also employing the particle sytem structure i had before, and switch action policies based on whether the sprite is “hurt” or not. A visual clue to let you know that the sprite responds to key controls again is once the stars start falling and turning red.

I think this is going to be the last in my Flash8 experiments of sprites and effects, and start porting what i have over to [AS3](http://labs.macromedia.com/)- cleaning and documenting as i go. Hopefully i’ll have something up soon, but seeing as i’m a newly proud owner of a DS, my productiveness may wane for a bit ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flash8](http://custardbelly.com/blog/category/flash8/).
