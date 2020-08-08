require("browser-sync").create("server");
const { series, parallel } = require("gulp");
const del = require("del");
const path = require("./tasks/path");

const html = () => {
    return require("./tasks/html")();
};

const fontsInit = () => {
    return require("./tasks/fonts").fontsInit();
};

const fonts = () => {
    return require("./tasks/fonts").fonts();
};

const js = () => {
    return require("./tasks/js")();
};

const css = () => {
    return require("./tasks/css")();
};

const img = () => {
    return require("./tasks/img")(img);
};

const delFiles = () => {
    return del(path.clean);
};

const pngSprites = () => {
    return require("./tasks/sprites").pngSprites();
};

const svgIcons = () => {
    return require("./tasks/sprites").svgIcons();
};

const svgSprites = () => {
    return require("./tasks/sprites").svgSprites();
};

const fontRead = (done) => {
    return require("./tasks/fonts").fontRead(done);
};

const liveWatch = () => {
    require("./tasks/watch")(css, html, js, img);
};

const init = parallel(fontsInit, fontRead, pngSprites, svgSprites, svgIcons);
const build = series(delFiles, parallel(img, fonts, css, js), html, liveWatch);

exports.default = build;
exports.init = init;
exports.svg = parallel(svgSprites, svgIcons);
exports.png = pngSprites;
exports.fony = fontRead;
exports.js = js;
