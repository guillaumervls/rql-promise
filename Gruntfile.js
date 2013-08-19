module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        indent: 2,
        camelcase: true,
        nonew: true,
        plusplus: true,
        quotmark: true,
        bitwise: true,
        forin: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        undef: true,
        unused: true,
        regexp: true,
        trailing: true,
        node: true,
        globals: {
          define: true,
          require: true
        }
      },
      gruntfile: {
        files: {
          src: ['Gruntfile.js']
        }
      },
      dev: {
        files: {
          src: ['rql-promise.js']
        },
        options: {
          debug: true,
          devel: true
        }
      },
      dist: {
        files: {
          src: ['rql-promise.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('default', 'jshint:dev');
};