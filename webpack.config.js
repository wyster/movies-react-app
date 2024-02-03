const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env"
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
          'astroturf/loader'
        ]
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader"
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
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
    new MiniCssExtractPlugin()
  ]
};
