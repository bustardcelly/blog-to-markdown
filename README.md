Introduction
---
Example of how to convert articles of a WordPress blog to static markdown.

Requirements
---
#### wpstatic
[wpstatic](https://github.com/mossiso/WP-Static) is used to read in all content of a WordPress blog and generate an HTML file of all articles held in the WP database.

**Steps**

1. Download/Clone [wpstatic](https://github.com/mossiso/WP-Static)
2. Upload to server hosting WP blog within the same directory that contains *wp-config.php*
3. Run: '$ ./wpstatic'

**Notes**

* I went into WP admin console and changed the post count on page to 1000, allowing for all posts to be accessed in a single request from _wpstatic_
* I had to change line 121 in _wpstatic_ to work on the system that hosted my WP blog. I changed:  
```if [[ "$tablename" =~ $tb_prefix ]]; then``` to ```if [[ "$tablename" = ~$tb_prefix ]]; th```

#### PhantomJS
[PhantomJS](http://phantomjs.org/download.html) is used to read in the full output HTML file from _wpstatic_ and split out single articles.

#### virtualenvwrapper
Assume using [virutalenvwrapper](virtualenvwrapper.readthedocs.org) for python projects.

#### NodeJS, NPM & Grunt
Uses [grunt-markdown-blog](https://github.com/testdouble/grunt-markdown-blog) to generate HTML articles based on converted markdown.

Articles to Markdown
---
| using [html2text](https://github.com/aaronsw/html2text).

1. Setup virtualenv and install requirements.  
```
$ mkvirtualenv blog -r requirements.txt --system-site-packages
```

2. Start local server  
```
$ python -m SimpleHTTPServer 8080
```

3. Load output of _wpstatic_ into phantomjs and output to singular files organized by title/date  
```
$ phantomjs post-parser.js
```

4. Convert single posts to markdown using _html2text_  
```
$ python blog-to-markdown.py
```

Markdown to Articles
---
| using [grunt-markdown-blog](https://github.com/testdouble/grunt-markdown-blog) task.

**Notes**
[grunt-markdown-blog](https://github.com/testdouble/grunt-markdown-blog) uses Underscore templates.