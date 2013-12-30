# [Timers in Android](http://custardbelly.com/blog/2010/10/01/timers-in-android/)

Thought i’d make a quick post as part of a reminder for me or for those coming from ActionScript to **Android** and wondering how to create a **Timer**. It’s no secret but took me some searching to find (what i think is) the correct way to use timers in Android while i was working on some stuff for [**MassRoute**](http://custardbelly.com/blog/?p=191).

Within the **Android SDK** there is a **Handler** class. I won’t go into the specifics of Handler as there is a pretty good explanation within the [documentation](http://developer.android.com/reference/android/os/Handler.html), but the basics is that you pass a **Runnable** object that will be invoked at a given time.

_To run the timer once:_
    
    protected Handler taskHandler = new Handler();
    protected void setTimer( long time )
    {
        Runnable t = new Runnable() {
    	public void run()
    	{
    		runNextTask();
    	}
        };
        taskHandler.postAtTime( t, time );
    }
    &nbsp_place_holder;
    protected void runNextTask()
    {
        // run my task.
    }

[**UPDATE 10/20/2010**: After talking with [Jesse Freeman](http://jessefreeman.com/) over continuous delayed timers in using Runnable in Android development, we discovered that the previous solution didn't quite go the whole mile. This example has been updated to provide a continuous delayed timer that stops based on a flag]

_To run the timer continuously at a given time:_
    
    // -- Class Members --
    protected Handler taskHandler = new Handler();
    protected Boolean isComplete = false;
    &nbsp_place_holder;
    // -- Set Timer --
    protected void setTimer( long time )
    {
        final long elapse = 1000;
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; Runnable t = new Runnable() {
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;  &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;public void run()
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;  &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;  &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;runNextTask();
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;  &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;if( !isComplete )
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;  &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;{
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;  &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;_taskHandler.postDelayed( this, elapse );
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;  &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;  &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder;}
    &nbsp_place_holder;&nbsp_place_holder;&nbsp_place_holder; };
    	_taskHandler.postDelayed( t, elapse );
    }
    &nbsp_place_holder;
    protected void runNextTask()
    {
        // run my task.
        // determine isComplete.
    }

Posted in [Android](http://custardbelly.com/blog/category/android/).
