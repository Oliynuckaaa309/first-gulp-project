require = require('esm')(module /*, options*/);
module.exports = require('./gulpfile.js');
const gulp = require('gulp');
const { series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();


const html = function () {
  return gulp.src('src/pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('build'));
};

const styles = function () {
  return gulp.src('src/styles/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/css'));
};

const images = async function () {
    const imagemin = await import('gulp-imagemin'); // Змінено рядок
    return gulp.src('src/images/photo/*.*')
      .pipe(imagemin())
      .pipe(gulp.dest('build/images'));
  };

const server = function () {
  browserSync.init({
    server: {
      baseDir: './build',
    },
    notify: false,
  });

  browserSync.watch('build', browserSync.reload);
};



const watch = function () {
  gulp.watch('src/pug/**/*.pug', html);
  gulp.watch('src/styles/**/*.scss', styles);
  gulp.watch('src/images/photo/*.*', images);
};

exports.default = series(
  
  parallel(html, styles, images),
  parallel(watch, server)
);

