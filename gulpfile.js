var fs = require('fs'),
    path = require('path'),
    moment = require('moment'),
    map = require('map-stream'),
    mkdirp = require('mkdirp'),
    coffee = require('coffee-script'),
    extend = require('util')._extend,
    _ = require('lodash'),
    tpl = _.template,
    RSS = require('rss'),
    highlight = require('highlight.js');


var Orchestrator = require('orchestrator');
var orcha = new Orchestrator();

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    markdown = require('gulp-markdown'),
    stylish = require('jshint-stylish'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    ssh = require('gulp-ssh');

var ENV_LOCAL = 'local',
    ENV_REMOTE = 'remote',
    DEPLOY_DEV = 'dryrun',
    DEPLOY_DIST = 'dist',
    LOCAL_LOCATION = '',
    REMOTE_LOCATION = 'http://custardbelly.com/blog';

var environment = ENV_REMOTE;
var deployDest = DEPLOY_DIST;
var dateFormat = 'YYYY MMMM Do';

var Post = function(filepath, content, configuration) {
  this.filepath = filepath;
  this.filecontent = content;
  this.posttitle = configuration.title;
  this.posturl = configuration.url;
  this.postdate = configuration.date;
  this.author = configuration.author;
};

Post.prototype.htmlPath = function() {
  return this.filepath.split(__dirname + '/')[1];
};

Post.prototype.content = function() {
  return this.filecontent.toString();
};

Post.prototype.get = function(key) {
  if(this.hasOwnProperty(key)) {
    return this[key];
  }
  return undefined;
};

Post.prototype.title = function() {
  return this.posttitle;
};

Post.prototype.date = function() {
  return moment(this.postdate).format(dateFormat);
};

var siteMap = [],
    contextMap = {},
    registerPost = function(filepath, context) {
      var post = new Post(filepath, undefined, context);
      siteContext.site.posts.push(post);
      siteMap.push(path.dirname(filepath));
      contextMap[path.dirname(filepath)] = post;
    },
    getPostContext = function(filepath) {
      return contextMap[path.dirname(filepath)];
    },
    getPostIndex = function(filepath) {
      return siteMap.indexOf(path.dirname(filepath));
    };

var siteContext = {
      site: {
        author: 'Todd Anderson',
        title: 'Todd Anderson',
        description: 'ramblings about making things for web, mobile, desktop and land.',
        url: 'http://custardbelly.com/blog',
        disqus: 'custardbelly',
        rssCount: 10,
        dateFormat: dateFormat,
        posts: [],
        newerPost: function(post) {
          var index = getPostIndex(post.filepath);
          if(index < siteMap.length -1) {
            return contextMap[siteMap[index+1]];
          }
          return undefined;
        },
        olderPost: function(post) {
          var index = getPostIndex(post.filepath);
          if(index > 0) {
            return contextMap[siteMap[index-1]]; 
          }
          return undefined;
        }
      },
      rootlocation: LOCAL_LOCATION,
      css: 'style/main.css',
      highlightjs: 'lib/highlight/highlight.pack.js',
      // highlightcss: 'lib/highlight/styles/docco.css'
      highlightcss: 'lib/highlight/styles/github.css'
    };

var defineEnvironment = function(env) {
  environment = env;
  deployDest = (env === ENV_REMOTE) ? DEPLOY_DIST : DEPLOY_DEV;
  siteContext.rootlocation = (env === ENV_REMOTE) ? REMOTE_LOCATION : LOCAL_LOCATION;
};

var stripheader = function(options) {
  return map(function(file, cb) {
    var content = file.contents.toString(),
        splitted = content.split('---'),
        postContext = {},
        postContent;
    if(splitted.length > 1) {
      postContext = eval(coffee.compile(splitted[1], {bare:true}));
      postContent = splitted[2];
    }
    else {
      postContent = splitted[0];
    }
    file.contents = new Buffer(postContent);
    registerPost(file.path, postContext);
    cb(null, file);
  });
};

var archive = function(data, options) {
  return map(function(file, cb) {
    file.contents = new Buffer(tpl(file.contents.toString(), data, options));
    cb(null, file);
  });
};

var template = function(tmplFile, options) {
  return map(function(file, cb) {
    var post = getPostContext(file.path);
    post.filepath = file.path;
    post.filecontent = file.contents.toString();
    fs.readFile(path.resolve(tmplFile), 'utf8', function(err, filedata) {
      file.contents = new Buffer(tpl(filedata, extend(siteContext, {post:post}), options));
      cb(null, file);
    });
  });
};

var wrap = function(tmplFile, data, options) {
  return map(function(file, cb) {
    var post = getPostContext(file.path);
    var content = file.contents.toString();
    fs.readFile(path.resolve(tmplFile), 'utf8', function(err, filedata) {
      file.contents = new Buffer(tpl(filedata, extend(siteContext, {post:post, yield:content}), options));
      cb(null, file);
    });
  });
};

var htmlize = function(options) {
  return map(function(file, cb) {
    file.path = gutil.replaceExtension(file.path, '.html');
    cb(null, file);
  });
};

var rssize = function(posts, options) {
  return map(function(file, cb) {
    var rss = new RSS({
      title: siteContext.site.title,
      description: siteContext.site.description,
      feed_url: [siteContext.site.url, 'index.xml'].join('/'),
      site_url: siteContext.site.url,
      author: siteContext.site.author
    });
    var index = posts.length,
        length = options.length,
        post;
    while(--length > -1) {
      post = posts[--index];
      rss.item({
        title: post.title(),
        description: post.content(),
        url: [options.rootlocation, post.htmlPath()].join('/'),
        date: post.date()
      });
    }
    file.contents = new Buffer(rss.xml());
    cb(null, file);
  });
};

gulp.task('lint', function() {
  gulp.src(['gulp.js'])
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
});

gulp.task('build-posts', function() {
  gulp.src(['blog-posts/**/*.md'])
      .pipe(stripheader({post:true}))
      .pipe(markdown({
          highlight: function (code, lang) {
            if(lang && highlight.LANGUAGES[lang]) {
              return highlight.highlight(lang, code, true).value;
            }
            return highlight.highlightAuto(code).value;
          }
      }))
      .pipe(template('app/templates/post.us'))
      .pipe(wrap('app/templates/wrapper.us'))
      .pipe(gulp.dest(deployDest + '/blog-posts'));
});

gulp.task('build-pages', function() {
  var stream = gulp.src(['blog-pages/**/*.md'])
                    .pipe(stripheader({page:true}))
                    .pipe(markdown())
                    .pipe(template('app/templates/page.us'))
                    .pipe(wrap('app/templates/wrapper.us'))
                    .pipe(gulp.dest(deployDest + '/blog-pages'));
  return stream;
});

gulp.task('build-index', function() {
  var filepath = _(siteContext.site.posts).last().htmlPath();
  // Added timeout.
  // Even though the build-posts task is async and this is run afterward, 
  // sometimes the stream for the last post is not complete.
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    gulp.src([deployDest, filepath].join('/')).pipe(gulp.dest(deployDest));
  }, 1000);
});

