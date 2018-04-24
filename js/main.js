require(['jquery', 'tweenmax', 'fastclick', 'imagesloaded', 'classes/preload', 'util/common', 'modules/menu', 'modules/accordion', 'pages/home', 'pages/people', 'pages/contact', 'pages/grid', 'pages/tools'],
	function($, TweenMax, FastClick, Imagesloaded, Preload, Common, Menu, Accordion, Home, People, Contact, Services, Tools) {
		'use strict';

		window.APP.firstLoad = true;
		window.APP.ajaxReady = false;
		window.APP.isAnimating = false;
		window.APP.isLoading = false;

		var $body = $('body');
		var $outer = $('#outer');
		var $inner = $('#inner');
		var $header = $('header');
		var $nav = $('nav');
		var $loader = $('#site-loader .line-container');

		FastClick.attach(document.body);

		// Console polyfill.
		window.log = function() {
			try {
				window.console.log(Array.prototype.slice.call(arguments));
			} catch(e) {}
		};

		// Request animation frame polyfill.
		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
		})();

		// Function bind polyfill.
		if (!Function.prototype.bind) {
			Function.prototype.bind = function (oThis) {
				if (typeof this !== 'function') {
					throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
				}

				var aArgs = Array.prototype.slice.call(arguments, 1);
				var FToBind = this;
				var FNOP = function () {};
				var FBound = function () {
					return FToBind.apply(this instanceof FNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
				};

				FNOP.prototype = this.prototype;
				FBound.prototype = new FNOP();

				return FBound;
			};
		}

		// DOMParse Polyfill
		(function(DOMParser) {
			var DOMParser_proto = DOMParser.prototype;
			var real_parseFromString = DOMParser_proto.parseFromString;

			// Firefox/Opera/IE throw errors on unsupported types
			try {
				// WebKit returns null on unsupported types
				if ((new window.DOMParser()).parseFromString('', 'text/html')) {
					// text/html parsing is natively supported
					return;
				}
			} catch (ex) {}

			DOMParser_proto.parseFromString = function(markup, type) {
				if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
					var doc = document.implementation.createHTMLDocument('');
					var doc_elt = doc.documentElement;
					var first_elt;

					doc_elt.innerHTML = markup;
					first_elt = doc_elt.firstElementChild;

					if (doc_elt.childElementCount === 1 && first_elt.localName.toLowerCase() === 'html') {
						doc.replaceChild(first_elt, doc_elt);
					}

					return doc;
				} else {
					return real_parseFromString.apply(this, arguments);
				}
			};
		}(window.DOMParser));

		// Window events.
		$(window).on({
			unload : function() {
				$(this).scrollTop(0);
			},
			resize : function() {
				Common.pubsub.publish('onWindowResize');
			},
			scroll : function() {
				Common.pubsub.publish('onWindowScroll');
			}
		});

		$('html').on('focus', 'input, textarea', function(evt) {
			togglePlaceholder(evt, false);
		});

		$('html').on('blur', 'input, textarea', function(evt) {
			togglePlaceholder(evt);
		});

		function togglePlaceholder(evt, bool) {
			var currentTarget = $(evt.currentTarget);
			var $label = currentTarget.prev();
			if (typeof bool === 'boolean') {
				if (bool) {
					$label.removeClass('hidden');
				} else {
					$label.addClass('hidden');
				}
			} else {
				if ($.trim(currentTarget.val()) === '') {
					$label.removeClass('hidden');
				} else {
					$label.addClass('hidden');
				}
			}
		}

		function _onloadGetImages() {
			var loaded = 0;
			var $assets = $('img');
			if ($assets.length) {
				$assets.each(function() {
					new Imagesloaded(this, function() {
						loaded += 1;
						if (loaded === $assets.length) {
							_animateIn();
						}
					});
				});
			} else {
				_animateIn();
			}
		}
		_onloadGetImages();

		// AJAX Logic
		if (window.Modernizr.history && window.DOMParser) {
			// Regular menu

			$('html').on('click', 'nav li:not(.external) a, footer ul li:not(.tooltip) a, .service-areas .more a, section.tools .article-content a, section.tools .article-thumb a, body.single .back a, body.single .article-related a', function(evt) {
				var currentTarget = $(evt.currentTarget);
				if (window.innerWidth > 767) {
					var targetUrl = currentTarget.attr('href');
					if (window.APP.isLoading) {
						return false;
					}

					if (targetUrl === window.location.href) {
						return false;
					}

					// Only animate if the URL doesnt have the 'knowledge' class (for APT078)
					if (!currentTarget.parent().hasClass('knowledge')) {
						window.APP.ajaxReady = false;
						Common.ajax.getHTML(evt);
					}
					
				}
			});

			if (window.addEventListener) {
				window.addEventListener('popstate', function() {
					if($('html').hasClass('historypushed')) {
						Common.ajax.getHTML();
					}
				});
			}
		}

		function _resetEvents() {
			$(window).off('orientationchange');
			$(window).off('resize');
			$('html').off('mousemove');
			$(document).off('mouseleave');
			window.clearTimeout(window.APP.slideInterval);
			window.APP.slideInterval = null;
		}

		function _animateIn() {
			// IE9 check for 'other' pages
			if ($header.css('position') !== 'fixed') {
				return false;
			}
			var headerHeight = (window.innerWidth > 767) ? 242 : 87;
			var tween = new window.TimelineMax({ onComplete: function() {
				$body.removeClass('preload');
				TweenMax.set([$header, $body, $nav, $loader], { clearProps: 'all' });
				Common.pubsub.publish('onAssetsLoaded');
			}});
			tween.to($body, 1, { opacity: 1 });
			if (window.innerWidth > 767) {
				tween.to($loader, 1, { width: '100%' });
			}
			tween.to($header, .5, { height: headerHeight });
			if (window.innerWidth > 767) {
				tween.set($nav, { opacity: 1 });
				tween.to($nav, 0.5, { y: '0%' });
			}
			//tween.to($content, 1, { opacity: 1 });
		}

		Menu.init();

		Home.init();
		People.init();
		Services.init();
		Contact.init();
		Tools.init();

		Common.pubsub.publish('menuUpdate');

		$('.grid-container').each(function() {
			new Accordion($(this));
		});

		window.APP.firstLoad = false;

		Common.pubsub.subscribe('onAjaxClick', function() {
			window.APP.isAnimating = true;
			var x = window.innerWidth;
			TweenMax.to($('#content > .heading .wrapper, section'), .5, { x: -x, onComplete: function() {
				window.APP.isAnimating = false;
				if ($(window).scrollTop() > 242) {
					TweenMax.to(window, 0.5, {scrollTo:{ y: 242 }, ease: window.Power2.easeOut});
				}
				$('body').addClass('loading');
				if (window.APP.ajaxReady) {
					Common.pubsub.publish('buildPage');
				}
			}});
		});

		Common.pubsub.subscribe('onAjaxOk', function() {
			//window.APP.isLoading = false;
			_resetEvents();
			Common.pubsub.publish('toAjaxPreload');
		});

		Common.pubsub.subscribe('toAjaxPreload', function() {
			new Preload($(window.APP.html.body));
		});

		Common.pubsub.subscribe('buildPage', function() {
			window.log('buildPage');
			window.log('pathname: ' + window.location.pathname);

			//var title = document.getElementsByTagName('title')[0].innerHTML;
			var $newBody = $(window.APP.html.body);
			$newBody.removeClass('preload');
			$body.removeAttr('class').attr('class', $newBody.attr('class'));
			$inner.remove();
			$newBody.find('#inner').appendTo($outer);
			$inner = $('#inner');

			Home.init();
			People.init();
			Services.init();
			Contact.init();
			Tools.init();

			$('.grid-container').each(function() {
				new Accordion($(this));
			});

			Common.pubsub.publish('menuUpdate');

			$('body').removeClass('loading');

			window.APP.isLoading = false;

			if (typeof window.ga !== 'undefined') {
				// window.ga('set', {
				// 	page: window.location.pathname,
				// 	title: title
				// });
				// send it for tracking
				window.ga('send', 'pageview', window.location.pathname);
			}
		});

		// Footer 'Tooltop'
		$('.tooltip').on('click', function(evt) {
			evt.preventDefault();
			$('.important-container').addClass('active');
		});

		$('.important-container .close').on('click', function() {
			$('.important-container').removeClass('active');
		});
		
		
		
	    $(".more").on('click', function() {
		    console.log("clicked on!");
		});
		


	}
);