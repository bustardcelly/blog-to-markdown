# [writeln and Keith Peters’ debugger](http://custardbelly.com/blog/2005/07/28/writeln-and-keith-peters-debugger/)

I use a little function called writeln in all my classes to keep track of where my traces are coming from. i started doing it to keep myself from going crazy when seeing random text come up in the output panel and not knowing where or how it got there- not to mention running through an app and then have that panel open up out of nowhere to tell me something that i have no idea what it means.  
Recently i have been loving this new debugger [Keith Peters’ unleashed](http://www.bit-101.com/blog/archives/000170.html), and coupling my writeln with it has put a smile on my face.  
i have extended the arguments in my writeln and now i can trace (recusively no less, thanks keith) with a specified level of importance and color coding!

Basically, what once was this:
    
    function writeln(str):Void  
    
    {  
    
    	trace(”#com.site.MyClass#\n     – ” + str);  
    
    }

..has become this:
    
    function writeln(str, line:Number, type:String, clear:Boolean, levels:Number):Void  
    
    {  
    
    	if(clear)  
    
    	{  
    
    		Debug.clear();  
    
    	};
    
    
    
    
    	type = (type == undefined) ? “DEBUG” : type;
    
    
    
    
    	if(arguments.length < 5)  
    
    	{  
    
    		Debug.trace("\n#com.site.MyClass#\n     " +  line + "- " + str, Debug[type]);  
    
    	}  
    
    	else  
    
    	{  
    
    		Debug.trace("\n#com.siteMyClass#\n     " +  line + "- " + str);  
    
    		Debug.traceObject(str, levels, Debug[type]);  
    
    	};  
    
    } 

..with this somewhere in the class file:
    
      
    
    writeln("i'm debugging!", 20);  
    
    

or
    
      
    
    writeln(someObject, 20, "INFO", false, 1);  
    
    

and with the FlashDedugPanel open i gets all i needs.

i'd like to do something with that if(clear), i just don't like it... but for now i'm very happy.

thanks again [Keith and ](http://bit-101.com)[Tim](http://www.timwalling.com/)

Posted in [Flash](http://custardbelly.com/blog/category/flash/).
