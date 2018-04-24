<?php

include_once '_metabox.php';
include_once '_mediaaccess.php';

// Media access.
$wpalchemy_media_access = new WPAlchemy_MediaAccess();

// Global styles for the metaboxes.
if (is_admin()) {
	add_action('admin_enqueue_scripts', 'metabox_style');
	function metabox_style() {
		wp_enqueue_style('wpalchemy-metabox', get_stylesheet_directory_uri() . '/metaboxes/libs/meta.css');
		wp_enqueue_style('wpalchemy-metabox-jquery-ui', get_stylesheet_directory_uri() . '/metaboxes/libs/jquery-ui.css');
	}
}