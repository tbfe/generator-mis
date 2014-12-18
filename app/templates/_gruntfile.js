module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
              files:[<% if(uiPlugins.indexOf('sweetalert') > -1) {%>{
                    src: 'bower_components/sweetalert/lib/sweet-alert.css',
                    dest: 'static/libs/sweetalert/sweet_alert.css'
                },{
                    src: 'bower_components/sweetalert/lib/sweet-alert.js',
                    dest: 'static/libs/sweetalert/sweet_alert.js'
                }<% } %><% if(uiPlugins.indexOf('animate.css') > -1) {%><% if(uiPlugins.indexOf('sweetalert') > -1) {%>,<%}%>{
                    src: 'bower_components/animate.css/animate.css',
                    dest: 'static/libs/animate.css'
                }<% } %>
              ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy']);

};