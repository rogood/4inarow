'use strict';

var gulp = require('gulp');

// Define default tasks for gulp
gulp.task('default',    ['scripts', 'styles', 'templates', 'images', 'watch']);

gulp.task('prod', ['scripts', 'templates', 'images', 'styles']);
