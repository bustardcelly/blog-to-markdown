---
title: 'AS3 LCD Donkee Kong Jr'
url: 'https://custardbelly.com/blog/2006/07/05/as3-lcd-donkee-kong-jr/'
author:
  name: 'Administrator'
date: '2006-07-05'
---

click to play. [Flash Player 9](http://www.adobe.com/products/flashplayer/) required.  
[![click me](http://www.custardbelly.com/blog/images/dkjr.gif)](javascript:MM_openBrWindow('http://www.custardbelly.com/dev/junior/index.html', 'dk_jr','resizable=no,width=340,height=280'))

After i brought those old Game&Watch [handhelds home](https://custardbelly.com/blog/?p=49), i started playing them heavily. After being beat into submission hundreds of times i began thinking ‘these games are too damn hard’ – so i put them down and decided to try and recreate one in [Actionscript3](http://livedocs.macromedia.com/flex/2/langref/index.html)… here’s the first one i came out with – a remake of Donkey Kong Jr from the widescreen [Game&Watch](http://gameandwatch.com/) series.

With the previous games i have worked on, i employed a pixel collision detection system to drive game play- but when thinking about LCD games, spaces on the screen are reserved and there is no real overlap of pixels to detected when an enemy runs into a hero, an enemy connects with a projectile, etc. Instead i had to employ a sort-of ‘mother may i’ management system where a call is made from every ‘object’ prior to it’s bitmap update to see if anything is in between where what block it’s in and what block needs to be rendered next. The development was based mainly on [Passive Matrix LCDs](http://electronics.howstuffworks.com/lcd7.htm). 

Ultimately how it is put together is by loading a graphics sheet with all the states for each ‘player’ and then basing it’s rendered state upon game interaction and a list of state ‘matrices’. On each ‘allowance’ of movement the bitmapdata is cleared and redrawn with a new state. And in the case of the enemies, based on your progression through the game, the ‘allowance’ timing is sped up.

The biggest thing i have gained from working this through is the beauty of the new [Timer class](http://livedocs.macromedia.com/flex/2/langref/index.html). With the introduction of BitmapData in Flash8 As2 i began rethinking how i was developing, and now with the Timer class i’m doing it again. I loved onEnterFrame for so long, but that just wasn’t gonna hack it for this project… and i’m glad it didn’t.

I kept the architecture pretty open for easy adaptation and extension so that i could make more of these LCD games with ease, but i think i have to step away for a bit. Sound would be a good addition to this and i plan to do a little work on that, but i’m getting pretty busy.  
Enough talk, enjoy the game and keep in mind that this is a rough prototype, so you may encounter a bug or two ![;)](https://custardbelly.com/blog/wp-includes/images/smilies/icon_wink.gif)

Posted in [AS3](https://custardbelly.com/blog/category/as3/), [Flash](https://custardbelly.com/blog/category/flash/).
