module.exports = ({ file, options, env }) => ({
    plugins: {
        "postcss-font-magician": {
            variants: {
                Roboto: {
                    "300": [],
                    "400": [],
                    "400 italic": [],
                    "700": [],
                },
            },
            foundries: ["google"],
        },

        "postcss-preset-env": {},

        "postcss-normalize": {},
    },
});
