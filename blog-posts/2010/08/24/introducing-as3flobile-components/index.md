---
title: 'Introducing as3flobile components'
url: 'https://custardbelly.com/blog/2010/08/24/introducing-as3flobile-components/'
author:
  name: 'todd anderson'
date: '2010-08-24'
---

_The library is available on github at [bustardcelly/as3flobile](http://github.com/bustardcelly/as3flobile). You can read more detailed information on [the wiki](http://wiki.github.com/bustardcelly/as3flobile/). You can also look at the [online docs](http://www.custardbelly.com/android/froyo/as3flobile/docs/). Continue reading if you enjoy rambling explanations._

As per usual, i had started a personal project that focused on refining parts of an old application and ended up creating a new library. This time, that application was going to get a face lift as i tried to port some code over to **AS3**-only views with the goal of targeting **Android** devices. What seemed like a little side project turned into a fun, can’t-stop-thinking-about suite of custom **ActionScript 3** components.

You can view the components here: [http://www.custardbelly.com/android/froyo/as3flobile/](http://www.custardbelly.com/android/froyo/as3flobile/). If you have a Flash-enabled device, please check them out and let me know how they run. I have only really tested on my Nexus 1.

[![as3flobile components](http://www.custardbelly.com/blog/images/as3flobile.jpg)](http://www.custardbelly.com/android/froyo/as3flobile/)

A full list of the current components is available on the [project’s wiki](http://wiki.github.com/bustardcelly/as3flobile/) in [github](http://github.com/bustardcelly/as3flobile). The main intent of creating these controls was to start thinking about user gesture as recognition and navigation within a control. My first task was to forget about scrollbars. They have essentially become useless on touch-devices in the context of navigating through content of a defined area. Though **as3flobile** does provide scrollbars in a sense (they are called **Sliders**) they are meant for selecting a value within a range, not as a handrail to hold onto to traverse items in a list. As a visual clue, the scrollbar still makes sense. As a user-input model, it is slowly not.

In any event, scrolling was the first gesture tackled. So I mainly started out making a **ScrollViewport** and then went crazy making all these other controls i know i would need _**if i ever got back to the original task at hand**_ ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) I could talk more in depth on how i tackled scrolling and how i kept the API open for you to create your own scrolling contexts and plug them in in later posts if you’d like.

There is some tap recognition, such as when selecting a list item or a **RadioButton**, but most of the focus is on swipe gesture for scrolling. I would like to start diving into other gestures (ie. zoom) which would probably make me rethink the architecture of a custom component for a touch-device, not only in its gesture recognition but also how you interact to access information. For instance, does a drop down really make any sense any more? (though there is a **DropDown** in **as3flobile**) I don’t know if i am the only one, but it really feels antiquated to me. I wonder if there will come a time when we are old and we look at old pictures of the online forms we used to fill out with there funny old clunky controls… how much time was wasted.

_**You keep talking, but can you skin them?**_

Yes, you can skin them. There really isn’t a skinning architecture in **as3flobile** per se. Any control that is a subclass of **AS3FlobileComponent** (which all the controls in the library currently are) can accept an **ISkin** and can maintain a state related to or rather accessible by an **ISkin**. Furthermore, the assignment, targeting and update to the skins is handled within **AS3FlobileComponent** with protected hook-ins you can override if seen fit. 

However, if you look at the default skins within **as3flobile**, in **com.custardbelly.as3flobile.skins.***, you’ll see that the **ISkin** implementations actually reference their target controls directly to access the graphic displays needed for custom skinning. I figured there was no reason to add extra overhead by creating interfaces for a control strictly for skinning purposes. If you create a custom skin for a control, it is assumed you know what the control needs to look like; so access it directly. Though the **target** property of **ISkin** is **ISkinnable** (which **AS3FlobileComponent** implements), the target is most times cast to the specific control that is being skinned. If people are really interested in these components and curious as to how to skin them, i can definitely fire up some more posts on that.

In any event, i hope you check out the **as3flobile** [project in github](http://wiki.github.com/bustardcelly/as3flobile/) and/or [get down to business as Gary always seems to do](http://30.media.tumblr.com/tumblr_l7foigmQIN1qzzw5do1_500.jpg). If you do check out the **as3flobile** project, suggestions, comments and questions are always appreciated. I am sure there are some bugs and some aspects of the controls that i just didn’t think of that may be needed.

Posted in [AS3](https://custardbelly.com/blog/category/as3/), [Android](https://custardbelly.com/blog/category/android/), [Flash](https://custardbelly.com/blog/category/flash/), [as3flobile](https://custardbelly.com/blog/category/as3flobile/).
