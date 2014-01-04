---
title: 'So long WordPress'
author:
  name: 'todd anderson'
date: '2014-01-03'
---
Originally a resolution for 2012, then 2013, I am making good early this year on getting rid of my reliance on [WordPress](http://wordpress.org/) as my blog engine - in fact, getting rid of _any_ engine to manage and serve blog posts; I converted all my old posts to static files and will be writing posts in markdown from now on.

### Out with the old
Within the past couple years it just felt laborious to maintain my blog - not so much in actually writing content, but rather in dealing with spam, upgrading WordPress to ward off attacks until the next upgrade, finding syntax highlight replacements and other plugins as interests changed/grew. As a consequence, I think it did affect me actually wanting to log into the admin console to write posts.

Along with maintenance of the my self-host WordPress being a bothersome heft, the WYSIWYG editor and all the extra bells and whistles in the admin console it provided just seemed to be a lot of useless noise. I have grown quite comfortable writing documentation in [markdown](http://daringfireball.net/projects/markdown/) (due, in most part, to the rise of [GitHub](https://github.com/)) and felt the experience of writing in such a context much more liberating and free-flowing. 

As such, I started looking at what else was out there that would allow me to:

* get rid of the dynamicism of serving blog posts  
* throw out requirement of a database to store and maintain information  
* write posts in markdown  
* easily generate and maintain static files

### The solution
As I mentioned previously, I started investigating solutions for the line items above a few years ago. Sitting on my desire to get rid of WordPress for so long has afforded me two things:

* growing frustration that I still have to deal with WordPress
* keeping track of the climate of tools that allow for generating static content from markdown

Naturally, the first one I gave a shot at back in 2012 was [Jekyll](http://jekyllrb.com/), and then the [Octopress](http://octopress.org/) framework. Truly great software which you should check out if you haven't had a chance. It was most likely the involvement of Octopress and maintenance that started to weigh down on me continuing to pursue it as an option and look for something more lightweight.

Within the time frame, as well, saw the rise of [Grunt](http://gruntjs.com/), a task-based utility built on [nodejs](http://nodejs.org/), and a tool I essentially use everyday in my work and personal projects. It was only natural that over the past couple years (or rather half-year) that I kept an eye out for any Grunt tasks that would generate markup from markdown; that's when [grunt-markdown-blog](https://github.com/testdouble/grunt-markdown-blog) which utilizes the [marked](https://github.com/chjj/marked) node module, along with [underscore](https://github.com/jashkenas/underscore/) templating, entered my life.

### The implementation
Though I had settled on a solution to turn markdown into markup, I had sort of started working backwards - there were more pertinent issues I had to address in order to preserve the past history of my bloggin - since 2005! (spoiler: not all _good_ content).

#### Conversion of WP posts to markdown
The first thing I had to accomplish was turning all my old posts stored in a database into static content. To do just that, I found the wonderful [wpstatic](https://github.com/mossiso/WP-Static) script. Dropping that script on my server in the same location as the _wp-config.php_ file of my WordPress install - along with turning on 1000 posts per page in my WP admin console - allowed me to spit out the whole full history of posts since I started blogging by simply issuing the following:

```
./wpstatic
```

With a full history of posts held in a single HTML file, I then used [PhantomJS](http://phantomjs.org/download.html) to consume that file and spit out each post into a directory structure that was relative to the naming convention used for posting in WordPress.

I then used [html2text](https://github.com/aaronsw/html2text) - a python module - to convert each post markup into markdown.

### Conversion of markdown back to markup
I know, I know. It seems really odd that in my first two steps I had generated valid markup and then went ahead and converted that to markdown only wanting to convert it back to markup... there is a good reason :) I wanted the markup to be consistent across previous posts and any new posts I would be writing in markdown. Using [html2text](https://github.com/aaronsw/html2text) allowed me to conform previous HTML documents to the structure of markdown I would be using going forward.

With the static markdown content produced, all it takes now is running the [grunt-markdown-blog](https://github.com/testdouble/grunt-markdown-blog) task on those files to generate static HTML documents.

And with that, all my previous work is preserved and available as it once was.

## The downside
The biggest benefit a database provides is being able to reference information categorically. Data stored with reference to other data stored allows for ease in generating new views and relationships. Admittedly, this is the big downside of moving my blog to static content - I do love analyzing and presenting data in new ways (its part of my job!). But, as mentioned previously, the weight of maintenance involved in the engine and tooling farly outweighed the need to move to static content than the need to access blog post data.

Another downside is the loss of comment association to post - and specifically the "google-ability" of providing a post of mine as a result of a comment being relevant to a search query. Even further, all previous comments are lost :( For that, I feel truly sorry to those of you out there who have added to the discussion on previous posts; I apologize for throwing them out with the bath water. If the previous comments corrected some information with the post or provided valuable insight, I did make it a habit of ammending the post and those should still be part of the static replacement. If you see something that is out of place or would like to be added, please get in touch.

### The brightside
I am free of WordPress :)

I do want to state that WordPress is not bad or evil - far from it. It had just become a burden for me; I much prefer just writing thoughts out in markdown and then issuing a command to generate and deploy new, static content.

If you are interested in all the details, you can checkout the Github repo I have set up to store my tools and blog content:  
[https://github.com/bustardcelly/blog-to-markdown](https://github.com/bustardcelly/blog-to-markdown)