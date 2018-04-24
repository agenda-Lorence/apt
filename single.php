<?php get_header(); ?>
	<div id="content">

		<section>

		<?php while (have_posts()) : the_post(); ?>
			<article <?php post_class() ?> id="post-<?php the_ID(); ?>">
				<?php
					if (has_post_thumbnail()) :
						$src = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'full', false, '' );
					?>
					<div class="featured">
						<img src="<?php echo $src[0]; ?>" />
					</div>
					<?php endif; ?>
					<div class="article-content">
						<div class="wrapper">
							<div class="article-inner">
								<h1><?php the_title(); ?></h1>
								<p class="article-meta"><?php echo get_avatar( get_the_author_meta( 'ID' ), 32 ); ?> <span class="lbl">Written by</span> <?php the_author(); ?> | <time datetime="<?php the_time('Y-m-d') ?>" pubdate>Published: <?php the_time('F jS, Y') ?></time></p>
								 <?php the_content(); ?>
								 <div class="social-icons">
									<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php the_permalink(); ?>" class="facebook"></a>
									<a target="_blank" href="https://twitter.com/intent/tweet?url=<?php the_permalink(); ?>" class="twitter"></a>
									<a target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&amp;url=<?php echo get_permalink($post->ID); ?>&amp;title=<?php the_title(); ?>" class="linked"></a>
								</div>
							</div>

							<?php if (count(get_field('related', $post->ID, true)) > 0): ?>
								<div class="article-related">
									<?php if ( ! in_category('blogs')) : ?>
										<h2>Related Articles</h2>
										<?php foreach(get_field('related', $post->ID, true) as $key => $value): ?>
											<div class="row">
												<h3>
													<a href="<?php echo get_permalink($value->ID); ?>">
														<?php __p($value->post_title); ?>
													</a>
												</h3>
												<a href="<?php echo get_permalink($value->ID); ?>" class="more">See article</a>
											</div>

											<?php // print_r($value); ?>

										<?php endforeach; ?>
									<?php elseif (in_category('blogs')) :?>
										<h2>Recent Blog Articles</h2>
										<?php echo do_shortcode( '[recent_post]' ); ?>
									<?php endif; ?>
								</div>
							<?php endif; ?>
							<?php if ( ! in_category('blogs') ) : ?>
								<div class="back">
									<a href="<?php bloginfo('url'); ?>/tools">Back to tools</a>
								</div>
							<?php endif; ?>
						</div>
					</div>
			</article>
		<?php endwhile; ?>

		</section>

	</div>
<?php get_footer(); ?>