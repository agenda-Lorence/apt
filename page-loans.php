<?php
/*
Template Name: Page Home Loans
*/
$post = $wp_query->get_queried_object();
get_header(); ?>

<div id="content">
	<section class="carousel-container">
		<div class="carousel">
			<div class="wrapper">
				<div class="carousel-inner">
                    <div style="background-image: url(<?php the_field('banner_image'); ?>);"></div>
                    </div>
				</div>

			</div>
		</div>
	</section>

	<section class="intro">
		<div class="wrapper">
			<div class="intro-inner">
				<div class="intro-content">
					<div class="intro-content-inner">
						<h1><?php __p(get_field('intro_heading', $post->ID, false)); ?></h1>
						<?php __c(get_field('intro_content', $post->ID, false)); ?>
					</div>
				</div>
				<div class="news">
				    <img class="apthm-logo" src="/wp-content/uploads/2017/12/apt-homeloans-logo.jpg" alt="APT Wealth Home Loans">
					<div class="news-inner">
						
						<?php __c(get_field('news', $post->ID, false)); ?>
						
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="call">
		<div class="wrapper">
			<?php $call_us_phone = get_option('call_us_phone'); ?>
			<?php $call_us_email = get_option('call_us_email'); ?>
			<?php $call_us_text = get_option('call_us_text'); ?>
			<?php $call_us_text = str_replace('{phone}', '<span class="phone">'.$call_us_phone.'</span>', $call_us_text); ?>
			<?php $call_us_text = str_replace('{email}', '<a href="mailto:' . $call_us_email . '">email</a>', $call_us_text); ?>
			<h3><?php __p($call_us_text); ?></h3>
		</div>
	</section>

</div>

<?php get_footer(); ?>