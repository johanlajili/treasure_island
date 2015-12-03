"use strict";
var gulp         = require('gulp');
var concat       = require('gulp-concat');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create('browserSync');
var browserify   = require('browserify');
var del          = require('del');
var runSequence  = require('run-sequence');
var fs           = require('fs');
var brfs         = require('brfs');
var babel        = require('babelify');
var source       = require('vinyl-source-stream');
var listImages   = require('./gulp/listImages');
var environement = {
	production: "production",
	staging: "staging"
};

var paths = {
    HTML: 'src/index.html',
    CSS: 'src/css/*.scss',
    JS: 'src/**/*.js',
    PRODUCTION: 'production/',
    STAGING: 'staging/',
    ASSETS:'src/assets/**/*.*',
    ENTRY_POINT:'src/main.js'
};

var partials = {
	ASSETS: '/resources/assets',
	RESOURCES: '/resources'

};

// "gulp" :  will build to staging, launch browsersync and listen to any new changes.
// "gulp build:production"  will build to production.

function createTasks(env, path){
    gulp.task('clean:'+env, function(callback){
        return del([path + "**/*.*"], callback);
    });
    gulp.task('handleHTML:'+env, function(){
        return gulp.src(paths.HTML)
            .pipe(gulp.dest(path))
            .pipe(browserSync.stream());
    });
    gulp.task('handleAssets:'+env, function() {
        return gulp.src(paths.ASSETS)
            .pipe(gulp.dest(path + partials.ASSETS));
    });
    gulp.task('handleJS:'+env, function(){

    	return browserify({
    	    entries: [paths.ENTRY_POINT],
    	    transform: [listImages, brfs, babel],
    	    debug: env == environement.staging,
    	    cache: {},
    	    packageCache: {},
    	    fullPaths: env == environement.staging
    	})
    	.bundle()
    	.pipe(source("bundle.js"))
    	.pipe(gulp.dest(path + partials.RESOURCES))
    	.pipe(browserSync.stream());
    });
    gulp.task('handleCSS:'+env, function () {
        return gulp.src(paths.CSS)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat("bundle.css"))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(path + partials.RESOURCES))
        .pipe(browserSync.stream());
    });
    gulp.task('build:'+env, function(){
       runSequence('clean:'+env, ['handleHTML:'+env, 'handleCSS:'+env, 'handleAssets:'+env, 'handleJS:'+env]);
    });
}

createTasks(environement.production, paths.PRODUCTION);
createTasks(environement.staging, paths.STAGING);



gulp.task('default', function(){
   runSequence(['build:staging'], ['browser-sync'], ['watch']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: paths.STAGING
        }
    });
});

gulp.task('watch', function(){
    gulp.watch(paths.HTML, ['handleHTML:staging']);
    gulp.watch(paths.CSS, ['handleCSS:staging']);
    gulp.watch(paths.JS, ['handleJS:staging']);
    gulp.watch(paths.ASSETS, ['handleAssets:staging']);
});