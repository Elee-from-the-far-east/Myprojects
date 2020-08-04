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
        html: [SOURCE_DIR + "/*.html"],
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

const { src, dest, series, parallel, lastRun } = require("gulp");
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
const spritesmith = require("gulp.spritesmith");
const gulpSvgSprite = require("gulp-svg-sprite");
const gulpTtf2woff = require("gulp-ttf2woff");
const gulpTtf2woff2 = require("gulp-ttf2woff2");
const gulpSourcemaps = require("gulp-sourcemaps");
const gulpResolveUrl = require("gulp-resolve-url");
const gulpIf = require("gulp-if");
const gulpConcat = require("gulp-concat");
const gulpCheerio = require("gulp-cheerio");

const babel = require("gulp-babel");
const fs = require("fs");

const html = () => {
    return src(path.src.html)
        .pipe(gulpFileInclude())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream());
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
    return src(path.src.js)
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
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream());
};

const css = () => {
    return src(path.src.css)
        .pipe(gulpSourcemaps.init())
        .pipe(
            gulpSass({
                outputStyle: "expanded",
            })
        )
        .pipe(
            gulpAutoprefixer({
                cascade: true,
                overrideBrowserslist: ["defaults"],
            })
        )
        .pipe(gulpResolveUrl())
        .pipe(media())
        .pipe(gulpSourcemaps.write())
        .pipe(dest(path.build.css))
        .pipe(gulpCleanCss())
        .pipe(
            gulpRename({
                extname: ".min.css",
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());
};

const img = () => {
    src(path.src.img, { since: lastRun(img) })
        .pipe(gulpWebp())
        .pipe(dest(path.build.img));
    return src(path.src.img).pipe(gulpImagemin()).pipe(dest(path.build.img));
};

const browserSyncFn = () => {
    browserSync.init({
        server: {
            baseDir: BUILD_DIR,
        },
        port: 3000,
        notify: false,
    });
};

const reload = (done) => {
    browserSync.reload();
    done();
};

const liveWatch = () => {
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.img, series(img, reload));
};
const delFiles = () => {
    return del(path.clean);
};

const pngSprites = () => {
    return src(`${SOURCE_DIR}/img/icons/*.png`)
        .pipe(
            spritesmith({
                imgName: "sprite.png",
                cssName: "sprite-png.scss",
                imgOpts: { quality: 75 },
            })
        )
        .pipe(
            gulpIf(
                "*.scss",
                dest(SOURCE_DIR + "/scss/tmp"),
                dest(`${SOURCE_DIR}/img/sprites`)
            )
        );
};

const removeSvgAtrr = () => {
    return gulpCheerio({
        run: function ($) {
            $("[fill]").removeAttr("fill");
            $("[stroke]").removeAttr("stroke");
            $("[style]").removeAttr("style");
            $("[viewBox]").attr("fill", "green");
        },
        parserOptions: { xmlMode: true },
    });
};

const svgSprites = () => {
    return (
        src(`${SOURCE_DIR}/img/icons/*.svg`)
            // .pipe(removeSvgAtrr())
            .pipe(
                gulpSvgSprite({
                    mode: {
                        css: {
                            dest: ".",
                            bust: false,
                            sprite: "sprite-svg.svg",
                            render: {
                                scss: {
                                    dest: "sprite-svg.scss",
                                },
                            },
                            mixin: "svg",
                            prefix: `@mixin svg-`,
                            layout: "vertical",
                        },
                        stack: {
                            dest: ".",
                            bust: false,
                            sprite: "sprite.svg",
                        },
                    },
                })
            )
            .pipe(
                gulpIf(
                    "*.scss",
                    dest(SOURCE_DIR + "/scss/tmp"),
                    dest(`${SOURCE_DIR}/img/sprites`)
                )
            )
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

const init = series(fontsInit, fontRead, pngSprites, svgSprites);
const build = series(
    delFiles,
    parallel(img, fonts, css, js),
    html,
    parallel(liveWatch, browserSyncFn)
);
const watch = parallel(liveWatch, browserSyncFn);
exports.default = build;
exports.init = init;
exports.watch = watch;
exports.svg = svgSprites;
exports.png = pngSprites;
