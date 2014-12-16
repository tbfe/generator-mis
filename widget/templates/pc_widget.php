<?php
/*
 * @author: <%= author %>
 * @time: <%= date %>
 */
?>

<?php HTML::scriptStart(); ?>
  <script>
    _.Module.use('<%= modName %>/widget/<%= instanceName %>', [], function(){});
  </script>
<?php HTML::scriptEnd(); ?>
