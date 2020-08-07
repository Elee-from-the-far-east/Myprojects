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
        img: [
            SOURCE_DIR + "/img/**/*.{jpg,jpeg,png,svg,gif,webp,ico}",
            `!${SOURCE_DIR}/img/icons/**`,
            `!${SOURCE_DIR}/img/*.svg`,
        ],
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
const rep = require("gulp-replace-image-src-from-data-attr");

const babel = require("gulp-babel");
const fs = require("fs");

const html = () => {
    return src(path.src.html)
        .pipe(gulpFileInclude())
        .pipe(rep({ keepOrigin: false }))
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

const svgIcons = () => {
    return (
        src(`${SOURCE_DIR}/img/icons/*.svg`)
            // .pipe(removeSvgAtrr())
            .pipe(
                gulpSvgSprite({
                    mode: {
                        css: {
                            dest: ".",
                            bust: false,
                            sprite: "sprite-icons.svg",
                            render: {
                                scss: {
                                    dest: "sprite-icons.scss",
                                },
                            },
                            mixin: "svg",
                            prefix: `@mixin svg-`,
                            layout: "vertical",
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

const svgSprites = () => {
    return src(`${SOURCE_DIR}/img/*.svg`)
        .pipe(
            gulpSvgSprite({
                mode: {
                    stack: {
                        dest: ".",
                        bust: false,
                        sprite: "sprite.svg",
                    },
                },
            })
        )
        .pipe(dest(`${SOURCE_DIR}/img/sprites`));
};

const fontRead = (done) => {
    fontWeightMap = {
        Light: "300",
        Regular: "400",
        Medium: "500",
        Bold: "700",
        Black: "900",
    };

    function isTTF(string) {
        return string.includes("ttf");
    }

    function isFontWeight(fontWeight) {
        return fontWeightMap[fontWeight];
    }
    fs.readdir(path.src.fonts.dir, function (err, fonts) {
        if (err) console.error(err);
        let prevFont;
        fonts.forEach((font) => {
            const arr = font.split(".");
            const fontNameFull = arr[0];
            const fontExt = arr[1];
            const fontArr = arr[0].split("-");
            const fontName = fontArr[0];
            const fontWeight = fontArr[1];

            if (!isTTF(fontExt)) {
                if (prevFont !== fontNameFull) {
                    fs.appendFile(
                        SOURCE_DIR + "/scss/reuseables/fonts.scss",
                        `@include add-fonts ("${fontName}", ${
                            isFontWeight(fontWeight)
                                ? fontWeightMap[fontWeight]
                                : fontWeight
                        }, "normal", "${fontNameFull}");\r\n`,
                        function () {}
                    );
                }
                prevFont = fontNameFull;
            }
        });
        done();
    });
};

const init = series(fontsInit, fontRead, pngSprites, svgSprites, svgIcons);
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
exports.svg = parallel(svgSprites, svgIcons);
exports.png = pngSprites;
exports.fony = fontRead;