gulp.task('build-archive', function() {
  gulp.src('app/templates/archive.us')
      .pipe(archive(siteContext))
      .pipe(wrap('app/templates/wrapper.us'))
      .pipe(htmlize())
      .pipe(gulp.dest(deployDest));
});

gulp.task('build-copy', function() {
  gulp.src('app/lib/highlight/highlight.pack.js')
      .pipe(gulp.dest(deployDest + '/lib/highlight'));
  gulp.src('app/' + siteContext.highlightcss)
      .pipe(gulp.dest(deployDest + '/lib/highlight/styles'));
  gulp.src(['app/asset/**/*']).pipe(gulp.dest(deployDest + '/asset'));
  gulp.src(['app/image/**/*']).pipe(gulp.dest(deployDest + '/image'));
  gulp.src(['app/style/**/*']).pipe(gulp.dest(deployDest + '/style'));
  gulp.src('.htaccess').pipe(gulp.dest(deployDest));
});

gulp.task('build-rss', function() {
  var filepath = path.join(__dirname, deployDest, 'index.xml');
  var file = new gutil.File({
        path: filepath,
        contents: new Buffer('<?xml version="1.0" encoding="UTF-8"?>')
      });
  
  file.pipe(fs.createWriteStream(filepath));
  gulp.src(filepath)
      .pipe(rssize(siteContext.site.posts, extend({length:siteContext.site.rssCount}, siteContext)))
      .pipe(gulp.dest(deployDest));
});

gulp.task('build', function() {
  orcha.start('build', function(err) {
    if(err) {
      console.log('Error in build: ' + err);
    }
  });
});

orcha.add('build-posts', function() {
  return gulp.src(['blog-posts/**/*.md'])
      .pipe(stripheader({post:true}))
      .pipe(markdown({
          highlight: function (code, lang) {
            if(lang && highlight.LANGUAGES[lang]) {
              return highlight.highlight(lang, code, true).value;
            }
            return highlight.highlightAuto(code).value;
          }
      }))
      .pipe(template('app/templates/post.us'))
      .pipe(wrap('app/templates/wrapper.us'))
      .pipe(gulp.dest(deployDest + '/blog-posts'));
});

orcha.add('build', ['build-posts'], function() {
  gulp.run('build-archive');
  gulp.run('build-rss');
  gulp.run('build-copy');
  gulp.run('build-index');
  gulp.run('build-pages');
});

gulp.task('build-local', function() {
  defineEnvironment(ENV_LOCAL);
  gulp.run('build');
});

gulp.task('build-remote', function() {
  defineEnvironment(ENV_REMOTE);
  gulp.run('build');
});

gulp.task('watch', function() {
  defineEnvironment(ENV_LOCAL);
  gulp.src('blog-posts/**/*.md')
      .pipe(watch(function() {
        gulp.run('build-posts');
      }));

});

gulp.task('deploy', function() {
  ssh.exec({
    command: ['uptime', 'ls -a'],
    sshConfig: {
      host: 'xxx.xx.xx.xx',
      port: 22,
      username: 'xxx',
      password: 'xxx'
    }
  });
});