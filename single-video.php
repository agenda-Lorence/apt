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
						<?php $youtube_url = get_field('youtube_url', $post->ID, false); ?>
						<?php if (isset($youtube_url) && !empty($youtube_url)): ?>
							<div class="video">
								<div>
									<iframe width="100%" height="100%" src="https://www.youtube.com/embed/<?php echo $youtube_url; ?>?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
								</div>
							</div>
						<?php else: ?>
							<img src="<?php echo $src[0]; ?>" />
						<?php endif; ?>

					</div>
					<?php endif; ?>
					<div class="article-content">
						<div class="wrapper">
							<div class="article-inner">
								<h1><?php the_title(); ?></h1>
								 <time datetime="<?php the_time('Y-m-d') ?>" pubdate><?php the_time('F jS, Y') ?></time>
								 <?php the_content(); ?>
								 <div class="social-icons">
									<a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php the_permalink(); ?>" class="facebook"></a>
									<a target="_blank" href="https://twitter.com/intent/tweet?url=<?php the_permalink(); ?>" class="twitter"></a>
									<a target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&amp;url=<?php echo get_permalink($post->ID); ?>&amp;title=<?php the_title(); ?>" class="linked"></a>
								</div>
							</div>

							<?php if (count(get_field('related', $post->ID, true)) > 0): ?>
								<div class="article-related">
									<h2>Related Videos</h2>
									<?php foreach(get_field('related', $post->ID, true) as $key => $value): ?>
										<div class="row">
											<h3>
												<a href="<?php echo get_permalink($value->ID); ?>">
													<?php __p($value->post_title); ?>
												</a>
											</h3>
											<a href="<?php echo get_permalink($value->ID); ?>" class="more">See video</a>
										</div>

										<?php // print_r($value); ?>

									<?php endforeach; ?>
								</div>
							<?php endif; ?>
							<div class="back">
								<a href="<?php bloginfo('url'); ?>/tools">Back to tools</a>
							</div>
						</div>
					</div>
			</article>
		<?php endwhile; ?>

		</section>

	</div>
<?php get_footer(); ?>