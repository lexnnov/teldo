var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {



  mode: 'production',
  entry: './start.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  externals: nodeModules,
  devtool: 'sourcemap',

}

//
//
// module.exports = {
//   entry: './start.js',
//   target: 'node',
//   output: {
//     filename: './bundle.js',
//     library: 'myApp'
//   },
//   externals: {
//     uws: "uws"
//   },
// };
