---
title: 'BDD in JavaScript III: CucumberJS and Test Automation'
author:
  name: 'todd anderson'
date: '2014-01-29'
---
In my [previous post](http://custardbelly.com/blog/blog-posts/2014/01/22/cucumberjs-world/index.html) I addressed the concepts of the __World__ context and __Background__ scenario. I am going to pause in actually working with [CucumberJS](https://github.com/cucumber/cucumber-js) in delivering code in a BDD manner for this article and address another vital part of the development process: __Automation__.

### &gt; code
Supported files related to this and any subsequent posts on this topic will be available at:  
[https://github.com/bustardcelly/cucumberjs-examples](https://github.com/bustardcelly/cucumberjs-examples)

## Why Automate?
The benefit of automation is in time saved. If we can pinpoint tasks that we do repetitively during development and automate them, we can save large amounts of time that could be put back into doing more coding, thinking, learning, laughing, beering - the list goes on.

While going through the basics of [CucumberJS](https://github.com/cucumber/cucumber-js) in the previous articles, I was demonstrating how I use the tool to TDD from the outside-in and constantly hopping back and forth from my code editor to the terminal to run this simple command over and over:

```
$ node node_modules/.bin/cucumber-js
```

Now, I am pretty good at `CMD+TAB` - not to brag - but I would much prefer to get feedback on my tests instantly as I describe my asserts and modify my code. If we automate the running of __Cucumber__ on file change, we can start seeing results quicker and we can take that time removed from manually switching between editor and terminal and running commands and put that time back into thinking how to design our code more cleanly :)

This automation and instant feedback really shows its worth in the __Refactor__ phase in which you have previously implemented code to pass the criteria in a __Feature__.

## Task Automation and JavaScript
When talking about build tools and task automation for JavaScript projects, there are roughly 3 types of task runners that are brought up:

1. [Grunt](http://gruntjs.com/)
2. [Gulp](http://gulpjs.com/)
3. [npm run](http://substack.net/task_automation_with_npm_run)

There are additional tools that have been around for some time - particularly, in the past I have used [Ant](http://ant.apache.org/) and [Make](http://www.gnu.org/software/make/) for my build process - but, generally speaking, these are the prevelant tools of the trade in JavaScript as it stands today. 

Some people think that each oppose each other, but I lean toward utilizing one or the others based on its merits and the requirements of a project. I have several on-going projects, both professional and personal, and each project actually incorporates one of each of these. I will discuss my thoughts on the value of each tool within each section in which I set up automation for our [Cucumber](https://github.com/cucumber/cucumber-js) tests.

## Npm run
I'll start off with the basics. By basics, I mean that there is no additonal tool required to install and get up and running with our test automation; we have everything already installed that we need: node & npm.

### Benifits
[James Halliday](https://twitter.com/substack) had previously written a [great post](http://substack.net/task_automation_with_npm_run) addressing the use of `npm run` in task automation, and I agree in so far as keeping things simple. The benefits of defining tasks in the `scripts` tag of your `package.json` file are __a) simplicity__ and __b) no additional tooling__. I do have the reservations that the "simplicity" vanishes if you have to eventually maintain dozens of tasks - some that may be similar with different arguments - and continually want to run series and parallels. 

When your build process becomes more complex, [James Halliday](https://twitter.com/substack) does mention moving it to a bash file, but I would argue to perhaps look at a more robust solution with the tools described previously (and in more detail later in this article).

### Usage
If we were to simply take the process of running our tests as we have in previous articles, we can modify our `package.json` file by adding the following `scripts` tag and task:

_package.json_

```
{
  "name": "cucumberjs-examples",
  ...
  "scripts": {
      "test": "node node_modules/.bin/cucumber-js"
  }
  ...
}
```

Plain and simple. To run it, we'd hop over to our terminal:

```
$ npm run test

> cucumberjs-examples@0.1.0 test /Users/toddanderson/Documents/workspace/custardbelly/cucumberjs-example
> node node_modules/.bin/cucumber-js
........

2 scenarios (2 passed)
8 steps (8 passed)
```

Same result. We get to type less now, so that's good. However, we are not really automating the process for running our tests. As mentioned previously, we are looking for the benefit of automating the running of our tests on change to __Step Definitions__ and code.

As such, we create a simple node script that will watch our `script` and `feature/step_definitions` and run the [CucumberJS](https://github.com/cucumber/cucumber-js) CLI tool on each change:

__cuke-watcher.js__

```
#!/usr/bin/env node
var watch = require('node-watch');
var child_process = require('child_process');
var running = false;
var cucumber;

var JS_EXT = /^.*\.js/i;
var options = ['node_modules/.bin/cucumber-js', 
               'features', 
               '-r', 'features/step_definitions',
               '-f', 'pretty'];

watch(['./features/step_definitions', 'script'], {recursive:true}, function(filename) {
  
  if(!running && filename.match(JS_EXT)) {

    running = true;
    
    cucumber = child_process.spawn('node', options)
                    .on('exit', function() {
                      running = false;
                    });

    cucumber.stdout.on('data', function(d) {
      console.log(String(d));
    });

    cucumber.stderr.on('data', function(d) {
      console.error(String(d));
    });

  }

});
```

We are using the wonderful [node-watch](https://npmjs.org/package/node-watch) module that is a convenient wrapper to `fs.watch`, and upon change, we spawn the __Cucumber__ tool as a child process. Running __Cucumber__ as a child process allows it to exit its own process without having to exit the `watch` process, which would kill all automation.

Modify our `package.json` to invoke this script:

_package.json_

```
{
  "name": "cucumberjs-examples",
  ...
  "scripts": {
      "test": "node node_modules/.bin/cucumber-js",
      "watch": "node cuke-watcher.js"
  }
  ...
}
```

And run it in the terminal:

```
$ npm run watch
```

And you will see the cursor flash with the `watch` process running. If you were to modify any of the __Step Definition__ or source files of our current [Grocery List](https://github.com/bustardcelly/cucumberjs-examples) example project, you would see [CucumberJS](https://github.com/cucumber/cucumber-js) run and produce the same results as before - the only difference is that it is now waiting for you to modify them again so it can run again.

It will continue to `watch` and run tests until you exit the process, most commonly done by focusing on the terminal and hitting `CTRL+C`.

## Grunt
Up until a few years ago, I  stuck with what I knew best and preferred to maintain builds for my JavaScript projects using [Make](http://www.gnu.org/software/make/). After having the fortunate opportunity to hear [Ben Alman](http://benalman.com/) speak and demonstrate [Grunt](http://gruntjs.com/) at [TXJS](http://2013.texasjavascript.com/) in 2012, I decided to give __Grunt__ a real try - and I have, for the most part, not looked back.

[Grunt](http://gruntjs.com/) is my go-to task automation tool for large projects that involve various complex tasks for developing, testing and deployment. For the most part, if my tasks are not solely based on files, I will incorporate __Grunt__ into my project. 

Along with a solid history and great documentation, there is also a very active community that creates task plugins for __Grunt__: [http://gruntjs.com/plugins](http://gruntjs.com/plugins). You can find virtually anything you need, and if for some odd reason you can't, you can create one: [Creating Grunt Plugins Docs](http://gruntjs.com/creating-plugins).

_It is too much for this article to get into a discussion about __Grunt__ and its concepts, so please read the [documentation](http://gruntjs.com/getting-started) on their site for clarity. In this section I intend to address how to use __Grunt__ to automate the tests we have been developing in this series._

### Usage
Just as we setup a watcher for our __Step Definitions__ and scripts for our `npm run` example, we will be using 2 [Grunt](http://gruntjs.com/) plugin tasks provided by the wonderful development community:

* [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) - maintained by the contributors for gruntjs
* [grunt-cucumber](https://github.com/s9tpepper/grunt-cucumber-js) - maintained by venerable developer [Omar Gonzalez](https://twitter.com/s9tpepper)

I will assume you have [Grunt installed properly](http://gruntjs.com/getting-started) and start with the `Gruntfile`:

_Gruntfile.js_

```
module.exports = function(grunt) {
  'use strict';
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      cucumber: {
        files: ['features/**/*.js', 'script/**/*.js'],
        tasks: ['cucumberjs']
      }
    },
    cucumberjs: {
      src: 'features',
      options: {
        steps: 'features/step_definitions',
        format: 'pretty'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-cucumber');

  grunt.registerTask('watch-tests', 'Starts a watch for test automation.', ['watch:cucumber']);

};
```

Within the `Gruntfile` we have configured `cucumberjs` task with the same arguments we have been using in previous examples and configured a `watch` task to listen for changes to JavaScript files in the _features_ and _script_ directories.

Additionally, we have defined a `watch-tests` task which we can invoke using __Grunt__ from the command line:

```
$ grunt watch-tests
```

Running that will do, essentially, what we have done using `npm run` in the previous section: the `watch` process will be active and execute the __Cucumber__ specs upon a change to JavaScript files in the target directories. To stop the task from running, focus on the terminal and `CTRL+C` to exit the process.

## Gulp
[Gulp](http://gulpjs.com/) is a (relatively) new-comer to the JavaScript-based task runner ecosystem. Like [Grunt](http://gruntjs.com/), it is a task-based build tool that has [good documentation](https://github.com/gulpjs/gulp/blob/master/README.md) and a lively community [contributing plugins](http://gratimax.github.io/search-gulp-plugins/). All good things.

[Gulp](http://gulpjs.com/)'s build system uses [streams](http://nodejs.org/api/stream.html) which allows you to pipe multiple tasks together. As well, the tasks defined in the `gulpfile` are the code itself - as opposed to __Grunt__ in which you provide a configuration for your tasks that are consumed by __Grunt__ and provided to the targetted plugin through a task registry.

There are [plenty](http://blog.ponyfoo.com/2014/01/09/gulp-grunt-whatever) of [other articles](http://www.100percentjs.com/just-like-grunt-gulp-browserify-now/) [contrasting the two](http://jaysoo.ca/2014/01/27/gruntjs-vs-gulpjs/), so I won't rehash them here. I will say that I choose __Gulp__ over __Grunt__ in projects where the build requirements are strictly focused on files - ie, take these files, do something to them (min, concat) and put them in this directory.

__As a side note: I highly recommend [James Halliday](https://twitter.com/substack)'s excellent [stream-handbook](https://github.com/substack/stream-handbook) to get a better understanding of streams in [node](http://nodejs.org).__

### Usage
The [plugin community](http://gratimax.github.io/search-gulp-plugins/) for [Gulp](http://gulpjs.com/) is fairly active, but as I mentioned previously __Gulp__'s system is really based on streams. As such, I don't intend to see a plugin for running [CucumberJS](https://github.com/cucumber/cucumber-js) tests specifically, as we have with [grunt-cucumber](https://github.com/s9tpepper/grunt-cucumber-js) - nor do intend to make one or continue to look for one: I don't think such a plugin is well suited to __Gulp__.

That's said, we can certainly set up a `watch` task on our __Step Definitions__ and scripts just as we have in the previous examples!

__gulpfile.js__

```
var gulp = require('gulp');
var watch = require('gulp-watch');
var child_process = require('child_process');

var cucumber;
var running = false;
var options = ['node_modules/.bin/cucumber-js',
               'features', 
               '-r', 'features/step_definitions',
               '-f', 'pretty'];

gulp.task('cucumber', function() {
  if(!running) {
    running = true;
    cucumber = child_process.spawn('node', options)
                    .on('exit', function() {
                      running = false;
                    });
    cucumber.stdout.on('data', function(d) {
      console.log(String(d));
    });

    cucumber.stderr.on('data', function(d) {
      console.error(String(d));
    });
  }
});

gulp.task('watch-tests', function() {
  gulp.src(['features/**/*.js', 'script/**/*.js'])
      .pipe(watch(function() {
        gulp.run('cucumber');
      }));
});
```

Running that is very similar to how we ran our __Grunt__ task:

```
$ gulp watch-tests
```

As you may notice, this example fairly similar to the `npm run` example shown previously. The main difference is that we pipe the streams through the `gulp-watch` plugin which triggers [CucumberJS](https://github.com/cucumber/cucumber-js) as a child process upon change to targetted files.

## Conclusion
So, which one should you use? Whichever! They each have their merits and it should be discussed with your team in alignment with the requirements for the current project.

It was my intent to showcase how to incoporate automated testing with [CucumberJS](https://github.com/cucumber/cucumber-js) using the three most popular task runner / build tools so we can devote more time to thinking about design instead of hopping from our code editor to the terminal for each change to our __Step Definitions__.

I didn't introduce any new concepts related to [CucumberJS](https://github.com/cucumber/cucumber-js), itself, but felt it necessary to address automation at this stage within the series as I feel it is a vital part to Test-Driven Development and the Agile process and something that should be addressed in the early stages of a project.

That said, I look forward to the next article where we get to write more tests and which I intend to introduce running tests in a browser environment :)

Source for examples related to this post can be found in the [0.3.0.post tag on my Github account](https://github.com/bustardcelly/cucumberjs-examples/tree/0.3.0.post).