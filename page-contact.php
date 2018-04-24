<?php
/*
Template Name: Page Contact
*/
$post = $wp_query->get_queried_object();
get_header(); ?>

<div id="content">

	<div class="heading">
		<div class="wrapper">
			<h1 class="page-title page-headline"><?php __p(get_field('heading', $post->ID, false)); ?></h1>
		</div>
	</div>

	<?php $addresses = _getAddresses(); ?>

	<?php if (count($addresses) > 0): ?>
		<section class="grid-container">
			<div class="wrapper">
				<div class="grid">
					<?php foreach($addresses as $key => $value): ?>
						<?php $cls = '';
						if ($key && $key % 3 === 0) {
							$cls = ' clearleft';
						}
						?>

						<div class="article<?php echo $cls; ?> borders">
							<div class="article-inner">

								<div class="article-title">
									<h1 class="page-title" itemprop="headline"><?php __p($value['name']); ?></h1>
								</div>
								<div class="article-content addresses">
									<?php __c($value['address']); ?>
									<div class="address-row">
										<span class="prefix">T</span>
										<span><?php __p($value['phone']); ?></span>
									</div>
									<div class="address-row">
										<span class="prefix">F</span>
										<span><?php __p($value['fax']); ?></span>
									</div>
									<div class="address-row">
										<span class="prefix">E</span>
										<span><a href="mailto:<?php __p($value['email']); ?>"><?php __p($value['email']); ?></a></span>
									</div>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</section>
	<?php endif; ?>

	<section class="grid-container form">
		<div class="wrapper">
			<div class="form-container">
				<h2>Alternatively, you can get in touch by filling out the form below.</h2>
				<form method="post">

					<div class="response">
						<div class="response-inner">
							<div class="pass">
								<h3>Success!</h3>
								<p>Form submitted successfully.</p>
							</div>
							<div class="fail">
								<h3>Error found on the form!</h3>
								<ul></ul>
							</div>
						</div>
					</div>

					<div class="table">
						<div class="col cell">
							<div class="row">
								<label for="enquiry_name">Name</label>
								<input type="text" name="enquiry_name" id="enquiry_name" data-validate="a name" />
							</div>
							<div class="row">
								<label for="enquiry_email">Email</label>
								<input type="text" name="enquiry_email" id="enquiry_email" data-validate="a email address" />
							</div>
							<div class="row enquiry">
								<label for="enquiry_message">Enquiry</label>
								<textarea type="text" name="enquiry_message" rows="6" data-validate="an enquiry" id="enquiry_message"></textarea>
							</div>
						</div>

						<div class="col cell bottom">
							<div class="row">
								<input type="submit" value="Submit" name="email" id="enquiry_submit" /> <div class="loading"></div>
							</div>
						</div>
					</div>

				</form>
			</div>
		</div>
	</section>

</div>

<?php get_footer(); ?>