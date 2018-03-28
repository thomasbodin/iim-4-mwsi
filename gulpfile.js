var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sassimport = require('gulp-sass-bulk-import'),
    path = require('path'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    imageminMozjpeg = require('imagemin-mozjpeg');


/**
 * Task Optimisation des images
 */

gulp.task("image", function () {
    return gulp.src('src/img/*')
        .pipe(imagemin(
            [
                imageminMozjpeg({
                    quality: 50
                })
            ]
        ))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'))
});



/**
 * Task Script (concatenation et minification)
 */

gulp.task('script', function () {
    return gulp.src('src/script/**/*.js', {sourcemap: true})
        .pipe(plumber(plumberErrorHandler))
        .pipe(sourcemaps.init())
        .pipe(concat('main.js')) //Concatenation
        .pipe(uglify()) //Minification
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/script/'))
});


/**
 * Task Style SCSS
 */
var plumberErrorHandler = { errorHandler: notify.onError({
    title: 'Gulp',
    message: 'Error: <%= error.message %>'
})};

gulp.task('style', function () {
    return gulp.src('src/style/**/*.scss', {sourcemap: true})
        .pipe(sassimport()) //Permet de ne pas spécifier les chemins d'import de chaque fichier
        .pipe(plumber(plumberErrorHandler)) //Alerte
        .pipe(sourcemaps.init()) //Mapping
        .pipe(sass({
            includePaths: ['src/style/']
        })) //SASS
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        })) //Autoprefixer
        .pipe(csso()) //Minification
        .pipe(sourcemaps.write('.')) //Mapping
        .pipe(gulp.dest('dist/style/'))
});


/**
 * Task Watcher
 * Style
 * Image
 * Script
 */


gulp.task("watch", function () {
    gulp.watch('src/img/*', ['image']);

    gulp.watch('src/style/**/*.scss', ['style']);

    gulp.watch('src/script/**/*.js', ['script']);
});
