'use strict';

var gulp = 		require('gulp'),
	image = 	require('gulp-image'),
	paths =		require('../config');

gulp.task('images', function() {

	return gulp.src(paths.img.files)					// Get all the files
			.pipe(image())								// Manage all img files
			.pipe(gulp.dest(paths.img.folder.dest));	// Put all images
});