'use strict';

var gulp =		require('gulp'),
	paths =		require('../config'),
	plumber =	require('gulp-plumber'),
	sass =		require('gulp-sass');

// Convert, minify and concat scss/css
gulp.task('styles', function() {

	return gulp.src(paths.scss.files)						// Get all the css files
			.pipe(plumber())								// Control for errors
			.pipe(sass())
			.pipe(gulp.dest(paths.scss.folder.dest));		// Put the files into css folder
});
