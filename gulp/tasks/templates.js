'use strict';

var gulp = 			require('gulp'),
	paths =			require('../config'),
	templatecache = require('gulp-angular-templatecache');

// Minify and concat angular app
gulp.task('templates', function() {

	return gulp.src([
				paths.html.files												// Get all the other files
			])
			.pipe(templatecache({standalone: true}))						// Put the html files into a template cache js file.
			.pipe(gulp.dest(paths.html.folder.dest));							// Put the file into js folder
});