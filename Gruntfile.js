module.exports = function(grunt) {
	grunt.initConfig({
		// --------
		// METADATA
		// --------

		path : {
			js : 'js',
			css : 'css',
			scss : 'scss',
			build : 'build',
			images : 'images',
			sprites : 'sprites'
		},

		pkg : grunt.file.readJSON('package.json'),

		// -----------
		// TASK CONFIG
		// -----------

		sass : {
			target_build : {
				files : [{
					expand : true,
					cwd : '<%= path.scss %>',
					src : ['*.scss'],
					dest : '<%= path.css %>',
					ext : '.css'
				}]
			}
		},

		watch : {
			files : ['<%= path.scss %>/*.scss', '<%= path.scss %>/parts/*.scss', '<%= path.scss %>/components/*.scss'],
			tasks : ['sass']
		},

		clean : {
			src : ['<%= path.build %>']
		},

		jshint : {
			options : {
				// Ignore warning: A leading decimal point can be confused with a dot.
				'-W008' : true,

				globals : {
					window : true,
					document : true,
					navigator : true,
					console : true,
					requirejs : true,
					require : true,
					define : true,
					Modernizr : true,
					WPAjax : true,
					Image : true,
					TimelineLite : true
				},
				curly : true,
				eqeqeq : true,
				forin : true,
				immed : true,
				indent : true,
				latedef : true,
				newcap : true,
				noarg : true,
				quotmark : 'single',
				undef : true,
				unused : true,
				strict : true,
				trailing : true
			},
			src : [
				'<%= path.js %>/modules/*.js',
				'<%= path.js %>/util/*.js',
				'<%= path.js %>/main.js'
			]
		},

		requirejs : {
			target_build : {
				options : {
					baseUrl : '<%= path.js %>',
					waitSeconds : 60,
					name : 'config',
					out : '<%= path.build %>/app-built-v1.js',
					paths : {
						'text' : 'libs/requirejs/requirejs-text-2.0.14',
						'jquery' : 'libs/jquery/jquery-1.11.2.min',
						'jquery.scrollmagic' : 'libs/scrollmagic/jquery.scrollmagic.min',
						'underscore' : 'libs/underscore/underscore-1.8.2.min',
						'tweenmax' : 'libs/greensock/tweenmax-1.17.0.min',
						'imagesloaded' : 'libs/imagesloaded/imagesloaded-3.1.8.min',
						'hammer' : 'libs/hammer/hammer.min',
						'fastclick': 'libs/fastclick/fastclick'
					},
					shim : {
						'jquery.scrollmagic' : {
							deps : ['jquery', 'tweenmax']
						},
						'tweenmax' : {
							exports : 'TweenMax'
						}
					}
				}
			}
		},
		cssmin : {
			target_build : {
				files : {
					'<%= path.build %>/style.min.css' : [
						'<%= path.css %>/normalize.css',
						'<%= path.css %>/main.css'
					]
				}
			}
		},

		sprite : {
			all : {
				src : ['<%= path.sprites %>/*.png'],
				destImg : '<%= path.images %>/sprite.png',
				destCSS : '<%= path.scss %>/_sprites.scss',
				padding : 4,
				algorithm : 'binary-tree',
				cssFormat : 'scss',
				cssVarMap : function (sprite) {
					sprite.name = 'sprite-' + sprite.name;
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-spritesmith');

	// Default tasks.
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('spritez', ['sprite']);
	grunt.registerTask('build', ['clean', 'jshint', 'requirejs', 'cssmin']);
};