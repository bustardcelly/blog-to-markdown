# [Styling the whiteBox of a Flex Container](http://custardbelly.com/blog/2008/04/16/styling-the-whitebox-of-a-flex-container/)

You can’t… That is to say, there is no style property to change the color of that little white box that appears in the lower right of a Container component when the vertical and horizontal scrollbars are present.

Today, i added a Canvas that had fixed dimensions to the displaylist of a Flex application. Because the content within the Canvas instance would vary in size, vertical and horizontal scrollbars are needed for content that is larger than the width and height of the fixed dimensions of its parent container. When both scrollbars are present on the display, they meet in the lower right and create an empty space. That empty space is actually a FlexShape in the Container class called whiteBox. The whiteBox shape is protected, but is added and removed programmatically within private methods based on the presence of both directional scrollbars. 

Fine by me… the problem i have is that the color of whiteBox is hard-coded ( to #FFFFFF ). Super! I guess if you name something with a prefix that is a color, you have to hard-code the actual color it will be using to draw… 

There is an easy work-around by just creating a subclass of Canvas and overriding the updateDisplayList() method to remove whiteBox, but it seems kind of hackish, especially if it is going to be added each time the vert and horiz scrollbars are added to the display and then i have to remove it again.

Here’s an example of how i resolved my issue:
    
    package
    {
        import mx.containers.Canvas;
    &nbsp_place_holder;
        public class NoWhiteBoxContainer extends Canvas
        {
            public function NoWhiteBoxContainer() {	super(); }
    &nbsp_place_holder;
            override protected function updateDisplayList( unscaledWidth:Number, unscaledHeight:Number ):void
            {
                super.updateDisplayList( unscaledWidth, unscaledHeight );
    &nbsp_place_holder;
                if( whiteBox ) rawChildren.removeChild( whiteBox );
            }
        }
    }

Nothing extremely complicated, but it would have been nice to just set a style property or for the fill color to inherit from the backgroundColor property. ah well… Hopefully someone may find this post if they are wondering what to do with that white box.

Posted in [Flex](http://custardbelly.com/blog/category/flex/).
