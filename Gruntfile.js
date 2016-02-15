'use strict';

module.exports = function (grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        datetime: Date.now(),

        clean: {
            files: ['dist/*']
        },

        /* Run JSHint on our JS files */
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['src/**/*.js']
            }
        },

        /* Run JSONLint on our configuration files */
        jsonlint: {
            configFiles: {
                src: ['bower.json', 'package.json', '.bowerrc', '.jshintrc', '.tenonrc']
            }
        },

        /* Run tenon before every commit */
        githooks: {
            all: {
                options: {
                    preventExit: true
                },
                'pre-commit': 'tenon'
            }
        },

        webdriver: {
            options: {
                desiredCapabilities: {
                    browserName: 'chrome'
                }
            },
            all: {
                tests: ['test/**/*Spec.js'],
            }
        },

        /* Run our accessibility tasks */
        tenon: {
            /* Set most Tenon options in external file */
            options: {
                config: '.tenonrc'
            },

            /* Test accessibility after triggering media query for tablet */
            responsiveTablet: {
                options: {
                    viewPortWidth: '1024',
                    saveOutputIn: 'responsiveTablet.json',
                },
                src: [
                    'src/*.html'
                ]
            },

            /* Test accessibility after triggering media query for phone */
            responsivePhone: {
                options: {
                    viewPortWidth: '320',
                    saveOutputIn: 'responsivePhone.json',
                },
                src: [
                    'src/*.html'
                ]
            },


            /* Test em all under default settings */
            all: {
                src: [
                    'src/*.html'
                ]
            },
        },

        shell: {
            dirListing: {
                command: 'ls'
            }
        },

        /* Watch tasks */
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'jshint']
            },
            html: {
                files: ['**/*.html'],
                tasks: ['tenon']
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'jsonlint', 'tenon']);
};
