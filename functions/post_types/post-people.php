<?php
	add_action('init', 'people_register');
	function people_register() {
		$labels = array(
			'name'               => _x('People', 'post type general name'),
			'singular_name'      => _x('Person', 'post type singular name'),
			'add_new'            => _x('Add New Person', 'people item'),
			'add_new_item'       => __('Add New Person'),
			'edit_item'          => __('Edit Person'),
			'new_item'           => __('New Person'),
			'view_item'          => __('View Person'),
			'search_items'       => __('Search People'),
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
			'menu_icon'           => 'dashicons-businessman',
			'menu_position'       => null,
			'supports'            => array('title','editor', 'thumbnail', 'page-attributes')
		);
		register_post_type( 'people' , $args );
		flush_rewrite_rules();
	}

	/*
	 * Register Resources Category (Taxonomy)
	 */
	add_action( 'init', 'register_people_taxonomies', 0 );
	function register_people_taxonomies() {

		 register_taxonomy('type',array('people'), array(
			'public' => true,
			'hierarchical' => true,
			'labels' => array(
					'name' => __( 'Category' ),
					'singular_name' => __( 'Category' )
				),
			'show_ui' => true,
			'show_in_nav_menus' => true,
			'query_var' => true,
			'rewrite' => array('slug' => 'resources/type', 'with_front' => false)

		));
	}