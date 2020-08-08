const $ = require("gulp-load-plugins")();
const path = require("./path");
const { src, dest } = require("gulp");

const pngSprites = () => {
    return src(`${path.SOURCE_DIR}/img/icons/*.png`)
        .pipe(
            $.spritesmith({
                imgName: "sprite.png",
                cssName: "sprite-png.scss",
                imgOpts: { quality: 75 },
            })
        )
        .pipe(
            $.if(
                "*.scss",
                dest(path.SOURCE_DIR + "/scss/tmp"),
                dest(`${path.SOURCE_DIR}/img/sprites`)
            )
        );
};

const removeSvgAtrr = () => {
    return $.cheerio({
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
        src(`${path.SOURCE_DIR}/img/icons/*.svg`)
            // .pipe(removeSvgAtrr())
            .pipe(
                $.svgSprite({
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
                $.if(
                    "*.scss",
                    dest(path.SOURCE_DIR + "/scss/tmp"),
                    dest(`${path.SOURCE_DIR}/img/sprites`)
                )
            )
    );
};

const svgSprites = () => {
    return src(`${path.SOURCE_DIR}/img/*.svg`)
        .pipe(
            $.svgSprite({
                shape: {
                    // transform: null,
                },
                mode: {
                    stack: {
                        dest: ".",
                        bust: false,
                        sprite: "sprite.svg",
                    },
                },
            })
        )
        .pipe(dest(`${path.SOURCE_DIR}/img/sprites`));
};

exports.pngSprites = pngSprites;
exports.svgIcons = svgIcons;
exports.svgSprites = svgSprites;
