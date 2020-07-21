/* eslint-disable no-unused-vars */
const path = require("path");
const fs = require("fs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const { path: PROJECT_ROOT } = require("app-root-path");
const SOURCE_DIR = path.resolve(PROJECT_ROOT, "./src");
const BUILD_DIR = path.resolve(PROJECT_ROOT, "./dist");
const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const filename = (ext, min) =>
  isDev ? `bundle.${ext}` : `bundle.[hash]${min ? "-" + min : ""}.${ext}`;

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: [
          [
            "@babel/preset-env",
            { useBuiltIns: "usage", corejs: { version: 3 } },
          ],
        ],
        plugins: ["@babel/plugin-proposal-class-properties"],
      },
    },
  ];

  if (isDev) {
    loaders.push("eslint-loader");
  }

  return loaders;
};

module.exports = {
  context: SOURCE_DIR,
  mode: "development",
  entry: ["./index.js"],
  output: {
    filename: filename("js"),
    path: BUILD_DIR,
  },
  resolve: {
    extensions: [".js"],
    alias: {
      "@": SOURCE_DIR,
      "@core": path.resolve(__dirname, "src/core"),
    },
  },
  devtool: isDev ? "source-map" : false,
  devServer: {
    port: 3000,
    contentBase: BUILD_DIR,
    watchContentBase: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin({
    //     patterns: [
    //         {
    //             from: SOURCE_DIR + "/images",
    //             to: BUILD_DIR,
    //             noErrorOnMissing: true,
    //         },
    //     ],
    // }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 75,
          progressive: true,
        }),
      ],
    }),
    new ExtractTextPlugin(filename("css", "min")),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /min\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
    }),
    new HTMLWebpackPlugin({
      filename: "index-min.html",
      template: "index.html",
      inject: false,
      title: "My app",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      title: "My app",
      inject: false,
      minify: false,
    }),

    // new FileIncludeWebpackPlugin({
    //     source: "./html",
    // }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
    new MiniCssExtractPlugin({
      filename: filename("css", "min"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader",
        }),
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          { loader: "css-loader", options: { importLoaders: 1 } },

          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
      },
    ],
  },
};
