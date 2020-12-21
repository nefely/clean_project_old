const {src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const webp = require('gulp-webp');

function browser_sync() {
  browserSync.init({
      server: {
        baseDir:"./",
        notify: false,
        online: true,
      }
  })
}

function scripts_bandle() {
  return src([
    "js/jquery.js",
    "pluggins/**/*.js",
    "js/script.js",
  ])
  .pipe(concat("bundle.min.js"))
  .pipe(uglify())
  .pipe(dest("js/"))
  .pipe(browserSync.stream())
}

function styles_bandle() {
  return src([
    "css/general.css",
    "pluggins/**/*.css",
    "css/components/**/*.css",
  ])
  .pipe(concat("bundle.min.css"))
  .pipe(cleanCSS())
  .pipe(dest("css/"))
  .pipe(browserSync.stream())
}

function images_min() {
  return src([
    "media/img/source/**/*"
  ])
  .pipe(newer("media/img/minified/"))
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
  .pipe(dest("media/img/minified/"))
}

function images_webp() {
  return src([
    "media/img/source/**/*.png",
    "media/img/source/**/*.jpg",
    "media/img/source/**/*.jpeg",
  ])
  .pipe(webp())
  .pipe(dest("media/img/minified/"))
}

function start_watch() {
  watch(["**/*.js","!js/bundle.min.js"] , scripts_bandle);
  watch(["**/*.css","!css/bundle.min.css"] , styles_bandle);
  watch(["media/img/**/*"] , images_min)
  watch(["**/*.html"]).on("change" , browserSync.reload)
}

exports.default = parallel(scripts_bandle, styles_bandle, browser_sync, start_watch, images_min , images_webp)