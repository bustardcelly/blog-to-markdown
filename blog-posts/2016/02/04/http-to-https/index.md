---
title: 'Getting Secure:  Transfering a domain to AWS and enabling HTTPS under nginx'
author:
  name: 'todd anderson'
date: '2016-02-04'
---
# Introduction
I recently decided to put this site under HTTPS after reading this article/interview with [Anselm Hannemann](https://helloanselm.com/) on __CSS-Tricks__:

&gt; [https://css-tricks.com/interview-web-security/](https://css-tricks.com/interview-web-security/)

I had already been interested in moving to HTTPS with the advent of an open Certificate Authority, [Let's Encrypt](https://letsencrypt.org/), and my growing fascination with [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), which will only work under HTTPS. Not sure if I would ever have a need for offline support for this site, but it never could hurt to mess around.

In any event, I had decided it was time to explore putting [custardbelly.com](https://www.custardbelly.com/blog) under HTTPS - please don't poke around, it needs a major update - and as I went about trying to set [Let's Encrypt](https://letsencrypt.org/) up on my current (_now old_) VPS host I was running into road blocks of predetermined OS'es and dependencies that were beyond my control, which can happen if you entrust hosting your domains through a general VPS provider.

To have more control over my environment, I decided to use the Amazon Web Services (__AWS__) knowledge I have gained from working intimately with it in my current job/role and spin up an EC2 instance to dedicate to my site - moving it off the VPS I previously had.

In doing so, I wanted to share my process and experiences to any of you that may be wondering how to do the same. As the title suggests but does not entirely convey, my process involved:

* [Moving a domain to an EC2 instance](#moving-a-domain-to-an-ec2-instance)
* [Transferring DNS records from a VPS to Amazon Route 53](#transferring-dns-records)
* [Setting up nginx to serve my site](#setting-up-nginx)
* Generating certificates from [Let's Encrypt](https://letsencrypt.org/)
* Setting up my site to be served under HTTPS
* References

---

# Moving a Domain to an EC2 Instance
This series of steps is essentially moving any files served by my previous VPS host to an EC2 instance on AWS. Because the site and its blog are all static files, it was a simple matter of moving - or rather pulling - my files to a new server.

## Setting up an EC2 Instance
If you don't already have an Amazon Web Services (AWS) account, you can sign up for one here: [https://aws.amazon.com/](https://aws.amazon.com/).

> I wont go into any detail about what AWS is, how to set up an account and the pricing models, so please review all documentation if you are curious.

Once you have signed in:
1. Navigate to the __Compute:EC2__ space
2. Once the _EC2 Dashboard_ select __Launch Instance__
    <img src="https://www.custardbelly.com/images/https_ec2_launch_instance.png" alt="EC2 Launch Instance">
3. Select the __Ubuntu Server 14.04 LTS (HVM)__ instance from the list of AMIs
4. Choose the __t2.micro__ item from the _Instance Type_ selection screen
5. Click __Next: Configure Instance Details__
6. Leave the default form entries and click __Next: Add Storage__
7. Leave the default form entries and click __Next: Tag Instance__
8. From the _Key/Value_ form, enter in the name related to your site into the __Value__ field. In my case, I entered `custardbelly.com`, but it does not have to specifically be your domain name.
9. Click __Next: Configure Security Group__
10. Under _Assign a security group_, select __Create new security group__
    * You will need to create security group with - at least - the following ports available: `22`, `80`, `443`
11. Use the __Add Rule__ button to add protocol types and ports
    <img src="https://www.custardbelly.com/images/https_security_group.png" alt="EC2 Security Groups">
12. Click __Review and Launch__
13. On the next page, accept the review and click __Launch__
14. If you do not already have a key pair on your system through your AWS account that you want to associated with your site, then __Create a new key pair__; otherwise, __Choose an existin key pair__.

Once accepting the license agreement, you should be redirected to the _EC2 Dashboard:Instances_ page and see your new instance listed - most likely spinning up with an _Initializing..._ note.

We'll wait until that is finished initializing before SSH'ing into it, but before we do that, we can assign an Elastic IP to the instance so that the IP is not potentially change by AWS at any time.

## Defining an Elastic IP
By associating an Elastic IP to an AWS instance, you are essentially reserving a static IP for your instance that won't change as long as it is associated in your account.

> I won't go into detail about Elastic IPs, so please refer to the documentation if interested: [http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html).

To assign an Elastic IP to your newly launched instance:

1. From the _EC2 Dashboard_ select the __Network & Security: Elastic IPs__ from the left-hand tree menu
2. Select __Allocate New Address__
3. From the modal window, click __Yes, Allocate__
4. Click on the newlly added address in the listing
5. From the _Actions_ button, above the listing_, select __Associate Address__
6. In the _Associate Address_ dialog, start typing the name Value giving to the newly launched instance in the __Instance__ field
7. Once you see the entry for your newly launched instance from the previous section, select it and fill the __Instance__ field value
    * In my case, that is `custardbelly.com`
8. Click __Associate__
9. Upon association of the new Elastic IP, you should see your __Instance__ show up in the listing entry

At this point, if you navigate back to __Instances:Instances__ from the _EC2 Dashboard_, tou should see your newly launched instance listed, and the __Public IP__ field should display the associated Elastic IP and appear in blue.

## Site Files
The main site files are hand curated and live in a [github repo](https://github.com/bustardcelly/custardbelly-dot-com). The blog site is generated from markdown and has its own [github repo](https://github.com/bustardcelly/blog-to-markdown), as well; its a bit overblown for its purpose now, but at the time it was used as a tooling system to generate markdown from Wordpress post as described in [a previous article](https://www.custardbelly.com/blog/blog-posts/2014/01/03/so-long-wordpress/index.html).

Using the newly associated IP for the instance and the key generated, I SSH'd into the box and pulled down my site sources. For example:

```
$ ssh ~/.ssh/custardbelly.pem ubuntu@xxx.xxx.xxx.xxx
```

Since this blog and the main site are static files and all it took was to do some `git clone`'s on my new instance and move some things to their respective places. But first I had to install `git`:

```
$ sudo apt-get update
$ sudo apt-get install git
```

Once I installed __git__ and pulled down my repos, I moved the main site files to `/var/www/custardbelly.com/public_html` and the blog files to `/var/www/blog`. Then I added a sym-link from `/var/www/custardbelly.com/public_html/blog` to `/var/www/blog`, so that whenever I needed to get updates to the blog on my server, I didn't have to fuddle about in the main site's directory.

> This was a rudimentary first pass on getting my site and blog set up. In the future, I will add deployment strategies to these repositories, either in the form of a Continuous Integration server or with tools such as [shipit](https://github.com/shipitjs/shipit). Props to [Kyle Kellogg](https://twitter.com/kylekellogg) on opening my eyes to it.

_If you do not maintain your site in a Version Control System (VCS), you may need to go through other avenues to get your site files onto the instance..._

With the site and blog files up on the new instance, it was time to tell the world to look there when they requested it.

---

# Transferring DNS Records

## Amazon Route 53

## Check with dig

---

# Setting Up nginx

## Installation

## Configuration
