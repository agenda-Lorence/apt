define(['jquery', 'util/common', 'modules/filter'],
	function($, Common, Filter) {
		'use strict';
		var tween;
		var $article;

		function _init() {
			if (!$('body').hasClass('page-template-page-team-php')) {
				return;
			}

			if (window.innerWidth < 768 || $('html').hasClass('ie9')) {
				new Filter($('.grid-container'));
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

			new Filter($('.grid-container'));

		}

		function _setAnimation() {
			var x = window.innerWidth;
			TweenMax.set($('#content > .heading .wrapper'), { x: x });
			TweenMax.set($('#content .filter, .grid .team > h3'), { opacity: 0 });
			$article.each(function() {
				var inner = $(this).find('.article-inner');
				TweenMax.set(inner, { y: '-100%' });
			});
		}

		function _animateIn() {
			tween.to($('#content > .heading .wrapper'), .75, { x: 0 });
			tween.to($('.grid .team > h3'), 0.75, { opacity: 1 });
			$article.each(function(i) {
				var delay = 0.5 * (i % 3);
				var inner = $(this).find('.article-inner');
				TweenMax.to(inner, 0.5, { delay: (delay + 1.5), y: '0%' });
			});
			tween.to($('#content .filter'), 0.75, { delay: 1.5, opacity: 1 });

		}

		return {
			init : _init
		}
	}
);