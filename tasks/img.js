const $ = require("gulp-load-plugins")();
const path = require("./path");
const { src, dest, lastRun } = require("gulp");

module.exports = function (img) {
    src(path.src.img, { since: lastRun(img) })
        .pipe($.webp())
        .pipe(dest(path.build.img));
    return src(path.src.img, { since: lastRun(img) })
        .pipe(
            $.imagemin([
                $.imagemin.gifsicle({ interlaced: true }),
                $.imagemin.mozjpeg({ quality: 70, progressive: true }),
                $.imagemin.optipng({ optimizationLevel: 5 }),
                $.imagemin.svgo({
                    plugins: [{ removeViewBox: false }],
                }),
            ])
        )
        .pipe(dest(path.build.img));
};
