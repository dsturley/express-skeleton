const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'public'), // store the bundled output in dist/bundle.js
    filename: 'bundle.js'                  // specifying file name for our compiled assets
  },
  resolve: {
    // required for enzyme to work properly
    alias: {
      sinon: 'sinon/pkg/sinon'
    }
  },
  module: {
    // don't run babel-loader through the sinon module
    noParse: [
      /node_modules\/sinon\//
    ],
    preLoaders: [
      {
        test: /\.js$/,
        loaders: ['eslint-loader'],
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window'
  }
};
