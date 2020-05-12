'use strict';

var gulp = require('gulp');

var plumber = require('gulp-plumber');

var sourcemap = require('gulp-sourcemaps');

var less = require('gulp-less');

var postcss = require('gulp-postcss');

var autoprefixer = require('autoprefixer');

var server = require('browser-sync').create();

gulp.task('css', function() {

    return gulp.src('Less/Style.less').
        pipe(plumber()).
        pipe(sourcemap.init()).
        pipe(less()).
        pipe(postcss([

            autoprefixer(),

        ])).
        pipe(sourcemap.write('.')).
        pipe(gulp.dest('CSS')).
        pipe(server.stream());

});

gulp.task('server', function() {

    server.init({

        server: '.',

        notify: false,

        open: true,

        cors: true,

        ui: false,

    });

    gulp.watch('Less/**/*.less', gulp.series('css'));

    gulp.watch('*.html').on('change', server.reload);

});

gulp.task('start', gulp.series('css', 'server'));
