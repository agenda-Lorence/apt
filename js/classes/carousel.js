define(['jquery', 'hammer', 'tweenmax', 'util/common'],
	function($, Hammer, TweenMax, Common) {
		'use strict';
		var ratioVal = 2.20;

		function Carousel(el) {
			this.parent = el.parents('section.carousel-container');
			this.el = el;
			this.inner = el.find('.carousel-inner');
			this.items = el.find('.item');
			this.arrow = el.find('.arrow');
			this.paginate = el.find('.paginate li');
			this.maxHeight = 0;
			this.maxPos = this.items.length;
			this.setPos = 0;
			this.prevPos = 0;
			this.pause = 6000;
			return this.init();
		}

		Carousel.prototype.init = function() {
			$('.carousel .item:last').insertBefore($(".carousel .item:first"));
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

			this.paginate.on('click', function(evt) {
				this.paginateClick(evt);
			}.bind(this));

			this.clearTimeOut();
			this.setAnimation();
		};

		Carousel.prototype.onSwipe = function(dir) {
			if (this.isAnimating) {
				return;
			}
			this.page = false;

			if (dir === 'left') {
				this.setPos++;
				this.direction = 'next';
			} else {
				this.setPos--;
				this.direction = 'prev';
			}

			this.checkPos();
			this.clearTimeOut();
			this.animateBanner();
		};

		Carousel.prototype.arrowClick = function(evt) {
			if (this.isAnimating) {
				return;
			}
			this.page = false;

			this.setPos++;
			this.direction = 'next';

			this.checkPos();
			this.clearTimeOut();
			this.animateBanner();
		};

		Carousel.prototype.paginateClick = function(evt) {
			var currentTarget = $(evt.currentTarget);
			if (currentTarget.hasClass('active')) { return false; }
			if (this.isAnimating) { return false; }
			this.page = true;
			var newIndex = this.paginate.index( currentTarget );
			this.direction = (newIndex > this.setPos) ? 'next' : 'prev';
			this.setPos = newIndex;
			this.checkPos();
			this.clearTimeOut();
			this.animateBanner();
		};

		Carousel.prototype.doLayout = function() {
			var ratio = Common.ratio.getRatio(ratioVal, this.inner);
			if (ratio > 409) {
				ratio = 409;
			}
			this.parent.css('height', ratio);
		};

		Carousel.prototype.setAnimation = function() {
			this.page = false;
			window.APP.slideInterval = window.setTimeout(function() {
				this.autoAnimate();
			}.bind(this), this.pause);
		};

		Carousel.prototype.clearTimeOut = function() {
			window.clearTimeout(window.APP.slideInterval);
			window.APP.slideInterval = null;
		};

		Carousel.prototype.autoAnimate = function() {
			this.setPos++;
			this.direction = 'next';

			this.checkPos(); // Check whether pos is valid

			this.animateBanner();
		};

		Carousel.prototype.checkPos = function() {
			if (this.setPos >= this.maxPos) { this.setPos = 0; }
			if (this.setPos < 0) { this.setPos = this.maxPos - 1; }
		};

		Carousel.prototype.animateBanner = function() {
			var distance = ((this.direction === 'next') ? '-100%' : '100%');
			var _self = this;
			var $target = this.items.eq(this.setPos);
			this.isAnimating = true;

			this.paginate.removeClass('active');
			this.paginate.eq(this.setPos).addClass('active');

			var delay = (!window.Modernizr.touch) ? 0.5 : 0;

			this.items.removeClass('active');

			if (this.page) {

			}

			TweenMax.to(this.items, 0.5, { delay: delay, x: distance, ease: window.Power2.easeInOut, onComplete: function() {
				_self.items.eq(_self.setPos).addClass('active');

				if (_self.direction === 'next') {
					$('.carousel .item:first').insertAfter($(".carousel .item:last"));
				} else {
					$('.carousel .item:last').insertBefore($(".carousel .item:first"));
				}

				TweenMax.set(_self.items, { clearProps: 'all' });
				_self.isAnimating = false;
				_self.clearTimeOut();
				_self.setAnimation();
			}});

		};

		return Carousel;
	}
);