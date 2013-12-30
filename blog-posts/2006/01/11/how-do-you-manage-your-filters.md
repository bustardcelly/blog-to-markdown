# [How do you manage your filters?](http://custardbelly.com/blog/2006/01/11/how-do-you-manage-your-filters/)

**[Update: 2/24/2006]**  
I’ve updated my workings of a management system for a movieclip’s filters after Lars Schwarz brought up some interesting thoughts. [Here are the new files.](http://custardbelly.com/downloads/ManagedFilterMap.zip) I basically pushed some management methods through a Singleton (McFilterManager), that registers/unregisters managed clips ( FilterManagedClip ). It’s not that necessary and the FilterManagedClip class can be used by itself, but if you want to hold references for all the clips that have filters, then it could be useful and expanded upon.

FilterManagedClip really does all the managing, and as Lars suggested, it now holds a reference to a unique id supplied, instead of using a instanceof check on the filter list.

plus i fixed that bug in removeFilter – sorry about that.  
**[End Update.]**

I’ve been playing around with filters in Flash 8, and started to get annoyed that if i wanted to update a filter’s settings i had to grab an instance from the movieclip’s filter array, change the properties and then reassign the filter array- particualarly because this caused problems if i had more than one type of filter and only wanted to change one propetry from one filter. Just seemed like too much code to change one thing.

-example  
Say your throwing up some particles that have a trajectory and prior to their apex, you want an increasing blur filter. as they hit the apex you want to add a glow filter, as they descend you want to increase that glow filter, while decreasing the blur filter. That’s a lot of grab-instances-of-filters, replace-values-of-properties-in-filters, reapply-changed-filters-to-mc, gobbildy-gook. Yeah, i went there… gobbildy-gook.

Then i thought, well i’ll just make a class with a couple static methods that will add, remove, replace, and update filters held in the filter array of a movieclip. That’s well and good, but i’m still a little dissatisfied. 

What if i want to make one for bitmapdata? sure, just copy-and-paste the code and replace the movieclip instances with bitmapdata in a new class.

What if i have more than one instance of the same type of filter? Uh-oh. (you’ll see what i mean if you check out the [class](http://www.custardbelly.com/downloads/McFilterMap.as)). I could make a manager class with handles a specified movieclip and holds unique ids in a map reference each new filter, but then if i have multiple particles… i don’t know… i just don’t like having so many managers.

I could be totally off the mark here and am missing some operation which i haven’t found and suits this very purpose… but i was just wondering what other people do to manage their filters.

suggestions? 

feel free to use the [McFilterMap class](http://www.custardbelly.com/downloads/McFilterMap.as).

Posted in [Flash](http://custardbelly.com/blog/category/flash/), [Flash8](http://custardbelly.com/blog/category/flash8/).
