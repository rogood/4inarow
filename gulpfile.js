var gulp   = require('gulp'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    gulpconcat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    templatecache = require('gulp-angular-templatecache');

gulp.task('default', ['build-css', 'bundle-css', 'build-templates', 'bundle-js']);

gulp.task('jshint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function() {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('bundle-css', function() {

  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './build/css/app.css',
    './build/css/game.css'
  ])
  .pipe(gulpconcat('bundle.css'))
  .pipe(gulp.dest('./dist'));

});

gulp.task('bundle-js', function() {
  return gulp.src([
    './node_modules/angular/angular.js',
    './node_modules/angular-ui-router/release/angular-ui-router.js',
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './build/js/templates.js',
    './src/js/app.js',
    './src/js/gameController.js'
  ])
  .pipe(gulpconcat('bundle-min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./dist'));

});

gulp.task('build-templates', function() {
    return gulp
        .src('./src/templates/**/*.html')
        .pipe(templatecache({standalone: true}))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('connect', function () {
  return connect.server({
    root: '/',
    port: 8888
  });
});

gulp.task('watch', function() {
  gulp.watch('js/**/*.js', ['jshint', 'bundle-js']);
  gulp.watch('scss/**/*.scss', ['build-css', 'bundle-css']);
  gulp.watch('templates/**/*.html', ['build-templates', 'bundle-js']);
});
