const SOURCE_DIR = "src";
const BUILD_DIR = "dist";

module.exports = {
    SOURCE_DIR,
    BUILD_DIR,
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
