define(['jquery', 'tweenmax'],
	function($, TweenMax) {
		'use strict';

		function Accordion(el) {
			this.el = el;
			this.content = el.find('.full');
			this.more = el.find('.more');
			return this.init();
		}

		Accordion.prototype.init = function() {
			this.more.on('click', function(evt) {
				this.onAction(evt);
			}.bind(this));


		};

		Accordion.prototype.onAction = function(evt) {
			var currentTarget = $(evt.currentTarget).parents('.article');
			var content = currentTarget.find('.full');
			var height = currentTarget.find('.full-inner').outerHeight(true);

			if (currentTarget.hasClass('active')) {
				TweenMax.set(content, { height: height });
				currentTarget.removeClass('active');
				TweenMax.to(content, 0.5, { height: 0, ease: window.Expo.easeInOut, onComplete: function() {
					content.removeAttr('style');
					$(evt.currentTarget).removeClass('invis');
				}});
			} else {
				TweenMax.set(content, { height: 0 });
				currentTarget.addClass('active');

				TweenMax.to(content, 0.5, { height: height, ease: window.Expo.easeInOut, onComplete: function() {
					var scrollPos = (window.innerWidth < 768) ? $('header').outerHeight() : $('nav').outerHeight();
					content.removeAttr('style');
					$(evt.currentTarget).addClass('invis');
					TweenMax.to(window, 0.5, {scrollTo:{y: currentTarget.offset().top - (scrollPos + 10) }, ease: window.Power2.easeOut});
				}});
			}
		};

		return Accordion;
	}
);