const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: [nodeExternals()],
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
              [
                '@babel/preset-env',
                {
                  "targets": {
                    "node": "14"
                  }
                }
              ],
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  }
}