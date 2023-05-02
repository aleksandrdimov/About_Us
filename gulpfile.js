const { src, dest, series, parallel, watch } = require("gulp");
const del = require("del");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const prefix = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
var rename = require("gulp-rename");
const { render } = require("pug");

const origin = "src";

function watcher(cb) {
  watch(`${origin}/**/*.html`).on("change", series(html, browserSync.reload));
  watch(`${origin}/scss/**/*.scss`, css);
  watch(`${origin}/js/*.js`).on("change", series(js, browserSync.reload));
  cb();
}

function server(cb) {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: origin,
    },
  });
  cb();
}

function html(cb) {
  src(`${origin}/**/*.html`);
  cb();
}

function css(cb) {
  src(`${origin}/scss/**/*.scss`)
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(
      prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: false })
    )
    .pipe(dest(`${origin}/css/`))
    .pipe(browserSync.stream());
  cb();
}

function js(cb) {
  src(`${origin}/js/*.js`).pipe(babel({ presets: ["@babel/env"] }));
  cb();
}

exports.default = series(series(css), parallel(html, js), server, watcher);
