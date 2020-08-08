const $ = require("gulp-load-plugins")();
const path = require("./path");
const { src, dest } = require("gulp");
const browserSync = require("browser-sync").get("server");

module.exports = function () {
    const addLibrary = function (file) {
        return `${path.SOURCE_DIR}/js/${file}`;
    };

    return src([addLibrary("swiper-bundle.min.js"), path.src.js])
        .pipe($.if("main.js", $.fileInclude()))
        .pipe($.if("main.js", dest(path.build.js)))
        .pipe(
            $.if(
                "main.js",
                $.babel({
                    presets: ["@babel/env"],
                })
            )
        )
        .pipe($.if("main.js", $.uglify()))
        .pipe($.concat("main.min.js"))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream());
};
