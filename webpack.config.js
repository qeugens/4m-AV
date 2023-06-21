const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: './index.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dev_build'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css?$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // {
      //   test: /\.html$/i,
      //   loader: 'html-loader'
      // },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      }
      // {
      //   test: /\.(ttf|otf|woff|woff2)$/i,
      //   loader: 'file-loader',
      //   options: {
      //     name: 'fonts/[name].[ext]'
      //   }
      // }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      title: 'who dat'
    })
    // new CopyPlugin({
    //   patterns: [{ from: 'src/fonts', to: 'fonts' }]
    // })
  ]
}
