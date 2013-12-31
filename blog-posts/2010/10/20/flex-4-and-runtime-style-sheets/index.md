---
title: 'Flex 4 and Runtime style sheets'
url: 'http://custardbelly.com/blog/2010/10/20/flex-4-and-runtime-style-sheets/'
author:
  name: 'todd anderson'
date: '2010-10-20'
---

I just put up some files on [github](http://github.com/bustardcelly/) under the project name [**flex-runtime-css**](http://github.com/bustardcelly/flex-runtime-css). Perhaps it is a misnomer if people are coming to see how to load and parse CSS files (there’s already the [great **F*CSS** library](http://github.com/theflashbum/fcss) out there for that). The **flex-runtime-css** project is intended to address a problem i saw when generating a **Runtime CSS SWF** to be loaded in a **Flex Application**.

Sometimes a project calls for loading in CSS at runtime rather than compiling the style sheets in. Often enough this is due to a project requirement to have dynamic styling/skinning based on separate client vendors, _yadda-yadda_. To generate these **Runtime CSS SWF** files i use the **Adobe MXMLC** compiler tool from the **Flex SDK**. If you are unfamiliar about how to generate a **CSS SWF** or how to load in the **SWF** at runtime for style declarations, you can visit the the **Adobe live docs** on the subject at [http://livedocs.adobe.com/flex/3/html/help.html?content=styles_10.html](http://livedocs.adobe.com/flex/3/html/help.html?content=styles_10.html).

The problem i was running is that the default **flex-config** used by the **MXMLC** tool in **Flex 4** now links against several **RSL**s. I won’t go into a discussion of **RSL**s, but the reason for this is lower application size. That’s great for an application, but unnecessary when generating a **CSS SWF**. In fact, if you generated a **CSS SWF** using the default **flex-config** via the following command:
    
    > mxmlc MyStyle.css

… your generated **CSS SWf** file will request those **RSL**s when loaded into the application via the **StyleManager**. Unnecessary overhead as they those **RSL**s are already in the application domain and the request becomes moot.

So, long story long, **[flex-runtime-css](http://github.com/bustardcelly/flex-runtime-css)** intends to address this issue by providing a custom configuration that does away with the **RSL** linking and externally compiles against the framework libraries. A **CSS SWF** can be generated using the **flex-runtime-css** files and ANT. If you use the **[flex-runtime-css](http://github.com/bustardcelly/flex-runtime-css)** you will need to update the build.properties file included in the project to point to the **Flex SDK** and file resources on your local disk.

[flex-runtime-css on github](http://github.com/bustardcelly/flex-runtime-css).

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flex](http://custardbelly.com/blog/category/flex/), [flex-runtime-css](http://custardbelly.com/blog/category/flex-runtime-css/).
