var _ = require('lodash');

function config(args) {
	var config = {};

	/**
	 * CONFIG GLOBALS
	 * --------------
	 * each of this properties need to check first for args passed from cli command
	 */
		config.src = args.src || './test/src';
		config.dest = args.dest || './test/build';


	/**
	 * TASK CONFIG
	 * -----------
	 */
		config.css = {
			enabled: 'styl', // 'styl'|'sass'|'css'|false
			src: config.src + '/**/*.styl',
			dest: config.dest + '/css'
		};

		config.html = {
			enabled: true, // true|false
			src: config.src + '/**/*.html.pug',
			dest: config.dest
		};


	/**
	 * PLUGINS CONFIG
	 * --------------
	 */
		config.gulpLoadPlugins = {
			pattern: ['gulp-*', 'gulp.*'],
			replaceString: /^gulp(-|\.)/,
			camelize: true,
			lazy: true,
			rename: {}
		};

		config.pug = {
			pretty: true,
			cache: true
		};

		config.stylus = {
			compress: true,
			linenos: false,
			'include css': true
		};

		config.sass = {
			errLogToConsole: true,
			includePaths: [],
			indentType: 'tab', // 'space' | 'tab'
			indentWidth: 1, // number
			outputStyle: 'compressed', // 'nested' | 'expanded' | 'compact' | 'compressed'
			precision: 5, // # of decimals to use
			sourceComments: false, // enable debugging info in output file as comments
		};

		config.autoprefixer = {
			browsers: ['last 2 version', '> 1% in US'],
			cascade: false,
			add: true,
			remove: true,
		};

		config.sourcemaps = {
			dest: './.maps'
		};

		config.browserSync = {
			server: {
				baseDir: config.dest
			},
			tunnel: true,
			directory: true
		};

		config.clean = {
			src: false
		};

		config.bump = {
			src: './package.json',
			dest: './'
		};

		// merge arguments to config
		return _.merge(config, args);
};

module.exports = config;