<?php

	// Show all errors, without needing to go back to wp-config.php
	//error_reporting(E_ALL);
	//ini_set('display_errors', '1');


     define('THEME_DIR_PATH', get_template_directory());
     define('THEME_DIR_URI', get_template_directory_uri());


	// Dirty pre function with limited height and randomnlt changing border colours
	function pre($var) {
		echo '<pre style="background: #fcffb1; text-align: left; outline: 4px solid rgb('. rand(0, 250) .','. rand(0, 250) .','. rand(0, 250) .'); width: 100%; overflow: auto; max-height: 300px;">';
			if ($var) :
				print_r($var);
			else :
				echo "\n\n\t--- <b>No data recieved by pre() function</b> ---\n\n";
			endif;
		echo '</pre>';
	}


	// Dirty JS console logging function, for when you want to see some data, but not in the markup
	// TODO: Make this function recognise objects & arrays and display as such
	function consolelog($string){
		echo '<script>console.log("%c" + "'. $string .'", "color:brown;background:#ddd;font-weight:bold;padding:2px 4px;");</script>';
	}

	require_once "admin/settings.php";


	 // Add support
	add_theme_support('post-thumbnails');
	add_theme_support('menus');

	// Remove generator meta tag from head
	remove_action('wp_head', 'wp_generator');


	// If page needs pagination nav, return true
	function show_posts_nav() {
		global $wp_query;
		return ($wp_query->max_num_pages > 1);
	}


	// Modifies the default excerpt [...] to say something a little more useful.
	function new_excerpt_more($more) {
		global $post;
		return '&nbsp;<a href="'. get_permalink($post->ID) . '">' . 'Read more' . '</a>';
	}
	add_filter('excerpt_more', 'new_excerpt_more');


	// Add first & last classes to wp_nav_menu menus
	// function add_first_and_last($output) {
	//     $output = preg_replace('/class="menu-item/', 'class="first-menu-item menu-item ', $output, 1);
	//     $output = substr_replace($output, 'class="last-menu-item menu-item ', strripos($output, 'class="menu-item'), strlen('class="menu-item'));
	//     return $output;
	// }
	// add_filter('wp_nav_menu', 'add_first_and_last');


	// Add featured image to feeds
	// http://app.kodery.com/s/1314
	function insertThumbnailRSS($content) {
		global $post;
		if (has_post_thumbnail($post->ID)){
			$content = '' . get_the_post_thumbnail($post->ID, 'thumbnail', array('alt' => get_the_title(), 'title' => get_the_title(), 'style' => 'float:right;')) . '' . $content;
		}
		return $content;
	}
	add_filter('the_excerpt_rss', 'insertThumbnailRSS');
	add_filter('the_content_feed', 'insertThumbnailRSS');


	// Make search prefix pretty
	function change_search_url_rewrite() {
		if (is_search() && ! empty($_GET['s'])) {
			wp_redirect(home_url("/search/") . urlencode(get_query_var('s')));
			exit();
		}
	}
	if (get_option('permalink_structure') !== '') {
		add_action('template_redirect', 'change_search_url_rewrite');
	}


	// Gets the page content by ID, useful if you're trimming it down
	function get_the_content_by_id($gcbid) {
		$my_postid = $gcbid; //This is page id or post id
		$content_post = get_post($my_postid);
		$content = $content_post->post_content;
		$content = apply_filters('the_content', $content);
		$content = str_replace(']]>', ']]>', $content);
		return $content;
	}


	// Trim a string by words, so words don't get cut up
	function trim_by_words($string, $count, $ellipsis = false){
		$words = explode(' ', $string);
		if (count($words) > $count){
			array_splice($words, $count);
			$string = implode(' ', $words);
			if (is_string($ellipsis)){
				$string .= $ellipsis;
			} elseif ($ellipsis){
				$string .= '...';
			}
		}
		return $string;
	}


	// Pagination, nativly. (Only works on pretty URLs)
	$wp_rewrite->rules = $feed_rules + $wp_rewrite->rules;
	$rules = $wp_rewrite->permalink_structure;
	function my_paginate_links() {
		global $wp_rewrite, $wp_query;
		$wp_query->query_vars['paged'] > 1 ? $current = $wp_query->query_vars['paged'] : $current = 1;
		if (empty($rules)) { $rulestouse = @add_query_arg('paged','%#%'); } else { $rulestouse = @add_query_arg('page','%#%'); }
		$pagination = array(
			'base' => $rulestouse,
			'format' => '',
			'total' => $wp_query->max_num_pages,
			'current' => $current,
			'prev_text' => __('« Previous'),
			'next_text' => __('Next »'),
			'end_size' => 1,
			'mid_size' => 2,
			'show_all' => true,
			'type' => 'plain'
		);
		if ($wp_rewrite->using_permalinks())
				$pagination['base'] = user_trailingslashit(trailingslashit(remove_query_arg('s', get_pagenum_link(1))) . 'page/%#%/', 'paged');
		if (!empty($wp_query->query_vars['s']))
				$pagination['add_args'] = array('s' => get_query_var('s'));
		echo paginate_links($pagination);
	}


	/*****
		Menu highlighing fix
		---
		Means if you have the blog page as a subpage and added to wp_nav_menu, single/archive pages will highlight correctly
	*****/
	add_filter('nav_menu_css_class', 'add_parent_url_menu_class', 10, 2);
	function add_parent_url_menu_class($classes = array(), $item = false) {
		$current_url = current_url();
		$homepage_url = trailingslashit(get_bloginfo('url'));
		if (is_404() or $item->url == $homepage_url) return $classes;
		if (strstr($current_url, $item->url)) {
			$classes[] = 'current_page_item';
		}
		return $classes;
	}
	function current_url() {
		$url = ('on' == $_SERVER['HTTPS']) ? 'https://' : 'http://';
		$url .= $_SERVER['SERVER_NAME'];
		$url .= ('80' == $_SERVER['SERVER_PORT']) ? '' : ':' . $_SERVER['SERVER_PORT'];
		$url .= $_SERVER['REQUEST_URI'];
		return trailingslashit( $url );
	}


	/*****
		Has children action
	*****/
	function add_menu_parent_class($items) {
		$parents = array();
		foreach ($items as $item) {
			if ($item->menu_item_parent && $item->menu_item_parent > 0) {
				$parents[] = $item->menu_item_parent;
			}
		}
		foreach ($items as $item) {
			if (in_array( $item->ID, $parents)) {
				$item->classes[] = 'has-children';
			}
		}
		return $items;
	}
	add_filter('wp_nav_menu_objects', 'add_menu_parent_class');


	/*****
		Nested Comment
	*****/
	function nested_comment($comment, $args, $depth) {
		$GLOBALS['comment'] = $comment;
		switch ($comment->comment_type) :
			case 'pingback' :
			case 'trackback' :
		?>
		<li class="post pingback">
			<p>Pingback: <?php comment_author_link(); ?><?php edit_comment_link('Edit', '<span class="edit-link">', '</span>'); ?></p>
		<?php
				break;
			default :
		?>

		<?php
			/*$avatar_size = 80;
			if ($depth === 1) $avatar_size = 80;
			if ($depth === 2) $avatar_size = 60;
			if ($depth === 3) $avatar_size = 50;
			if ($depth === 4) $avatar_size = 40;
			*/
		?>

		<li class="comment-item depth-<?php echo $depth; ?>" id="li-comment-<?php comment_ID(); ?>">
			<article id="comment-<?php comment_ID(); ?>" class="comment">

				<div class="left">
					<?php comment_author_link() ?> <a href="#comment-<?php comment_id(); ?>" class="comment_hash">#</a>
					<span><?php comment_date('F jS, Y') ?> at <?php comment_time() ?></span>
					<?php echo get_avatar($comment, 30); ?>
				</div>

				<div class="right">
					<?php if ($comment->comment_approved == '0') : ?>
						<span class="red">Your comment is awaiting moderation, <?php comment_author(); ?>.</span><br>
					<?php endif; ?>
					<?php comment_text() ?>
					<div class="reply">
						<?php comment_reply_link(
							array_merge(
								$args,
								array(
									'reply_text' => 'Reply',
									'depth' => $depth,
									'max_depth' => $args['max_depth']
								)
							)
						); ?>
					</div><!-- .reply -->
				</div>

				<div class="clear"></div>

			</article><!-- #comment-<?php comment_id(); ?> -->

		<?php
				break;
		endswitch;
	} // end nested_comment()


	/*****
		Convert int to words
	*****/
	function convert_number_to_words($number, $alt) {

		$alt = ($alt) ? $alt : false;

		$hyphen      = '-';
		$conjunction = ' and ';
		$separator   = ', ';
		$negative    = 'negative ';
		$decimal     = ' point ';
		$dictionary  = array(
			0                   => 'zero',
			1                   => 'one',
			2                   => 'two',
			3                   => 'three',
			4                   => 'four',
			5                   => 'five',
			6                   => 'six',
			7                   => 'seven',
			8                   => 'eight',
			9                   => 'nine',
			10                  => 'ten',
			11                  => 'eleven',
			12                  => 'twelve',
			13                  => 'thirteen',
			14                  => 'fourteen',
			15                  => 'fifteen',
			16                  => 'sixteen',
			17                  => 'seventeen',
			18                  => 'eighteen',
			19                  => 'nineteen',
			20                  => 'twenty',
			30                  => 'thirty',
			40                  => 'fourty',
			50                  => 'fifty',
			60                  => 'sixty',
			70                  => 'seventy',
			80                  => 'eighty',
			90                  => 'ninety',
			100                 => 'hundred',
			1000                => 'thousand',
			1000000             => 'million',
			1000000000          => 'billion',
			1000000000000       => 'trillion',
			1000000000000000    => 'quadrillion',
			1000000000000000000 => 'quintillion'
		);

		if (!is_numeric($number)) {
			return false;
		}

		if (($number >= 0 && (int) $number < 0) || (int) $number < 0 - PHP_INT_MAX) {
			trigger_error(
				'convert_number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX,
				E_USER_WARNING
			);
			return false;
		}

		if ($number < 0) {
			return $negative . convert_number_to_words(abs($number));
		}

		$string = $fraction = null;

		if (strpos($number, '.') !== false) {
			list($number, $fraction) = explode('.', $number);
		}

		switch (true) {
			case $number < 21:
				$string = $dictionary[$number];
				break;
			case $number < 100:
				$tens   = ((int) ($number / 10)) * 10;
				$units  = $number % 10;
				$string = $dictionary[$tens];
				if ($units) {
					$string .= $hyphen . $dictionary[$units];
				}
				break;
			case $number < 1000:
				$hundreds  = $number / 100;
				$remainder = $number % 100;
				$string = $dictionary[$hundreds] . ' ' . $dictionary[100];
				if ($remainder) {
					$string .= $conjunction . convert_number_to_words($remainder);
				}
				break;
			default:
				$baseUnit = pow(1000, floor(log($number, 1000)));
				$numBaseUnits = (int) ($number / $baseUnit);
				$remainder = $number % $baseUnit;
				$string = convert_number_to_words($numBaseUnits) . ' ' . $dictionary[$baseUnit];
				if ($remainder) {
					$string .= $remainder < 100 ? $conjunction : $separator;
					$string .= convert_number_to_words($remainder);
				}
				break;
		}

		if (null !== $fraction && is_numeric($fraction)) {
			$string .= $decimal;
			$words = array();
			foreach (str_split((string) $fraction) as $number) {
				$words[] = $dictionary[$number];
			}
			$string .= implode(' ', $words);
		}

		if ($alt == 'capitalize') {
			$string = ucwords($string);
		}

		return $string;
	}


	/*****
		Hide Admin Bar in WP 3.1
	*****/
	 add_filter('show_admin_bar', '__return_false');

	// ASP052
	 if (function_exists('add_image_size')) {
		add_image_size('person-thumb', 105, 130, true);
		add_image_size('article-thumb', 61, 59, true);
	}

	function current_page_url() {
		$pageURL = 'http';
		if( isset($_SERVER["HTTPS"]) ) {
			if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
		}
		$pageURL .= "://";
		if ($_SERVER["SERVER_PORT"] != "80") {
			$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
		} else {
			$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
		}
		return $pageURL;
	}

	// Shorthand for echo.
	function __p($val) {
		echo $val;
	}

	// Shorthand for printing asset.
	function __a($path) {
		echo get_template_directory_uri() . '/' . $path;
	}

	// Shorthand for printing text content.
	function __c($txt) {
		echo apply_filters('the_content', $txt);
	}

	function __br($txt) {
		echo nl2br($txt);
	}

	// Shorthand for printing log/dump.
	function __l($val) {
		echo '<pre>';
		print_r($val);
		echo '</pre>';
	}

	/**
	 * WPALCHEMY
	 */

	// Register all metaboxes.
	//include_once 'metaboxes/libs/setup.php';
	//include TEMPLATEPATH . '/metaboxes/service-spec.php';

	include_once 'functions/post_types/post-people.php';
	include_once 'functions/post_types/post-address.php';
	include_once 'functions/post_types/post-videos.php';

	function remove_type_meta() {
		remove_meta_box( 'typediv', 'people', 'side' );
	}
	add_action( 'admin_menu' , 'remove_type_meta' );

	function _getAddresses() {
		$args = array(
			'post_type' => 'address',
			'post_status' => 'publish',
			'posts_per_page' => -1,
			'order' => 'ASC'
		);
		$return_array = array();
		$query = new WP_Query($args);

		if ($query->have_posts()):
			while($query->have_posts()) : $query->the_post();
				array_push($return_array,
					array(
					'name' => get_the_title(),
					'address' => get_field('address', $post->ID, false),
					'phone' => get_field('telephone', $post->ID, false),
					'fax' => get_field('fax', $post->ID, false),
					'email' => get_field('email', $post->ID, false)
					)
				);
			endwhile;
		endif;
		wp_reset_postdata();
		return $return_array;
	}

	function _getPeople() {
		$args = array(
			'post_type' => 'people',
			'post_status' => 'publish',
			'posts_per_page' => -1,
			'order' => 'ASC',
			'orderby' => 'menu_order'
		);
		$return_array = array();
		$query = new WP_Query($args);

		if ($query->have_posts()):
			while($query->have_posts()) : $query->the_post();

				$image = '';
				if (has_post_thumbnail()) {
					$image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'person-thumb', false, '' );
					$image = $image[0];
				}
				$firstname = explode(' ',trim(get_the_title()));
				array_push($return_array,
					array(
					'name' => get_the_title(),
					'firstname' => $firstname[0],
					'image' => $image,
					'location' => get_field('location', $post->ID, true),
					'email' => get_field('email_address', $post->ID, false),
					'content' => get_the_content(),
					'title' => get_field('title', $post->ID, false),
					'position' => get_field('category', $post->ID, true)
					)
				);
			endwhile;
		endif;
		wp_reset_postdata();
		return $return_array;
	}

	require_once('ses.php');

	add_action('wp_ajax_nopriv_post_contact', 'ajax_cb_post_contact');
	add_action('wp_ajax_post_contact', 'ajax_cb_post_contact');
	function ajax_cb_post_contact() {
		$data = $_POST['data'];

		$formcontent='<html>
		<head>
		</head>
		<body>
		<h1>Contact form enquiry submitted by a user.</h1>
		<p>A user has submitted an enquiry. Please see the details below for more information.</p>
		<table width="100%">
		<tr>
		<td valign="top" width="220"><strong>Name</strong>:</td>
		<td valign="top">'.$data['enquiry_name'].'</td>
		</tr>
		<tr>
		<td valign="top" width="220"><strong>Email</strong>:</td>
		<td valign="top">'.$data['enquiry_email'].'</td>
		</tr>
		<tr>
		<td valign="top" width="220"><strong>Enquiry</strong>:</td>
		<td valign="top">'.$data['enquiry_message'].'</td>
		</tr>';
		$formcontent .= '</table>
		</body></html>';

		$subject = 'New contact form enquiry';
		$mailheader  = 'MIME-Version: 1.0' . "\n";
		$mailheader .= 'Content-type: text/html; charset=iso-8859-1' . "\n";
		$mailheader .= 'From: Apt Wealth Website <sydney@aptwealth.com.au>' . "\n";

		$ses = new SimpleEmailService('AKIAIVRDI42RZGMNDPUQ', 'x4wCzKzIYh1Tl40VsbdmVaIizsKaLIo3qK4Qbh8M');
		$m = new SimpleEmailServiceMessage();
		$m->addTo('sydney@aptwealth.com.au');
		$m->setFrom('sydney@aptwealth.com.au');
		$m->setSubject($subject);
		$m->setMessageFromString('Please use a HTML browser to view the email', $formcontent);
		$ses->sendEmail($m);

		$response = json_encode($data);

		header('Content-Type: application/json');
		echo $response;

		exit;
	}

	function _getTestimonials($i) {
		//print_r($i);
		$return_array = array();
		$count = 0;
		$count = 0;
		$index = 0;
		$length = count($i);
		//print_r($length);
		foreach ($i as $key => $value) {
			//if (!$key)
			if (!$key) {
				$return_array[$index] = array();
			}
			array_push($return_array[$index], array(
				'name' => $value['name'],
				'text' => $value['text']
			));
			if ($key && $key % 2 === 1 && ($key != $length - 1) ) {
				$index++;
				$return_array[$index] = array();
			}
		}
		return $return_array;
	}

	add_filter('body_class','my_class_names');
	function my_class_names($classes) {

		$classes[] = 'preload';

		// return the $classes array
		return $classes;
	}

	function _getPosts($type = 'post') {

		$args = array(
			'post_type' => $type,
			'post_status' => 'publish',
			'posts_per_page' => -1,
			'order' => 'ASC',
			'orderby' => 'menu_order'
		);
		$return_array = array();
		$query = new WP_Query($args);

		if ($query->have_posts()):
			while($query->have_posts()) : $query->the_post();

				$image = '';
				if (has_post_thumbnail()) {
					$image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'full', false, '' );
					$image = $image[0];
				}
				array_push($return_array,
					array(
					'name' => get_the_title(),
					'image' => $image,
					'content' => get_the_content(),
					'date' => get_the_time('d M, Y', $post->ID),
					'link' => get_permalink()
					)
				);
			endwhile;
		endif;
		wp_reset_postdata();
		return $return_array;
	}
	
	
	/**
     * Enqueue scripts and styles
     */
    function wpdocs_apt_scripts() {

        $ctime = filemtime( THEME_DIR_PATH . '/css/custom.css' );
        

        // custom matchheight
        wp_enqueue_script( 'matchheight-scripts', THEME_DIR_URI . '/js/jquery.matchHeight.js', array('jquery'),false );
        wp_enqueue_script( 'custom-scripts', THEME_DIR_URI . '/js/scripts.js', array(), true);
    
        wp_enqueue_style( 'custom-style', THEME_DIR_URI . '/css/custom.css', array(), $ctime, false );
    }
    add_action( 'wp_enqueue_scripts', 'wpdocs_apt_scripts' );
    
    
    

    
    
    function pn_body_class_add_categories( $classes ) {
 
    	// Only proceed if we're on a single post page
    	if ( !is_single() )
    		return $classes;
     
    	// Get the categories that are assigned to this post
    	$post_categories = get_the_category();
     
    	// Loop over each category in the $categories array
    	foreach( $post_categories as $current_category ) {
     
    		// Add the current category's slug to the $body_classes array
    		$classes[] = 'category-' . $current_category->slug;
     
    	}
     
    	// Finally, return the $body_classes array
    	return $classes;
    }
    add_filter( 'body_class', 'pn_body_class_add_categories' );
    


    function display_recentpost() {
        $the_query = new WP_Query( array( 'category_name' => 'blogs', 'posts_per_page' => 5 ) ); 
        if ( $the_query->have_posts() ) {
            $string .= '<ul class="postsbycategory widget_recent_entries">';
            while ( $the_query->have_posts() ) {
                $the_query->the_post();
                    $string .= '<li>';
                    $string .= '<a href="' . get_the_permalink() .'" rel="bookmark">' . get_the_title() .'</a><br>';
                    $string .= 'Written by '. get_the_author() .' on ' . get_the_date('F jS, Y' );   
                    $string .='</li>';
                    }
            } else {
        }
        $string .= '</ul>';
        return $string;
        wp_reset_postdata();
    }
	// Add a shortcode
	add_shortcode('recent_post', 'display_recentpost');
	// Enable shortcodes in text widgets
	add_filter('widget_text', 'do_shortcode');



    add_action( 'wp_head', 'meta_wp_head' );
    function meta_wp_head() {
        if (is_single()) {
            $post_id = get_queried_object_id();

            if ( ! $description = get_post_field( 'post_excerpt', $post_id ) ){
                $description = get_post_field( 'post_content', $post_id );
            }

            $description = trim( wp_strip_all_tags( $description, true ) );
            $description = substr( $description, 0, 297 );
			$description .= '...';

            $feat_image = wp_get_attachment_url( get_post_thumbnail_id($post_id) );

            // printf( '<h1>%s</h1>' . "\n\t", esc_attr( $description ) );
            
            ?>
                
                <meta name="description" content="<?php echo esc_attr( $description );?>" />
                
                <meta property="og:url" content="<?php the_permalink(); ?>" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="<?php single_post_title(); ?>" />
                <meta property="og:description" content="<?php echo esc_attr( $description );?>" />
                <meta property="og:image" content="<?php echo $feat_image ?>" />


                <meta name="twitter:title" content="<?php single_post_title(); ?>">
                <meta name="twitter:description" content="<?php echo esc_attr( $description );?>">
                <meta name="twitter:image" content="<?php echo $feat_image ?>">

            <?php
         }else{
            ?>
                <meta name="description" content="<?php bloginfo("description");?>" />
            <?php
         }
    }




	// function add_people_metaboxes() {
	// 	add_meta_box('meta_people', 'Job Details', 'meta_people', 'people', 'side', 'default');
	// }

	// // 'People' input fields.

	// function meta_people() {
	// 	global $post;

	// 	echo '<input type="hidden" name="peoplemeta_noncename" id="peoplemeta_noncename" value="' .
	// 	wp_create_nonce(plugin_basename(__FILE__)) . '" />';

	// 	$titles = array(
	// 		0 => 'Director',
	// 		1 => 'Planner',
	// 		2 => 'Support Staff'
	// 	);

	// 	$locations = array(
	// 		0 => 'Sydney',
	// 		1 => 'Melbourne',
	// 		2 => 'Geelong'
	// 	);

	// 	$title = get_post_meta($post->ID, '_title', true);
	// 	$title_caption = get_post_meta($post->ID, '_title_caption', true);
	// 	$email = get_post_meta($post->ID, '_email', true);
	// 	$location = get_post_meta($post->ID, '_location', true);

	// 	echo '<p><em>Please select the location for this person:</em></p>';
	// 	echo '<select name="_location">';
	// 	echo '<option value="">- Select -</option>';
	// 	foreach ($locations as $key => $value) {
	// 		if ($value == $location) {
	// 			echo '<option value="' . $value . '" selected="selected">' . $value . '</option>';
	// 		} else {
	// 			echo '<option value="' . $value . '">' . $value . '</option>';
	// 		}
	// 	}
	// 	echo '</select>';

	// 	echo '<p><em>Please select the job category for this person:</em></p>';
	// 	echo '<select name="_title">';
	// 	echo '<option value="">- Select -</option>';
	// 	foreach ($titles as $key => $value) {
	// 		if ($value == $title) {
	// 			echo '<option value="' . $value . '" selected="selected">' . $value . '</option>';
	// 		} else {
	// 			echo '<option value="' . $value . '">' . $value . '</option>';
	// 		}
	// 	}
	// 	echo '</select>';

	// 	echo '<p><em>Job title:</em></p>';
	// 	echo '<input type="text" name="_title_caption" value="' . $title_caption  . '" class="widefat" />';

	// 	echo '<p><em>Email address:</em></p>';
	// 	echo '<input type="text" name="_email" value="' . $email  . '" class="widefat" />';
	// }

	// // Save 'People' meta data.

	// function people_save_meta($post_id, $post) {
	// 	if (!wp_verify_nonce($_POST['peoplemeta_noncename'], plugin_basename(__FILE__))) {
	// 		return $post->ID;
	// 	}

	// 	if (!current_user_can('edit_post', $post->ID)) {
	// 		return $post->ID;
	// 	}

	// 	$events_meta['_location'] = $_POST['_location'];
	// 	$events_meta['_title'] = $_POST['_title'];
	// 	$events_meta['_email'] = $_POST['_email'];
	// 	if ($_POST['_title_caption'] == '') {
	// 		$events_meta['_title_caption'] = $_POST['_title'];
	// 	} else {
	// 		$events_meta['_title_caption'] = $_POST['_title_caption'];
	// 	}

	// 	foreach ($events_meta as $key => $value) {
	// 		if ($post->post_type == 'revision') {
	// 			return;
	// 		}

	// 		$value = implode(',', (array)$value);

	// 		if (get_post_meta($post->ID, $key, FALSE)) {
	// 			update_post_meta($post->ID, $key, $value);
	// 		} else {
	// 			add_post_meta($post->ID, $key, $value);
	// 		}

	// 		if (!$value) {
	// 			delete_post_meta($post->ID, $key);
	// 		}
	// 	}
	// }

	// add_action('save_post', 'people_save_meta', 1, 2);

	// //---------------------------
	// // 'Address' custom post type.
	// //---------------------------

	// // 'Address' meta box form.

	// function add_address_metaboxes() {
	// 	add_meta_box('meta_address', 'Address Details', 'meta_address', 'address', 'side', 'default');
	// }

	// // 'Address' input fields.

	// function meta_address() {
	// 	global $post;

	// 	echo '<input type="hidden" name="addressmeta_noncename" id="addressmeta_noncename" value="' .
	// 	wp_create_nonce(plugin_basename(__FILE__)) . '" />';

	// 	$phone = get_post_meta($post->ID, '_phone', true);
	// 	$fax = get_post_meta($post->ID, '_fax', true);
	// 	$email = get_post_meta($post->ID, '_email', true);

	// 	echo '<p><em>Telephone:</em></p>';
	// 	echo '<input type="text" name="_phone" value="' . $phone  . '" class="widefat" />';
	// 	echo '<p><em>Fax:</em></p>';
	// 	echo '<input type="text" name="_fax" value="' . $fax  . '" class="widefat" />';
	// 	echo '<p><em>Email:</em></p>';
	// 	echo '<input type="text" name="_email" value="' . $email  . '" class="widefat" />';
	// }

	// // Save 'Address' meta data.

	// function address_save_meta($post_id, $post) {
	// 	if (!wp_verify_nonce($_POST['addressmeta_noncename'], plugin_basename(__FILE__))) {
	// 		return $post->ID;
	// 	}

	// 	if (!current_user_can('edit_post', $post->ID)) {
	// 		return $post->ID;
	// 	}

	// 	$events_meta['_phone'] = $_POST['_phone'];
	// 	$events_meta['_fax'] = $_POST['_fax'];
	// 	$events_meta['_email'] = $_POST['_email'];

	// 	foreach ($events_meta as $key => $value) {
	// 		if ($post->post_type == 'revision') {
	// 			return;
	// 		}

	// 		$value = implode(',', (array)$value);

	// 		if (get_post_meta($post->ID, $key, FALSE)) {
	// 			update_post_meta($post->ID, $key, $value);
	// 		} else {
	// 			add_post_meta($post->ID, $key, $value);
	// 		}

	// 		if (!$value) {
	// 			delete_post_meta($post->ID, $key);
	// 		}
	// 	}
	// }

	// add_action('save_post', 'address_save_meta', 1, 2);


	// //---------------------------
	// // 'Banner' custom post type.
	// //---------------------------

	// include TEMPLATEPATH . '/metaboxes/banner-spec.php';
	// add_action('init', 'banner_register');
	// function banner_register() {
	// 	$labels = array(
	// 		'name' => _x('Banner', 'post type general name'),
	// 		'singular_name' => _x('Banner', 'post type singular name'),
	// 		'add_new' => _x('Add New Banner', 'banner item'),
	// 		'add_new_item' => __('Add Banner'),
	// 		'edit_item' => __('Edit Banner'),
	// 		'new_item' => __('New Banner'),
	// 		'view_item' => __('View Banner'),
	// 		'search_items' => __('Search Banner'),
	// 		'not_found' => __('Nothing found'),
	// 		'not_found_in_trash' => __('Nothing found in Trash'),
	// 		'parent_item_colon' => ''
	// 	);
	// 	$args = array(
	// 		'labels' => $labels,
	// 		'public' => true,
	// 		'publicly_queryable' => false,
	// 		'exclude_from_search' => false,
	// 		'show_ui' => true,
	// 		'query_var' => true,
	// 		'rewrite' => true,
	// 		'capability_type' => 'page',
	// 		'hierarchical' => true,
	// 		'menu_position' => null,
	// 		'supports' => array('title', 'editor'),
	// 	);
	// 	register_post_type('banner' , $args);
	// 	flush_rewrite_rules();
	// }

	// function get_banners() {
	// 	global $mb_banner;

	// 	$results = array();
	// 	$query = new WP_Query(array(
	// 		'posts_per_page' => 50,
	// 		'post_type' => 'banner',
	// 		'order' => 'ASC',
	// 		'orderby' => 'menu_order'
	// 	));

	// 	foreach ($query->posts as $item) {
	// 		$meta = $mb_banner->the_meta($item->ID);

	// 		// Color.
	// 		$item->color = !empty($meta['color']) ? $meta['color'] : '';

	// 		// Image.
	// 		$item->image = '';
	// 		if (isset($meta['image']) && count($meta['image']) > 0) {
	// 			$item->image = $meta['image'][0];
	// 			$item->image = $item->image['image_src'];
	// 		}

	// 		$results[] = $item;
	// 	}

	// 	wp_reset_query();
	// 	return $results;
    // }