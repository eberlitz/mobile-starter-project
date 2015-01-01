'use strict';

var path = require('path');
var fs = require('fs');

// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    phonegapBuild = require('gulp-phonegap-build'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    sh = require('shelljs');

// -------------------------------------------------------------------------------------- 

// variables
var distPath = './dist';
// load sensitive data from a config file, so we don't upload it to the github repository
var sensitiveData;
if (fs.existsSync('config.json')){
    sensitiveData = JSON.parse(fs.readFileSync('config.json', 'utf8'));   
}

// -------------------------------------------------------------------------------------- 

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
            './lib/ngCordova/dist/ng-cordova.js',

            './app/app.js',
            './app/**/*.js'
        ])
        .pipe(concat('app.js'))
        //.pipe(ngAnnotate())
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
        .pipe(gulp.dest(path.join(distPath, 'fonts')));
});

// -------------------------------------------------------------------------------------- 

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

// -------------------------------------------------------------------------------------- 


gulp.task('phonegap-build', function(done) {
    if (sensitiveData) {
        return gulp.src(distPath + '/**/*')
            .pipe(phonegapBuild(extend(sensitiveData.phonegapBuild, {
                // keys: {
                //  ios: {
                //      "password": "foobar"
                //  },
                //  android: {
                //      "key_pw": "foobar",
                //      "keystore_pw": "foobar"
                //  }
                // },
                // download: {
                //      ios: 'dist/ios.ipa',
                //      android: 'dist/android.apk'
                //      winphone: 'dist/winphone.xap'
                // }
            })));
    } else {
        done();
    }
});


//Auxiliar function to extent objects
function extend(dst) {
    for (var i = 1, ii = arguments.length; i < ii; i++) {
        var obj = arguments[i];
        if (obj) {
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                dst[key] = obj[key];
            }
        }
    }
    return dst;
}