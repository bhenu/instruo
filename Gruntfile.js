module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        my_targer: {
            files: {
                'dist/js/main.min.js': 'src/js/main.js',
                'dist/js/plugins.min.js': 'src/js/plugins.js'
            }
        }
    },

    jshint: {
        options: {
            curly: true,
            eqeqeq: true,
            eqnull: true,
            globals: {
                jQuery: true
            },
        },
        files: {
            src: ['src/js/main.js', 'src/js/plugins.js']
        }
    },

    cssmin: {
        combine: {
            files: {
                'dist/css/main.min.css': ['src/css/normalize.css', 'src/css/main.css']
            }
        },
        add_banner: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            files: {
                'dist/css/main.min.css': ['dist/css/main.min.css']
            }
        }
    },
    watch: {
        options: {
            livereload: true
        },
        src: {
          files: ['src/js/*.js', 'src/css/*.css', '*.html'],
          tasks: ['default']
        }
    }
});

// Load the packages for performing the tasks
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-watch');

// Default task(s).
grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);
grunt.registerTask('livewatch', 'watch');

};
