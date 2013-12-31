---
title: 'Flex Ant Tasks and FlexFileSet error'
url: 'http://custardbelly.com/blog/2008/12/11/flex-ant-tasks-and-flexfileset-error/'
author:
  name: 'todd anderson'
date: '2008-12-11'
---

_*This is more of a post-reminder or a google-search aha than a soliloquy on the joys of FlexTasks and how to use them. If you want to know more about [flextasks, visit here](http://labs.adobe.com/wiki/index.php/Flex_Ant_Tasks), or [Ryan Taylor’s blog](http://www.boostworthy.com/blog/) for some good tips, or pick up [this wonderful book](http://www.amazon.com/Flex-Cookbook-Code-Recipes-Developers-Developer/dp/0596529856/ref=pd_bbs_sr_1?ie=UTF8&s=books&qid=1229047533&sr=8-1)… the holidays are coming._

I have had the fortunate opportunity to work with [Andy Zupko](http://blog.zupko.info/) on a project here at [Infrared5](http://infrared5.com/). We have our good days and our bad days – as most projects go – and hopefully we’ll be able to showcase our efforts at some time. Recently i started whipping the project into shape to handle modules, rsls and loaded styles to minimize the download time and highten user experience. Why does it always come down to the last few days to get this up and running? I don’t know. Maybe we’re so gung-ho to get things finished for an iteration and to show a client that deployment structure falls a little to the wayside. In any event Andy, and in some part me i suppose, structured the project to have minimal impact when it came time to have a deployment routine and manage runtime styles and rsls. Enough horn-tooting! What am i talking about?

Well, when it came time to set up the ant tasks that will take over the deployment and distribution of the application i was hitting a wall in compiling against an rsl. More to the point, i was getting this error:
    
    BUILD FAILED : No directory specified for FlexFileSet.

… when combined with this directive
    
    <compiler .external-library-path>
    	<include name="${app.dir}/${rsl.name}.swc" />
    </compiler>

I’m not gonna go into the nuts and bolts of the build file or even attempt to explain what that error means. I am familiar with compiling applications and modules from the Terminal and pretty much love doing most things from the terminal rather than relying on tools in eclipse, but i thought to bring experience down to a playing ground for a project that will be handed off to a client at some point, go with flex ant tasks. It’s well documented. Google finds most answers. Etc. But there are subtle changes to syntax that i am unfamiliar with when it comes to create a build file targeting the command line tools of the SDK.

In any event, it baffled me why this command would not work. It syntactically looked correct to me. The compiler directive is spelled correctly, the option variable is the correct path… wtf. Well just like the -library-path option i suppose you had to remove the directory that the SWC lives in from the variable and add it as a dir property.
    
    <compiler .external-library-path dir="${app.dir}">
    	<include name="${rsl.name}.swc" />
    </compiler>

Works! All is fine… but it took a hell of a long time to figure that out. Thought i would post this for any Terminal monkeys out there that run across this issue when building an ant file for compiling rsls into your application.

Was I bone-head for 2 hours? Probably…. feel free to leave a comment.

**[Update February 3rd, 2009]** – [Ryan Taylor](http://www.boostworthy.com/blog/) sent a solution that he uses (after being welcomed by my wordpress comments failure), which i find pretty elegant and will use in the future.
    
    <mxmlc ...>
           <runtime -shared-library-path path-element="${libs}/MyLibrary.swc">
               <url rsl-url="MyLibrary.swf" />
               <url policy-file-url="" />
        </runtime>
    </mxmlc>

Thanks, Ryan!

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/), [FlexTasks](http://custardbelly.com/blog/category/flextasks/).
