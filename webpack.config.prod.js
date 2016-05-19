var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  entry: [
    './app/js/app.js'
  ],

  output: {
    path: './build',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' }
    ]
  },

  postcss: [ autoprefixer ],

  target: "atom",

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      },
      'global.Object.prototype': {},
      'global.GENTLY': false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}