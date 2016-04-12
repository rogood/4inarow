'use strict';

var gulp = require('gulp');

// Define default tasks for gulp
gulp.task('default', ['scripts-lib', 'scripts', 'styles-lib', 'styles', 'templates', 'watch']);

gulp.task('prod', ['scripts-lib', 'scripts', 'styles-lib', 'styles', 'templates']);
