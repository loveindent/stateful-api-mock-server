var gulp = require('gulp');
var del = require('del');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var install = require('gulp-install');
var shrinkwrap = require('gulp-shrinkwrap');
var gzip = require('gulp-gzip');
var tar = require('gulp-tar');

gulp.task('clean', function(cb) {
  return del(['./dist'], cb);
});

gulp.task('copy', function() {
  return gulp.src([
    'config/**',
    'src/**',
    'README.md',
    'package.json'
  ], {base: '.'})
    .pipe(plumber())
    .pipe(gulp.dest('./dist'))
  ;
});

gulp.task('npm-install', function() {
  return gulp
    .src(['./dist/package.json'])
    .pipe(install({production: true}))
  ;
});

gulp.task('shrinkwrap', function() {
  return gulp.src('./dist/package.json')
    .pipe(shrinkwrap.lock({devDependencies: false}))
    .pipe(gulp.dest('./dist'))
  ;
});

gulp.task('zip', function() {
  return gulp.src('dist/**/*')
    .pipe(tar('archive.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('.'))
  ;
});

gulp.task('build', function(callback) {
  runSequence(
    'clean',
    'copy',
    'shrinkwrap',
    'npm-install',
    'zip',
    callback
  );
});

gulp.task('default', ['build']);
