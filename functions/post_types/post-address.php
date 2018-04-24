<?php
	add_action('init', 'address_register');
	function address_register() {
		$labels = array(
			'name'               => _x('Addresses', 'post type general name'),
			'singular_name'      => _x('Address', 'post type singular name'),
			'add_new'            => _x('Add New Address', 'address item'),
			'add_new_item'       => __('Add New Address'),
			'edit_item'          => __('Edit Address'),
			'new_item'           => __('New Address'),
			'view_item'          => __('View Address'),
			'search_items'       => __('Search Address'),
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
			'menu_icon'           => 'dashicons-admin-site',
			'menu_position'       => null,
			'supports'            => array('title','editor', 'thumbnail', 'page-attributes')
		);
		register_post_type( 'address' , $args );
		flush_rewrite_rules();
	}