<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if IE 9]>         <html class="no-js ie9"> <![endif]-->
<!--[if !IE]><!--> <html class="no-js"> <!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo('charset'); ?>" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
		<link rel="shortcut icon" href="<?php bloginfo('template_url'); ?>/favicon.ico" />
		<link rel="apple-touch-icon" sizes="57x57" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="60x60" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="72x72" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="76x76" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="114x114" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="<?php bloginfo('template_url'); ?>/favicons/apple-touch-icon-180x180.png">
		<link rel="icon" type="image/png" href="<?php bloginfo('template_url'); ?>/favicons/favicon-32x32.png" sizes="32x32">
		<link rel="icon" type="image/png" href="<?php bloginfo('template_url'); ?>/favicons/android-chrome-192x192.png" sizes="192x192">
		<link rel="icon" type="image/png" href="<?php bloginfo('template_url'); ?>/favicons/favicon-96x96.png" sizes="96x96">
		<link rel="icon" type="image/png" href="<?php bloginfo('template_url'); ?>/favicons/favicon-16x16.png" sizes="16x16">
		<link rel="manifest" href="<?php bloginfo('template_url'); ?>/favicons/manifest.json">
		<meta name="msapplication-TileColor" content="#da532c">
		<meta name="msapplication-TileImage" content="/mstile-144x144.png">
		<meta name="theme-color" content="#ffffff">


		<title><?php wp_title('&laquo;', true, 'right'); ?> <?php bloginfo('name'); ?></title>

		<?php wp_head(); ?>

		<?php
			if (is_singular() && get_option('thread_comments')) :
				wp_enqueue_script('comment-reply');
			endif;
		?>
		<link rel="stylesheet" href="<?php bloginfo("template_url"); ?>/css/normalize.css">
		<link rel="stylesheet" href="<?php bloginfo("template_url"); ?>/css/main.css?ver=1">

		<script src="<?php bloginfo("template_url"); ?>/js/libs/modernizr/modernizr-2.6.2.min.js"></script>

	</head>
<body <?php body_class(); ?>>

	<div id="outer">
		<div id="inner">

			<header>
				<div class="wrapper">

					<div class="nav-bar"></div>

					<a class="burger" href="#">
						<span class="bars">
							<span class="line top"></span>
							<span class="line mid"></span>
							<span class="line bot"></span>
						</span>
					</a>

					<div class="logo">
						<a href="<?php bloginfo('url'); ?>/">
							<span><?php bloginfo('name'); ?></span>
						</a>
					</div>

					<div id="site-loader">
						<div class="site-loader-inner">
							<div class="start"></div>
							<div class="line-container">
								<div class="line"></div>
								<div class="end"></div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<nav>
				<div class="wrapper">
					<?php $args = array(
						'menu' => 'Main',
						'container' => false,
						'link_before' => '<span class="over">',
						'link_after' => '</span>'
						);

					wp_nav_menu($args); ?>
				</div>
			</nav>