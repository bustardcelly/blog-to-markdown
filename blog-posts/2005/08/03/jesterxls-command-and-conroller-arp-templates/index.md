---
title: 'JesterXL’s Command and Controller ARP Templates'
url: 'https://custardbelly.com/blog/2005/08/03/jesterxls-command-and-conroller-arp-templates/'
author:
  name: 'todd anderson'
date: '2005-08-03'
---

[JesterXL has posted about his modification](http://www.jessewarden.com/archives/2005/08/arp_labs_upload.html) to the [ARP framework](http://osflash.org/doku.php?id=arp) involving the CommandTemplate and the ControllerTemplate allowing arguments to be passed using a runCommand function instead of the dispatchEvent, and i couldn’t be happier.  
I use the ARP framework at work and have often wanted to pass arguments along to commands, mainly because i would want to run the same command from different instances but sometimes alert the user of success or fail and other times not- don’t ask me why- but, also so i didn’t have to keep creating public vars and functions in the main class to grab something i didn’t think needed to be held by it.  
I had started trying to work on putting this together, but work got back up and projects needed to be escorted out the door… so… thanks Jesse!

Posted in [Flash](https://custardbelly.com/blog/category/flash/).
