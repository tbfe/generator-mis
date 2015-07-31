<?php
/**
 * <%= templateDescription %> template
 * @author <%= author %>
 * @since  <%= date %>
 */
$_layout = $__layout__->load('tb_skeleton', array(
    'common_js_pos' => 'after_body',
    'forum' => $forum,
    'user' => $user,
    'product' => 'frs',
    'page' => 'new_version'
), 'common');

$_layout->setBlock('title', '页面标题');

$_layout->startBlock('content');
?>
/**
 * your logic goes here
 */
<?php
$_layout->endBlock('content');
$_layout->render();
?>