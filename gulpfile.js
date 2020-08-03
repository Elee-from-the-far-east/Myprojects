const SOURCE_DIR = "src";
const BUILD_DIR = "dist";
const path = {
    build: {
        html: BUILD_DIR,
        css: BUILD_DIR + "/css",
        js: BUILD_DIR + "/js",
        fonts: BUILD_DIR + "/fonts",
        img: BUILD_DIR + "/img",
    },
    src: {
        html: [SOURCE_DIR + "/*.html", !SOURCE_DIR + "/_*.html"],
        css: SOURCE_DIR + "/scss/style.scss",
        js: SOURCE_DIR + "/js/main.js",
        fonts: {
            dir: SOURCE_DIR + "/fonts/",
            ttf: SOURCE_DIR + "/fonts/*.ttf",
            woff: SOURCE_DIR + "/fonts/*.{woff,woff2}",
        },
        img: SOURCE_DIR + "/img/**/*.{jpg,jpeg,png,svg,gif,webp,ico}",
    },
    watch: {
        html: SOURCE_DIR + "/**/*.html",
        css: SOURCE_DIR + "/scss/**/*.scss",
        js: SOURCE_DIR + "/js/**/*.js",
        fonts: SOURCE_DIR + "/fonts/**/*.ttf",
        img: SOURCE_DIR + "/img/**/*.{jpg,png,svg,gif,webp,ico}",
    },
    clean: BUILD_DIR,
};

const { src, dest, series, parallel } = require("gulp");
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const gulpFileInclude = require("gulp-file-include");
const del = require("del");
const gulpSass = require("gulp-sass");
const gulpAutoprefixer = require("gulp-autoprefixer");
const media = require("gulp-group-css-media-queries");
const gulpCleanCss = require("gulp-clean-css");
const gulpRename = require("gulp-rename");
const gulpUglify = require("gulp-uglify");
const gulpImagemin = require("gulp-imagemin");
const gulpWebp = require("gulp-webp");
const gulpWebpHtml = require("gulp-webp-in-html");
const gulpWebpCss = require("gulp-webp-css");
const spritesmith = require("gulp.spritesmith");
const gulpSvgSprite = require("gulp-svg-sprite");
const gulpTtf2woff = require("gulp-ttf2woff");
const gulpTtf2woff2 = require("gulp-ttf2woff2");
const gulpSourcemaps = require("gulp-sourcemaps");
const gulpResolveUrl = require("gulp-resolve-url");

const gulpConcat = require("gulp-concat");
const gulpCheerio = require("gulp-cheerio");

const babel = require("gulp-babel");
const fs = require("fs");

const html = () => {
    return src(path.src.html, { since: gulp.lastRun(html) })
        .pipe(gulpFileInclude())
        .pipe(gulpWebpHtml())
        .pipe(dest(path.build.html));
};

const fontsInit = () => {
    src(path.src.fonts.ttf).pipe(gulpTtf2woff()).pipe(dest(path.src.fonts.dir));
    return src(path.src.fonts.ttf)
        .pipe(gulpTtf2woff2())
        .pipe(dest(path.src.fonts.dir));
};

const fonts = () => {
    return src(path.src.fonts.woff).pipe(dest(path.build.fonts));
};

const js = () => {
    return src(path.src.js, { since: gulp.lastRun(js) })
        .pipe(
            babel({
                presets: ["@babel/env"],
            })
        )
        .pipe(dest(path.build.js))
        .pipe(gulpUglify())
        .pipe(
            gulpRename({
                extname: ".min.js",
            })
        )
        .pipe(dest(path.build.js));
};

const css = () => {
    return src(path.src.css, { since: gulp.lastRun(css) })
        .pipe(gulpSourcemaps.init())

        .pipe(
            gulpSass({
                outputStyle: "expanded",
            })
        )
        .pipe(
            gulpAutoprefixer({
                cascade: true,
                grid: "autoplace",
                overrideBrowserslist: ["defaults"],
            })
        )
        .pipe(gulpResolveUrl())

        .pipe(media())
        .pipe(gulpWebpCss())
        .pipe(gulpSourcemaps.write())
        .pipe(dest(path.build.css))
        .pipe(gulpCleanCss())
        .pipe(
            gulpRename({
                extname: ".min.css",
            })
        )
        .pipe(gulpSourcemaps.write())
        .pipe(dest(path.build.css));
};

const img = () => {
    return src(path.src.img)
        .pipe(gulpWebp({}))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(gulpImagemin())
        .pipe(dest(path.build.img));
};

const browserSyncFn = () => {
    browserSync.init({
        server: {
            baseDir: BUILD_DIR,
        },
        port: 3000,
        notify: false,
    });
    browserSync.watch(BUILD_DIR).on("change", browserSync.reload);
};

const liveWatch = () => {
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.js, js);
};
const delFiles = () => {
    return del(path.clean);
};

const pngSprites = () => {
    return src(`${SOURCE_DIR}/img/icons/*.png`)
        .pipe(
            spritesmith({
                imgName: "sprite.png",
                cssName: "sprite.scss",
                imgOpts: { quality: 75 },
            })
        )
        .pipe(dest(`${SOURCE_DIR}/img/sprites`));
};

const svgSprite = () => {
    return (
        src(`${SOURCE_DIR}/img/icons/*.svg`)
            // .pipe(
            //     gulpCheerio({
            //         run: function ($, file) {
            //             $("[fill]").first().removeAttr("fill");
            //             $("[stroke]").removeAttr("stroke");
            //             $("[style]").removeAttr("style");
            //         },
            //         parserOptions: { xmlMode: true },
            //     })
            // )
            .pipe(
                gulpSvgSprite({
                    mode: {
                        stack: { sprite: "../sprite.svg" },
                        symbol: false,
                    },
                })
            )
            .pipe(dest(`${SOURCE_DIR}/img/sprites`))
    );
};

const fontRead = (cb) => {
    const content = fs.readFileSync(SOURCE_DIR + "/scss/fonts.scss");
    if (content) {
        return fs.readdir(path.src.fonts.dir, function (err, items) {
            if (items) {
                let prevFont;
                items.forEach((el) => {
                    let currentFont = el.split(".");
                    if (!currentFont[1].includes("ttf")) {
                        if (prevFont !== currentFont[0]) {
                            fs.appendFile(
                                SOURCE_DIR + "/scss/fonts.scss",
                                `@include add-fonts ("${currentFont[0]}", "400", "normal", "${currentFont}");\r\n`,
                                function () {}
                            );
                        }
                        prevFont = currentFont[0];
                    }
                });
            }
            cb();
        });
    }
};

const init = series(fontsInit, fontRead, pngSprites, svgSprite);
const build = series(
    delFiles,
    parallel(html, img, fonts, css, js),
    parallel(liveWatch, browserSyncFn)
);
const watch = parallel(liveWatch, browserSyncFn);
exports.default = build;
exports.init = init;
exports.watch = watch;
exports.svg = pngSprites;
