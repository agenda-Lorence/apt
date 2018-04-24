<?php
/*
Template Name: Page Home
*/
$post = $wp_query->get_queried_object();
get_header(); ?>

<div id="content">
	<section class="carousel-container">
		<div class="mask-container">
			<div class="mask left"></div>
			<div class="mask right"></div>
		</div>

		<div class="carousel">
			<div class="wrapper">
				<div class="carousel-inner">
					<?php foreach(get_field('carousel', $post->ID, true) as $key => $value): ?>
						<?php $img = $value['image']; ?>
						<div class="item<?php if (!$key): ?> active<?php endif; ?>">
							<div class="background" style="background-image: url('<?php __p($img['url']); ?>');">
								<img src="<?php __p($img['url']); ?>" alt="" />
							</div>
							<div class="text <?php echo strtolower($value['colour']); ?>">
								<span><?php __br($value['text']); ?></span>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
				<div class="arrow">
					<span></span>
				</div>
				<div class="paginate">
					<ul>
						<?php foreach(get_field('carousel', $post->ID, true) as $key => $value): ?>
							<li<?php if (!$key): ?> class="active"<?php endif; ?>>
								<span></span>
							</li>
						<?php endforeach; ?>
					</ul>
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
					<div class="news-inner">
						<h3>Keep updated on the latest market trends</h3>
						<?php __c(get_field('news', $post->ID, false)); ?>
						<a href="<?php bloginfo('url'); ?>/resources/portfolio-watch/">View here</a>
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

	<section class="service-areas">
		<div class="wrapper">
			<h2>Service Areas</h2>
			<div class="service-areas-inner">
				<div class="arrow prev">
					<span></span>
				</div>
				<div class="arrow next">
					<span></span>
				</div>
				<?php if (count(get_field('services', 852, true)) > 0): ?>
					<?php foreach(get_field('services', 852, true) as $key => $value): ?>
						<?php $cls = '';
						if ($key && $key % 4 === 0) {
							$cls = ' clearleft';
						}
						$img = $value['home_page_thumbnail'];
						$page_child_thumb = wp_get_attachment_image_src($img['ID'], 'full');
						?>

						<div class="item<?php echo $cls; ?><?php if (!$key): ?> active<?php endif; ?>">
							<div class="item-inner">
								<?php if ($page_child_thumb[0]) { ?>
									<div class="item-thumb" style="background-image: url('<?php echo $page_child_thumb[0]; ?>');">
										<img src="<?php echo $page_child_thumb[0]; ?>" alt="<?php echo $page_child_title; ?>">
									</div>
								<?php } ?>

								<div class="item-title">
									<h3><?php __p($value['title']); ?></h3>
								</div>

								<div class="more">
									<a href="<?php bloginfo('url'); ?>/services/#<?php echo sanitize_title($value['title']); ?>">Read more</a>
								</div>

							</div>
						</div>
					<?php endforeach; ?>
				<?php endif; ?>


			</div>
		</div>
	</section>

	<section class="links">
		<div class="wrapper">
			<div class="links-inner">
				<div class="links-first">
					<div class="icon">
						<?php $icon = get_field('partner_icon', $post->ID, true); ?>
						<img src="<?php echo $icon['url']; ?>" />
					</div>

					<div class="icon-heading">
						Our Partners
					</div>

					<?php foreach(get_field('partner', $post->ID, true) as $key => $value): ?>

						<div class="link">
							<div class="link-content">
								<h3><?php __p($value['heading']); ?></h3>
								<?php __c($value['content']); ?>
								<?php foreach($value['links'] as $k => $v): ?>
									<p><a target="_blank" href="<?php __p($v['address']); ?>" class="arrow-icon"><?php __p($v['text']); ?></a></p>
								<?php endforeach; ?>
							</div>

							<div class="link-logo">
								<?php $logo = $value['logo']; ?>
								<?php if (!empty($logo['url']) && isset($logo['url'])): ?>
									<img src="<?php echo $logo['url']; ?>" />
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>

				</div>
				<div class="links-second">
					<div class="icon">
						<?php $icon = get_field('community_icon', $post->ID, true); ?>
						<img src="<?php echo $icon['url']; ?>" />
					</div>

					<div class="icon-heading">
						The Community
					</div>

					<?php foreach(get_field('community', $post->ID, true) as $key => $value): ?>

						<div class="link">
							<div class="link-content">
								<h3><?php __p($value['heading']); ?></h3>
								<?php __c($value['content']); ?>
								<?php foreach($value['links'] as $k => $v): ?>
									<p><a href="<?php __p($v['address']); ?>" target="_blank" class="arrow-icon"><?php __p($v['text']); ?></a></p>
								<?php endforeach; ?>
							</div>

							<div class="link-logo">
								<?php $logo = $value['logo']; ?>
								<?php if (!empty($logo['url']) && isset($logo['url'])): ?>
									<img src="<?php echo $logo['url']; ?>" />
								<?php endif; ?>

							</div>
						</div>
					<?php endforeach; ?>

				</div>
			</div>
		</div>
	</section>
</div>

<?php get_footer(); ?>