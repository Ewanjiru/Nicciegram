const path = require("path");

module.exports = {
  entry: ".src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /nodemodules/
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      },
      {
        test: /\.png$/,
        loader: "url-loader"
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist")
  }
};