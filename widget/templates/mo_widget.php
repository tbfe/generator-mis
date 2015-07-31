<?php
/**
 * A simple text describing this file
 * @author <%= author %>
 * @since  <%= date %>
 */
?>

<?php HTML::scriptStart(); ?>
<script>
    F.use('<%= modName %>/widget/<%= name %>', function (exports) {/* 你可以修改exports这个名字*/
        var <%= instanceName %> = new exports.<%= className %>({
            $el: $('.<%= name %>'),
            conf: {}
        });
    });
</script>
<?php HTML::scriptEnd(); ?>
