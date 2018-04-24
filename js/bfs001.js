function Carousel($, $el) {
	this.$el = $el;
	this.$bannerContainer = this.$el.find('.banners');
	this.$banners = this.$el.find('.banners .banner');
	this.$titles = this.$el.find('.banners .title');
	this.$arrow = this.$el.find('.banner-arrow');
	this.$bullets = this.$el.find('.banner-nav-item');
	this.isAnimating = false;
	this.tm = null;
	this.tmInterval = 5000;

	return this;
}

Carousel.prototype.init = function() {
	var _self = this;

	this.$el.on('click', function() {
		if (!_self.isAnimating) {
			_self.isAnimating = true;
			_self.next();
		}
	});

	this.$arrow.on('click', function() {
		if (!_self.isAnimating) {
			_self.isAnimating = true;
			_self.next();
		}
	});

	this.$banners.eq(1).find('.title').animate({
		opacity : 1
	}, 400, function() {
		_self.startTimer(10000);
	});
};

Carousel.prototype.next = function() {
	var _self = this;

	this.resetTimeout();

	var tl = new TimelineLite();
	tl.append(TweenLite.to(this.$titles, .4, {
		alpha : 0
	}));
	tl.append(function() {
		_self.$bullets.removeClass('active');
	});
	tl.append(TweenLite.to(_self.$bannerContainer, .4, {
		left : -900
	}));
	tl.append(function() {
		_self.wrapUp();
		_self.$banners.eq(1).find('.title').animate({
			opacity : 1
		}, 400, function() {
			_self.isAnimating = false;
		});
	});
	tl.append(function() {
		_self.startTimer();
	});
};

Carousel.prototype.wrapUp = function() {
	var $first = this.$banners.eq(0);
	this.$bannerContainer.append($first);
	this.$bannerContainer.css('left', '');
	this.$banners = this.$el.find('.banners .banner');
	this.$titles = this.$el.find('.banners .title');

	var idx = this.$banners.eq(0).attr('data-index');
	this.$el.find('.banner-nav-item[data-index="' + idx + '"]').addClass('active');
};

Carousel.prototype.resetTimeout = function() {
	clearTimeout(this.tm);
	this.tm = null;
};

Carousel.prototype.startTimer = function(s) {
	var _self = this;

	this.resetTimeout();
	this.tm = setTimeout(function() {
		_self.next();
	}, s ? s : this.tmInterval);
};


/******************************/
/* BFS001 - Canvas Group - RT */
/******************************/

