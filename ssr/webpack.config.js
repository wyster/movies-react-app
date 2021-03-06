const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  externals: [nodeExternals({
    allowlist: [/\.(?!(?:jsx?)$).{1,5}$/i],
  })],
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
                  'targets': {
                    'node': '14'
                  }
                }
              ],
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /(\.(?!(?:jsx?)$).{1,5}$)/,
        use: ['ignore-loader'],
      }
    ],
  },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  }
}