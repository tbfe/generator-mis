<?php
/**
 * A simple text describing this file
 * @author <%= author %>
 * @since  <%= date %>
 */
?>

<?php HTML::scriptStart(); ?>
  <script>
    _.Module.use('<%= modName %>/widget/<%= instanceName %>', [], function(){});
  </script>
<?php HTML::scriptEnd(); ?>
