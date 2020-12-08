const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'node',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react'
    })
  ],
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, '..', 'bin'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  }
}