window.jQuery(function() {
	var $ = window.jQuery;
	var $window = $(window);
	var $body = $('body');
	var $container = $('#container');
	var $header = $('header.header #inner-header');
	var $navigation = $('nav.navigation');
	var $loader = $('#site-loader .bar');
	var $headline = $('.page-header');
	var $headlineTitle = $('.page-headline');
	var $content = $('.entry-content');
	var $contentChildren = $('.entry-children');
	var $contentSub = $('.entry-sub');
	var $contentSubWrapper = $('.entry-sub-wrapper');
	var $newsticker = $('.newsticker');
	var $teamfilter = $('.teamfilter');

	// Put the scroll back to top to reset scroll position on refresh
	$window.on('unload', function() {
		$window.scrollTop(0);
	});

	var pageLoadTl = new TimelineLite();
	var tl = window.tl = new TimelineLite();
	var fn = {
		tm : new Date().getTime()
	};

	var textlines = {
		'FT_LOCATION' : 'Our {1} Office',
		'FT_POSITION' : 'Our {1}',
		'FT_COMBINATION' : 'Our {1} in {2}',
		'FT_ALL' : 'Our People',
		'SCROLL_TO_TOP' : 'Back to top',
		'MORE_LINKS' : 'More links'
	};

	var page = {
		isHome : $body.hasClass('home'),
		isTeam : $body.hasClass('page-template-page-team-php'),
		hasGridItems : false
	};

	var linksBacthNum = 10;

	function getTextlines(key) {
		var txt = '';
		if (textlines[key]) {
			txt = textlines[key];
			for (var i = 1, iLen = arguments.length; i < iLen; i += 1) {
				arguments[i] = arguments[i].toString();

				// If not 'staff', convert it to plural form.
				if (i === 1 && (key === 'FT_POSITION' || key === 'FT_COMBINATION')) {
					if (arguments[i].toLowerCase().indexOf('staff') === -1) {
						arguments[i] += 's';
					}
				}

				txt = txt.replace('{' + i + '}', arguments[i]);
			}
		}
		return txt;
	}

	function nthChildWalker(offset, $nodes, $) {
		var currentIndex = -1;
		$ = $ || window.jQuery;
		$.each($nodes, function(idx, el) {
			var $el = $(el).removeClass('clearleft');
			if ($el.css('display') !== 'none') {
				currentIndex += 1;
				if (currentIndex % offset === 0) {
					$el.addClass('clearleft');
				}
			}
		});
	}

	// IE8 fallback.
	// if (window.PIE) {
 //        $('#site-loader .finish i').each(function() {
 //            PIE.attach(this);
 //        });
 //    }

	// When new page is loaded via ajax, this function needs to be re-called.
	function doLayout(isFirst) {
		var cb = [];

		// Retina-ize images.
		if (window.devicePixelRatio && window.devicePixelRatio > 1) {
			$('.article-thumb img').each(function(){
				try {
					new RetinaImage(this);
				} catch(e) {}
			});
		}

		// Step 0:
		// Detect if there is a sub-content (gray area, below main content).
		// If there is, wrap it for animation.
		if ($contentSub.length > 0) {
			var contentSubHeight = 0;

			contentSubHeight = $contentSub.outerHeight();
			$contentSub.attr('h', contentSubHeight);
			$contentSub.wrap('<div class="entry-sub-wrapper"></div>');

			contentSubHeight = $contentSub.parent().outerHeight();
			$contentSubWrapper = $contentSub.parent().outerHeight(contentSubHeight);
			$contentSub.css('marginTop', contentSubHeight);
		}

		// Step 1:
		// Process all collapsible content, set the height, and hide them.
		$('.collapsed').each(function() {
			var $el = $(this);
			var $li = $el.parents('li.col');

			// Detect long-list of links.
			var $list = $li.find('ul');
			if ($list.length > 0) {
				var $listItems = $list.find('> li > a');
				if ($listItems.length > linksBacthNum) {
					// Flag the column for having links collection.
					$li.data('many-links', true);
					$list.addClass('links-container');

					$listItems.each(function(idx, el) {
						if (idx > linksBacthNum - 1) {
							$(el).parent().hide();
						}
					})

					$list.data('visible', linksBacthNum);

					var htmlLink = '';
					htmlLink += '<a class="morelinks">';
					htmlLink += '<i style="-webkit-transform: matrix(1, 0, 0, 1, 0, 0);">&gt;</i>';
					htmlLink += '<span>' + getTextlines('MORE_LINKS') + '</span>';
					htmlLink += '</a>';

					$(htmlLink).insertAfter($list).on('click', function() {
						var currentBatchIndex = $list.data('visible');
						var newBatchIndex = currentBatchIndex + linksBacthNum;

						if (currentBatchIndex === -1) {
							TweenLite.to(window, .5, {
								scrollTo : $el.parents('li.col').offset().top - 50,
								ease : Back.easeOut
							});
						} else {
							// Loosen up element height.
							$el.height('auto');

							for (var i = currentBatchIndex, iLen = newBatchIndex; i < iLen; i += 1) {
								$listItems.eq(i).parent().fadeIn();
							}

							// Re-set element height.
							$el.height($el.outerHeight());

							if (newBatchIndex >= $listItems.length) {
								$list.data('visible', -1);
								var $moreLink = $(this);
								TweenLite.to($moreLink, .15, {
									opacity : 0,
									height : 0,
									onComplete : function() {
										$moreLink.hide();
										$moreLink.parents('.full').height('auto');
									}
								});
							} else {
								$list.data('visible', newBatchIndex);
							}
						}
					}).hover(function(e) {
						e.stopPropagation();
						var $link = $(this);
						TweenLite.to($link.find('i'), .15, { rotation : $link.hasClass('less') ? -90 : 90 });
					}, function(e) {
						e.stopPropagation();
						TweenLite.to($(this).find('i'), .15, { rotation : 0 });
					});
				}
			}
			// Detection - end.

			$el.data('height', $el.outerHeight()).height(0);

			if ($li.attr('start-hidden') === 'y') {
				$li.hide();
			}
		});

		// Step 2:
		// Process all grid (column) items, set the width, and hide them.
		$('.threecols .col .col-content, .fourcols .col .col-content').each(function() {
			var $box = $(this);
			if ($box.length > 0) {
				var $parent = $box.parents('.col');
				var modifier = 56;
				var w = $box.outerWidth();
				var h = $box.outerHeight();

				$parent.css({
					height : h + modifier,
					overflow : 'hidden'
				});

				$box.css('marginTop', 0 - h);
			}
			page.hasGridItems = true;
		});

		// Step 3:
		// Prepare headline for fly-in animation.
		prepareHeadlineForAnimation();

		// Step 4:
		// Iterate through column containers to 'clear-left' its children accordingly.
		// For IE8 fallback.
		nthChildWalker(2, $('.twocols').find('.col'));
		nthChildWalker(3, $('.threecols').find('.col'));
		nthChildWalker(4, $('.fourcols').find('.col'));

		// Step 5:
		// Calculate newsticker dimensions.
		(function($) {
			if ($newsticker.length > 0) {
				$newsticker.css({
					opacity : 0,
					height : 'auto'
				});

				var maxHeight = 0;
				var $el = $newsticker.find('.newsticker-inner');
				var $newsItems = $el.find('li');

				$newsItems.each(function() {
					var h = $(this).outerHeight();
					if (h > maxHeight) {
						maxHeight = h;
					}
				});

				maxHeight = maxHeight < 190 ? 190 : maxHeight;

				$newsItems.height(maxHeight);
				$el.data('max-height', maxHeight).css('height', maxHeight);

				cb.push(startNewsTicker);
			}
		})(window.jQuery);

		// Step 5-1:
		// Push team filter (if exist) to the sequence.
		(function($) {
			if ($teamfilter.length > 0) {
				$teamfilter.css('opacity', 0);
			}
		})(window.jQuery);

		// Step 6:
		// Init collapsible box (read more).
		(function($) {
			$('section.collapsible').each(function() {
				var collapsedCls = 'hidden';
				var $el = $(this);
				var $col = $el.parents('li.col');
				var $full = $el.find('.full');
				var $excerpt = $el.find('.excerpt');
				var $readmore = $el.find('.readmore');
				var $arrow = $readmore.find('i');

				// Reset link collection state.
				var collapseLinkCollection = function() {
					if ($col.data('many-links') === true) {
						$col.find('.links-container').data('visible', linksBacthNum);
						$col.find('.links-container li').hide();
						$col.find('.links-container li:lt(' + linksBacthNum + ')').show();
						$col.find('.morelinks').removeClass('less').css({
							opacity : 1,
							height : 'auto'
						}).show().find('span').text(getTextlines('MORE_LINKS'));
					}
				};

				$readmore.on('click', function() {
					if (!$full.hasClass(collapsedCls)) {
						TweenLite.to($full, .3, {
							opacity : 1,
							height : $full.data('height'),
							onComplete : function() {
								TweenLite.to($arrow, .3, { rotation : 0, delay : .5 });
								TweenLite.to(window, .5, {
									scrollTo : $col.offset().top - 50,
									ease : Back.easeOut
								});
							}
						});
						$full.addClass(collapsedCls);
						$readmore.addClass('less').find('span').html($readmore.data('txtless'));
					} else {
						TweenLite.to($full, .3, {
							opacity : 0,
							height : 0,
							onComplete : function() {
								TweenLite.to($arrow, .3, { rotation : 0, delay : .5 });
								TweenLite.to(window, .5, {
									scrollTo : $col.offset().top - 50,
									ease : Back.easeOut
								});
								collapseLinkCollection();
							}
						});
						$full.removeClass(collapsedCls);
						$readmore.removeClass('less').find('span').html($readmore.data('txtmore'));
					}
				}).hover(function(e) {
					e.stopPropagation();
					TweenLite.to($arrow, .15, { rotation : $readmore.hasClass('less') ? -90 : 90 });
				}, function(e) {
					e.stopPropagation();
					TweenLite.to($arrow, .15, { rotation : 0 });
				});
			});
		})(window.jQuery);

		// Step 7:
		// Init team filter (in the team members page).
		(function($) {
			var positions = {};
			var locations = {};
			var $teams = $('.teams');
			var $persons = $teams.find('li');
			var $form = $('.teamfilter');
			if ($persons.length > 0 && $form.length > 0) {
				// Collect positions and locations to populate selectbox.
				$persons.each(function() {
					var $person = $(this);

					var position = $person.data('position');
					if (position && position !== '') {
						positions[position] = true;
					}

					var location = $person.data('location');
					if (location && location !== '') {
						locations[location] = true;
					}
				});

				// Populate selectboxes.
				var $locationFilter = $('#locationfilter');
				for (var location in locations) {
					if (locations.hasOwnProperty(location)) {
						$locationFilter.append('<option class="' + location.toLowerCase() + '" value="' + location + '">' + location + '</option>');
					}
				}

				var $positionFilter = $('#positionfilter');
				for (var position in positions) {
					if (positions.hasOwnProperty(position)) {
						$positionFilter.append('<option class="' + position.toLowerCase() + '" value="' + position + '">' + position + '</option>');
					}
				}

				// TEMPORARY: Restrict 'directors' & 'geelong' combination,
				$locationFilter.on('change', function(e) {
					var $optDirector = $positionFilter.find('.director');
					if ($(this).val() === 'Geelong') {
						if ($positionFilter.val() === 'Director') {
							$positionFilter.get(0).selectedIndex = 0;
						}
						$optDirector.attr('disabled', 'disabled');
					} else {
						$optDirector.removeAttr('disabled');
					}
				});
				$positionFilter.on('change', function(e) {
					var $optGeelong = $locationFilter.find('.geelong');
					if ($(this).val() === 'Director') {
						if ($locationFilter.val() === 'Geelong') {
							$locationFilter.get(0).selectedIndex = 0;
						}
						$optGeelong.attr('disabled', 'disabled');
					} else {
						$optGeelong.removeAttr('disabled');
					}
				});

				// Prevent lonely person at the last row.
				var gridColumns = 3;
				var $startVisible = $persons.filter(function() {
					return !$(this).attr('start-hidden');
				});
				if ($startVisible.length > gridColumns && $startVisible.length % gridColumns === 1) {
					$startVisible.eq($startVisible.length - 2).addClass('clearleft')
					$startVisible.eq($startVisible.length - 1).removeClass('clearleft');
				}

				// Attach handler to submit button.
				var $button = $form.find('button');
				if ($button.length > 0) {
					$button.on('click', function() {
						var currentHeight = $teams.outerHeight();
						var currentLocation = $locationFilter.val();
						var currentPosition = $positionFilter.val();

						var fnCollapseAll = function() {
							$persons.each(function() {
								var $el = $(this);
								$el.find('.full').removeClass('hidden').css({
									height : 0,
									opacity : 0
								});
								$el.find('.readmore').each(function() {
									var $btn = $(this);
									$btn.removeClass('less');
									$btn.find('span').html($btn.attr('data-txtmore'));
								});
							});
						};

						var fnProcess = function() {
							var collectionVisible = [];

							$persons.each(function() {
								var match = 0;
								var $person = $(this);

								if (currentLocation === '' || (currentLocation !== '' && $person.data('location').toString() === currentLocation)) {
									match++;
								}

								if (currentPosition === '' || (currentPosition !== '' && $person.data('position').toString() === currentPosition)) {
									match++;
								}

								if (match === 2) {
									$person.show();
									collectionVisible.push($person);
								} else {
									$person.hide();
								}
							});

							nthChildWalker(3, $persons, $);

							// Make sure there's no person being "alone" in the last row.
							// 3 -> number of columns.
							if (collectionVisible.length > 3 && collectionVisible.length % 3 === 1) {
								collectionVisible[collectionVisible.length - 2].addClass('clearleft')
								collectionVisible[collectionVisible.length - 1].removeClass('clearleft');
							}

							// Update heading.
							var $heading = $('.teamselected');
							if ($heading.length > 0) {
								var newHeadingText = '';
								if (currentLocation === '' && currentPosition === '') {
									newHeadingText = getTextlines('FT_ALL');
								} else if (currentLocation === '' && currentPosition !== '') {
									newHeadingText = getTextlines('FT_POSITION', currentPosition);
								} else if (currentLocation !== '' && currentPosition === '') {
									newHeadingText = getTextlines('FT_LOCATION', currentLocation);
								} else {
									newHeadingText = getTextlines('FT_COMBINATION', currentPosition, currentLocation)
								}
								$heading.html(newHeadingText);
							}
						};

						var fnDone = function() {
							$teams.height('auto').animate({
								opacity : 1
							});
						};

						$teams.height(currentHeight);
						TweenLite.to($teams, .3, {
							opacity : 0,
							onComplete : function() {
								fnCollapseAll();
								fnProcess();
								fnDone();
							}
						});
					});
				}
			}
		})(window.jQuery);

		// Step 8:
		// Grid animation.
		(function($, fn) {
			if (page.hasGridItems) {
				var $boxes = $('.entry-children .boxwrap li .col-content');
				if ($boxes.length > 0) {
					var countdown = $boxes.length;
					fn.PUSH_GRID_ITEMS = function() {
						function recurAnimate($boxes, index) {
							var currentIndex = index || 0;
							var $box = $boxes.eq(currentIndex);
							if ($box.length > 0) {
								currentIndex++;
								var $parent = $box.parents('.col');
								var oriWidth = $box.data('width');
								var oriHeight = $box.data('height');

								if ($parent.css('display') === 'none') {
									$box.css({
										height : 'auto',
										marginTop : 0
									});
									$parent.height('auto');
									countdown--;
									if (countdown === 0) {
										showTeamFilter();
									}
									recurAnimate($boxes, currentIndex);
								} else {
									TweenLite.to($box, 1.5, {
										delay : .25,
										marginTop : 0,
										onComplete : function() {
											$box.css('height', 'auto');
											$parent.height('auto');
											countdown--;
											if (countdown === 0) {
												showTeamFilter();
												execLeftoverCallbacks();
											}
										}
									});
									setTimeout(function() {
										recurAnimate($boxes, currentIndex);
									}, 400);
								}
							}
						}
						recurAnimate($boxes);
					};

					if (!isFirst) {
						cb.push(fn.PUSH_GRID_ITEMS);
					}
				}
			}
		})(window.jQuery, fn);

		return cb.length === 0 ? null : cb;
	}

	// Scroll to top.
	TweenLite.to($('html, body'), .1, { scrollTop : 0 });

	// Set default height for main header element (logo).
	$header.data('ori-height', $header.height());

	// Hide headline and navigation initially for animation.
	$headlineTitle.css('visibility', 'hidden');
	$navigation.css('opacity', 0);

	// Hide contents.
	$content.css('opacity', 0);
	$contentChildren.css('opacity', 0);

	// Process all menus and add first-last element for old IE fallback.
	$('.nav').each(function() {
		$('li:last-child').addClass('last');
	});

	// Process main menu (top) for applying animation.
	$('.navigation a').each(function() {
		var $menu = $(this);
		var menuText = $menu.text();
		$menu.html('<span class="out">' + menuText + '</span><span class="over">' + menuText + '</span>')
	});

	// Process any tooltip (using modal).
	if ($.fn.leanModal) {
		$('.tooltip a, a.tooltip').each(function() {
			var $el = $(this);
			var title = '';
			var msg = $el.attr('title');
			var modalId = 'modal-' + parseInt(Math.random(100) * 1000, 10) + '-' + new Date().getTime();

			$el.removeAttr('title');

			// Parse title and content (refer to readme file for instruction).
			// Example usage:
			// Some title**Some content. Some other paragraph. Etc.
			msg = msg.split('**');
			if (msg.length > 1) {
				title = '<h5>' + msg[0] + '</h5>';
				msg = msg[1];
			}

			var $modal = $('<div id="' + modalId + '" class="modal"><span class="modal-close"></span>' + title + '<p>' + msg.replace(/\\n/gim, '<br>') + '</p></div>').appendTo($('body'));
			$modal.find('.modal-close').hover(function(e) {
				e.stopPropagation();
				TweenLite.to($(this), .15, { rotation : -90 });
			}, function(e) {
				e.stopPropagation();
				TweenLite.to($(this), .15, { rotation : 0 });
			});
			$el.attr('href', '#' + modalId).leanModal({
				closeButton : '.modal-close'
			});
		});
	}

	// Header (logo) animation on landing page.
	if (page.isHome) {
		// Fill the viewport with header.
		$header.height($window.outerHeight());
	}

	// Page load sequence.
	function execLoadSequence() {
		doLayout(true);

		tl.add(TweenLite.to($body, 1, { opacity : 1 }));
		tl.add(TweenLite.to($loader, 1, { width : '100%' }));

		if (page.isHome) {
			tl.add(TweenLite.to($header, .5, { height : $header.data('ori-height') }));
		}

		tl.add(TweenLite.to($navigation, 1, {
			top : $header.data('ori-height') + 1,
			opacity : 1,
			onComplete : function() {
				stickMenu();
			}
		}));

		var $carousel = $('.banner-carousel');
		if ($carousel.length > 0) {
			tl.add(TweenLite.to($carousel, .5, { opacity : 1 }));
		} else {
			tl.add(TweenLite.to($headline, .5, { opacity : 1 }));
			tl.add(TweenLite.to($headlineTitle, .5, {
				left : 0,
				onComplete : function() {
					$headlineTitle.css('position', 'relative');
					$container.css('overflow', 'auto');
				}
			}));
		}

		tl.add(TweenLite.to($content, .5, { opacity : 1, delay : (page.isHome ? 1 : .5) }));

		tl.add(TweenLite.to($contentChildren, .5, {
			opacity : 1,
			onComplete : function() {
				fn.PUSH_GRID_ITEMS && fn.PUSH_GRID_ITEMS();
			}
		}));

		if ($contentSub.length > 0) {
			tl.add(TweenLite.to($contentSub, .5, {
				marginTop : 0
			}));
		}

		if (page.isHome) {
			tl.add(startNewsTicker);
		}

		tl.add(execDone);
	}

	// Page load 'simulation' is finished.
	function execDone() {
		checkHash && checkHash();
	}

	// Stick menu on top when scrolling down.
	function stickMenu() {
		if ($header.length > 0 && $navigation.length > 0) {
			var headerHeight = $header.outerHeight();
			function fn() {
				var yPos = $(window).scrollTop();
				if (yPos > headerHeight) {
					$navigation.addClass('sticky');
				} else {
					$navigation.removeClass('sticky');
				}
			}
			$window.on('scroll', fn);
		}
	}

	// Prepare headline for fly-in animation.
	function prepareHeadlineForAnimation() {
		var $headerWrap = $('.page-header .wrap');
		if ($headerWrap.length > 0) {
			$container.css('overflow', 'hidden').removeClass('loading');
			$headerWrap.height($headerWrap.outerHeight());
			$headlineTitle.css({
				'position' : 'absolute',
				'visibility' : 'visible',
				'left' : $body.outerWidth()
			});
			return $headlineTitle;
		}
		return null;
	}

	// Show team filter box.
	function showTeamFilter(timeline) {
		function doAnimation() {
			TweenLite.to($teamfilter, .5, {
				opacity : 1
			});
		}

		if (timeline) {
			timeline.add(doAnimation);
		} else {
			doAnimation();
		}
	}

	// Start rolling news ticker.
	function startNewsTicker() {
		var $el = $newsticker.find('.newsticker-inner');
		var maxHeight = $el.data('max-height');

		$el.rtCGTicker({
			width : $el.outerWidth(),
			height : maxHeight,
			interval : 5000,
			onComplete : function() {
				setTimeout(function() {
					TweenLite.to($newsticker, .5, {
						opacity : 1
					});
				}, 400);
			}
		});
	}

	// Stop news ticker.
	function stopNewsTicker() {
		try {
			var $el = $newsticker.find('.newsticker-inner');
			if ($el.length > 0) {
				$el.rtCGTicker('stop');
			}
		} catch(e) {}
	}

	// Start load sequence.
	execLoadSequence();

	// =========
	// =========
	// AJAXIFIED
	// =========
	// =========

	function initContactForm7() {
		return window._wpcf7ManualInit && window._wpcf7ManualInit();
	}

	function setHash($targetMenu) {
		if (_APT_SITE_URL && _APT_SITE_URL !== '') {
			var target = $targetMenu.attr('href');
			if (target.indexOf(_APT_SITE_URL) === 0) {
				var hash = target.replace(_APT_SITE_URL, '');
				window.location.hash = hash;
			}
		}
	}

	function checkHash() {
		if (_APT_SITE_URL && _APT_SITE_URL !== '') {
			var hash = window.location.hash.replace(/#/gim, '');
			var target = _APT_SITE_URL + hash;
			var $targetMenuItem = null;

			if (hash === '/' || hash === '#' || _APT_PAGE_URL.indexOf(hash) > -1) {
				return false;
			}

			$('.navigation a').each(function() {
				var $el = $(this);
				if ($el.attr('href') === target) {
					$targetMenuItem = $el;
					return false;
				}
			});

			if ($targetMenuItem) {
				$targetMenuItem.trigger('click');
			}
		}
	}

	// Use this bucket to register whatever needs to be called after async-page-load is finished.
	var leftoverCallbacks = null;
	function execLeftoverCallbacks() {
		if (leftoverCallbacks && typeof leftoverCallbacks === 'function') {
			leftoverCallbacks.call();
		}
	}


	function loadPage($targetMenu, $el, $wrapper) {
		var targetURL = $targetMenu.attr('href');
		$('#content').load(targetURL + ' #inner-content', function() {
			// Re-assign variables due to old content being overwritten.
			$headline = $('.page-header');
			$headlineTitle = $('.page-headline');
			$content = $('.entry-content').css('opacity', 0);
			$contentChildren = $('.entry-children').css('opacity', 0);
			$contentSub = $('.entry-sub');
			$contentSubWrapper = $('.entry-sub-wrapper');
			$newsticker = $('.newsticker');
			$teamfilter = $('.teamfilter');

			// Put content back into view.
			$el.css({
				marginLeft : 0
			});

			// Check if there is a target column for auto-expand.
			leftoverCallbacks = null;
			var $targetCol = $('ul.threecols');
			var targetColIndex = $targetMenu.data('target-column');
			console.log($targetMenu);
			console.log(targetColIndex);
			if (targetColIndex && $targetCol.length > 0) {
				$targetCol = $targetCol.find('li.col').eq(targetColIndex - 1);
				if ($targetCol.length > 0) {
					leftoverCallbacks = function() {
						$targetCol.find('a.readmore').trigger('click');
					};
				}
			}

			// Re-attach all event handlers.
			var cb = doLayout();

			// If next page loaded is contact page, init the WPCF7 form.
			if (targetURL.indexOf('contact') > -1) {
				initContactForm7();
			}

			prepareHeadlineForAnimation();

			// Expand the content area to fit the new content.
			pageLoadTl.add(TweenLite.to($wrapper, .5, { opacity : 1, height : 'auto' }));

			// Swipe-in headling.
			var $carousel = $('.banner-carousel');
			if ($carousel.length > 0) {
				pageLoadTl.add(TweenLite.to($carousel, .5, {
					opacity : 1,
					onComplete : function() {
						new Carousel(window.jQuery, $carousel).init();
					}
				}));
			} else {
				pageLoadTl.add(TweenLite.to($headlineTitle, .5, {
					left : 0,
					onComplete : function() {
						$headlineTitle.css('position', 'relative');
						$container.css('overflow', 'auto');
					}
				}));
			}

			// Fade-in new contents.
			if ($content.length > 0) {
				pageLoadTl.add(TweenLite.to($content, .5, { opacity : 1, delay : .1 }));
			}
			if ($contentChildren.length > 0) {
				pageLoadTl.add(TweenLite.to($contentChildren, .5, { opacity : 1, delay : .1 }));
			}
			if ($contentSub.length > 0) {
				pageLoadTl.add(TweenLite.to($contentSub, .5, {
					marginTop : 0
				}));
			}

			// Execute additional callback after the re-layout process.
			if (cb && cb.length) {
				for (var i = 0, iLen = cb.length; i < iLen; i += 1) {
					pageLoadTl.add(cb[i]);
				}
			}
		});
	}

	// Walk through all menu items to use AJAX instead traditional page load.
	$('#container').on('click', '.navigation li a, .footer .nav li.internal a, a.internal, a.service-link', function(e) {
		var $targetMenu = $(this);
		var $newActiveMenuItem = $targetMenu.parents('.menu-item');
		if ($newActiveMenuItem.hasClass('external')) {
			return true;
		}

		e.preventDefault();

		// Disable active page click.
		if ($targetMenu.parents('li').hasClass('current_page_item')) {
			return false;
		}

		// Update hash value.
		setHash($targetMenu);

		var $activeMenuItem = $('.current-menu-item');
		var $currentContainer = $('#inner-content');
		var currentHeight = $currentContainer.outerHeight();

		// Wrap current content in a container and set a static height.
		// This will prevent scrollbar to jump around after new content is loaded.
		var $wrapper = $('#content-wrapper');
		var $el = $('#content');
		if ($wrapper.length === 0) {
			$content.wrap('<div id="content-wrapper"></div>');
			$wrapper = $('#content-wrapper');
		}

		$wrapper.data('height', currentHeight).css({
			height : currentHeight,
			overflow : 'hidden'
		});

		// De-activate current active menu.
		$activeMenuItem.removeClass('current-menu-item').removeClass('current_page_item');

		// Set new selected menu to active state.
		$newActiveMenuItem.addClass('current-menu-item').addClass('current_page_item');

		// If menu element if from footer or newsticker,
		// find correlating menu in the top navigation menu and activate it.
		if ($targetMenu.parents('ul').hasClass('footer-nav') || $targetMenu.hasClass('internal')) {
			$navigation.find('a').each(function() {
				if ($(this).attr('href') === $targetMenu.attr('href')) {
					$(this).parent().addClass('current-menu-item current_page_item');
				}
			});
		}

		// Stop news ticker (if applicable).
		stopNewsTicker();

		pageLoadTl = new TimelineLite();

		// Adjust scroll position.
		var headerHeight = $header.outerHeight() + 1;
		if ($body.scrollTop() > headerHeight) {
			pageLoadTl.add(function() {
				pageLoadTl.add(TweenLite.to($body, .2, {
					scrollTop : headerHeight
				}));
			});
		}

		// Swipe-out content.
		pageLoadTl.add(TweenLite.to($el, .5, {
			marginLeft : 0 - ($body.outerWidth() * 2),
			onComplete : function() {
				$container.addClass('loading');
			}
		}));

		// Load content from the new URL.
		pageLoadTl.add(function() {
			loadPage($targetMenu, $el, $wrapper);
		});
	});

	// =========
	// =========
	// BANNER CAROUSEL
	// =========
	// =========

	var $carousel = $('.banner-carousel');
	if ($carousel.length > 0) {
		new Carousel(window.jQuery, $carousel).init();
	}
});