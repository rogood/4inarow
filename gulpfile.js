var gulp   = require('gulp'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    gulpconcat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    templatecache = require('gulp-angular-templatecache');
    
/* Files */
var jsLibs = [    
    './node_modules/angular/angular.js',
    './node_modules/angular-ui-router/release/angular-ui-router.js',
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js'
];

var jsDevLibs = [
     './node_modules/angular-mocks/angular-mocks.js',
];

var jsSrcFiles = [
      './src/js/app.js',
      './src/js/app/**/*.js'
];

var cssLibs = [
  './node_modules/bootstrap/dist/css/bootstrap.css',
   './node_modules/animate.css/animate.css'
];

var cssBuildFiles = [
  "./build/css/base.css"
];

var templateBuildFiles = [
  './build/js/templates.js'
];

var allCssSrcFiles = './src/scss/**/*.scss';
var allJsSrcFiles = 'src/scss/**/*.scss';
var allTemplateSrcFiles = 'src/templates/**/*.html';

/* Default Task */
gulp.task('default', ['dev']);

/* Bundle Tasks */
gulp.task('dev', ['bundle-css-dev', 'bundle-js-dev']);

gulp.task('prod', ['bundle-css-prod', 'bundle-js-prod']);

/* CSS Tasks */
gulp.task('build-css', function() {
  return gulp.src(allCssSrcFiles)
    .pipe(sass())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('bundle-css-dev', ['build-css'], function() {
  var files = cssLibs.concat(cssBuildFiles);
  return gulp.src(files)
    .pipe(gulpconcat('bundle.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle-css-prod', ['build-css'], function() {
  var files = cssLibs.concat(cssBuildFiles);
  return gulp.src(files)
    .pipe(gulpconcat('bundle.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('./dist'));
});

/* HTML Template tasks */
gulp.task('build-templates', function() {
    return gulp
        .src(allTemplateSrcFiles)
        .pipe(templatecache({standalone: true}))
        .pipe(gulp.dest('./build/js'));
});

/* Javascript Tasks */
gulp.task('bundle-js-dev', ['build-templates'], function() {
  var files = jsLibs.concat(jsDevLibs, jsSrcFiles, templateBuildFiles);
  return gulp.src(files)
  .pipe(gulpconcat('bundle.js'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('bundle-js-prod', ['build-templates'], function() {
  var files = jsLibs.concat(jsSrcFiles, templateBuildFiles);
  return gulp.src(files)
  .pipe(gulpconcat('bundle.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist'));
});

/* JS Hinting */
gulp.task('jshint', function() {
  return gulp.src(allJsSrcFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/* Run a local server */
gulp.task('connect', function () {
  return connect.server({
    root: '',
    port: 8080
  });
});

/* Watches */
gulp.task('watch', ['dev'], function() {
  gulp.watch(allJsSrcFiles, ['jshint', 'bundle-js-dev']);
  gulp.watch(allCssSrcFiles, ['bundle-css-dev']);
  gulp.watch(allTemplateSrcFiles, ['bundle-js-dev']);
});
