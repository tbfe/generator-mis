<?php
/*
 * @author: <%= author %>
 * @time: <%= date %>
 */
?>

<?php HTML::scriptStart(); ?>
  <script>
    _.Module.use('<%= modName %>/widget/<%= name %>', [], function(){});
  </script>
<?php HTML::scriptEnd(); ?>
