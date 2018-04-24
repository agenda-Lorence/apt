requirejs.config({
	baseUrl: window.APP.templateUrl + '/js/',
	waitSeconds : 60,
	urlArgs : 'bust=' + (+new Date()),
	paths : {
		'text' : 'libs/requirejs/require-text-2.0.14',
		'jquery' : 'libs/jquery/jquery',
		'hammer' : 'libs/hammer/hammer.min',
		'jquery.scrollmagic' : 'libs/scrollmagic/scrollmagic-2.0.0',
		'scrollmagic.gsap' : 'libs/scrollmagic/scrollmagic.gsap-2.0.0',
		'underscore' : 'libs/underscore/underscore-1.8.2.min',
		'tweenmax' : 'libs/greensock/tweenmax-1.17.0.min',
		'imagesloaded' : 'libs/imagesloaded/imagesloaded-3.1.8.min',
		'fastclick': 'libs/fastclick/fastclick'
	},
	shim : {
		'hammer' : {
			deps : ['jquery']
		},
		'tweenmax' : {
			exports : 'TweenMax'
		}
	}
});

require(['main'], function() {});