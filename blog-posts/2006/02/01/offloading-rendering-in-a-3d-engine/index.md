---
title: 'Offloading rendering in a 3d engine'
url: 'https://custardbelly.com/blog/2006/02/01/offloading-rendering-in-a-3d-engine/'
author:
  name: 'todd anderson'
date: '2006-02-01'
---

After reading Keith’s [Making Things Move](http://www.amazon.com/gp/product/1590595181/sr=1-1/qid=1138766400/ref=pd_bbs_1/103-6509034-0931065?%5Fencoding=UTF8), i went on a coding-binge and made a simple 3d engine. I was loving it. went nuts with some extended primitives – still need to get around to the infamous [Utah Teapot](http://www.sjbaker.org/teapot/)… we’ll see how that goes …

But i recently built a particle system engine that handles 3d objects, and after trying to plug it into the pipeline i already created, i started to question where i was passing off the rendering of objects.

The way i have it set up is by registering objects in a World class, in which a new movieclip is created held in an array and, when updates are made to the scene, cleared and redrawn. So i basically offloaded all the drawing within the World class.

[SANDY](http://sandy.media-box.net/blog/) has it set up to clearing all clips, creating new clips within the world, then sending those references off to each face of the object. So inside the Face class all drawing is handled.  
There’s some ideas in that process that i really like (like the fact that the face knows what it’s supposed to look like so it knows internally what to do), but i don’t like that the drawing process is so deeply nested.  
The way i have it, i’m grabbing the skin properties of the faces within the view update of the World class and then drawing accordingly. That’s probably not the greatest idea because i’m adding a couple more processes (”hey what do you look like so i can draw you right.” – as a opposed to – “hey you need to redraw yourself. whatever you look like, do that.”) – but for some reason i just think keeping it out of my Face class makes more sense. Maybe i think it’s a better way of seperating the model construction from the rendering process. i don’t know. 

Now, i’m contemplating where to offload this drawing process. The main reason being filter application when dealing with particles. With the particle system i have set up, i handle transformations and filters of the object in clip in Policy classes, then pass off a check of being active to managers that handle whether or not to render that object.

It brings up an interesting topic for me. When dealing with OOP in Flash, where do you think the drawing process should really be placed? Inside the object that’s being drawn? In some manager that handles all objects being drawn? suggestions? are any of these options more optimal to proccessing?

For fun, here’s a little example of what i’ve been playing around with. It was built in 8 based on the ideas of [Joa Ebert](http://blog.je2050.de/) for his engine in AS3 (if you haven’t been to his blog, i highly recommend it), where Life and Action Policies are wrapped around a 3d object. There’s no Z-buffering or collision-detection yet (because of my aformentioned question), so don’t be too judgemental .

It’s in constant emmision, so when a particle expires, it regenerates itself at the initialization point – optimizations still to be done.

[![click me to view](http://www.custardbelly.com/blog/images/stars.png)](javascript:MM_openBrWindow('insets/psys.html','psystem','resizable=no,width=300,height=288');)

Posted in [General](https://custardbelly.com/blog/category/general/).
