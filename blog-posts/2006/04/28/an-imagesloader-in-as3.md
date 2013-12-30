# [An ImagesLoader in AS3](http://custardbelly.com/blog/2006/04/28/an-imagesloader-in-as3/)

[**Edit:** Files have been updated for [Flex2_beta3](http://labs.adobe.com/)]

You can view ( although it’s pretty unexciting visually ) and download the [source here.](javascript:MM_openBrWindow('http://www.custardbelly.com/blog/files/ImagesLoader/imgsLoader.html','imgsLoader','resizable=no,width=325,height=360');)

My first ‘real’ dabbling in AS3 was to tackle a port of my [ImagesLoader](http://custardbelly.com/blog/?p=27) classes from Flash8.  
I’ve been using the ImagesLoader, or at least one of the buffer classes, in all of my personal projects since i created it – which is styled after [Andrew Davison](http://fivedots.coe.psu.ac.th/~ad/)’s ImagesLoader – and find it extremely convenient. i hope if anyone has downloaded the classes and used them, they found it so as well. If not, i’m up for any criticism you may have.

[Patrick Mineault](http://www.5etdemi.com/blog/) had mentioned loading more than one file within the ImageLoaderQueue class ( which is mainly used in the MultiBuffer ), but i didn’t get around to it. Mainly because i’d have to have multiple instances of the ImageLoader in the queue… and i’m being lazy ![:)](http://custardbelly.com/blog/wp-includes/images/smilies/icon_smile.gif)  
If someone’s got a different take on that, i’d be glad to hear it.

I think it works pretty well right now, but i may go back in and flesh out the BufferEvent to handle event parameters as [Darron Schall explains here.](http://www.darronschall.com/weblog/archives/000191.cfm) Right now a buffer queue just calls back to it’s instance of ImageLoader after an event and grabs any data needed… not sure how i feel about that…

Posted in [AS3](http://custardbelly.com/blog/category/as3/), [Flash](http://custardbelly.com/blog/category/flash/).
