---
title: 'flood-pi: Flood detection on Raspberry Pi'
author:
  name: 'todd anderson'
date: '2014-12-04'
---
A lot has happened over the course current year. Among the biggest changes, we left Boston for Vermont! We have begun to settle in here in the beatuiful Champlain Valley and, of course, my oldest is enrolled in hockey lessons - a sport i know very little about, but am excited to learn from him.

As is expected from a big move, we have found outselves in different surroundings and different living spaces. We are no longer 4 people cramped in a tiny 2-bedroom condo along the train line in Brighton, MA; we are now 4 people in a ranch house with noone above or below us to complain about taking off their loud shoes when the baby is sleeping. 

While the extra space of a house is wonderful, tit comes with additional maintenance and care over renting an apartment. For instance, we never had a basement in our previous apartments and never had to worry about flooding or failures in a sump pump. Now we do. And we have had a handful of instances when it has occurred. While it is true that we have and will continue to have qualified people locate the source of the problem, I thought - in the meantime - it would be a fun little project to setup something that could alert me to possible water starting to accumulate in the basement.

![a flood!](http://custardbelly.com/images/flood_pi_flood.jpg)

And from that [flood-pi](https://github.com/bustardcelly/flood-pi) was born!

## flood-pi
__flood-pi__ is an open source Python project meant to be run on a [Raspberry Pi](http://www.raspberrypi.org/). The Github repo for [flood-pi](https://github.com/bustardcelly/flood-pi) has some more technical details, but essential __flood-pi__ detects a "flood" by reading an analog value from a circuit completed by water.

The basic premise is that two leads with copper plates at the end (originally nails in my prototype) are set level to the floor of the basement and spaced about a inch apart from each other. One lead is connected to the power while the other lead is connected to the between the first pin of the mcp3008 and the ground. As water comes between the leads (most likely from the start of a flood), the circuit is complete and a reading from 0 to 1024 is read through the ADC. Some low values may come in but should be considered not a "positive" detection. As well, some high values may come in which typically means that somehow the leads started touching each other and be considered not a "positive" detection, either. In correlation to the distance between the leads, there is a middleground of values that would be considered a "positive" detection.

When a "positive" detection occurs, __flood-pi__ then sends out an email to alert me. Then I can take appropriate action.

_There is no analog in on [Raspberry Pi](http://www.raspberrypi.org/), but i have set up projects reading potentiometers using the [mcp3008 as described here on adafruit](https://learn.adafruit.com/reading-a-analog-in-and-controlling-audio-volume-with-the-raspberry-pi), so I knew i could use that setup for this project._

### project
Here's some pictures of the project:

The leads.

![leads](http://custardbelly.com/images/flood_pi_leads.jpg)

[Raspberry Pi](http://www.raspberrypi.org/), running [Debian-Wheezy](http://www.raspberrypi.org/downloads/) with the [flood-pi](https://github.com/bustardcelly/flood-pi) program running as a daemon. [Edimax WiFi adapter](http://www.edimax.com/edimax/merchandise/merchandise_detail/data/edimax/global/wireless_adapters_n150/ew-7811un) for the interweb-bings and email-ery.

![pi](http://custardbelly.com/images/flood_pi_rasp.jpg)

The mcp3008 on its own breakout. (__i soldered it up all by myself!__)

![mcp3008](http://custardbelly.com/images/flood_pi_mcp3008.jpg)

### installation
Here's some pictures of its installation in the basement:

![full install](http://custardbelly.com/images/flood_pi_install3.jpg)

![module install](http://custardbelly.com/images/flood_pi_install1.jpg)

![lead install](http://custardbelly.com/images/flood_pi_install2.jpg)

We, thankfully, haven't been able to get a _true_ "positive" reading since its installation, but I have submersed the leads in water for a short time to ensure i was being sent emails :)

## flood-pi-admin
I couldn't just stop at getting emails. I am empoyed as a software developer by trade, so I _had_ to keep writing software.

I wanted to aggregate the readings from [flood-pi](https://github.com/bustardcelly/flood-pi) and get an overview of its workings (or failure of workings if it may come to that). I don't know if there could be any patterns found from the data as to when the sump pump fails or whatnot, but more data can't hurt, can it?

As such, [flood-pi-admin](https://github.com/bustardcelly/flood-pi-admin) was born!

### about flood-pi-admin
[flood-pi-admin](https://github.com/bustardcelly/flood-pi-admin) is a NodeJS-based server that provides a RESTful API for POSTing and accessing daatbeing reported by [flood-pi](https://github.com/bustardcelly/flood-pi). There is more detailed information on the [Github repo for the project](https://github.com/bustardcelly/flood-pi-admin), but it has endpoints for the __flood-pi__ detector to post confiuguration and reading data as well as two main routes for accessing information about past and current conditions. 

__It's pretty bare-bones at the moment, but i plan to add new features as they are required (or requested).__

### charts
The landing page and _/level?range=(day|week|year|all)_ provide chart data with the level readings:

![chart data](http://custardbelly.com/images/flood_pi_chart.png)

The red band across the middle of the chart is the "positive" value range provided from the __flood-pi__ and should be considered possible flood detection. As mentioned previously, lower values may come in but not high enough to be considered "positive"; additionally, high values may come in which may actually mean that the leads have somehow started touching each other rather than completing the circuit with water.

### isitflooded
There is also a direct page at _/isitflooded_ that will let you know if it is currently considered flooded or not:

![current detection](http://custardbelly.com/images/flood_pi_no.png)

It also reports last reporting time and whether or not it should alert you to the [flood-pi](https://github.com/bustardcelly/flood-pi) no longer reporting information.

## conclusion
I had a lot of fun taking a small idea of being notified the nextr time their is water in the basement and transferring it to an actual physical devices that can send out emails upon completion of a circuit. Plus, i got better at soldering - i know the ADC breakout is a small assembly, but it made me happy the way it turned out.

If you have occasional water in your basement and have an interest in [Raspberry Pi](http://www.raspberrypi.org/), i hope you check out the [flood-pi](https://github.com/bustardcelly/flood-pi) program and install it. And if you have yourself a VPS, feel free to also setup the [flood-pi-admin](https://github.com/bustardcelly/flood-pi-admin) on it to access level reading data.

Now, onto the next little pet project i have in mind:)

Cheers!
