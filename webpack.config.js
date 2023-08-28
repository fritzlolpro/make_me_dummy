const path = require("path");
module.exports = {
  name: "dummy_project",
  mode: "development",
  entry: path.join(__dirname, "generated", "index.js"),
  output: {
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js?x?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }], "@babel/preset-react"],
            },
          },
          // {
          //   loader: "swc-loader",
          //   options: {
          //     jsc: {
          //       parser: { syntax: "ecmascript", jsx: true },
          //     },
          //   },
          // },
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
