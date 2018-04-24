<?php
/*
Template Name: Page Team Members
*/
?>

<?php get_header(); ?>

<div id="content">

	<div class="heading">
		<div class="wrapper">
			<h1 class="page-title page-headline"><?php __p(get_field('heading', $post->ID, false)); ?></h1>
		</div>
	</div>

	<section class="grid-container has-filter">
		<div class="wrapper">
			<div class="filter">
				<h3>Filter by:</h3>
				<div class="row">
					<label for="location">Location</label>
					<div class="selectbox">
						<select id="location">
							<option value="">- Any -</option>
							<?php $addresses = _getAddresses(); ?>
							<?php foreach($addresses as $key => $value): ?>
								<option data-name="<?php echo $value['name']; ?>" value="<?php echo sanitize_title($value['name']); ?>"><?php __p($value['name']); ?></option>
							<?php endforeach; ?>

						</select>
					</div>
				</div>
				<div class="row">
					<label for="position">Position</label>
					<div class="selectbox">
						<select id="position">
							<option value="">- Any -</option>

							<option data-name="director" value="director">Director</option>
							<option data-name="planner" value="planner">Planner</option>
							<option data-name="support-staff" value="support-staff">Support Staff</option>
						</select>
					</div>
				</div>
				<div class="row">
					<button class="button">Submit</button>
				</div>
			</div>

			<?php $people = _getPeople(); ?>

			<?php if (count($people) > 0): ?>
				<div class="grid">
					<div class="team">
						<h3>Our People</h3>
					</div>
					<?php foreach($people as $key => $value): ?>
						<?php $cls = '';
						if ($key && $key % 3 === 0) {
							$cls = ' clearleft';
						}
						?>

						<div class="article<?php echo $cls; ?> borders" data-location="<?php __p($value['location']->post_name); ?>" data-position="<?php __p($value['position']->slug); ?>">
							<div class="article-inner">

								<?php if ($value['image']): ?>
									<div class="article-thumb">
										<img src="<?php echo $value['image']; ?>" />
									</div>
								<?php endif; ?>

								<div class="article-title">
									<h1 class="page-title" itemprop="headline"><?php __p($value['name']); ?></h1>
									<h2 class="page-subtitle"><?php __br($value['title']); ?></h2>
									<?php if (!empty($value['email']) && isset($value['email'])): ?>
										<p class="email">
											<a href="mailto:<?php __p($value['email']); ?>">Email <?php __p($value['firstname']); ?></a>
										</p>
									<?php endif; ?>
								</div>

								<div class="article-content">
									<div class="full">
										<div class="full-inner">
											<?php __c($value['content']); ?>
										</div>
									</div>
									<div class="more" data-txtmore="Read more" data-txtless="Read less">
										<span>Read more</span>
									</div>
								</div>



							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>
