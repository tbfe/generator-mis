<?
/**
 * @author <%= author %>
 * @date <%= date %>
 */
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title><%= projectName %></title>
    <link rel="shortcut icon" href="http://static.tieba.baidu.com/tb/favicon.ico" />
    <?php
      echo HTML::combocss(array(
        '<%= modName %>/lib/bootstrap/css/bootstrap.css',<% if(uiPlugins.indexOf('sweetalert')>-1){ %>
        //sweetalert插件 doc:http://tristanedwards.me/sweetalert
        '<%= modName %>/lib/sweetalert/sweet_alert.css',<% } %><% if(uiPlugins.indexOf('animate.css')>-1){ %>
        //animate.css插件 doc:http://daneden.github.io/animate.css/
        '<%= modName %>/lib/animate.css',<% } %><% if(uiPlugins.indexOf('ztree')>-1){ %>
        //树状插件 doc:http://www.ztree.me/v3/api.php
        '<%= modName %>/lib/ztree/css/metroStyle/metroStyle.css',<% } %><% if(uiPlugins.indexOf('bootstrap-material-design')>-1){ %>
        //bootstrap material design doc:http://fezvrasta.github.io/bootstrap-material-design/bootstrap-elements.html
        '<%= modName %>/lib/snackbarjs/snackbar.css',
        '<%= modName %>/lib/bootstrap-material-design/css/material-fullpalette.css',
        '<%= modName %>/lib/bootstrap-material-design/css/ripples.css',<% } %>

        //views下面合并后的css
        '<%= modName %>/<%= projectFoler %>/app_all.css',
        //本项目css 文件
        '<%= modName %>/template/<%= projectFoler %>/index.css'
      ));
    ?>
    <?php
      echo HTML::combojs(array(
        'devplatcommon/lib/jquery/jquery.js',<% if(uiPlugins.indexOf('bootstrap-material-design')>-1){ %>
        //伴随bootstrap material design 的snackbar 消息提示插件
        '<%= modName %>/lib/snackbarjs/snackbar.js',<% } %><% if(uiPlugins.indexOf('sweetalert')>-1){ %>
        //sweetalert插件 doc:http://tristanedwards.me/sweetalert
        '<%= modName %>/lib/sweetalert/sweet_alert.js',<% } %>
        'devplatcommon/lib/require/require.js'));

      echo HTML::combojs(array(
        'devplatcommon/lib/angular/angular.js',
        'devplatcommon/lib/angular/angular-resource.js',
        'devplatcommon/lib/angular/angular-route.js', 
        'devplatcommon/lib/angular/angular-sanitize.js',
        'devplatcommon/lib/angular/ui-bootstrap.js',

        '<%= modName %>/lib/bootstrap/js/bootstrap.js',
        //内部平台公共库
        'devplatcommon/js/ng_common/ng_common.js',<% if(uiPlugins.indexOf('highcharts-ng')>-1){ %>
        //highchart的angular封装 doc:https://github.com/pablojim/highcharts-ng
        '<%= modName %>/lib/highcharts/highcharts.js',
        '<%= modName %>/lib/highcharts-ng/highcharts-ng.js',<% } %><% if(uiPlugins.indexOf('ztree')>-1){ %>
        '<%= modName %>/lib/ztree/js/ztree.js',<% } %><% if(uiPlugins.indexOf('lodash')>-1){ %>
        '<%= modName %>/lib/lodash/lodash.js',<% } %><% if(uiPlugins.indexOf('moment')>-1){ %>
        '<%= modName %>/lib/moment/moment.js',<% } %><% if(uiPlugins.indexOf('bootstrap-material-design')>-1){ %>
        '<%= modName %>/lib/arrive/arrive.js',
        '<%= modName %>/lib/bootstrap-material-design/js/ripples.js',
        'automation/lib/bootstrap-material-design/js/material.js',<% } %>

        '<%= modName %>/template/<%= projectFoler %>/index.js'
      ));
    ?>
  </head>
  <body>
      <div class="navbar navbar-default">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#"> <img src='../../static/img/tb-logo.png'> </a>
        </div>
      <navbar></navbar>
    </div>
      <div class="container main">
        <div ng-view>
        </div>
      </div>
      <hr>
      <footer class="text-center">
        <p class="text-muted"> <a href="mailto:magonglei@baidu.com">帮助及反馈</a> | <a href="#">文档</a> </p>
        <p class="text-muted">&copy;<?php echo date("Y"); ?> 百度贴吧 | 自动化测试平台</p>
      </footer>
  </body>
  
  <?php
  /**
   * 如下代码用将由框架负责处理js资源加载到页面
   */
  echo HTML::js('<%= projectFoler %>/app_all.js', "<%= modName %>");
  ?>

  <?php
  echo HTML::getScript('important'); ?>
  <?php
  echo HTML::getJs(); ?>
  <?php
  echo HTML::getScript('normal'); ?>
  <?php
  echo HTML::getScript('optional'); ?>
</html>
