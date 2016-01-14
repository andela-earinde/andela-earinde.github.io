var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app/js/app.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  }
}