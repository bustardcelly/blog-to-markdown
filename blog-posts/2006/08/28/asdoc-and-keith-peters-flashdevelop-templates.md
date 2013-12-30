# [ASDoc and Keith Peters’ FlashDevelop templates](http://custardbelly.com/blog/2006/08/28/asdoc-and-keith-peters-flashdevelop-templates/)

… via [Joa Eberts fairwell to AS3Doc](http://blog.je2050.de/?p=80) …

[Adobe](http://www.adobe.com/) had release their [ASDoc command line tool](http://labs.adobe.com/wiki/index.php/ASDoc) around the 11th- i was otherwise [occupied](http://custardbelly.com/blog/?p=54), but am happy to find a way to figure documentation into [Keith Peters’ FlashDevelop templates for Flex2 and As3 projects](http://www.bit-101.com/blog/?p=849) now that i am back at my computer.

( If you haven’t already, follow that l[ink to Keith’s tutorial](http://www.bit-101.com/blog/?p=849) on adding project templates if you are interested in creating an excellent dev environment in FD and are curious about what i added to target auto-documentation in the ANT process ). 

To sum it up, all i added was a couple properties to the build.properties file and a conditional target to the build.xml. The modified files are here:

[build.properties](http://custardbelly.com/downloads/fd/build.properties)  
[build.xml](http://custardbelly.com/downloads/fd/build.xml)

… be aware that these are modified files downloaded from keith’s post, so if you have changed some values in the properties file on your own machine you shouldn’t explicitly replace these with your own.

[Note: it's not really actionscript code below, i'm just being lazy]

**The additions to _build.properties_**:

_1 – under the project properties header…_  

    
    #document titles  
    
    docbuild=false  
    
    doc.maintitle=templatetest  
    
    doc.windowtitle=’template test’

  
_  
… the docbuild property is a string boolean evaluated in a conditional in the build.xml. The others are command params [found here](http://labs.adobe.com/wiki/index.php/ASDoc:Using_ASDoc). Remember that anything with spaces needs quotes around it, as is the value for doc.windowtitle._

_2 – under the tools header…_  

    
    # where you installed your documenter:  
    
    asdoc.dir=C:/Flex_2_sdk  
    
    …  
    
    # most of this shouldn’t need to change  
    
    …  
    
    documenter=bin/asdoc.exe  
    
    …  
    
    

_… where asdoc.dir and documenter are relative to where you unzipped the ASDoc – in this case i threw it into the directory of the sdk._

**the additions to _build.xml:_**

_1- conditional added to the compile target:_  

    
      
    
      
    
      
    
    

  
_2 – the document target_  

    
      
    
    	  
    
                  
    
               
    
      
    
    

  
_3 – antcall added to build target:_  


… Changing the doc.build value in build.properties to any string other than ‘true’ will cause this to not rebuild the documentation, which can be handy if you are just doing quick tests or bug finding – otherwise, if set to ‘true’ it will document any AS files recursively found in ${source.dir}.

I had a similar build made up for AS2 projects and [BlDoc](http://www.blinex.com/index.cfm?view=bldoc&nav_view=products) in FlashDevelop using ANT earlier and thought i’d have a go with it using [ASDoc](http://labs.adobe.com/wiki/index.php/ASDoc), maybe someone else will find this useful…

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – August 28, 2006
  *[August 28, 2006]: 2006-08-28T22:50
