var path = require('path');
// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');

var gutil = require('gulp-util');
var bower = require('bower');
var sh = require('shelljs');

// variables
var distPath = './dist';


// Default Task
gulp.task('default', ['assets', 'templates', 'sass', 'scripts']);

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
    		'./lib/angular/angular.js',
    		'./lib/angular-animate/angular-animate.js',
    		'./lib/angular-sanitize/angular-sanitize.js',
    		'./lib/angular-ui-router/release/angular-ui-router.js',
    		'./lib/ionic/js/ionic.js',
    		'./lib/ionic/js/ionic-angular.js',
    		'./app/app.js',
    		'./app/**/*.js'
    	])
        .pipe(concat('app.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(distPath));
});

// Compile sass
gulp.task('sass', function(done) {
  gulp.src('./app/app.scss')
    .pipe(sass())
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest(distPath))
    .on('end', done);
});

// Templates
gulp.task('templates', function() {
    return gulp.src('./app/**/*.html')
        .pipe(gulp.dest(distPath));
});

// assets
gulp.task('assets', function() {
    return gulp.src('./lib/ionic/fonts/**/*')
        .pipe(gulp.dest(path.join(distPath,'fonts')));
});



gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});