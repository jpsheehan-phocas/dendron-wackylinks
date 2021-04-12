const path = require("path")

module.exports = {
  entry: {
    filename: "./src/index.ts",
  },
  target: "node",
  output: {
    filename: "bundle3.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "commonjs2"
    }
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  }
}