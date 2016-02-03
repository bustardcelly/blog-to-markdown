---
title: 'as3flobile extension: as3flobile-android'
url: 'https://custardbelly.com/blog/2010/10/20/as3flobile-extension-as3flobile-android/'
author:
  name: 'todd anderson'
date: '2010-10-20'
---

I just made an initial commit to [github](http://github.com/bustardcelly/) with an [**as3flobile** library](http://github.com/bustardcelly/as3flobile) extension named [**as3flobile-android**](http://github.com/bustardcelly/as3flobile-android). 

[![as3flobile-android](https://custardbelly.com/blog/images/as3flobile_android.png)](http://github.com/bustardcelly/as3flobile-android)

The intent of **as3flobile-android** is to provide custom skins and controls that target the look-and-feel of the **Android** platform. Currently within the library are graphic assets, custom skins and a few *convenience* controls which are composite controls that extend their **as3flobile** counterpart with the skinning already wired up (take for instance the **AndroidScrollList** which extends **ScrollList** to provide custom item renderers and skins that have the look-and-feel of the Android list – also has the precense of scrollbars on scroll behaviour!).

Now, it should be said, i didn’t go all out and study/push every pixel to make the skins look *exactly* like **Android**. I just cut some graphics from a PSD and applied them in the skins. This is a project (of many) that i do on my spare time and if/when i do need to have themed rolled in for a paying client, i am sure a designer wold be breathing down my neck ![:)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif) That said, If at the very least, it will provide an example to anyone who is interested applying custom skins to **as3flobile** components. 

It should be noted (as it also is in the **README** markdown for the** as3flobile-android** repository) that I cut the graphics from a PSD made available by **Pavel Macek**. That PSD can be found at [http://www.matcheck.cz/androidguipsd/](http://www.matcheck.cz/androidguipsd/) so check it out. The library also includes the **ScaleBitmap** from [bytearray.org](http://www.bytearray.org), available at [http://www.bytearray.org/?p=118](http://www.bytearray.org/?p=118) and is pretty awesome. I made a slight modification to the source in order to re-use graphics in the skins (details can be found in the **CHANGES** document) so i could not have it external and compiles against.

There are a few more custom controls targeting the Android platform that i have yet to check in as i would like to drum up some examples before then. These include things like a **ContextMenu**, **AlertDialog**, **TitleBar**, etc. And most likely the **Menu** control from as3flobile will be moved to **[as3flobile-android](http://github.com/bustardcelly/as3flobile-android)** as it really is Android specific… so look out for that.

Criticism and feedback is always welcome.

Posted in [Android](https://custardbelly.com/blog/category/android/), [Flash](https://custardbelly.com/blog/category/flash/), [as3flobile](https://custardbelly.com/blog/category/as3flobile/), [as3flobile-android](https://custardbelly.com/blog/category/as3flobile-android/).
