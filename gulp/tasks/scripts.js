'use strict';

var gulp = 			require('gulp'),
	paths =			require('../config'),
	uglify = 		require('gulp-uglify'),
	concat = 		require('gulp-concat'),
	ngAnnotate = 	require('gulp-ng-annotate'),
	gutil = 		require('gulp-util'),
	jshint = 		require('gulp-jshint');

// Minify and concat angular app
gulp.task('scripts', function() {

	return gulp.src(paths.js.files)
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'))
			.pipe(gutil.env.env === 'prod' ? ngAnnotate(): gutil.noop()) 	// Automatically auto inject angular dependecies
			.pipe(concat(paths.js.bundle))									// Concat all file in once
			.pipe(gutil.env.env === 'prod' ? uglify() : gutil.noop()) 		// Minify the code if in production
			.pipe(gulp.dest(paths.js.folder.dest));							// Put the file into js folder
});
