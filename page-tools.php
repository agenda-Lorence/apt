<?php
/*
Template Name: Page Tools
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

	<section class="grid-container tools">

		<div class="tools-head">
			<div class="wrapper">
				<h1 class="head">Tools</h1>
			</div>
		</div>

		<div class="tools-headings">
			<div class="wrapper">
				<div class="grid">
					<div class="item">
						<div class="item-thumb articles"></div>
						<div class="item-title">
							<h1>Articles</h1>
						</div>
						<div class="item-more">
							<span class="closed">Show Tools</span>
							<span class="opened">Hide Tools</span>
						</div>
					</div>

					<div class="item">
						<div class="item-thumb calculator"></div>
						<div class="item-title">
							<h1>Calculators</h1>
						</div>
						<div class="item-more">
							<span class="closed">Show Tools</span>
							<span class="opened">Hide Tools</span>
						</div>
					</div>

					<div class="item">
						<div class="item-thumb video"></div>
						<div class="item-title">
							<h1>Videos</h1>
						</div>
						<div class="item-more">
							<span class="closed">Show Tools</span>
							<span class="opened">Hide Tools</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="tools-content">

			<div class="tab blog">
				<div class="tab-inner">

					<div class="head">
						<div class="wrapper">
							<div class="icon articles-icon">
								<span></span>
							</div>
							<div class="title">
								<h2>Articles</h2>
							</div>
							<div class="head-more">
								<span class="closed">Show Tools</span>
								<span class="opened">Hide Tools</span>
							</div>

						</div>
					</div>

					<?php $posts = _getPosts(); ?>
					<?php if (count($posts) > 0): ?>
						<div class="articles">
							<div class="articles-inner">
								<?php foreach($posts as $key => $value): ?>
									<div class="article<?php if (!$key): ?> featured<?php endif; ?>">
										<div class="article-inner">
											<div class="article-table">
												<div class="article-thumb">
													<a href="<?php echo $value['link']; ?>">
														<img src="<?php echo $value['image']; ?>" />
													</a>
												</div>
												<div class="article-content">
													<div>
														<h2><?php echo $value['name']; ?></h2>
														<time><?php echo $value['date']; ?></time>
														<?php echo __c(trim_by_words($value['content'], 25, true)); ?>
														<a href="<?php echo $value['link']; ?>" class="more">View Article</a>
													</div>
												</div>

											</div>
										</div>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
					<?php endif; ?>

				</div>
			</div>

			<div class="tab calc">
				<div class="tab-inner">

					<div class="head">
						<div class="wrapper">
							<div class="icon calculator">
								<span></span>
							</div>
							<div class="title">
								<h2>Calculators</h2>
							</div>
							<div class="head-more">
								<span class="closed">Show Tools</span>
								<span class="opened">Hide Tools</span>
							</div>
						</div>
					</div>

					<div class="articles articles-calc">
						<div class="articles-inner">
							<div class="wrapper">
								<?php foreach(get_field('calculators', $post->ID, true) as $key => $value): ?>
									<div class="cal">
										<div class="cal-inner">
											<h2><?php __p($value['title']); ?></h2>
											<?php __c($value['content']); ?>
											<?php if (isset($value['links']) && !empty($value['links'])): ?>
												<div class="links">
													<?php foreach($value['links'] as $k => $v): ?>
														<div class="link">
															<a class="more" href="<?php __p($v['address']); ?>"><?php __p($v['text']); ?></a>
														</div>
													<?php endforeach; ?>
												</div>
											<?php endif; ?>
										</div>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
					</div>

				</div>
			</div>

			<div class="tab vids">
				<div class="tab-inner">

					<div class="head">
						<div class="wrapper">
							<div class="icon video">
								<span></span>
							</div>
							<div class="title">
								<h2>Videos</h2>
							</div>
							<div class="head-more">
								<span class="closed">Show Tools</span>
								<span class="opened">Hide Tools</span>
							</div>

						</div>
					</div>


						<?php $posts = _getPosts('video'); ?>
						<?php if (count($posts) > 0): ?>
							<div class="articles">
								<div class="articles-inner">
									<?php foreach($posts as $key => $value): ?>
										<div class="article<?php if (!$key): ?> featured<?php endif; ?>">
											<div class="article-inner">
												<div class="article-table">
													<div class="article-thumb">
														<a href="<?php echo $value['link']; ?>">
															<img src="<?php echo $value['image']; ?>" />
														</a>
													</div>
													<div class="article-content">
														<div>
															<h2><?php echo $value['name']; ?></h2>

															<time><?php echo $value['date']; ?></time>
															<?php echo __c(trim_by_words($value['content'], 25, true)); ?>
															<a href="<?php echo $value['link']; ?>" class="more">View Article</a>
														</div>
													</div>
												</div>
											</div>
										</div>
									<?php endforeach; ?>
								</div>
							</div>
						<?php endif; ?>


				</div>
			</div>




		</div>



	</section>



</div>

<?php get_footer(); ?>