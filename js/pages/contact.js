define(['jquery', 'tweenmax', 'util/common'],
	function($, TweenMax, Common) {
		'use strict';
		var tween;
		var $article;

		function _init() {
			if (!$('body').hasClass('page-template-page-contact-php')) {
				return;
			}

			if (window.innerWidth < 768 || $('html').hasClass('ie9')) {
				new SubmitForm($('form'));
				return;
			}

			tween = new TimelineMax();
			$article = $('.article');

			if (window.innerWidth > 767) {
				if (window.APP.firstLoad) {
					_setAnimation();
					Common.pubsub.subscribe('onAssetsLoaded', function() {
						_animateIn();
					});
				} else {
					_setAnimation();
					_animateIn();
				}
			}

			new SubmitForm($('form'));
		}

		function _setAnimation() {
			var x = window.innerWidth;
			TweenMax.set($('#content > .heading .wrapper'), { x: x });
			$article.each(function() {
				var inner = $(this).find('.article-inner');
				TweenMax.set(inner, { y: '-100%' });
			});
		}

		function _animateIn() {
			tween.to($('#content > .heading .wrapper'), .75, { x: 0 });
			$article.each(function(i) {
				var delay = 0.5 * (i % 3);
				var inner = $(this).find('.article-inner');
				TweenMax.to(inner, 0.5, { delay: (delay + 0.75), y: '0%' });
			});
		}

		function SubmitForm(el) {
			this.el = el;
			this.$input = el.find('input[type="text"], textarea');
			this.$email = el.find('#enquiry_email');
			this.$error = el.find('.fail');
			this.isSubmitting = false;
			this.valid = true;
			this.err = [];
			return this.init();
		}

		SubmitForm.prototype.validateEmail = function(email) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			return re.test(email);
		}

		SubmitForm.prototype.init = function() {
			this.el.on('submit', function() {
				this.submitForm();
				return false;
			}.bind(this));
		};

		SubmitForm.prototype.submitForm = function() {
			var _self = this;
			this.err = [];
			if (this.isSubmitting) {
				return false;
			}
			this.valid = true;

			this.$input.each(function() {
				if ($(this).attr('id') === 'enquiry_email') {
					return;
				} else {
					if (($.trim($(this).val()) === '')) {
						_self.valid = false;
						_self.err.push('Please supply ' + $(this).attr('data-validate') );
					}
				}
			});

			if (!this.validateEmail(this.$email.val())) {
				this.err.push('Please supply a valid email address.');
			}

			this.el.removeClass('error');

			if (this.valid) {

				this.el.addClass('submitting');
				var data = {};
				this.$input.each(function() {
					data[$(this).attr('name')] = $(this).val();
				});

				$.ajax({
					type : 'POST',
					url: window.APP.ajaxUrl,
					dataType: 'json',
					data: {
						action: 'post_contact',
						data: data
					},
					success: function() {
						window.log('siccess');
						_self.el.removeClass('submitting');
						_self.el.addClass('success');
					}, error: function() {
						window.log('error');
					}
				});
			} else {
				this.el.addClass('error');

				this.$error.find('ul').empty();
				window.log(this.$error);
				$.each(this.err, function() {
					var li = $('<li />');
					li.text(this);
					_self.$error.find('ul').append(li);
				});

			}

		};

		return {
			init : _init
		}
	}
);