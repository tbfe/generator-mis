<?
/**
 * @author wayou
 * @date 2014-8-25
 */
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>众审平台-后台</title>
  <link rel="shortcut icon" href="http://static.tieba.baidu.com/tb/favicon.ico" />
  <?php
echo HTML::combocss(array(
    'devplatcommon/lib/bootstrap/bootstrap.css',
    //本项目css
    'uegmis/libs/sweetalert/sweet_alert.css',
    'uegmis/template/admin/index.css'
    ));
  ?>
  <?php
  echo HTML::combojs(array(
    'devplatcommon/lib/jquery/jquery.js', 
    'devplatcommon/lib/require/require.js'
    ));

echo HTML::combojs(array(
  'devplatcommon/lib/angular/angular.js', 
  'devplatcommon/lib/angular/angular-resource.js', 
  'devplatcommon/lib/angular/angular-route.js', 
  'devplatcommon/lib/angular/angular-sanitize.js',
  'devplatcommon/lib/angular/ui-bootstrap.js',
  'devplatcommon/js/ng_common/ng_common.js', 
  'devplatcommon/lib/bootstrap/bootstrap.js',

  //本项目的插件,其他文件类似这样引入即可
   'uegmis/libs/sweetalert/sweet_alert.js'
   // 'uegmis/template/admin/index.js'
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
            <span class="logo-text" style="vertical-align:middle">|众审平台</span>
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
      <p class="text-muted">&copy;2014 | 百度贴吧众审平台</p>
    </footer>
</body>

<?php
/**
 * 如下代码用将由框架负责处理js资源加载到页面
 */
echo HTML::js('admin/app_all.js', "uegmis");
?>

<?php echo HTML::getScript('important'); ?>
<?php echo HTML::getJs(); ?>
<?php echo HTML::getScript('normal'); ?>
<?php echo HTML::getScript('optional'); ?>

</html>
