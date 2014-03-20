---
title: 'gulp-rev-append: simple cache-busting plugin'
author:
  name: 'todd anderson'
date: '2014-03-18'
---
I just released [gulp-rev-append](https://www.npmjs.org/package/gulp-rev-append), a simple cache-busting plugin for [gulp](http://gulpjs.org) that appends a query-string file hash to script and stylesheet dependencies in HTML files.

There are [several other cache-busting plugins](https://www.npmjs.org/search?q=gulp-rev) currently available by some awesome developers and I suggest you look at those to fit your project's need.

For my particular project in which I decided to create the [gulp-rev-append](https://www.npmjs.org/package/gulp-rev-append) plugin, I was looking to:

* enable cache-busting by appending a file hash on query string
* not require additionally markup commenting to declare dependencies to be modified
* not generate an additional manifest to be a dependency in file access for production-level application

I was trying to develop a simple web-based mobile site on a desktop while testing on devices and cache-ing was giving me a headache. I did not want to modify my workflow and build to accommodate an addition cache-manifest, nor did I foresee my work requirng a more robust cache-busting technique that the other plugins provided. 

_If this project was to be in millions of hands out in production, I would certainly use a file revving solution such as [https://www.npmjs.org/package/gulp-rev](https://www.npmjs.org/package/gulp-rev)._

## Usage
The [gulp-rev-append](https://github.com/bustardcelly/gulp-rev-append) plugins allows for appending a query-string file hash to dependencies declared in html files defined using the following regex: `(?:href|src)="(.*)[\?]rev=(.*)[\"]`

That's fancy talk for any stylesheet or script declarations that are declared in an html file such as the following:

```
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="style/style-one.css?rev=@@hash">
    <script src="script/script-one.js?rev=@@hash"></script>
    <script src="script/script-two.js"></script>
  </head>
  <body>
    <div><p>hello, world!</p></div>
    <script src="script/script-three.js?rev=@@hash"></script>
  </body>
</html>
```

will turn into something similar as the following after running `gulp-rev-append`:
```
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="style/style-one.css?rev=d65aaba987e9c1eefeb4be9cfd34e0de">
    <script src="script/script-one.js?rev=17a5da6c8a2d875cf48aefb722eefa07"></script>
    <script src="script/script-two.js"></script>
  </head>
  <body>
    <div><p>hello, world!</p></div>
    <script src="script/script-three.js?rev=5cadf43edba6a97980d42331f9fffd17"></script>
  </body>
</html>
```

Any subsequent runs of the `gulp-rev-append` file will change the output _only_ if the target file(s) declared have been modified. This is because the revision hash is computed using the target file contents.

The only requirement is that the dependency to be appended with the hash be declared using `?rev=`. The `@@hash` is not required, and any value will be overriden as the dependency file contents change.

### Installation
```
$ npm install gulp-rev-append --save-dev
```

### Declaration

_gulpfile.js_
```
var rev = require('gulp-rev-append');

gulp.task('rev', function() {
  gulp.src('./index.html')
    .pipe(rev())
    .pipe(gulp.dest('.'));
});

```
### Execution
```
$ gulp rev
```

## A word of warning
Using query strings to cache-bust dependencies isn't fool proof. These are some great articles that explain why:

[Google | Leverage Proxy Cache Article](https://developers.google.com/speed/docs/best-practices/caching?csw=1#LeverageProxyCaching)  
[Steve Souders | Revving Filenames: don't use querystring](http://www.stevesouders.com/blog/2008/08/23/revving-filenames-dont-use-querystring/)

As mentioned previously, file revving is a more robust cache-busting technique and there is already a great [gulp](http://gulpjs.org) plugin out there called [https://www.npmjs.org/package/gulp-rev](https://www.npmjs.org/package/gulp-rev) to fit your development needs.

## project
[gulp-rev-append](https://github.com/bustardcelly/gulp-rev-append)

Cheers.