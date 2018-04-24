jQuery(document).ready(function($) {
	// SORTABLE ----------
	// Make all items in the metabox sortable (using drag-and-drop).
	// WARNING: When using TinyMCE, the editor is cleared (not working) after swapping position.

	$('.wpalchemy-meta-control').find('.wpa_loop').sortable();

	// Reference: http://pastebin.com/kigpvmzq
	// http://www.farinspace.com/wordpress-media-uploader-integration/comment-page-2/#comment-17330

	// UPLOAD ----------

	var $formImageSrc = null;
	var $formImageAlt = null;
	var $formImageId = null;
	var $preview = null;
	var $button = null;
	var $parent = null;
	var frameInterval = null;

	$('.wpalchemy-meta-control').on('click', '.upload_image_button', function() {
		$button = $(this);
		$parent = $button.parent();
		$formImageSrc = $parent.find('input.image_src');
		$formImageAlt = $parent.find('input.image_alt');
		$formImageId = $parent.find('input.image_id');
		$preview = $parent.find('.preview');

		frameInterval = setInterval(function() {
			var $frame = $('#TB_iframeContent');

			// Change button text.
			$frame.contents().find('.savesend .button').val('Use This Image');

			// Remove url, alignment and size fields- auto set to null, none and full respectively
			$frame.contents().find('.url').hide().find('input').val('');
			$frame.contents().find('.align').hide().find('input:radio').filter('[value="none"]').attr('checked', true);
			$frame.contents().find('.image-size').hide().find('input:radio').filter('[value="full"]').attr('checked', true);
		}, 1000);

		var sourceTab = $button.hasClass('change') ? 'library' : 'type';
		tb_show('', 'media-upload.php?type=image&tab=' + sourceTab + '&TB_iframe=true');
		return false;
	});

	window.original_send_to_editor = window.send_to_editor;
	window.send_to_editor = function(html) {
		clearInterval(frameInterval);
		if ($formImageSrc && $formImageSrc.length > 0) {
			var id = '';
			var url = '';
			var src = null;
			var cls = null;
			var alt = null;
			var href = null;

			// If image links somewhere then the img node will be a child of the returned html.
			var $html = $(html);
			if ($html.children().length > 0) {
				src = $('img',html).attr('src');
				cls = $('img',html).attr('class');
				alt = $('img',html).attr('alt');
				href = $('a',html).attr('href');
			} else {
				src = $html.attr('src');
				cls = $html.attr('class');
				alt = $html.attr('alt');
			}

			if (typeof cls !== 'undefined') {
				id = cls.match(/([0-9]+)/i);
				id = (id && id[1]) ? id[1] : '';
			}

			url = src ? src : href ;

			$formImageSrc.val(url);
			$formImageAlt.val(alt);
			$formImageId.val(id);

			// Show image preview.
			var previewUrl = url;
			$preview.attr('data-full', url).fadeIn();

			// Change button state.
			$button.html('Change').addClass('change').parent().find('.delete_image_button').fadeIn();
			tb_remove();
			$formImageSrc = null;
		} else {
			window.original_send_to_editor(html);
		}
	};

	// REMOVE FN ----------

	$('.wpalchemy-meta-control').on('click', '.delete_image_button', function() {
		var $el = $(this);

		$parent = $el.parent();
		$formImageSrc = $parent.find('input.image_src').val('');
		$formImageAlt = $parent.find('input.image_alt').val('');
		$formImageId = $parent.find('input.image_id').val('');

		// Remove preview image.
		$parent.find('.preview').attr('data-full', '').hide();
		$parent.find('.upload_image_button').html('Upload').removeClass('change');
		$el.fadeOut();
		return false;
	});

	// PREVIEW CLICK HANDLER ----------

	$('.wpalchemy-meta-control').on('click', '.preview', function() {
		var w = 640;
		var h = 480;
		var fullSrc = $(this).data('full');
		if (fullSrc && fullSrc !== '') {
			var title = 'IMG_' + new Date().getTime();
			var left = (screen.width / 2) - (w / 2);
			var top = (screen.height / 2) - (h / 2);
			return window.open(fullSrc, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
		}
	});

	// DATE PICKER ----------

	$('.wpalchemy-meta-control').find('.datepicker').each(function() {
		var $el = $(this);
		$el.datepicker({
			dateFormat : 'dd/mm/yy'
		});
		if ($.trim($el.val()) === '') {
			$el.datepicker('setDate', new Date());
		}
	});

	// TINYMCE ----------

	$('.wpalchemy-meta-control').find('.wysiwyg').each(function(idx) {
		var $el = $(this);
		var id = $el.attr('id');
		if (!id) {
			id = +new Date() + '-' + idx;
			$el.attr('id', id);
		}
		tinyMCE.execCommand('mceAddEditor', false, id);
	});
});