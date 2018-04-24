define(['jquery', 'tweenmax', 'classes/carousel', 'util/common'],
	function($, TweenMax, Carousel, Common) {
		'use strict';
		var $content;

		function _init() {
			if (!$('body').hasClass('page-template-page-tools-php')) {
				return;
			}

			$content = $('#content');

			new Carousel($('.carousel'));

			new ToolsAccordion($('section.tools'));

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
		}

		function _setAnimation() {
			TweenMax.set($content, { opacity: 0 });
		}

		function _animateIn() {
			TweenMax.to($content, 1, { opacity: 1});
		}

		function ToolsAccordion(el) {
			this.el = el;
			this.items = el.find('.item'); // Desktop / Tablet toggles
			this.headingMore = el.find('.item-more');
			this.tab = el.find('.tab');
			this.index = 0;
			this.opened = 0;
			this.more = el.find('.head-more');
			return this.init();
		}

		ToolsAccordion.prototype.init = function() {
			this.headingMore.on('click', function(evt) {
				var currentTarget = $(evt.currentTarget).parents('.item');
				this.index = this.items.index(currentTarget);
				this.onAction(evt);
			}.bind(this));

			this.more.on('click', function(evt) {
				var currentTarget = $(evt.currentTarget).parents('.tab');
				this.index = this.tab.index(currentTarget);

				this.onAction(evt);
			}.bind(this));
		};

		ToolsAccordion.prototype.onAction = function(evt) {
			var self = this;
			var currentTarget = this.tab.eq(this.index);
			var height;
			var delay = 0;

			if (window.innerWidth > 767) {
				var toClose = false;
				this.items.each(function(i) {
					if ($(this).hasClass('active')) {
						if (i !== self.index) {
							toClose = true;
							return;
						}
					}
				});
				if (toClose) {
					delay = 0.5;
					this.items.removeClass('active');
					this.tab.addClass('invisible');
					TweenMax.to(this.tab, 0.5, { height: 0, onComplete: function() {
						var other = self.tab.not(':eq(' + self.index + ')');
						other.removeClass('active');
						self.tab.removeClass('invisible');
					}});
				}
			}


			var $target = (window.innerWidth > 767) ? currentTarget : currentTarget.find('.articles');

			if (!currentTarget.hasClass('active')) {
				currentTarget.addClass('active');
				TweenMax.set($target, { height: 0 });
				height = $target.find('> div').outerHeight(true);
				self.items.eq(self.index).addClass('active');
				TweenMax.to($target, 0.5, { delay: delay, height: height, ease: window.Expo.easeInOut, onComplete: function() {
					TweenMax.set($target, { clearProps: 'all' });
					var scrollPos = (window.innerWidth < 768) ? $('header').outerHeight() : $('nav').outerHeight();
					TweenMax.to(window, 0.5, {scrollTo:{ y: (currentTarget.offset().top - scrollPos) }, ease: window.Power2.easeOut});
				}});
			} else {
				height = (window.innerWidth > 767) ? $target.find('> div').outerHeight(true) : null;
				TweenMax.set($target, { height: height });
				TweenMax.to($target, 0.5, { height: 0, ease: window.Expo.easeInOut, onComplete: function() {

					TweenMax.set($target, { clearProps: 'all' });
					currentTarget.removeClass('active');
					self.items.eq(self.index).removeClass('active');

				}});
			}


		};

		return {
			init : _init
		}
	}
);