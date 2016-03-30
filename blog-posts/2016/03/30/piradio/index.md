---
title: 'Building a Custom PiRate Radio'
author:
  name: 'todd anderson'
date: '2016-03-30'
---
# Introduction
Some time back - and judging from the post date, literally a couple of years ago - I bookmarked a post from [Make:](http://makezine.com/) titled [Raspberry Pirate Radio](http://makezine.com/projects/raspberry-pirate-radio/). I've always been interested in custom radio projects with microcontrollers. I've built various started kits for FM and AM radios to hone my soldering chops, and my favorite radio project so far has been [The Public Radio](http://www.thepublicrad.io/). _I use it daily. Go get one_. In fact, I have a personal radio project that I have been working on for longer back then this post; a bit ambitious for my skill level at the time I started it, but some day I hope to blog about it here...

In any event, I have had [the Pirate Radio post](http://makezine.com/projects/raspberry-pirate-radio/) in the back of my mind for a while, waiting for the resources and time to implement. As of recent, I was able to get it assembled and working and have been very happy! I went a little outside of the steps described here, [http://makezine.com/projects/raspberry-pirate-radio/](http://makezine.com/projects/raspberry-pirate-radio/), and wanted to document what I did in case others are curious.

# Specs
The ending solution has the following specs:

## Hardware
* [Raspberry Pi A+](https://www.raspberrypi.org/products/model-a-plus/)
* [8GB MicroSD Card](http://www.amazon.com/Sandisk-MicroSDHC-Memory-Card-Adapter/dp/B000WH6H1M)
* [Pi Supply Switch](https://www.pi-supply.com/product/pi-supply-raspberry-pi-power-switch/?v=7516fd43adaa)

I could go down to a __Raspberry Pi A__ model and most likely a lower SD Card size if I changed the target OS, but I was using what I already had available to me.

Additionally, the [Pi Supply Switch](https://www.pi-supply.com/product/pi-supply-raspberry-pi-power-switch/?v=7516fd43adaa) is not a real requirement - i just wanted a way to safely shutdown the Pi without have to explicitly _pull the plug_.

## Software
* [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/)
* [ffmpeg](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu)
* [PirateRadio](https://github.com/Make-Magazine/PirateRadio)
* [Pi Supply Soft Shutdown](https://www.pi-supply.com/pi-supply-switch-v1-1-code-examples/?v=7516fd43adaa)

# Raspberry Pi OS Set Up
I used a [Rasbperry Pi B+](https://www.raspberrypi.org/products/model-b-plus/) when setting up the system. Eventually, I moved the SD Card with the necessary software onto a [Raspberry Pi A+](https://www.raspberrypi.org/products/model-a-plus/), but will probably at some point transfer it to a [Raspberry Pi A](https://www.raspberrypi.org/products/model-a/), seeing as the GPIO requirements are a minimum.

The exact model that I used to setup the system is not a requirement. However, I did need something that I could connect an ethernet cable and eventually WiFi dongle to, so that I could SSH into the Pi and install the necessary software and test on; that meant I needed at least:

* an Ethernet port
* 2 USB ports - one for the WiFi dongle, the other for the Flash Drive

I usually have a spare __B__ or __B+__ lying around for such a purpose.

## Raspbian Jessie
In order to get the target OS onto the MicroSD Card, I downloaded an image of [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/) image, plugged my SD Card into [this lovely USB MicroSD Card Writer from adafruit](https://www.adafruit.com/products/939) and followed the graciously provided from [https://github.com/RayViljoen/Raspberry-PI-SD-Installer-OS-X](https://github.com/RayViljoen/Raspberry-PI-SD-Installer-OS-X). _Be sure to heed the warnings!_

## Expand the Filesystem
After flashing the image to the MicroSD card, I inserted into my Pi - for this stage in the project, that was the [Rasbperry Pi B+](https://www.raspberrypi.org/products/model-b-plus/) - and plugged in both an Ethernet chord and the power supply.

_I additionally used a WiFi dongle and setup my WPA configuration so I didn't have to work so close to my router in the living room, but that is not entirely necessary and such instructions will not be included in this article._

After the Pi powered up, I SSH'd into it:

```
$ ssh pi@10.0.0.x
```

_Provide the actually local IP of your Pi in placement of 10.0.0.x. You can use tools such as [Angry Ip Scanner](http://angryip.org/download/#mac) or [Fing](https://itunes.apple.com/us/app/fing-network-scanner/id430921107?mt=8) to find its local IP._

Once logged in, I issued:

```
$ raspi-config
```

From the console prompt GUI, I clicked `Enter/Return` on the entry for _Expand Filesystem_; after which, it asked if I wanted to reboot - I selected `Yes`.

_You can update whichever other configurations you desire, with a recommendation to Change Your User Password._

## Install some required libs
After the PI reboots, SSH back into it and issue:

```
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt-get install git
```

I additionally installed `vim`:

```
$ sudo apt-get install vim
```

but, I have been known to get by with straight `vi` (which does not require any additional installation) if need be :)

