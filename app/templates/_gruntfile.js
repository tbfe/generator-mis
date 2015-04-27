module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
              files:[{
                expand:true,
                flatten:true,
                src: 'bower_components/bootstrap/dist/fonts/**',
                dest: 'static/lib/bootstrap/fonts/'
              },{
                expand:true,
                flatten:true,
                src: 'bower_components/bootstrap/dist/css/**',
                dest: 'static/lib/bootstrap/css/'
              },{
                expand:true,
                flatten:true,
                src: 'bower_components/bootstrap/dist/js/**',
                dest: 'static/lib/bootstrap/js/'
              }<% if(uiPlugins.indexOf('sweetalert') > -1) {%>,{
                src: 'bower_components/sweetalert/lib/sweet-alert.css',
                dest: 'static/lib/sweetalert/sweet_alert.css'
              },{
                src: 'bower_components/sweetalert/lib/sweet-alert.js',
                dest: 'static/lib/sweetalert/sweet_alert.js'
                }<% } %><% if(uiPlugins.indexOf('bootstrap-material-design') > -1) {%>,{
                expand:true,
                flatten:true,
                src: 'bower_components/bootstrap-material-design/dist/fonts/**',
                dest: 'static/lib/bootstrap-material-design/fonts/'
              },{
                expand:true,
                flatten:true,
                src: 'bower_components/bootstrap-material-design/dist/css/**',
                dest: 'static/lib/bootstrap-material-design/css/'
              },{
                expand:true,
                flatten:true,
                src: 'bower_components/bootstrap-material-design/dist/js/**',
                dest: 'static/lib/bootstrap-material-design/js/'
              },{
                expand:true,
                flatten:true,
                src: 'bower_components/snackbarjs/src/**',
                dest: 'static/lib/snackbarjs/'
              },{
                expand:true,
                flatten:true,
                src: 'bower_components/arrive/src/**',
                dest: 'static/lib/arrive/'
              }<% } %><% if(uiPlugins.indexOf('animate.css') > -1) {%>,{
                src: 'bower_components/animate.css/animate.css',
                dest: 'static/lib/animate.css'
              }<% } %><% if(uiPlugins.indexOf('ztree') > -1) {%>,{
                src: 'bower_components/ztree_v3/js/jquery.ztree.all-3.5.js',
                dest: 'static/lib/ztree_v3/js/ztree.js'
              },{
                src: 'bower_components/ztree_v3/css/metroStyle/metroStyle.css',
                dest: 'static/lib/ztree_v3/css/metroStyle/metroStyle.css'
              },{
                expand:true,
                flatten:true,
                src: 'bower_components/ztree_v3/css/metroStyle/img/**',
                dest: 'static/lib/ztree_v3/css/metroStyle/img/'
              },{
                src: 'bower_components/ztree_v3/css/zTreeStyle/zTreeStyle.css',
                dest: 'static/lib/ztree_v3/css/zTreeStyle/zTreeStyle.css'
              },{
                expand:true,
                flatten:true,
                src: 'bower_components/ztree_v3/css/zTreeStyle/img/**',
                dest: 'static/lib/ztree_v3/css/zTreeStyle/img/'
              }<% } %><% if(uiPlugins.indexOf('highcharts-ng') > -1) {%>,{
                src: 'bower_components/highcharts-ng/dist/highcharts-ng.js',
                dest: 'static/lib/highcharts-ng/highcharts-ng.js'
              },{
                src: 'bower_components/highcharts-release/highcharts.js',
                dest: 'static/lib/highcharts/highcharts.js'
              }<% } %><% if(uiPlugins.indexOf('lodash') > -1) {%>,{
                src: 'bower_components/lodash/lodash.js',
                dest: 'static/lib/lodash/lodash.js'
              }<% } %><% if(uiPlugins.indexOf('moment') > -1) {%>,{
                src: 'bower_components/moment/moment.js',
                dest: 'static/lib/moment/moment.js'
              }<% } %><% if(uiPlugins.indexOf('pace') > -1) {%>,{
                src: 'bower_components/pace/pace.js',
                dest: 'static/lib/pace/pace.js'
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