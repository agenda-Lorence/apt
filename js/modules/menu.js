define(['jquery', 'tweenmax', 'util/common'],
	function($, TweenMax, Common) {
		'use strict';

		var pos = 0;
		var scrollPin = 242;

		function _init() {

			$('html').on('click', 'header .burger', function(evt) {
				evt.preventDefault();
				$('html').toggleClass('apt-menu');
				$('html').addClass('menu-transition');
				if (window.Modernizr.csstransitions) {
					$('html').addClass('apt-menu-animating');
				}
				if ($('html').hasClass('apt-menu')) {
					pos = $(window).scrollTop();
				} else {
					$(window).scrollTop(pos);
				}
			});

			$('html').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', 'nav', function() {
				$('html').removeClass('menu-transition apt-menu-animating');
				if ($('html').hasClass('apt-menu')) {
					if (window.innerWidth < 1024) {
						$(window).scrollTop(0);
					}
				}
			});

			$('html').on('click', 'nav li a', function() {
				if (window.innerWidth < 768) {
					$('header a.burger').click();
				}
			});

			$(window).on('scroll', _onScroll);

			// Process main menu (top) for applying animation.
			if (window.APP.firstLoad) {
				Common.pubsub.subscribe('menuUpdate', function() {
					$('nav ul li a').each(function() {
						var $menu = $(this);
						var menuText = $menu.text();
						$menu.empty();
						$menu.html('<span class="out">' + menuText + '</span><span class="over">' + menuText + '</span>');
					});
					_onScroll();
				});
			}
		}

		function _onScroll() {
			if ($(window).scrollTop() > scrollPin) {
				$('nav').addClass('pinned');
			} else {
				$('nav').removeClass('pinned');
			}
		}


		return {
			init : _init
		};
	}
);