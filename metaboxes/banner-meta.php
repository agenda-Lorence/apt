<?php global $wpalchemy_media_access; ?>
<table class="wpalchemy-meta-control" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<th>
			<label>Text color</label>
		</th>
		<td>
			<ul class="checkboxes">
				<?php $mb->the_field('color'); ?>
				<?php $types = array('light', 'dark'); ?>
				<?php foreach ($types as $i => $t): ?>
					<li>
						<?php $rad_val = $mb->get_the_value(); ?>
						<?php if (empty($rad_val) && $i === 0) : ?>
							<input id="t-<?php echo $i; ?>" type="radio" name="<?php $mb->the_name(); ?>" value="<?php echo $t; ?>" checked="checked">
						<?php else : ?>
							<input id="t-<?php echo $i; ?>" type="radio" name="<?php $mb->the_name(); ?>" value="<?php echo $t; ?>" <?php $mb->the_radio_state($t); ?>>
						<?php endif; ?>
						<label for="t-<?php echo $i; ?>"><?php echo $t; ?></label>
					</li>
				<?php endforeach; ?>
			</ul>
		</td>
	</tr>
	<tr>
		<th>
			<label>Banner image</label>
			<br>
			<span>Size: 900px (W) x 409px (H)</span>
		</th>
		<td>
			<?php $field_name = 'image'; ?>
			<?php while($mb->have_fields_and_multi($field_name)): ?>
			<?php $mb->the_group_open(); ?>

				<?php $mb->the_field('image_src'); ?>
				<p>
					<input type="text" name="<?php $mb->the_name(); ?>" value="<?php $mb->the_value(); ?>" class="image_src">
					<?php $mb->the_field('image_id'); ?>
					<input type="hidden" name="<?php $mb->the_name(); ?>" value="<?php $mb->the_value(); ?>" class="image_id">
					<?php $mb->the_field('image_alt'); ?>
					<input type="hidden" name="<?php $mb->the_name(); ?>" value="<?php $mb->the_value(); ?>" class="image_alt">
				</p>

				<?php
				if ($mb->get_the_value('image_src') != "") {
					$button_text = 'Change';
					$cls = 'change';
					$hide = '';
				} else {
					$button_text = 'Upload';
					$cls = '';
					$hide = 'hide';
				}?>

				<button type="button" class="upload_image_button button <?php echo $cls; ?>">
					<?php echo $button_text; ?>
				</button>
				<button type="button" class="delete_image_button button <?php echo $hide; ?>">
					<?php echo 'Remove'; ?>
				</button>

				<?php // Show image preview.
				$mb->the_field('image_src');
				$preview_cls = 'hide';
				if ($mb->get_the_value()) {
					$preview_cls = '';
				}
				echo '<span class="preview ' . $preview_cls . '" alt="' . $mb->get_the_name() . '" data-full="' . $mb->get_the_value() . '">preview</span>';
				?>

			<?php $mb->the_group_close(); ?>
			<?php endwhile; ?>
		</td>
	</tr>
</table>