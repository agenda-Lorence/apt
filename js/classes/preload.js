define(['jquery', 'util/common'],
	function($, Common) {
		'use strict';

		var $preloader = $('#preloader');
		var $progress = $preloader.find('.progress');

		function Preload($el) {
			this.el = $el;
			this.assets = $el.find('img');
			this.currentAsset = 0;
			this.progressFactor = 0;
			window.APP.progressFactor = 0;
			this.assetsToLoadArray = [];
			this.totalAssets = 0;

			return this.init();
		}

		Preload.prototype.init = function() {
			var _self = this;
			var $newBody = $(window.APP.html.body);

			if (this.assets.length) {
				this.assets.each(function() {
					_self.assetsToLoadArray.push(this);
				});
				this.totalAssets = this.assets.length;
			}

			if (this.totalAssets) {
				this.progressFactor = Math.round(100 / this.totalAssets);
				this.preloadImages();
			} else {
				this.preloadFake();
			}
		};

		Preload.prototype.preloadImages = function() {
			var imgObj = new Image();
			imgObj.src = $(this.assetsToLoadArray[this.currentAsset]).attr('src');
			imgObj.onload=function() {
				this.preloadNextAsset();
			}.bind(this);
		};

		Preload.prototype.preloadNextAsset = function() {
			this.currentAsset++;
			this.preloadProgress();
			if(this.currentAsset == (this.totalAssets)) {
				this.preloadFinish();
			} else {
				this.preloadImages();
			}
		};

		Preload.prototype.preloadProgress = function() {

			// Get percentage
			this.progressFactor = (this.currentAsset * 100) / this.assets.length;

			// Start the counter at 30%, to a max of 100%.
			//this.progressFactor = (this.progressFactor * 0.7) + 30;

			window.APP.progressFactor = this.progressFactor;

			//TweenMax.set($progress, { width: this.progressFactor + '%' });
			//$progress.addClass('transition');
		};

		Preload.prototype.preloadFinish = function() {

			//if (!window.APP.push) {
				if (window.APP.progressFactor === 100) {
					window.APP.isLoading = false;
					if (!window.APP.isAnimating) {
						Common.pubsub.publish('buildPage');
					}
				}
			//}

		};

		Preload.prototype.preloadFake = function() {
			if (!window.APP.isAnimating) {
				Common.pubsub.publish('buildPage');
			}
		};



		return Preload;
	}
);