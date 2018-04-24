define(['jquery', 'underscore'],
	function($, _) {
		'use strict';

		var $body = $('body');
		var events = [];
		var uId = 0;

		function _createId() {
			return 'X' + (++uId).toString() + (+new Date());
		}

		/* PUBSUB */

		var pubsub = (function() {
			function _subscribe(name, cb) {
				if (!events[name]) {
					events[name] = [];
				}

				var token = _createId();
				events[name].push({
					token : token,
					fn : cb
				});

				return token;
			}

			function _unsubscribe(token) {
				for (var ev in events) {
					if (events[ev]) {
						for (var i = 0, iLen = events[ev].length; i < iLen; i += 1) {
							if (events[ev][i].token === token) {
								events[ev].splice(i, 1);
								return token;
							}
						}
					}
				}
			}

			function _publish(name, args) {
				if (!events[name]) {
					return;
				}

				var subscribers = events[name];
				var count = subscribers ? subscribers.length : 0;

				while (count--) {
					subscribers[count].fn(name, args);
				}
			}

			return {
				subscribe : _subscribe,
				unsubscribe : _unsubscribe,
				publish : _publish
			};
		})();

		/* DOM */

		var dom = (function() {
			function _prefix($el, prop, val) {
				var prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
				_.each(prefixes, function(pre) {
					$el.css(pre + prop, val);
				});
			}

			function _clipPath($el, prop, val) {
				var prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
				var polygon = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0">' +
					'<clipPath id="<%= id %>">' +
					'<polygon points="<%= points %>">' +
					'</polygon>' +
					'</clipPath>' +
					'</svg>';

				_.each(prefixes, function(pre) {
					if (pre === '-moz-') {
						var id = _createId();
						var svg = _.template(polygon, {
							id : id,
							points : val.replace(/px/gi, '')
						});
						$body.append(svg);
						$el.css(prop, 'url("#' + id + '")');
					} else {
						$el.css(pre + prop, 'polygon(' + val + ')');
					}
				});
			}

			function _onTransitionEnd($el, callback) {
				var id = _createId();
				$el.data('x-guid', id);
				$el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
					var guid = $(e.target).data('x-guid');
					if (guid === id && typeof callback === 'function') {
						callback();
					}
				});
			}

			function _onTransitionEndAlways($el, callback) {
				var id = _createId();
				$el.data('x-guid', id);
				$el.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
					var guid = $(e.target).data('x-guid');
					if (guid === id && typeof callback === 'function') {
						callback();
					}
				});
			}

			function _onAnimationEnd($el, callback) {
				var id = _createId();
				$el.data('x-guid', id);
				$el.one('animationend webkitAnimationEnd oAnimationEnd oanimationend MSAnimationEnd', function(e) {
					var guid = $(e.target).data('x-guid');
					if (guid === id && typeof callback === 'function') {
						callback();
					}
				});
			}

			function _onAnimationEndAlways($el, callback) {
				var id = _createId();
				$el.data('x-guid', id);
				$el.on('animationend webkitAnimationEnd oAnimationEnd oanimationend MSAnimationEnd', function(e) {
					var guid = $(e.target).data('x-guid');
					if (guid === id && typeof callback === 'function') {
						callback();
					}
				});
			}

			return {
				prefix : _prefix,
				clipPath : _clipPath,
				onTransitionEnd : _onTransitionEnd,
				onTransitionEndAlways : _onTransitionEndAlways,
				onAnimationEnd : _onAnimationEnd,
				onAnimationEndAlways : _onAnimationEndAlways
			};
		})();

		/* COOKIE */

		var cookie = (function() {
			function _get(name) {
				var nm = name + '=';
				var ca = document.cookie.split(';');
				for(var i = 0, iLen = ca.length; i < iLen; i += 1) {
					var c = ca[i];
					while (c.charAt(0) === ' ') {
						c = c.substring(1, c.length);
					}
					if (c.indexOf(nm) === 0) {
						return c.substring(nm.length, c.length);
					}
				}
				return null;
			}

			function _set(name, value, days) {
				var expires = '';
				if (days) {
					var date = new Date();
					date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
					expires = '; expires=' + date.toGMTString();
				}
				document.cookie = name + '=' + value + expires + '; path=/';
			}

			return {
				get : _get,
				set : _set
			};
		})();

		/* ASSET */

		var asset = (function() {
			function _load(assets, fnComplete, fnProgress) {
				var loaded = 0;
				_.each(assets, function(asset) {
					_loadOne(asset, function() {
						loaded += 1;
						if (typeof fnProgress === 'function') {
							fnProgress(loaded, assets.length);
						}
						if (loaded === assets.length && typeof fnComplete === 'function') {
							fnComplete();
						}
					});
				});
			}

			function _loadOne(asset, fnComplete) {
				var img = new window.Image();
				img.onload = function() {
					if (typeof fnComplete === 'function') {
						fnComplete();
					}
				};
				img.src = asset;
			}

			return {
				load : _load,
				loadOne : _loadOne
			};
		})();

		/* FN (MISC) */

		var fn = (function() {
			function _load(src, fn) {
				var r = false;
				var s = document.createElement('script');
				s.type = 'text/javascript';
				s.src = src;
				s.onload = s.onreadystatechange = function() {
					if (!r && (!this.readyState || this.readyState === 'complete')) {
						r = true;
						if (fn) {
							fn();
						}
					}
				};
				document.body.appendChild(s);
			}

			function _createCallback(fn, scope) {
				var id = '__CB' + _createId();
				window[id] = function() {
					delete window[id];
					if (typeof fn === 'function') {
						fn.apply(scope, arguments);
					}
				};
				return id;
			}

			return {
				load : _load,
				createCallback : _createCallback
			};
		})();

		var ratio = (function() {
			function _getRatio(ratio, el) {
				var width = el && typeof el !== 'undefined' ? el.outerWidth(true) : $(window).outerWidth(true);
				return Math.floor(width / ratio);
			}

			return {
				getRatio: _getRatio
			};
		})();

		// AJAXify website
		var ajax = (function() {
			function _getHTML(evt) {
				var url = document.URL;

				// Logic for click / back button
				if (typeof evt === 'object') {
					evt.preventDefault();
					window.APP.push = true;
					url = $(evt.currentTarget).attr('href');
				} else {
					window.APP.push = false;
				}

				if (window.APP.isLoading) {
					return false;
				}
				window.APP.isLoading = true;
				pubsub.publish('onAjaxClick');
				window.log('util onAjaxClick');

				$.ajax({
					type: 'GET',
					url: url,
					cache: false,
					success : function(data) {
						_callbackOk(data, url);
					}, error : function() {
						window.log('error on _getHTML');
						window.APP.isLoading = false;
					}
				});
			}

			function _updateUrl(i) {
				var address = i && typeof i !== 'undefined' ? i : window.APP.url;
				window.history.pushState( null, null, address );
			}

			function _callbackOk(data, url) {
				var parser = new window.DOMParser();
				var doc = parser.parseFromString(data, 'text/html');
				window.APP.html = doc;
				var title = $(doc).find('title').text();
				window.log('util onAjaxOk');

				window.APP.ajaxReady = true;
				window.APP.url = url;

				$('html').find('title').empty().append(title);
				$('html').addClass('historypushed');
				pubsub.publish('onAjaxOk');

				if (window.APP.push) {
					_updateUrl();
				}
			}

			return {
				getHTML: _getHTML
			};
		})();

		return {
			pubsub : pubsub,
			dom : dom,
			cookie : cookie,
			asset : asset,
			fn : fn,
			ratio: ratio,
			ajax: ajax
		};
	}
);