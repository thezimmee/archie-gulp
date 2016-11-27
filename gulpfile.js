'use strict';

/**
 * SETUP
 * -----
 */
	var argv = require('minimist')(process.argv.slice(2));
	var config = require('./gulp.config')(argv);
	var gulp = require('gulp');
	var $ = require('gulp-load-plugins')(config.gulpLoadPlugins);
	var _ = require('lodash');
	var path = require('path');
	var fs = require('fs');
	var browserSync = require('browser-sync');
	var frontMatter = require('front-matter');


/**
 * TASKS
 * -----
 */
	gulp.task(bump);
	gulp.task('default', gulp.series(clean, gulp.parallel(css, html), serve));


/**
 * CSS TASK
 * --------
 */
	function css(done) {
		if (!config.css || !config.css.enabled) {
			done();
			return false;
		}

		return gulp.src(config.css.src)
			.pipe($.plumber())
			.pipe($.if((config.css.enabled === 'styl' || config.css.enabled === 'sass'), $.sourcemaps.init()))
			.pipe($.if(config.css.enabled === 'sass', $.sass(config.sass)))
			.pipe($.if(config.css.enabled === 'styl', $.stylus(config.stylus)))
			.pipe($.autoprefixer(config.autoprefixer))
			.pipe($.if((config.css.enabled === 'styl' || config.css.enabled === 'sass'), $.sourcemaps.write(config.sourcemaps.dest)))
			.pipe(gulp.dest(config.css.dest))
			.pipe($.size({
				title: '[css]',
				showFiles: true
			}))
			.pipe(browserSync.stream({match: '**/*.css'}));
	}


/**
 * HTML TASK
 * ---------
 */
	function html(done) {
		if (!config.html || !config.html.enabled) {
			done();
			return false;
		}

		return gulp
			.src(config.html.src)
			.pipe($.cached('pug'))
			.pipe($.plumber())
			.pipe($.data(function (file) {
				var content = frontMatter(String(file.contents));
				file.contents = new Buffer(content.body);
				var data = content.attributes;

				if (data.data) {
					var filePath = path.resolve(path.dirname(file.path), data.data);
					try {
						fs.accessSync(filePath, fs.F_OK);
						var pageData = require(filePath);
						return _.assign(pageData, data);
					} catch (error) {
						console.log('Could not find %s. %s', filePath, error);
					}
				} else {
					return data;
				}
			}))
			.pipe($.pug(config.pug))
			.pipe($.rename(function (path) {
				path.basename = path.basename.split('.')[0];
				path.extname = '.html';
			}))
			.pipe(gulp.dest(config.html.dest))
			.pipe($.size({
				title: '[html]',
				showFiles: true
			}))
			.pipe(browserSync.stream({match: '**/*.html'}));
	}


/**
 * CLEAN UP TASK
 * -------------
 */
	function clean(done) {
		if (!config.clean || !config.clean.src) {
			done();
			return false;
		}
		require('del')(config.clean.src, done);
	}


/**
 * BUMP TASK
 * ---------
 * @todo: add git tag release [https://github.com/gulpjs/gulp/blob/4.0/docs/recipes/bump-version-and-create-git-tag.md]?
 */
	function bump(done) {
		return gulp.src(config.bump.src)
			.pipe($.plumber())
			.pipe($.bump({type: (argv.type || 'patch')}))
			.pipe(gulp.dest(config.bump.dest))
	}


/**
 * SERVE TASK
 * ----------
 */
	function serve(done) {
		browserSync.init(null, config.browserSync);

		if (config.css && config.css.src) {
			var cssWatcher = gulp.watch(config.css.src, css);
			cssWatcher.on('add', function addNewCssFiles(filePath) {
				cssWatcher.add(filePath);
				console.log('%s was added to the css watcher.', filePath);
			});
		}

		if (config.html && config.html.src) {
			var htmlWatcher = gulp.watch(config.html.src, html);
			htmlWatcher.on('add', function addNewPugFiles(filePath) {
				htmlWatcher.add(filePath);
				console.log('%s was added to the pug watcher.', filePath);
			});
		}

		done();
	}