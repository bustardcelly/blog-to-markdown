---
title: 'Building a Custom PiRate Radio'
author:
  name: 'todd anderson'
date: '2016-03-30'
---
# Introduction
Some time back - and judging from the post date, literally a couple of years ago - I bookmarked a post from [Make:](http://makezine.com/) titled [Raspberry Pirate Radio](http://makezine.com/projects/raspberry-pirate-radio/). I've always been interested in custom radio projects with microcontrollers. I've built various started kits for FM and AM radios to hone my soldering chops, and my favorite radio project so far has been [The Public Radio](http://www.thepublicrad.io/). _I use it daily. Go get one_. In fact, I have a personal radio project that I have been working on for longer back then the mentioned post; a bit ambitious for my skill level at the time I started it, but some day I hope to blog about it here...

In any event, I have had [the Pirate Radio post](http://makezine.com/projects/raspberry-pirate-radio/) in the back of my mind for a while, waiting for the resources and time to implement. As of recent, I was able to get it assembled and working and have been very happy! I went a little outside of the steps described here, [http://makezine.com/projects/raspberry-pirate-radio/](http://makezine.com/projects/raspberry-pirate-radio/) - more specifically, not using the image they created and manually setting up my system - and wanted to document what I did in case others are curious.

<iframe width="420" height="315" src="https://www.youtube.com/embed/aBu2tyXOWnU" frameborder="0" allowfullscreen></iframe>

_I like my old school rap. I apologize to Mr. Ness; there was no offense, just showing off the band change..._

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

## Checking

To test that __ffmpeg__ is available form the command line, do a quick test to find its location:

```
which ffmpeg
```

If a path to your install or symlink directory is printed in the console, you are good to proceed.

# PirateRadio
Now it is time to grab and update the [PirateRadio](https://github.com/Make-Magazine/PirateRadio) script.


## Cloning
I cloned and modified it in the `/opt` directory, but you can place it wherever you prefer - just note that the startup script will point to the `/opt` location when we arrive to that section.

```
$ cd /opt
$ sudo mkdir pirateradio
$ sudo chown -R pi:pi pirateradio

$ cd /opt/pirateradio
$ git clone https://github.com/Make-Magazine/PirateRadio.git .
```

## Modifying
Once `clone`'d, modify a few lines of the __PirateRadio.py__ file to conform to our current setup:

```
$ vim PirateRadio.py
```

Modify the following variable declaration to point to the `pirateradio.conf` of the current directory:

```
config_location = "/opt/pirateradio/pirateradio.conf"
```

Modify the _uncommented_ __fm_process__ defined to point to the relative __pifm__ library:

```
fm_process = subprocess.Popen(["./pifm","-",str(frequency),"44100", "stereo" if play_stereo else "mono"], stdin=music_pipe_r, stdout=dev_null)
```

Additionally, I had to __remove all additional `fallback=x` arguments__.

## Configuration Update
Now that we modified the location that the [PirateRadio](https://github.com/Make-Magazine/PirateRadio) script is looking for the configuration, we need to update the configuration to look for the appropriate target directory for music files to access and play.

```
$ vim pirateradio.conf
```

Modify the following line:

```
music_dir = /media/pi
```

Because we installed [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/), we know that any USB drive installed into a USB port will auto-mount `dev/sda1` to `/media/pi`. I additionally, loaded a USB stick with audio files and optionally names the stick `RADIOPI` - so I extended the `music_dir` configuraation property as such:

```
music_dir = /media/pi/RADIOPI
```

As mentioned before, with [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/) installed, the USB stick will be auto-mounted if plugged in to a port prior to provided power supply to the board.

# [OPTIONAL] Pi Supply Soft Shutdown
I also added a [Pi Supply Switch](https://www.pi-supply.com/product/pi-supply-raspberry-pi-power-switch/?v=7516fd43adaa) to my board.

This is optional, but it allows for shutdown without having to explicitly pull the power supply from my board when I no longer wanted it to run. Something I was interested in with regards to corrupting the mounted USB, and also because I wanted to try it out :) _As a side note, I have been pretty happy and would recommend it - only complaints are that it is a bit "bulky"_.

If you decide to add a [Pi Supply Switch](https://www.pi-supply.com/product/pi-supply-raspberry-pi-power-switch/?v=7516fd43adaa) as well, follow the instructions from their site - [https://www.pi-supply.com/pi-supply-switch-v1-1-code-examples/?v=7516fd43adaa](https://www.pi-supply.com/pi-supply-switch-v1-1-code-examples/?v=7516fd43adaa) - by adding the "soft shutdown" script to your system and follow this instructions to add it to the `/etc/rc.local` script.

# Adding to Startup
Add the script to start-up the Pi so that, whenever power is supplied, the broadcast will kick off and be picked up the default __88.9__ band by a radio reciever.

Add it to `init.d`:

```
$ cd /etc/init.d
$ sudo touch pirateradio
$ sudo chmod +x pirateradio
$ sudo vim pirateradio
```

Paste in the following to `/etc/init.d/pirateradio`:

```
#! /bin/sh
# /etc/init.d/pirateradio

### BEGIN INIT INFO
# Provides:          pirateradio
# Required-Start:    $network
# Required-Stop:     $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start PirateRadio at boot
# Description:       PirateRadio script will start / stop a program a boot / shutdown.
### END INIT INFO

case "$1" in
  start)
    echo "Starting PirateRadio"
    mount /dev/sda1 /media/pi/RADIOPI/
    cd /opt/pirateradio
    python PirateRadio.py &>/dev/null
    ;;
  stop)
    echo "Stopping PirateRadio"
    umount /dev/sda1
    kill `pgrep -f ffmpeg\(.*\)\/pi`
    kill `pgrep -f pifm`
    ;;
  *)
    echo "Usage: /etc/init.d/pirateradio {start|stop}"
    exit 1
    ;;
esac

exit 0
```

Then save and add to start-up:

```
$ sudo update-rc.d pirateradio defaults
$ sudo /etc/init.d/pirateradio start
```

## Reboot
At this point, you could reboot:

```
$ sudo shutdown -r now
```

And once the Pi is up again, and the USB stick has been pointed and the startup script run (takes about 5 - 10 seconds for me):

1. Find your favorate radio reciever (for FM frequencies)
2. Tune the radio to __88.9__
3. Get down to your favorite tunes!

### Additional Note
If you used and setup the [Pi Supply Shutdown](https://www.pi-supply.com/pi-supply-switch-v1-1-code-examples/?v=7516fd43adaa) you won't need to unplug and plug back in the power supply to the Pi when deciding to stop broadcasting music from the USB stick on your PI to the FM frequency - just simply press the soft or hard shutdown buttons.

# Conclusion
I had a lot of fun building this custom "local" radio station based off the [Raspberry Pirate Radio](http://makezine.com/projects/raspberry-pirate-radio/) post from a few years back. With a little customization, I was able to set it up the way I wanted while incorporating the [Pi Supply Shutdown](https://www.pi-supply.com/pi-supply-switch-v1-1-code-examples/?v=7516fd43adaa) peripheral.

I love music and talk radio and this project was just a continuation of different presentations of which I can access - and, dare I say, harness - that fascination. Hopefully, I will one day finish my one long standing project and have that posted up here as well :) Time will tell.

Until then, I submit to you this admission:
<iframe width="420" height="315" src="https://www.youtube.com/embed/A8HT4kkBjD8" frameborder="0" allowfullscreen></iframe>
