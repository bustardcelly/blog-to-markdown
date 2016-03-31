---
title: 'Building a Custom PiRate Radio'
author:
  name: 'todd anderson'
date: '2016-03-30'
---
# Introduction
Some time back - and judging from the post date, literally a couple of years ago - I bookmarked a post from [Make:](http://makezine.com/) titled [Raspberry Pirate Radio](http://makezine.com/projects/raspberry-pirate-radio/). I've always been interested in custom radio projects with microcontrollers. I've built various started kits for FM and AM radios to hone my soldering chops, and my favorite radio project so far has been [The Public Radio](http://www.thepublicrad.io/). _I use it daily. Go get one_. In fact, I have a personal radio project that I have been working on for longer back then the mentioned post; a bit ambitious for my skill level at the time I started it, but some day I hope to blog about it here...

In any event, I have had [the Pirate Radio post](http://makezine.com/projects/raspberry-pirate-radio/) in the back of my mind for a while, waiting for the resources and time to implement. As of recent, I was able to get it assembled and working and have been very happy! I went a little outside of the steps described here, [http://makezine.com/projects/raspberry-pirate-radio/](http://makezine.com/projects/raspberry-pirate-radio/) - more specifically, not using the image they created and manually setting up my system - and wanted to document what I did in case others are curious.

# Specs
The ending solution has the following specs:

## Hardware
* [Raspberry Pi A+](https://www.raspberrypi.org/products/model-a-plus/)
* [8GB MicroSD Card](http://www.amazon.com/Sandisk-MicroSDHC-Memory-Card-Adapter/dp/B000WH6H1M)
* [Pi Supply Switch](https://www.pi-supply.com/product/pi-supply-raspberry-pi-power-switch/?v=7516fd43adaa)

I could go down to a __Raspberry Pi A__ model and most likely a lower SD Card size if I changed the target OS, but I was using what I already had available to me.

Additionally, the [Pi Supply Switch](https://www.pi-supply.com/product/pi-supply-raspberry-pi-power-switch/?v=7516fd43adaa) is not a requirement - I just wanted a way to safely shutdown the Pi without have to explicitly _pull the plug_.

## Software
* [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/)
* [ffmpeg](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu)
* [PiFM](http://www.icrobotics.co.uk/wiki/index.php/Turning_the_Raspberry_Pi_Into_an_FM_Transmitter) _(included in the [PirateRadio Gtihub repository](https://github.com/Make-Magazine/PirateRadio/blob/master/PirateRadio.py))_.
* [PirateRadio](https://github.com/Make-Magazine/PirateRadio/blob/master/PirateRadio.py)
* [Pi Supply Soft Shutdown](https://www.pi-supply.com/pi-supply-switch-v1-1-code-examples/?v=7516fd43adaa)

# Raspberry Pi OS Set Up
I used a [Rasbperry Pi B+](https://www.raspberrypi.org/products/model-b-plus/) when setting up the system. Eventually, I moved the SD Card with the necessary software onto a [Raspberry Pi A+](https://www.raspberrypi.org/products/model-a-plus/), but will probably at some point transfer it to a [Raspberry Pi A](https://www.raspberrypi.org/products/model-a/), seeing as the GPIO requirements are a minimum; pin *4* is used for the antenna and pins *7* &amp; *8* are used for the Pi Supply shutdown.

The exact Pi model that I used to setup the system is not a requirement. However, I did need something that I could connect an ethernet cable - and eventually a WiFi dongle - to, so that I could SSH into the Pi and install the necessary software and test; that meant I needed at least the following on the board:

* An Ethernet port
* 2 USB ports - one for the WiFi dongle, the other for the Flash Drive

I usually have a spare __B__ or __B+__ lying around for such a purpose.

## Raspbian Jessie
In order to get the target OS onto the MicroSD Card, I downloaded an image of [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/) image, plugged my SD Card into [this lovely USB MicroSD Card Writer from adafruit](https://www.adafruit.com/products/939) and followed the graciously provided script from [https://github.com/RayViljoen/Raspberry-PI-SD-Installer-OS-X](https://github.com/RayViljoen/Raspberry-PI-SD-Installer-OS-X). _Be sure to heed the warnings!_

## Expand the Filesystem
After flashing the image to the MicroSD card, I inserted into my Pi - for this stage in the project, that was the [Rasbperry Pi B+](https://www.raspberrypi.org/products/model-b-plus/) - and plugged in both an Ethernet chord and the power supply.

_I additionally used a WiFi dongle and setup my WPA configuration so I didn't have to work so close to my router in the living room, but that is not entirely necessary and such instructions will not be included in this article._

After the Pi powered up, I SSH'd into it:

```
$ ssh pi@10.0.0.x
```

_Provide the actually local IP of your Pi in placement of `10.0.0.x`. You can use tools such as [Angry Ip Scanner](http://angryip.org/download/#mac) or [Fing](https://itunes.apple.com/us/app/fing-network-scanner/id430921107?mt=8) to find its local IP on your network._

Once logged in, I issued:

```
$ raspi-config
```

From the console prompt GUI, I clicked `Enter/Return` on the entry for _Expand Filesystem_; after which, it asked if I wanted to reboot - I selected `Yes`.

_You can update whichever other configurations you desire, with a recommendation to `Change Your User Password`._

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

# FFMPEG
The next thing to do is to build and install [ffmpeg](https://trac.ffmpeg.org). If you are unware of __ffmpeg__, it is software that allows for - among other things - playback of audio and video. It is the basis of playback for [PiFM](http://www.icrobotics.co.uk/wiki/index.php/Turning_the_Raspberry_Pi_Into_an_FM_Transmitter) which is the C library that is run by the [PirateRadio](https://github.com/Make-Magazine/PirateRadio/blob/master/PirateRadio.py) python script.

I followed the following guide from FFMPEG regarding installation on Ubuntu: [https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu), knowing I was only concerned with the following assemblers and codecs:

* YASM
* libfdk-aac
* libmp3lame

## Building and Installing
SSH into the Pi and issue:

```
$ sudo apt-get -y --force-yes install autoconf automake build-essential libass-dev libfreetype6-dev \
  libsdl1.2-dev libtheora-dev libtool libva-dev libvdpau-dev libvorbis-dev libxcb1-dev libxcb-shm0-dev \
  libxcb-xfixes0-dev pkg-config texinfo zlib1g-dev

$ mkdir ~/ffmpeg_sources
$ mkdir ~/ffmpeg_build

$ cd /usr/src
$ sudo git clone git://source.ffmpeg.org/ffmpeg.git
$ cd ffmpeg
$ sudo ./configure --prefix="$HOME/ffmpeg_build" --pkg-config-flags="--static" --extra-cflags="-I$HOME/ffmpeg_build/include" --extra-ldflags="-L$HOME/ffmpeg_build/lib" --arch=armel --target-os=linux --enable-gpl --enable-libmp3lame --enable-libfdk-aac --enable-nonfree

$ sudo make
$ sudo make install
```

Essentially, we are getting the required dependencies, setting up and defining the `source` and `build` directories for our custom FFMPEG install, and then building and installing it.

Once complete, __and it will take a long while - few hours for me__, you'll need to update the `PATH` environment variable to include the new FFMPEG install:

```
$ vim ~/.profile
```

Add:

```
PATH=$PATH:/home/pi/ffmpeg_build/bin
```

Then source:

```
$ source ~/.profile
```

Additionally, you will want to symlink to the `usr/bin` directory:

```
$ sudo ln -s /home/pi/ffmpeg_build/bin/ffmpeg /usr/bin/ffmpeg
```
