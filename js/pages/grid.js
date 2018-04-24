define(['jquery', 'util/common', 'underscore'],
	function($, Common, _) {
		'use strict';
		var tween;
		var $article;

		function _init() {
			if ($('body').hasClass('page-template-page-services-php') || $('body').hasClass('page-template-page-resources-php')) {

				if (window.innerWidth < 768 || $('html').hasClass('ie9')) {
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

			}
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

			if (window.location.hash) {
				var hash = window.location.hash;
				hash = hash.split('#')[1];
				var el = $('*[data-id=' + hash + ']');
				_.delay(function() {
					el.find('.more').click();
				}, 2000);

			}

		}

		return {
			init : _init
		}
	}
);