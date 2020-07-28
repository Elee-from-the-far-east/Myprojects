module.exports = ({ file, options, env }) => ({
    plugins: {
        "postcss-font-magician": {
            display: "swap",
        },

        "postcss-preset-env": {},

        "postcss-normalize": {},
    },
});
