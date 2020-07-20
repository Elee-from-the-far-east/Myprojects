module.exports = ({ file, options, env }) => ({
    plugins: {
        "postcss-font-magician": {
            variants: {
                "Roboto Condensed": {
                    "300": [],
                    "400": [],
                    "700": [],
                },
            },
            foundries: ["google"],
        },

        "postcss-preset-env": {},

        "postcss-normalize": {},
    },
});
