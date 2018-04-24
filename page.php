<?php get_header(); ?>

	<div id="content">

		<div class="heading">
			<div class="wrapper">
				<h1 class="page-title page-headline"><?php __br(get_field('heading', $post->ID, false)); ?></h1>
			</div>
		</div>

		<?php while (have_posts()) : the_post(); ?>
			<section class="default">
				<div class="wrapper">
					<article <?php post_class() ?> id="post-<?php the_ID(); ?>">
						<?php
							if (has_post_thumbnail()) :
								$src = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'medium', false, '' );
								echo '<img src="'. $src[0] .'" />';
							endif;
						?>
						<?php the_content('<p>Read the rest of this page &raquo;</p>'); ?>
					</article>
				</div>
			</section>
		<?php endwhile; ?>
	</div>

<?php get_footer(); ?>