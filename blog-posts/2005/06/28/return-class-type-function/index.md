# [return class; = [type Function] ?](http://custardbelly.com/blog/2005/06/28/return-class-type-function/)

[Edit: sorry about all the italics and bolds. i really need to get some sort of style sheet for actionscript code]  
[Edit 2: and i got one. have to do some color changes. [IG: Syntax Hiliter](http://blog.igeek.info/index.php)]  
i found something i don’t quite understand today (not that much of a shock) when trying to make a _CharacterManager_ class to control the registration and reference of classes extending a _Character_ class. In short, when i make a new character that a user can use, i just want to create a new class that extends the _Character_ class, go into my main class register it and drop the new character movieclip into the library, brush off my hands give a little grunt and call it a day.  
Now i found this odd, but technically i know very little, so i was hoping someone out there might be able to explain it to me.  
The way i want this to work is when i register a new character, i say something like this:

__characterManager.registerCharacterClass(MyNewCharacterClass, “class name”);

- where **__characterManager** is the singleton

….(in _Character Manager_)  

    
      
    
    	public function registerCharacterClass(classToAdd, classNameStr)  
    
    	{  
    
    		__classList[ classNameStr ] = classToAdd;  
    
    	}  
    
    

- and then when i want to retrive that class when i create a new character i say:

(1)  

    
      
    
         Application.addCharacter(”class name”, “symbol linkage id”, “instance name”);  
    
    

  
(2)  

    
      
    
         function addCharacter(classNameStr, clipID, name)  
    
          {
    
    
    
    
              var characterClass:Character =  
    
    
    
    
                                      characterManager.getCharacterClassByName(classNameStr);
    
    
    
    
              var character:Character = characterClass.create(clipID, name);  
    
          }  
    
    

  
- what i had in the _CharacterManager_ class before i found the reason why i’m asking this question is this:  

    
      
    
    	public function getCharacterClassByName(classNameStr):Character  
    
    	{  
    
    		return __classList[ classNameStr ];  
    
    	}  
    
    

- but that always returned the [type Function]- never a reference to the class i was trying to get.  
So i peeked into the _CommandTemplate_ class within [the ariaware package](http://ariaware.com/products/arp/), and noticed how they did it.  
Using this: 

**return new __classList[ classNameStr]();**

Now this makes sense to me, since when you create an instance of a class you use new most of the time. But i guess i’m wondering why it would return [type Function] before, and not even [object Object], or something else. and if this is always true, can i not create a Singleton from here, or should i make a _CharacterSingletonManager_ class and **return __classList[ classNameStr].getInstance();** ?  
The answer is probably simple and can be summed up in one line, and here i write a novel out of a question.. but oh well.

Posted in [Flash](http://custardbelly.com/blog/category/flash/).

By [todd anderson](http://custardbelly.com/blog/author/todd-anderson/) – June 28, 2005
  *[June 28, 2005]: 2005-06-28T14:19
