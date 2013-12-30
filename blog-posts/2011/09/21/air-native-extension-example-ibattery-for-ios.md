# [AIR Native Extension Example: iBattery for iOS](http://custardbelly.com/blog/2011/09/21/air-native-extension-example-ibattery-for-ios/)

## Introduction

The most exciting new feature [coming to Adobe AIR](http://blogs.adobe.com/flashplatform/2011/09/announcing-flash-player-11-and-air-3.html) to me is the ability to compile against a library that can communicate with a device natively. Though some of the Stage* API opens a whole new world of rendering improvements, the inclusion of [Native extensions for Adobe AIR](http://www.adobe.com/devnet/air/articles/extending-air.html) (NE) relieves the wishing and waiting of what will be exposed at the device level in future **AIR SDK** releases; we can now extend the **Runtime** ourselves. With the arrival of **Native extensions**, the possibilities of what can be achieved with a mobile **AIR** application grow larger; and certainly with that, so does complexity in design and the requirement to develop with mobile performance in mind. 

Keeping the complexities and performance in check (and to calm myself down from excitement of the endless possibilities) I decided to give it a quick test-run by creating a **Native Extension** that I thought was sorely missing from the **Adobe AIR SDK** – battery information on iOS. In all seriousness, getting up and running and accessing the battery information of my iPhone from an application **AIR** application was rather painless and – dare i say it – easier than i expected. I intend to give a quick walk through of how I went about creating the **iBattery Native Extension** and how to use it in an AIR application.

### Disclaimer

I am going to assume you are familiar with setting up an **Apple Developer** account and downloading the SDK and won’t even go into the headache of provisioning profiles and the deployment process for an **iOS** application. I am also going to assume that you are familiar with using the recent **Flex 4.5 SDK** to create mobile Flex applications. The application in this example is in no way complex, but I am not going to cover how the pieces of the application work – only how you can compile against and include an **Native extension for Adobe AIR**.

### Source

If you are curious or just want to jump to code, I created a [github repo](https://github.com/bustardcelly/iBattery) with all the source as well as deployment builds or if you just came here for the **Native Extension** and know your way around you can download [ibatteryextension.ane](http://www.custardbelly.com/downloads/air/ane/ibatteryextension.ane.zip) directly.

## Requirements

  * [Flex 4.5.1 SDK](http://opensource.adobe.com/wiki/display/flexsdk/Download+Flex+4.5)
  * [AIR 3 Runtime and SDK (Release Candidate)](http://labs.adobe.com/technologies/flashplatformruntimes/air3/)
  * [iOS SDK](http://developer.apple.com/devcenter/ios/index.action)

Also, take a look at these excellent articles:

  * [Extending Adobe AIR by Oliver Goldman](http://www.adobe.com/devnet/air/articles/extending-air.html)
  * [Why Native Extensions for AIR](http://renaun.com/blog/2011/09/why-native-extensions-for-air/)
  * [Developing ActionScript Extensions for Adobe AIR](http://www.adobe.com/content/dam/Adobe/en/devnet/devices/pdfs/DevelopingActionScriptExtensionsForAdobeAIR.pdf)
  * [Native Extensions for Adobe AIR](http://www.adobe.com/devnet/air/native-extensions-for-air.html) in the AIR Developer Center

_I am not going to cover how to get this going with any IDEs (eg. **Flash Builder 4.5**). I will show you how to do all this from the command line. There are some niceties with IDEs that will separate you from invoking the command line tools of the **SDK** directly, but sometimes it is nice to see what is going on behind the scenes._

I went about downloading the **Flex 4.5 SDK** and unzipping it somewhere on my local disk, then downloaded the **Adobe AIR SDK** and overlaid it on the **Flex SDK** using the instructions here: [How To Overlay the AIR SDK](http://kb2.adobe.com/cps/495/cpsid_49532.html). For the purposes of the examples in this article let’s just say that **SDK** is located on my machine at: **/Users/todd/SDKs/flex_4.5_air_3rc1**.

The whole iOS & Xcode set up, you are on your own. Sorry, not to be mean. There is some great information already out there and i want to keep this article more focused on **Native Extensions for Adobe AIR** and not to prevent hair-loss developing for iOS.

## Moving Pieces

There are three major portions to create an AIR application utilizing the **Native Extension for Adobe AIR**:

  1. Native code compiled for target platform.
  2. Flex library project to deploy the Native Extension for Adobe AIR.
  3. Mobile AIR application.

Depending on your target device/platform, the language and generated library on the native-side can vary and really is covered well in [Oliver Goldman’s article](http://www.adobe.com/devnet/air/articles/extending-air.html#articlecontentAdobe_numberedheader_4). For the purposes of this example, the native part involved me writing some C/Obj-C and creating a static library (.a file). The Flex library project is actually two-fold; I created a library that interfaced with the [flash.external.ExtensionContext](http://help.adobe.com/en_US/FlashPlatform/beta/reference/actionscript/3/flash/external/ExtensionContext.html ), then generated an **.ane** file from the **SWC** and static library. The **Mobile AIR** application is then compiled against this **Native Extension** and the **.ane** library file is included in the generated **.ipa** file.

## Native

I am not that much of an C/Objective-C developer. I have developed and deployed a handful of iOS applications in the past (some reaching the **AppStore**), but honestly have not touched it in quite some time. So I have some history, but cannot speak at length on how things work and why. Let’s just say, for the example in this article, that I knew enough to get in and get out and carry on on the **ActionScript** side of things.

When creating a native extension targeting the iOS platform, you’ll write some C code (which can call Obj-C) and deploy a static library with a **.a** extension. What i did was create a new Library project in Xcode, imported the header file included with the **AIR SDK** (found at **/include/FlashRuntimeExtensions.h**) and added a **.m** (Obj-C implementation) file to the project that will serve as the implementation of the native context and expose the API for accessing the battery life and information of the iOS device:
    
    // Access battery life.
    
    FREObject GetBatteryLife(FREContext ctx, void* funcData, uint32_t argc, FREObject argv[]) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;UIDevice *device = [UIDevice currentDevice];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;[device setBatteryMonitoringEnabled:YES];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;float life = [device batteryLevel];
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;FREObject retVal;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;FRENewObjectFromDouble( life, &retVal );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return retVal;
    
    }
    
    &nbsp_place_holder;
    
    // Access info about battery
    
    FREObject GetBatteryInfo(FREContext ctx, void* funcData, uint32_t argc, FREObject argv[]) {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;UIDevice *device = [UIDevice currentDevice];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;[device setBatteryMonitoringEnabled:YES];
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;int info = [device batteryState];
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;FREObject retVal;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;FRENewObjectFromInt32( info, &retVal );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return retVal;
    
    }

Boiled down and abstracted in thinking on the **ActionScript** side of things, the API of this native library exposes two methods: _GetBatteryLife_ and _GetBatteryInfo_. Each return a numerical value related to their context: a Number representing the percent of battery life left on the device and an Integer representing battery state, respectively. The relation of the Number value to percent is fairly straight-forward. The Integer returned from _[[UIDevice currentDevice] batteryState]_ relates to the various “states” that the battery can be in, and they are:

  * 0 : Unknown
  * 1 : Unplugged
  * 2 : Charging
  * 3 : Full

The **FREObject** is covered more properly by [Oliver Goldman in his article](http://www.adobe.com/devnet/air/articles/extending-air.html#articlecontentAdobe_numberedheader_4), and I just blindly assume that the [ExtensionContext](http://help.adobe.com/en_US/FlashPlatform/beta/reference/actionscript/3/flash/external/ExtensionContext.html ) of the **AIR SDK** knows how to interpret this value for me so I can cast as an **ActionScript** type and move on. We’ll see how that happens in the next section.

## The Native Extension

The previous section lightly covered the native side of things and generated a static library file that will be used to compile an **Native Extension** (NE) library that will be used by an AIR application to access battery information of an iOS device it is deployed to. Creating the **Native Extension** file (.ane) is actually a two step process:

  1. Create a Flash library project compiled against AIR libraries and expose an API that interfaces with the native library through [ExtensionContext](http://help.adobe.com/en_US/FlashPlatform/beta/reference/actionscript/3/flash/external/ExtensionContext.html ).
  2. Use the ADT command line tool with to generate an .ane file compiled against the library SWC and the native library.

The [flash.external.ExtensionContext](http://help.adobe.com/en_US/FlashPlatform/beta/reference/actionscript/3/flash/external/ExtensionContext.html ) from the **AIR SDK** is your main access point to the native library. Essentially, you create a new instance of an **ExtensionContext** using an ID defined in an extension descriptor file compiled into the **Native Extension**. For the **iBattery Native Extension**, this is what my extension descriptor file looks like:
    
    <extension xmlns="[http://ns.adobe.com/air/extension/2.5](http://ns.adobe.com/air/extension/2.5)">
    
    &nbsp_place_holder;&nbsp_place_holder;<id>com.custardbelly.ibattery</id>
    
    &nbsp_place_holder;&nbsp_place_holder;<versionNumber>1</versionNumber>
    
    &nbsp_place_holder;&nbsp_place_holder;<platforms>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<platform name="iPhone-ARM">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<applicationDeployment>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<nativeLibrary>libAIRExtensionC.a</nativeLibrary>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<initializer>ExtInitializer</initializer>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<finalizer>ExtFinalizer</finalizer>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</applicationDeployment>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</platform>
    
    &nbsp_place_holder;&nbsp_place_holder;</platforms>
    
    </extension>

Highlighted in that snippet are some important bits. The **id** node value will be used to create a new **ExtensionContext** instance. The **nativeLibrary** node value is the native library created in the previous section. For this example, it is also of note that we have defined the _iPhone-ARM_ platform as a target, as well. This extension descriptor file describes the association of id to native library that the **ExtensionContext** will look up upon instantiation. To create an **ExtensionContext**:

_com.cusardbelly.air.extensions.battery.ios.Battery_
    
    _extensionContext = ExtensionContext.createExtensionContext( "com.custardbelly.ibattery", "main" );

… and then use the **call**() method to invoke the corresponding method exposed in the native library. For the purposes of the example in this article, and for the **iBattery Native Extension**, I basically exposed the same API that was on the native side:

_com.cusardbelly.air.extensions.battery.ios.Battery_
    
    public function getBatteryLife():Number
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return _extensionContext.call( 'GetBatteryLife' ) as Number;
    
    }
    
    &nbsp_place_holder;
    
    public function getBatteryState():int
    
    {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;return _extensionContext.call( 'GetBatteryInfo' ) as int;
    
    }

With my API done, I compiled the library into a SWC:
    
    > /Users/todd/SDKs/flex_4.5_air_3rc1/bin/compc -output build/iBattery.swc -load-config+=ibattery_lib.config +configname=airmobile

If you are unfamiliar with using the command line tools of the SDK, I used the compc tool which is used to generate SWC files. The **iBattery.swc** file is generated and placed in a build directory and is compiled against an additional custom config (which just defines source location) and the **+configname=airmobile** directive. That’s actually a little fun tidbit. If you want to generate a SWC or SWF that uses the AIR mobile libraries, just add **+configname=airmobile** and they’ll be compiled against for you without defining them in an additional config file.

I then took the iBattery.swc and unzipped it to get the **library.swf** file. This is necessary for generating a **Native Extension** file (.ane) using the **ADT** command line tool:
    
    > /Users/todd/SDKs/flex_4.5_air_3rc1/bin/adt -package -target ane ../release/ibatteryextension.ane extension.xml -swc iBattery.swc -platform iPhone-ARM library.swf libAIRExtensionC.a

That generates an **ibatteryextension.ane** in a release directory and defines the target SWC library and platform as well as compiling in the descriptor, SWF library and native library.

That **Native extension** is then used as one would as SWC library in an AIR Mobile application to interface with the native library. You need to compile against the .ane and include it in an extension directory within the AIR application.

## The AIR Mobile Application

The application I created to showcase the **iBattery Native Extension** is pretty dead simple. Again, I am assuming you have some knowledge of a mobile AIR application and its pieces. There are a ton of great articles out there that can help in developing an AIR application targeting mobile, so I won’t provide any more explanations in this article, I just wanted to show you quickly how the communication works and the requirements for compilation of the application.

To being I just have a main _ViewNavigatorApplication_ that defines a single view:

_iBatteryExample.mxml_
    
    <?xml version="1.0" encoding="utf-8"?>
    
    <s:ViewNavigatorApplication xmlns:fx="[http://ns.adobe.com/mxml/2009](http://ns.adobe.com/mxml/2009)"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;xmlns:s="[library://ns.adobe.com/flex/spark](library://ns.adobe.com/flex/spark)"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;firstView="BatteryTestView">
    
    &nbsp_place_holder;
    
    </s:ViewNavigatorApplication>

… and the _BatteryTestView_ provides a UI to request the battery information on the device and does all the communication through the **ActionScript** side of the **Native Extension** library generated previously:

_BatteryTestView.mxml_
    
    <?xml version="1.0" encoding="utf-8"?>
    
    <s:View xmlns:fx="[http://ns.adobe.com/mxml/2009](http://ns.adobe.com/mxml/2009)"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;xmlns:s="[library://ns.adobe.com/flex/spark](library://ns.adobe.com/flex/spark)"
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;title="BatteryTestView" creationComplete="handleCreationComplete();">
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<fx:Script>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<![CDATA[
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;import com.custardbelly.air.extensions.battery.ios.Battery;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected var _batteryExtension:Battery;
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected function handleCreationComplete():void
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_batteryExtension = new Battery();
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;lifeButton.addEventListener( MouseEvent.CLICK, handleLifeRequest, false, 0, true );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;infoButton.addEventListener( MouseEvent.CLICK, handleInfoRequest, false, 0, true );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected function handleLifeRequest( evt:Event ):void
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;try {
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;console.appendText( "Battery Life Percentage: " );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;console.appendText( ( _batteryExtension.getBatteryLife() * 100 ).toString() + "%\n" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;catch( e:Error )
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;console.appendText( "Error: " + e.message );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;protected function handleInfoRequest( evt:Event ):void
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;console.appendText( "Battery State: " + ( _batteryExtension.getBatteryState() ).toString() + "\n" );
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;]]>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</fx:Script>
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<s:layout>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<s:VerticalLayout paddingLeft="10" paddingRight="10" paddingTop="10" paddingBottom="10" />
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</s:layout>
    
    &nbsp_place_holder;
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<s:TextArea id="console" width="100%" height="100%" editable="false" text="Hello World!" />
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<s:HGroup width="100%" height="24" verticalAlign="middle">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<s:Button id="lifeButton" label="get life" />
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<s:Button id="infoButton" label="get info" />
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</s:HGroup>
    
    &nbsp_place_holder;
    
    </s:View>

Access to the **ActionScript** API from the **Native Extension** is available just as if you were developing against an external SWC library, and I created a new instance of a _Battery_ to request life and information of the device which is then just printed out in a text area:

_BatteryTestView.mxml_
    
    _batteryExtension = new Battery();
    
    console.appendText( "Battery State: " + ( _batteryExtension.getBatteryState() ).toString() + "\n" );

To generate my AIR application for iOS, was a two step process. First, I generated the application SWF targeting AIR mobile:
    
    > /Users/todd/SDKs/flex_4.5_air_3rc1/bin/mxmlc +configname=airmobile -output build/iBatteryExample.swf src/iBatteryExample.mxml -load-config+=battery_app.config

Again i used the **+configname=airmobile** directive to include the mobile SWC from the Adobe AIR SDK without defining the dependencies in an additional config file. I did, however, have an additional config file that defined the **Native Extension** (.ane file) to compile against as an external library:

_battery_app.config_
    
    <?xml version="1.0"?>
    
    <flex-config xmlns="[http://www.adobe.com/2006/flex-config](http://www.adobe.com/2006/flex-config)">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<compiler>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<external-library-path append="true">
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;<path-element>ext/ibatteryextension.ane</path-element>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</external-library-path>
    
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;</compiler>
    
    </flex-config>

That generated an _iBatteryExample.swf_ which was then used alongside an application descriptor file to compile and generate the **.ipa** file (application installer file for iOS). We can create that using the **ADT** command line tool:
    
    > /Users/todd/SDKs/flex_4.5_air_3rc1/bin/adt -package -target ipa-test-interpreter -provisioning-profile {path.to}.mobileprovision -storetype pkcs12 -keystore {path.to}.developer_identity.p12 -storepass {pass} ../release/iBatteryExample.ipa iBatteryExample-app.xml iBatteryExample.swf -extdir ../ext/

There are two things in this command that you should note. First off, you will need to replace the _{path.to}_ and _{pass}_ tokens to point to your iOS developer files and password, respectively. Second is the _-extdir_ option. This defines where the application can locate the **Native Extension** (.ane file).

And that was pretty much it for the application. Pretty basic, but a rather quick way to get up and running to allow someone to find information about their battery on an iOS device.

## Conclusion

The addition of **Native Extensions for Adobe AIR** to the AIR SDK opens a lot of doors not only for native device integration but also to the experience you can provide in a mobile AIR application – with the biggest takeaway (as a developer) being that we no longer have to wait and see what gets exposed to us at the device-level in future **AIR SDK** releases. We can just write our own native extension now.

Hopefully this article provided some insight on how to quickly get up and running in creating your own Native Extensions and how to incorporate them into your mobile AIR application. And it should be noted that though this example was iOS specific, the native library for an **Native Extension for Adobe AIR** is in no way restricted to that platform and you should really check out [Oliver Goldman’s excellent article, Extending Adobe AIR on the Adobe DevNet](http://www.adobe.com/devnet/air/articles/extending-air.html#articlecontentAdobe_numberedheader_4).

The source discussed in this article can be found on **github** at [http://github.com/bustardcelly/iBattery](https://github.com/bustardcelly/iBattery) and the [ibatteryextension.ane](http://www.custardbelly.com/downloads/air/ane/ibatteryextension.ane.zip) itself (if you’d like to use it in your application) can be downloaded from this link.

Posted in [AIR](http://custardbelly.com/blog/category/air/), [AS3](http://custardbelly.com/blog/category/as3/), [Flex](http://custardbelly.com/blog/category/flex/), [Flex 4.5](http://custardbelly.com/blog/category/flex-4-5/), [Native Extension for Adobe AIR](http://custardbelly.com/blog/category/native-extension-for-adobe-air/).
