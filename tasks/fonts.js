const $ = require("gulp-load-plugins")();
const { src, dest } = require("gulp");
const path = require("./path");
const fs = require("fs");

const fontsInit = () => {
    src(path.src.fonts.ttf).pipe($.ttf2woff()).pipe(dest(path.src.fonts.dir));
    return src(path.src.fonts.ttf)
        .pipe($.ttf2woff2())
        .pipe(dest(path.src.fonts.dir));
};

const fonts = () => {
    return src(path.src.fonts.woff).pipe(dest(path.build.fonts));
};

const fontRead = (done) => {
    fontWeightMap = {
        Light: "300",
        Regular: "400",
        Medium: "500",
        Bold: "700",
        Black: "900",
    };

    function notTTF(string) {
        return !string.includes("ttf");
    }

    function isFontWeight(fontWeight) {
        return fontWeightMap[fontWeight];
    }
    fs.readdir(path.src.fonts.dir, function (err, fonts) {
        if (err) console.error(err);
        let prevFont;
        fonts.forEach((font) => {
            const arr = font.split(".");
            const fontArr = arr[0].split("-");
            const fontNameFull = arr[0];
            const fontExt = arr[1];
            const fontName = fontArr[0];
            const fontWeight = fontArr[1];

            if (notTTF(fontExt)) {
                if (prevFont !== fontNameFull) {
                    fs.appendFile(
                        path.SOURCE_DIR + "/scss/reuseables/fonts.scss",
                        `@include add-fonts ("${fontName}", ${
                            isFontWeight(fontWeight)
                                ? fontWeightMap[fontWeight]
                                : fontWeight
                        }, "normal", "${fontNameFull}");\r\n`,
                        function (err) {
                            if (err) console.error(err);
                        }
                    );
                }
                prevFont = fontNameFull;
            }
        });
        done();
    });
};

exports.fontsInit = fontsInit;
exports.fonts = fonts;
exports.fontRead = fontRead;
