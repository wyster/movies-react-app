const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

const transpileDependencies = [
  '@apollo'
]

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  //devtool: 'source-map',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve('src'),
        ],
        use: {
          loader: "babel-loader",
          options:{
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: 'usage',
                  "corejs": 3,
                  debug: true,
                }
              ],
              [
                "@babel/preset-react",
                {
                  "runtime": "automatic"
                }
              ]
            ],
          }
        },
      },
      {
        test: /\.(js)$/,
        include: [
          path.resolve('node_modules/apollo-link-rest'),
          path.resolve('node_modules/@sentry'),
          path.resolve('node_modules/yup'),
          path.resolve('node_modules/react'),
        ],
        use: {
          loader: "babel-loader",
          options:{
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: 'usage',
                  "corejs": 3,
                  debug: true,
                  modules: "cjs"
                }
              ],
              [
                "@babel/preset-react",
                {
                  "runtime": "automatic"
                }
              ]
            ],
          }
        },
      },
      {
        test: /\.(js|mjs)$/,
        include: [
          path.resolve('node_modules/@apollo'),
          path.resolve('node_modules/optimism'),
          path.resolve('node_modules/@wry'),
          path.resolve('node_modules/ts'),
        ],
        use: {
          loader: "babel-loader",
          options:{
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: 'usage',
                  "corejs": 3,
                  debug: true,
                }
              ]
            ]
          }
        },
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "build")
        }
      ],
    }),
  ]
};
