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
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-markdown-blog');

  grunt.registerTask('dryrun', ['markdown:dev']);
  // grunt.registerTask('deploy', ['markdown:dev', 'copy:dist', 'uglify']);
  
  // Default task.
  grunt.registerTask('default', ['jshint']);

};