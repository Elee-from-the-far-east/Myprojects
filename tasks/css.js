const path = require("./path");
const { src, dest } = require("gulp");
const browserSync = require("browser-sync").get("server");
const $ = require("gulp-load-plugins")( {rename: {
    'gulp-group-css-media-queries': 'media'
  }});

module.exports = function () {
    return src(path.src.css, { sourcemaps: false })
        .pipe($.sourcemaps.init())
        .pipe(
            $.sass({
                outputStyle: "expanded",
            })
        )
        .pipe(
            $.autoprefixer({
                cascade: true,
                overrideBrowserslist: ["defaults"],
            })
        )
        .pipe($.resolveUrl())
        .pipe($.media())
        .pipe($.sourcemaps.write())
        .pipe(dest(path.build.css))
        .pipe($.cleanCss())
        .pipe(
            $.rename({
                extname: ".min.css",
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());
};
