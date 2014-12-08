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
        'devplatcommon/lib/bootstrap/bootstrap.css',
        <% if(uiPlugins.indexOf('sweetalert')>-1){ %>
        //sweetalert插件 doc:http://tristanedwards.me/sweetalert
        '<%= modName %>/libs/sweetalert/sweet_alert.css',
        <% } %>
        <% if(uiPlugins.indexOf('animate.css')>-1){ %>
        //animate.css插件 doc:http://daneden.github.io/animate.css/
        '<%= modName %>/libs/animate.css',
        <% } %>
        //本项目css 文件
        '<%= modName %>/template/admin/index.css'
      ));
    ?>
    <?php
      echo HTML::combojs(array(
        'devplatcommon/lib/jquery/jquery.js',
        'devplatcommon/lib/require/require.js'));

      echo HTML::combojs(array(
        //使用传统bootstrap布局
        'devplatcommon/lib/angular/angular.js',
        'devplatcommon/lib/angular/angular-resource.js',
        'devplatcommon/lib/angular/angular-route.js', 
        'devplatcommon/lib/angular/angular-sanitize.js',
        'devplatcommon/lib/angular/ui-bootstrap.js',
        'devplatcommon/lib/bootstrap/bootstrap.js',
        //内部平台公共库
        'devplatcommon/js/ng_common/ng_common.js', 

        //本项目的插件,其他文件类似这样引入即可
        <% if(uiPlugins.indexOf('sweetalert')>-1){ %>
        //sweetalert插件 doc:http://tristanedwards.me/sweetalert
        '<%= modName %>/libs/sweetalert/sweet_alert.js',
        <% } %>
        '<%= modName %>/template/admin/index.js',
        '<%= modName %>/js/foo.js'
      ));
    ?>
  </head>
  <body>
       <nav class="navbar navbar-default" role="navigation">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a href="#" class="navbar-brand">
              <img class="logo" style="height:25px;vertical-align:middle" src="../../static/img/zhongshen/tb_logo.png" >
              <span class="logo-text" style="vertical-align:middle">|<%= projectName %></span>
            </a>
          </div>
          <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav navbar-right">
              <li><a href="#" id="username"></a></li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="container-fluid" id="main-container">
        <div class="row">
          <div ng-view>
          </div>
        </div>
      </div>
      <footer class="text-center">
        <hr>
        <p class="text-muted">
          &copy;<?php echo date("Y"); ?> | <%= projectName %>
        </p>
      </footer>
  </body>
  
  <?php
  /**
   * 如下代码用将由框架负责处理js资源加载到页面
   */
  echo HTML::js('<%= projectName %>/app_all.js', "<%= modName %>");
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
