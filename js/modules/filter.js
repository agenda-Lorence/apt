define(['jquery', 'tweenmax'],
	function($, TweenMax) {
		'use strict';

		function Filter(el) {
			this.el = el;
			this.items = el.find('div.article');
			this.select = el.find('.filter select');
			this.locationSel = el.find('.filter select#location');
			this.positionSel = el.find('.filter select#position');
			this.heading = el.find('.grid .team > h3');
			this.submit = el.find('.button');
			this.location = null;
			this.position = null;
			this.filtereditems = null;
			return this.init();
		}

		Filter.prototype.init = function() {
			this.submit.on('click', function() {
				this.toggle();
			}.bind(this));

			this.select.on('change', function() {
				this.disableDirectors();
			}.bind(this));
		};

		Filter.prototype.disableDirectors = function() {
			this.select.find('option').removeAttr('disabled');
			if (this.locationSel.find('option:selected').text() === 'Geelong') {
				this.positionSel.find('option[data-name="director"]').attr('disabled', 'disabled');
			}
			if (this.positionSel.find('option:selected').text() === 'Director') {
				this.locationSel.find('option[data-name="Geelong"]').attr('disabled', 'disabled');
			}
		};

		Filter.prototype.clearLeft = function() {
			this.filtereditems.each(function(i) {
				if (i % 3 === 0) {
					$(this).addClass('clearleft');
				}
			});
		};

		Filter.prototype.setTitle = function() {
			var grammar;
			if (this.location.length) {
				this.title = 'Our ' + this.locationSel.find('option:selected').text() + ' Office';
			}
			if (this.position.length) {
				grammar = (this.positionSel.find('option:selected').text() !== 'Support Staff') ? 's' : '';
				this.title = 'Our ' + this.positionSel.find('option:selected').text() + grammar;
			}
			if (this.position.length && this.location.length) {
				grammar = (this.positionSel.find('option:selected').text() !== 'Support Staff') ? 's' : '';
				this.title = 'Our ' + this.positionSel.find('option:selected').text() + grammar + ' in ' + this.locationSel.find('option:selected').text();
			}
			if (!this.position.length && !this.location.length) {
				this.title = 'Our People';
			}
			this.heading.text(this.title);
		};

		Filter.prototype.toggle = function() {
			var self = this;
			this.location = this.locationSel.val();
			this.position = this.positionSel.val();
			var search = '';
			if (this.location.length) {
				search += '[data-location="'+this.location+ '"]';
			}
			if (this.position.length) {
				search += '[data-position="'+this.position+ '"]';
			}

			this.setTitle();

			if (search.length) {
				this.filtereditems = $(search);
			} else {
				this.filtereditems = $('div.grid div.article');
			}

			var tween = new window.TimelineMax({onComplete: function() {
				var scrollPos = (window.innerWidth < 768) ? $('header').outerHeight() : $('nav').outerHeight();
				if (window.innerWidth < 1023) {
					TweenMax.to(window, 0.5, {scrollTo:{y: $('.grid').offset().top - scrollPos }, ease: window.Power2.easeOut});
				}
			}});
			tween.to(this.items, 0.2, { opacity: 0, onComplete: function() {
				self.items.removeClass('hidden');
				self.items.removeClass('clearleft');
				self.clearLeft();
				self.items.not(self.filtereditems).addClass('hidden');
			}});
			tween.to(this.filtereditems, 0.2, { opacity: 1 });
		};



		return Filter;
	}
);