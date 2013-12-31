# [AIR InvokeEvent and FileTypes](http://custardbelly.com/blog/2007/10/05/air-invokeevent-and-filetypes/)

As some of you may know, [Matt Wright](http://www.designhonky.com/) and [Marc Leuchner](http://www.forwardatlantic.com/marc/2006/) (of [nobien](http://blog.nobien.net/) fame) and I are authoring an [Adobe AIR book](http://www.amazon.com/Adobe-AIR-Create-Modify-Reuse/dp/0470182075/ref=pd_bbs_sr_6/002-5985048-8156021?ie=UTF8&s=books&qid=1191543407&sr=8-6) to be published by [Wiley](http://www.wiley.com/WileyCDA/). We’ve been breaking fingernails typing away to deliver a jam-packed by-examples book in which you’ll build real world applications while learning about the AIR API. As we’re writing, we run across some amazing features in AIR and yammer amongst ourselves – or to anyone who listens – but rarely blog about our excitement and findings.

That said, there is a coupling of features of AIR while leveraging the Flex Framework that i cannot hold inside and think is worth mentioning: Associated filetypes, the invoke event, and BindingUtils. 

_To view and download the full code, [click here](http://custardbelly.com/downloads/air/FileTypeFun).  
_  
**File Types**  
First off, you can associate filetypes to your AIR app in the application descriptor file within the `fileTypes` node:
    
    <filetypes>
        <filetype>
          <name>com.example</name>
          <extension>ftf</extension>
          <description>FileTypeFun file</description>
          <contenttype>text/plain</contenttype>
        </filetype>
    </filetypes>

Once the AIR app is installed on your machine, a file with the extension set as the value of the `extension` node will be associated with your app. Meaning, it will show up first in the list when you choose ‘open with’ and even invoke the app if you double-click on the file – that is if the extension is not associated with another program on your machine (ie. doc) in which case you will have to set your app to always open associated as default to your app.

**InvokeEvent**  
The invoke event of a `WindowedApplication` will be triggered upon initial instantiation – without having the application previously running – and any subsequent ‘open with file’ calls. The arguments property of the `InvokeEvent` is an array of arguments passed through invocation of the app. This not only allows command line junkies to open an application with a file like so:

_On Mac:_  
>open MyAirApp.app MyDocuments.ftf  
_  
On Windows:_  
>MyAirApp MyDocument.ftf

.. but as well as double-clicking or choosing ‘open with’ on a file (as describe above). Probably you wouldn’t have any documents lying around in your applications directory – but you get the picture. To handle those arguments your app would look something like as follows:
    
    < ?xml version="1.0" encoding="utf-8"?>
    <mx :WindowedApplication 
        xmlns:mx="http://www.adobe.com/2006/mxml"
        layout="vertical" 
        horizontalAlign="center" verticalAlign="middle"
        invoke="onAppInvoke(event);">
    &nbsp_place_holder;
        </mx><mx :Script>
            < ![CDATA[
                private function onAppInvoke( evt:InvokeEvent ):void
                {
                    var items:Array = evt.arguments;
                    for( var i:int = 0; i < items.length; i++ )
                    {
                        trace( items[i] );
                    }
                }
            ]]>
        <mx :Label text="Welcome" />
    </mx>

_Note:  
AARG… i can’t find a decent mxml plugin for Wordpress. There is an errant closing_ mx _tag before the script and the closing tag at the end should read_ /mx:WindowedApplication . _If anyone has any tips on a good plugin, please leave a comment!_

This assigns the `onAppInvoke()` method as the handler to the ‘invoke’ event dispatched from `WindowedApplication` upon instantiation AND any subsequent invocation calls. The arguments attribute of the `InvokeEvent` is a list of strings – deliminated by space if you on the command line. From here, just handle them as you want to. In following with this example we are going to handle paths to simple text files.

**BindingUtils**  
All this filetypes and invoke events craziness is enough to warrent me to stop writing… but i got to thinking (always bad news)… what if i’ve got an ‘invoke’ event that may trigger prior to the creation of a client that needs to know about an opened file, or more so, the app needs to switch focus to a client that has yet to be instantiated that knows how to handle that file? This is where `BindingUtils `and `ChangeWatcher `come into play and really show off the power of the Flex Framework.
    
    < ?xml version="1.0" encoding="utf-8"?>
    <mx :WindowedApplication 
        xmlns:mx="http://www.adobe.com/2006/mxml"
        layout="vertical" 
        horizontalAlign="center" verticalAlign="middle"
        applicationComplete="onAppComplete();"
        invoke="onAppInvoke(event);">
        </mx><mx :Script>
            < ![CDATA[
                import mx.binding.utils.ChangeWatcher;
                import mx.binding.utils.BindingUtils;
                import mx.events.FlexEvent;
    &nbsp_place_holder;
                private var _invokedFile:File;
                private var _fileWindow:FileDisplayWindow;
                private var _filesBinding:ChangeWatcher;
    &nbsp_place_holder;
                private function onAppComplete():void
                {
                    _filesBinding = BindingUtils.bindSetter( invalidateFiles, this, 'invokedFile', true );
                }
    &nbsp_place_holder;
                private function onAppInvoke( evt:InvokeEvent ):void
                {
                    var items:Array = evt.arguments;
                    if( items.length > 0 )
                    {
                        invokedFile = new File( evt.arguments[0] );
                    }    
                }
    &nbsp_place_holder;
                private function openFileWindow():void
                {
                    _fileWindow = new FileDisplayWindow();
                    _fileWindow.addEventListener( FlexEvent.CREATION_COMPLETE, applyFileToWindow );
                    _fileWindow.open();
                }
    &nbsp_place_holder;
                private function applyFileToWindow( evt:FlexEvent = null ):void
                {
                    _fileWindow.file = _invokedFile;
                }
    &nbsp_place_holder;
                private function invalidateFiles( arg:* = null ):void
                {
                    if( _invokedFile == null ) return;
                    if( _fileWindow == null || _fileWindow.closed ) openFileWindow();
                    else applyFileToWindow();
                }
    &nbsp_place_holder;
                [Bindable]
                public function get invokedFile():File
                {
                    return _invokedFile;
                }
                public function set invokedFile( arr:File ):void
                {
                    _invokedFile = arr;
                }
    &nbsp_place_holder;
            ]]>
        <mx :Label text="Welcome" />
    </mx>

_Note:  
Again i apologize for the terrible representation of mxml code. To view the full code,_ [click here](http://custardbelly.com/downloads/air/FileTypeFun)

On dispatch of ‘applicationComplete’, a `ChangeWatcher `instance is created to bind any changes to the `invokeFile `attribute to the `invalidateFiles()` method. The `invalidateFiles()` method will be called upon a change to the `invokedFile `which is of type `File `from the AIR API. The client that handles any invoked files in this case is another addition to the AIR API – Window. I threw it in there because i can’t stop wanting to use it ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

The `invalidateFiles()` has checks to see if the file is valid as well as to make sure the `Window `is open and ready to receive data. Basically, with binding a change to the `invokedFile `attribute to the i`nvalidateFiles()` handler, we can be sure that when a file is requested to be open – either through invocation from the command, double-click, or ‘open with’ – the `Window `client that knows how to handle that file data will be presented.

This just scratches the surface. There are icons you can associate with file types, there’s drag and drop capabilities that can update the invoked file if wanted… i just have to stop typing at some point!

[View the full source code here.](http://custardbelly.com/downloads/air/FileTypeFun) I didn’t offer up the air app to download because it’s a rather boring app, but it is included in the source if you want to install it and test out the invocation.

If you made it this far and haven’t checked out [AIR](http://labs.adobe.com/technologies/air/), go [download the bits](http://labs.adobe.com/). And maybe consider buying [a book](http://www.amazon.com/Adobe-AIR-Create-Modify-Reuse/dp/0470182075/ref=pd_bbs_sr_6/002-5985048-8156021?ie=UTF8&s=books&qid=1191552882&sr=8-6) or [ two](http://amazon.com/s/ref=nb_ss_gw/102-6567738-0807350?initialSearch=1&url=search-alias%3Daps&field-keywords=Adobe+AIR&Go.x=0&Go.y=0&Go=Go)… ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)

Posted in [AIR](http://custardbelly.com/blog/category/air/), [Apollo](http://custardbelly.com/blog/category/apollo/), [Books](http://custardbelly.com/blog/category/books/), [Flex](http://custardbelly.com/blog/category/flex/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – October 5, 2007
  *[October 5, 2007]: 2007-10-05T09:24
