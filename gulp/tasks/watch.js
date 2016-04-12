'use strict';

var gulp = 			require('gulp'),
	paths = 		require('../config'),
    livereload = 	require('gulp-livereload');

// Watch tasks
gulp.task('watch', function(){
	
	livereload.listen();
	
	// For every app change, reload js and scss
	gulp.watch(paths.js.files,		['scripts']);		// Watch for scripts changes
	gulp.watch(paths.scss.files,	['styles']);		// Watch for styles changes
	gulp.watch(paths.html.files,	['templates']);		// Watch for html changes
});