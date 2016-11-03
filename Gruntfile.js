'use strict';

var ngrok = require('ngrok');
var unirest = require('unirest');
var jsonfile = require('jsonfile');
var util = require('util');
var fs = require('fs');
var glob = require('glob-fs')({gitignore: true});

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
            files: ['tmp/*']
        },

        /* Serve up the project on localhost */
        connect: {
            server: {
                options: {
                    protocol: 'http',
                    port: 9001,
                    hostname: '*',
                    base: 'src',
                    directory: 'src',
                    keepalive: true
                }
            }
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
                    saveOutputIn: 'responsiveTablet.json'
                },
                src: [
                    'src/*.html'
                ]
            },

            /* Test accessibility after triggering media query for phone */
            responsivePhone: {
                options: {
                    viewPortWidth: '320',
                    saveOutputIn: 'responsivePhone.json'
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


    grunt.registerTask('tenonlive', 'Test the project URLs on localhost using NGrok', function () {
        var done = this.async();
        var config = JSON.parse(require('fs').readFileSync('.tenonrc', 'utf8'));

        ngrok.connect({
            addr: '9001', // port or network address
            authtoken: '5AaXuMb5dTAff2rfYFBDY_4zTRbQJnyTByNS3GMMuxD' // your authtoken from ngrok.com
        }, function (err, url) {

            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }

            grunt.log.writeln('ngrok URL: ' + url);

            // do the loop-de-doo on all the project files
            var filenames, i, testUrl;

            // read all the HTML files in the project
            filenames = glob.readdirSync('/**/*.html');
            filenames.forEach(function (fName) {

                // Although grunt-connect allows us to set the docroot to 'src',
                // we need to strip that to assemble our test URL
                testUrl = url + '/' + fName.replace('src/', '');

                grunt.log.writeln('Test Url: ' + testUrl);

                // All of these 'config.*' items come from the .tenonrc file
                unirest.post(config.apiURL).send({
                    key: config.key,
                    url: testUrl,
                    projectID: config.projectID,
                    certainty: config.certainty,
                    level: config.level,
                    priority: config.priority,
                    ref: config.ref,
                    store: config.store
                }).header('Accept', 'application/json').end(function (response) {
                    grunt.log.writeln('Testing: ');
                    grunt.log.writeln('Status: ' + response.status);

                    if (response.status > 200) {
                        grunt.fail.fatal('Tenon API response: ' + response.status);
                        return done();
                    }

                    var data = JSON.parse(JSON.stringify(response.body));
                    grunt.log.writeln('responseID: ' + data.request.responseID);
                    grunt.log.writeln('Total Errors: ' + data.resultSummary.issues.totalErrors);
                    grunt.log.writeln('Total Warnings: ' + data.resultSummary.issues.totalWarnings);

                    var file = 'tmp/' + data.request.responseID + '.json';

                    // write the results to a JSON file
                    jsonfile.writeFile(file, data, function (err) {
                        if (err) {
                            grunt.log.writeln('Error Writing File: ' + err);
                            grunt.log.writeln('--------------------');
                        }
                        else {
                            grunt.log.writeln('Response Saved To: ' + file);
                            grunt.log.writeln('--------------------');
                        }
                    });

                });
            });

        });
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'jsonlint', 'tenon']);
};
