<?php
$mb_banner = new WPAlchemy_MetaBox(array(
	'id' => '_mb_banner',
	'prefix' => '_mb_banner_',
	'title' => '&nbsp;',
	'types' => array('banner'),
	'hide_editor' => true,
	'mode' => WPALCHEMY_MODE_EXTRACT,
	'template' => get_stylesheet_directory() . '/metaboxes/banner-meta.php'
));