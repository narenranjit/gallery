'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            compass: {
                files: ['src/styles/**/*.scss'],
                tasks: ['compass']
            },
            jst: {
                files: ['src/templates/**/*.tmpl'],
                tasks: ['jst']
            },
            js: {
                files: [ 'src/scripts/**/*.js'],
                tasks: 'browserify2'
            },
            options: {
                nospawn: true,
                livereload: {
                    port: LIVERELOAD_PORT
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                directory: './public'

            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, './public')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        browserify2: {
            dev: {
                entry: './src/scripts/app.js',
                compile: './public/scripts/app.js',
                debug: true,
                options: {
                    expose: {
                        files: [
                            {
                                cwd: 'src/scripts/views/',
                                src: ['**/*.js'],
                                dest: 'views/'
                            },
                            {
                                cwd: 'src/scripts/models/',
                                src: ['**/*.js'],
                                dest: 'models/'
                            },
                            {
                                cwd: 'src/scripts/collections/',
                                src: ['**/*.js'],
                                dest: 'collections/'
                            }
                        ]
                    }
                }
            }
        },

        jst: {
            compile: {
                options: {
                    namespace: 'App.tmpl',
                    prettify: true,
                    amdWrapper: false,
                    processName: function (filename) {
                        var fullName = filename.split('src/templates/');
                        var changedName = fullName[1].replace(/(\-[a-z])/g, function ($1) {return $1.toUpperCase().replace('-', ''); });
                        return changedName.replace('.tmpl', '');
                    }
                },
                files: {
                    'public/scripts/templates.js': ['src/templates/**/*.tmpl']
                }
            }
        },

        compass: {
            dev: {
                options: {
                    sassDir: 'src/styles',
                    cssDir: 'public/styles',
                    imagesDir: 'public/styles/assets/images',
                    javascriptsDir: 'public/scripts',
                    fontsDir: 'public/styles/assets/fonts',
                    environment: 'dev',
                    outputStyle: 'expanded',
                    relativeAssets: true
                }
            }
        }
    });

    grunt.registerTask('server', ['connect:livereload', 'open', 'watch']);
    grunt.registerTask('init', ['compass', 'jst', 'browserify2']);


    grunt.registerTask('default', ['watch']);
};
