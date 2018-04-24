<?php
/*
Template Name: Page Services
*/
$post = $wp_query->get_queried_object();
get_header(); ?>

<div id="content">

	<div class="heading">
		<div class="wrapper">
			<h1 class="page-title page-headline"><?php __p(get_field('heading', $post->ID, false)); ?></h1>
		</div>
	</div>

	<?php if (count(get_field('services', $post->ID, true)) > 0): ?>
		<section class="grid-container">
			<div class="wrapper">
				<div class="grid">
					<?php foreach(get_field('services', $post->ID, true) as $key => $value): ?>
						<?php $cls = '';
						if ($key && $key % 4 === 0) {
							$cls = ' clearleft';
						}
						$img = $value['thumbnail'];
						$page_child_thumb = wp_get_attachment_image_src($img['ID'], 'article-thumb');
						?>

						<div class="article<?php echo $cls; ?> borders" data-id="<?php echo sanitize_title($value['title']); ?>">
							<div class="article-inner">

								<?php if ($page_child_thumb[0]) { ?>
									<div class="article-thumb article-thumb-small">
										<img src="<?php echo $page_child_thumb[0]; ?>" alt="<?php echo $page_child_title; ?>">
									</div>
								<?php } ?>

								<div class="article-title">
									<h1 class="page-title" itemprop="headline"><?php __p($value['title']); ?></h1>
								</div>

								<div class="article-content">
									<?php if (empty($value['excerpt'])) { ?>
										<div class="full">
											<?php __c($value['excerpt']); ?>
										</div>
									<?php } else { ?>
										<p class="excerpt"><?php __p($value['excerpt']); ?></p>
										<div class="full">
											<div class="full-inner">
												<?php __p($value['content']); ?>
											</div>
										</div>
										<div class="more" data-txtmore="Read more" data-txtless="Read less">
											<span>Read more</span>
										</div>
									<?php } ?>
								</div>

							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</section>
	<?php endif; ?>

</div> <!-- end #content -->

<?php get_footer(); ?>