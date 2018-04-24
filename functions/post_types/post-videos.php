<?php
	add_action('init', 'video_register');
	function video_register() {
		$labels = array(
			'name'               => _x('Videos', 'post type general name'),
			'singular_name'      => _x('Video', 'post type singular name'),
			'add_new'            => _x('Add New Video', 'video item'),
			'add_new_item'       => __('Add New Video'),
			'edit_item'          => __('Edit Video'),
			'new_item'           => __('New Video'),
			'view_item'          => __('View Video'),
			'search_items'       => __('Search Videos'),
			'not_found'          => __('Nothing found'),
			'not_found_in_trash' => __('Nothing found in Trash'),
			'parent_item_colon'  => ''
		);
		$args = array(
			'labels'              => $labels,
			'public'              => true,
			'publicly_queryable'  => true,
			'exclude_from_search' => false,
			'show_ui'             => true,
			'query_var'           => true,
			'rewrite' => true,
			'capability_type'     => 'page',
			'has_archive'         => false,
			'hierarchical'        => true,
			'menu_icon'           => 'dashicons-format-video',
			'menu_position'       => null,
			'supports'            => array('title','editor', 'thumbnail')
		);
		register_post_type( 'video' , $args );
		flush_rewrite_rules();
	}