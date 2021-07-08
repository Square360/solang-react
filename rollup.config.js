// rollup.config.js

// const babel = require("rollup-plugin-babel");
// const commonjs = require("rollup-plugin-commonjs");
// const resolve = require("rollup-plugin-node-resolve");

export default {
  dest: "dist/main.js",
  entry: "src/lib.js",
  format: "cjs"
}
