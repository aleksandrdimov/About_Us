const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const prefix = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
var rename = require("gulp-rename");
const { render } = require("pug");

function watcher(cb) {
  watch(`/**/*.html`).on("change", series(html, browserSync.reload));
  watch(`/scss/**/*.scss`, css);
  watch(`/js/*.js`).on("change", series(js, browserSync.reload));
  cb();
}

function server(cb) {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: "/",
    },
  });
  cb();
}

function html(cb) {
  src(`/**/*.html`);
  cb();
}

function css(cb) {
  src(`/scss/**/*.scss`)
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(
      prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: false })
    )
    .pipe(dest(`/css/`))
    .pipe(browserSync.stream());
  cb();
}

function js(cb) {
  src(`/js/*.js`).pipe(babel({ presets: ["@babel/env"] }));
  cb();
}

exports.default = series(series(css), parallel(html, js), server, watcher);
