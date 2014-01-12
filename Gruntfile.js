/*global module:false*/
var path = require('path');

module.exports = function(grunt) {

  var configuration = grunt.file.readJSON('grunt-settings.json');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),
    config: configuration,

    // Task configuration.
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    },
    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['lib/highlight/highlight.pack.js', 'lib/highlight/styles/github.css'],
            dest: '<%= markdown.dev.dest %>'
          },
          {
            expand: true,
            cwd: 'app',
            src: ['style/**/*.css'],
            dest: '<%= markdown.dev.dest %>'
          },
          {
            expand: true,
            cwd: 'app',
            src: ['asset/**/*.png', 'asset/**/*.svg'],
            dest: '<%= markdown.dev.dest %>'
          },
          {
            expand: true,
            cwd: './',
            src: ['.htaccess'],
            dest: '<%= markdown.dev.dest %>'
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['lib/highlight/highlight.pack.js', 'lib/highlight/styles/github.css'],
            dest: '<%= markdown.dist.dest %>'
          },
          {
            expand: true,
            cwd: 'app',
            src: ['style/**/*.css'],
            dest: '<%= markdown.dist.dest %>'
          },
          {
            expand: true,
            cwd: 'app',
            src: ['asset/**/*.png', 'asset/**/*.svg'],
            dest: '<%= markdown.dist.dest %>'
          },
          {
            expand: true,
            cwd: './',
            src: ['.htaccess'],
            dest: '<%= markdown.dist.dest %>'
          }
        ]
      }
    },
    markdown: {
      options: {
        author: 'Todd Anderson',
        title: 'Todd Anderson',
        description: 'ramblings about making things for web, mobile, desktop and land.',
        url: 'http://custardbelly.com/blog',
        disqus: 'custardbelly',
        rssCount: 10,
        dateFormat: 'YYYY MMMM Do',
        layouts: {
          wrapper: 'app/templates/wrapper.us',
          index: 'app/templates/index.us',
          post: 'app/templates/post.us',
          page: 'app/templates/page.us',
          archive: 'app/templates/archive.us'
        },
        paths: {
          posts: 'blog-posts/**/*.md',
          pages: 'blog-pages/**/*md',
          index: 'index.html',
          archive: 'archive.html',
          rss: 'index.xml'
        },
        pathRoots: {
          posts: '*',
          pages: '*'
        },
      },
      dev: {
        dest: '<%= config.dev %>',
        context: {
          rootlocation: '<%= config.site.dev %>',
          css: 'style/main.css',
          highlightjs: 'lib/highlight/highlight.pack.js',
          highlightcss: 'lib/highlight/styles/github.css'
        }
      },
      dist: {
        dest: '<%= config.dist %>',
        context: {
          rootlocation: '<%= config.site.dist %>',
          css: 'style/main.css',
          highlightjs: 'lib/highlight/highlight.pack.js',
          highlightcss: 'lib/highlight/styles/github.css'
        }
      }
    },
    exec: {
      yslow: {
        cmd: 'phantomjs yslow.js --info basic --format plain <%= config.site.dist %>'
      },
      sitespeed: {
        cmd: '<%= config.sitespeed %> -u <%= config.site.dist %> -r ' + __dirname + '/doc/metrics'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-markdown-blog');
  grunt.loadNpmTasks('grunt-exec');

  /**
   * Runs metrics on deployed site at http://qa.infrared5.com
   */
  grunt.registerTask('metrics', 'Running site speed metrics on http://custardbelly.com/blog', ['exec']);

  /**
   * Generate files to test locally.
   */
  grunt.registerTask('dryrun', ['markdown:dev', 'copy:dev']);
  /**
   * Generate files to run on http://custardbelly.com/blog
   */
  grunt.registerTask('build', ['markdown:dist', 'copy:dist']);

  // Default task.
  grunt.registerTask('default', ['jshint']);

};