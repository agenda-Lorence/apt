<?php
$mb_service = new WPAlchemy_MetaBox(array(
	'id' => '_mb_service',
	'prefix' => '_mb_service_',
	'title' => '&nbsp;',
	'types' => array('page'),
	'include_template' => array('page-service-area.php'),
	'hide_editor' => false,
	'mode' => WPALCHEMY_MODE_EXTRACT,
	'template' => get_stylesheet_directory() . '/metaboxes/service-meta.php'
));