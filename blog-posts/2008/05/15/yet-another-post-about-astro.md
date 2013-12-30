# [Yet another post about Astro](http://custardbelly.com/blog/2008/05/15/yet-another-post-about-astro/)

If you read MXNA, you probably have stopped checking quite some time ago because every post is about [Astro](http://labs.adobe.com/technologies/flashplayer10/)…  
but if you are interested in another way to set up your projects in FlexBuilder to target FP10 without having to muck about with files in the frameworks folder of your _original_ Flex3 SDK installation this post may shed some light.

I am a workspace fanatic when it comes to development. I like things tidy, and when i start a new client project or go into some new exploration that involves multiple projects, i create a new workspace. The great thing about workspaces for me, aside from keeping things neat in my head, is that each new project you create in that workspace inherits from any default settings. So [when the big news hit](http://blogs.zdnet.com/Stewart/?p=841) and i wanted to check out the latest SDK, i created a new workspace and followed _most_ of the [excellent directions already available on the adobe open source site](http://opensource.adobe.com/wiki/display/flexsdk/Targeting+Flash+Player+10+Beta+with+Flex+SDK+3.0.x). I only strayed a little in how i went about setting my workspace up so that every new project i created in it was *almost* set for development targeted at FP10 without having to run through the process each time. 

The following is the process i took to only mess with the files from the nightly build and set defaults for a single workspace in order to play around with the current features available in Astro:  
**  
1**. Download Flash Player 10 codenamed Astro.  
**2**. Download the nightly build and unzip to some directory. (for me that is /Applications/flex_sdk_3.0.1.1728  
**3**. Open FlexBuilder or Eclipse (if you have the plugin) and create a new workspace. (ie. ~/Documents/workspace/astro).  
**4**. Create a new project.  
**5**. Navigate to Project>Properties  
**6**. Select the Flex Compiler option  
**7**. Under Flex SDK version, click Configure Flex SDKs…  
**8**. In the Preferences (Filtered) window, select Add  
**9.** Navigate to the installation of your nightly build. (ie. /Applications/flex_sdk_3.0.1.1728)  
**10**. Add a new name for the SDK… you should see something like so:

![Flex Builder Astro set up](http://custardbelly.com/blog/images/astro.jpg)””””””””””””””””””””””””””””””””””””””””””””””””””””””’ 

**11**. Click OK, Then tick the checkbox next to the newly added sdk in the Installed Flex SDKs window.  
**12**. Click Apply, then OK.  
**13**. Then back in the Project Properties folder, under Use a specific SDK, if the newly added SDK isn’t selected, select it.  
**14**. Under the Required Flash Player Version, change the value to 10.0.0  
**15**. In the Project Properties window on the left side, select Flex Build Path> Library Path.  
**16**. Expand the SDK you just set as default, and select the playerglobal.swc and Remove it.  
**17**. Click Add SWC, and navigate to the player 10 swc from your nightly build SDK installation (ie. /Applications/flex_sdk_3.0.1.1728/frameworks/libs/player/10/playerglobal.swc)  
**18**. Click Apply, then OK.  
**19**. Open up the flex-config.xml file from the Astro SDK installation and update the settings [as described in the first part of the Command-line Compiler instructions from here](http://opensource.adobe.com/wiki/display/flexsdk/Targeting+Flash+Player+10+Beta+with+Flex+SDK+3.0.x).

Thats it! Only 19 steps… that seems like a lot. In any case, in ensures that any project you now build under that workspace will default to using the targeted SDK. You will still have to manually change the Required Flash Version (from step 14) before you compile a new project, but other than that when you want to tinker with the nightly build – and not mess with your stable Flex 3 SDK release that other projects in other workspaces are targeting – just hop over to that workspace.  
**  
Good reading**:  
Ryan Stewart – [Flash Player 10 codename “Astro” goes beta](http://blogs.zdnet.com/Stewart/?p=841)  
Tinic Uro – [Adobe Is Making Noise series](http://www.kaourantin.net/)  
Keith Peters – [Astro Dynamic Sound!](http://www.bit-101.com/blog/?p=1264)  
Josh Tynjala – [Gratuitous Text Effects](http://www.zeuslabs.us/2008/05/15/gratuitous-text-effects-courtesy-of-flash-player-10/)

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Astro](http://custardbelly.com/blog/category/astro/), [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/).
