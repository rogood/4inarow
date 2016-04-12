'use strict';

var gulp = 			require('gulp'),
	paths = 		  require('../config'),
	Server =	    require('karma').Server

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: require('path').resolve("karma.conf.js"),
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new Server({
    configFile: require('path').resolve(paths.test.config)
  }, done).start();
});