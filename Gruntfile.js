/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
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
        dest: 'generated',
        context: {
          rootlocation: '',
          css: 'style/main.css',
          highlightjs: 'lib/highlight/highlight.pack.js',
          highlightcss: 'lib/highlight/styles/github.css'
        }
      },
      dist: {
        dest: 'dist',
        context: {
          rootlocation: 'http://custardbelly.com/blog',
          css: 'style/main.css',
          highlightjs: 'lib/highlight/highlight.pack.js',
          highlightcss: 'lib/highlight/styles/github.css'
        }
      }
    }
    // markdown: {
    //   all: {
    //     files: [
    //       {
    //         expand: true,
    //         cwd: 'blog-posts',
    //         src: ['**/*.md'],
    //         dest: 'dist/',
    //         ext: '.html'
    //       }
    //     ]
    //   }
    // }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-markdown-blog');
  // grunt.loadNpmTasks('grunt-markdown');

  grunt.registerTask('dryrun', ['markdown:dev', 'copy:dev']);
  grunt.registerTask('deploy', ['markdown:dist', 'copy:dist']);

  // Default task.
  grunt.registerTask('default', ['jshint']);

};