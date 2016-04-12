'use strict';

var gulp = require('gulp'),
	paths = require('../config'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass');

// Convert, minify and concat scss/css
gulp.task('styles', function () {

	return gulp.src(paths.scss.files) 					// Get all the css files
	    .pipe(plumber())									// Control for errors
		.pipe(sass())
		.pipe(concat("app.css"))
		.pipe(gulp.dest(paths.scss.folder.dest));		// Put the files into css folder
});

gulp.task('styles-lib', function () {

	return gulp.src(paths.scss.libs) 					// Get all the css files
		.pipe(plumber())								// Control for errors
		.pipe(sass())
		.pipe(concat("libs.css"))
		.pipe(gulp.dest(paths.scss.folder.dest));		// Put the files into css folder
});
