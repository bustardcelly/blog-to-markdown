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
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= markdown.dev.dest %>/blog-posts',
            src: ['**/*'],
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: '<%= markdown.dev.dest %>',
            src: ['archive.html', 'index.html', 'index.xml'],
            dest: 'dist/'
          }
        ]
      }
    },
    markdown: {
      options: {
        author: 'Todd Anderson',
        title: 'it\'s a long story',
        description: 'ramblings about making things for web, mobile, desktop and land.',
        url: 'http://custardbelly.com/blog',
        // disqus: 'xyz',
        rssCount: 10,
        dateFormat: 'YYYY MMMM Do',
        layouts: {
          wrapper: 'app/templates/wrapper.us',
          index: 'app/templates/index.us',
          post: 'app/templates/post.us',
          archive: 'app/templates/archive.us'
        },
        paths: {
          posts: 'blog-posts/**/*.md',
          index: 'index.html',
          archive: 'archive.html',
          rss: 'index.xml'
        },
        pathRoots: {
          posts: '*'
        }
      },
      dev: {
        dest: 'generated'
      },
      dist: {
        dest: 'dist'
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

  grunt.registerTask('dryrun', ['markdown:dev']);
  // grunt.registerTask('deploy', ['markdown:dev', 'copy:dist', 'uglify']);

  // Default task.
  grunt.registerTask('default', ['jshint']);

};