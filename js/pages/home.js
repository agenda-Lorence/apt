define(['jquery', 'tweenmax', 'util/common', 'classes/carousel', 'hammer'],
	function($, TweenMax, Common, Carousel, Hammer) {
		'use strict';

		var $content;

		function _init() {
			if (!$('body').hasClass('home')) {
				return;
			}
			$content = $('#content');

			new Carousel($('.carousel'));
			new MiniCarousel($('.service-areas-inner'));
			window.log('init');
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

		function MiniCarousel(el) {
			this.el = el;
			this.items = this.el.find('.item');
			this.arrow = this.el.find('.arrow');
			this.setPos = 0;
			this.maxPos = this.items.length;
			return this.init();
		}

		MiniCarousel.prototype.init = function() {
			this.doLayout();
			if (window.Modernizr.touch) {
				$(window).on('orientationchange', function() {
					this.doLayout();
				}.bind(this));
			} else {
				$(window).on('resize', function() {
					this.doLayout();
				}.bind(this));
			}

			var hamm = new Hammer(this.el.get(0), {
				velocity : 1
			});

			hamm.on('swipeleft', function() {
				this.direction = 'next';
				this.onSwipe('left');
			}.bind(this));

			hamm.on('swiperight', function() {
				this.direction = 'prev';
				this.onSwipe('right');
			}.bind(this));

			this.arrow.on('click', function(evt) {
				this.arrowClick(evt);
			}.bind(this));
		};

		MiniCarousel.prototype.doLayout = function() {
			this.innerWidth = window.innerWidth;
			this.maxHeight  = Math.max.apply(null, this.items.find('.item-inner').map(function () {
				return $(this).outerHeight();
			}).get());

			if (this.innerWidth < 767) {
				this.items.addClass('transition');
				this.el.css('height', this.maxHeight);
			} else {
				this.items.removeClass('transition');
				this.el.css('height', '');
			}
		};

		MiniCarousel.prototype.onSwipe = function(dir) {
			if (dir === 'left') {
				this.setPos++;
				this.direction = 'next';
			} else {
				this.setPos--;
				this.direction = 'prev';
			}

			this.checkPos();
			this.animateBanner();
		};

		MiniCarousel.prototype.arrowClick = function(evt) {
			var currentTarget = $(evt.currentTarget);

			if (currentTarget.hasClass('prev')) {
				this.setPos--;
				this.direction = 'prev';
			} else {
				this.setPos++;
				this.direction = 'next';
			}

			this.checkPos(); // Check whether pos is valid

			this.animateBanner();
		};

		MiniCarousel.prototype.checkPos = function() {
			if (this.setPos >= this.maxPos) { this.setPos = 0; }
			if (this.setPos < 0) { this.setPos = this.maxPos - 1; }
		};

		MiniCarousel.prototype.animateBanner = function() {
			var $target = this.items.eq(this.setPos);
			this.items.removeClass('active');
			$target.addClass('active');
		};


		// Banner

		return {
			init : _init
		}
	}
);