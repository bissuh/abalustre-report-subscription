const path = require("path");
const webpack = require("webpack");
var copyWebpackPlugin = require("copy-webpack-plugin");

const bundleOutputDir = "./dist";

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);

  return [
    {
      entry: "./src/index.ts",
      output: { filename: "widget.js", path: path.resolve(bundleOutputDir) },
      devServer: { contentBase: bundleOutputDir },
      mode: isDevBuild ? "development" : "production",
      module: {
        rules: [
          {
            enforce: "pre",
            test: /\.(ts|tsx)$/,
            exclude: /node_modules|serviceWorker/,
            loader: "tslint-loader",
          },
          {
            test: /\.(js|ts|tsx|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets: { browsers: ["IE 11, last 2 versions"] },
                      useBuiltIns: "usage",
                    },
                  ],
                  ["@babel/typescript", { jsxPragma: "h" }],
                ],
                plugins: [
                  "@babel/proposal-class-properties",
                  "@babel/proposal-object-rest-spread",
                  [
                    "@babel/plugin-transform-react-jsx",
                    { pragma: "h", pragmaFrag: "Fragment" },
                  ],
                ],
              },
            },
          },
          { test: /\.html$/i, use: "html-loader" },
          {
            test: /\.css$/i,
            use: [
              {
                loader: "style-loader",
                options: { injectType: "singletonStyleTag" },
              },
              {
                loader: "css-loader",
                options: {
                  modules: { localIdentName: "[name]-[local]-[hash:base64:5]" },
                  sourceMap: isDevBuild,
                },
              },
            ],
          },
        ],
      },
      optimization: { minimize: !isDevBuild },
      plugins: isDevBuild
        ? [
            new webpack.SourceMapDevToolPlugin(),
            new copyWebpackPlugin({ patterns: [{ from: "dev/" }] }),
          ]
        : [],
      resolve: {
        extensions: ["*", ".js", ".ts", ".tsx"],
      },
    },
  ];
};
