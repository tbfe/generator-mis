<?php
/*
 * @author: <%= author %>
 * @time: <%= date %>
 */
?>

<?php HTML::scriptStart(); ?>
  <script>
    F.use('<%= modName %>/widget/<%= name %>', function (<%= className %>) {
      var <%= instanceName %> = new <%= className %>({
        $el: $('.<%= name %>'),
          conf: {
          }
        });
     })
  </script>
<?php HTML::scriptEnd(); ?>
