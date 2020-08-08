const browserSync = require("browser-sync").get("server");
const path = require("./path");
const { watch, series } = require("gulp");

const reload = (done) => {
    browserSync.reload();
    done();
};

module.exports = function (css, html, js, img) {
    browserSync.init({
        server: {
            baseDir: path.BUILD_DIR,
        },
        port: 3000,
        notify: false,
    });
    watch(path.watch.css, css);
    watch(path.watch.html, html);
    watch(path.watch.js, js);
    watch(path.watch.img, series(img, reload));
};
