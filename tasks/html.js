const $ = require("gulp-load-plugins")({rename: {
    'gulp-replace-image-src-from-data-attr': 'rep'
  }});
const path = require("./path");
const { src, dest } = require("gulp");
const browserSync = require("browser-sync").get("server");

module.exports = function () {
    return src(path.src.html)
        .pipe($.fileInclude())
        .pipe($.rep({ keepOrigin: false }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream());
};
