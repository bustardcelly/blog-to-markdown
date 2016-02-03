---
title: 'as3flobile update: now using as3-signals'
url: 'https://custardbelly.com/blog/2010/10/25/as3flobile-update-now-using-as3-signals/'
author:
  name: 'todd anderson'
date: '2010-10-25'
---

If you have been following/using [as3flobile](http://github.com/bustardcelly/as3flobile), I just recently committed an update for [v0.3 to github](http://github.com/bustardcelly/as3flobile). The new version now utilizes [as3-signals](http://github.com/robertpenner/as3-signals) by **[Robert Penner](http://robertpenner.com/flashblog/)** for assigning delegate handling.

In the previous versions of [as3flobile](http://github.com/bustardcelly/as3flobile), interface delegates were used in order to notify subscribing clients of a change to a control. I knew i did not want to institute event dispatching in [as3flobile](http://github.com/bustardcelly/as3flobile) because it was faster to notify a client through a method than going through an observer. So interface delegates were originally used. In basic terms, each control in [as3flobile](http://github.com/bustardcelly/as3flobile) declared one or more optional delegates whose method(s) would be invoked when a change to the control had occured. As an example, this was the now deprecated **IButtonDelegate**:
    
    public interface IButtonDelegate
    {
    	function buttonTapped( button:Button ):void;
    }

When a client wanted to subscribe as the delegate for a tap gesture on the **Button**, it would point itself as the delegate for the **Button**:
    
    var button:Button = new Button();
    button.delegate = this;
    addChild( button );
     
    public function buttonTapped( button:Button )
    {
    trace( "button tapped: " + button );
    }

I had some issues with this, but i went ahead with that implementation for the first couple versions of [as3flobile](http://github.com/bustardcelly/as3flobile). As far as how this solution stacked up:

**Pros:**  
1. No event system. Faster execution.

**Cons:**  
1. Only one subscribing delegate allowed.  
2. No @optional interface method declarations. A delegate had to strictly adhere to the interface and declare all the methods whether or not it cared to handle them.

So the one **Pro** was good, but the 2nd **Con** really started to bother me. In some cases i started adding multiple delegate properties to a control so they could target different changes to the control. Take for instance a delegate for the scroll of a list and a delegate for the selection of a list. It started to feel cumbersome.

Then last week, i finally decide to see what [as3-signals](http://github.com/robertpenner/as3-signals) was about. Very intuitive and an excellent library. I was impressed and decided that [as3-signals](http://github.com/robertpenner/as3-signals) was a perfect fit for the delegate handling in [as3flobile](http://github.com/robertpenner/as3flobile). So the library has moved to support that. More information is available at [as3flobile on github](http://github.com/robertpenner/as3flobile) and [its wiki](http://github.com/bustardcelly/as3flobile/wiki).

As with every project i create that has a dependency on another library, there are now two flavors of the build: **Standalone** and **External**. The **Standalone** is meant as a standalone library with the parts required of the dependency compiled in. The **External** is solely the [as3flobile](http://github.com/bustardcelly/as3flobile) bits and any personal project using the **External** library will also need to build against the **as3-signals** library. [The as3-signals library can be found on github](http://github.com/robertpenner/as3-signals).

Subsequently, the[ as3flobile-air](http://github.com/bustardcelly/as3flobile-air) and [as3flobile-android](http://github.com/bustardcelly/as3flobile-android) extensions have been updated due to this change.

So, a big change, i know. But I think a step in the right direction. If you are using **as3flobile**, update and let me know how you feel about this change.

**[Robert Penner](http://flashblog.robertpenner.com/)**’s [as3-signals](http://github.com/robertpenner/as3-signals)  
[as3flobile on github](http://github.com/bustardcelly/as3flobile)

Posted in [General](https://custardbelly.com/blog/category/general/).
