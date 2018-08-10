const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./app.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        options: ["env", "react", "stage-3"]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "main.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 9999,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