</div>




			<div id="content-old" style="display: none;">

				<div id="inner-content">

						<div id="main" class="page-team clearfix" role="main">

							<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

							<article id="post-<?php the_ID(); ?>" <?php post_class('clearfix'); ?> role="article" itemscope itemtype="http://schema.org/BlogPosting">

								<header class="article-header page-header">
									<div class="wrap clearfix">
										<h1 class="page-title page-headline"><?php the_title(); ?></h1>
										<div class="sidebox teamfilter">
											<h4>Filter by:</h4>
											<label for="locationfilter">LOCATION</label>
											<div class="selectbox">
												<select id="locationfilter">
													<option value="">- Any -</option>
												</select>
											</div>
											<label for="positionfilter">POSITION</label>
											<div class="selectbox">
												<select id="positionfilter">
													<option value="">- Any -</option>
												</select>
											</div>
											<button>SUBMIT</button>
										</div> <!-- end team filter -->
									</div>
								</header> <!-- end article header -->

								<?php
								$page_content = get_the_content();
								if (!empty($page_content)) {
									?>
									<section class="entry-content clearfix" itemprop="articleBody">
										<div class="wrap clearfix">
											<div class="entry-content-box">
												<?php the_subtitle('<p class="page-subtitle">', '</p>'); ?>
												<?php the_content(); ?>
											</div>
										</div>
									</section> <!-- end article section -->
									<?php
								}
								?>

								<?php
								$page_children = get_pages('title_li=&post_type=people&sort_column=menu_order&echo=0');
								if (count($page_children) > 0) {
									?>

									<div class="entry-children plain">
										<div class="wrap clearfix">
											<div class="teamselected">Our People</div>

											<ul class="threecols boxwrap teams">

												<?php
												foreach ($page_children as $page_child) {

													// People meta data (job title and location).
													$job_title = get_post_meta($page_child->ID, '_title', true);
													$job_title_caption = get_post_meta($page_child->ID, '_title_caption', true);
													$job_location = get_post_meta($page_child->ID, '_location', true);
													$job_email = get_post_meta($page_child->ID, '_email', true);

													$hide_class = '';
													// if (strtolower($job_title) != 'director') {
													// 	$hide_class = ' start-hidden="y" style="" ';
													// }

													$page_child_content = $page_child->post_content;
													if (!$page_child_content) {
														continue;
													}
													$page_child_content = apply_filters('the_content', $page_child_content);
													$page_child_thumb = wp_get_attachment_image_src(get_post_thumbnail_id($page_child->ID), 'person-thumb');
													$page_child_title = get_the_title($page_child->ID);

													$fname = explode(" ", $page_child_title);

													?>
													<li class="col" data-position="<?php echo $job_title; ?>" data-location="<?php echo $job_location; ?>" <?php echo $hide_class; ?>>
														<div class="col-content">
															<?php if ($page_child_thumb[0]) { ?>
																<div class="article-thumb">
																	<img src="<?php echo $page_child_thumb[0]; ?>" alt="<?php echo $page_child_title; ?>">
																</div>
															<?php } ?> <!-- end article thumbnail (featured image) -->

															<header class="article-header">
																<h1 class="page-title" itemprop="headline"><?php echo $page_child_title; ?></h1>
																<?php if (!empty($job_title)) { ?>
																	<h2 class="page-subtitle"><?php echo $job_title_caption; ?></h2>
																<?php } ?>
																<?php if (!empty($job_email)) : ?>

																<p class="person-email"><a href="mailto:<?php echo $job_email; ?>">Email <?php echo $fname[0]; ?></a></p>
																<?php endif; ?>
															</header> <!-- end article header -->

															<section class="entry-content clearfix collapsible" itemprop="articleBody">
																<?php if (!empty($page_child_content)) { ?>
																	<div class="full collapsed"><?php echo $page_child_content; ?></div>
																	<p><a class="readmore" data-txtmore="Read more" data-txtless="Read less"><i>&gt;</i><span>Read more</span></a></p>
																<?php } ?>
															</section> <!-- end article section -->
														</div>
													</li>
													<?php
												}
												?>

											</ul>
										</div>
									</div>

									<?php
								}
								?> <!-- end article children section -->

								<footer class="article-footer">
									<p class="clearfix"><?php // the_tags('<span class="tags">' . __('Tags:', 'bonestheme') . '</span> ', ', ', ''); ?></p>

								</footer> <!-- end article footer -->

								<?php // comments_template(); ?>

							</article> <!-- end article -->

							<?php endwhile; else : ?>

									<article id="post-not-found" class="hentry clearfix">
											<header class="article-header">
												<h1><?php _e("Oops, Post Not Found!", "bonestheme"); ?></h1>
										</header>
											<section class="entry-content">
												<p><?php _e("Uh Oh. Something is missing. Try double checking things.", "bonestheme"); ?></p>
										</section>
										<footer class="article-footer">
												<p><?php _e("This is the error message in the page-custom.php template.", "bonestheme"); ?></p>
										</footer>
									</article>

							<?php endif; ?>

						</div> <!-- end #main -->

						<?php // get_sidebar(); ?>

				</div> <!-- end #inner-content -->

			</div> <!-- end #content -->

<?php get_footer(); ?>
