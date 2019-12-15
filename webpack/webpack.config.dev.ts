import path from 'path';
import * as webpack from 'webpack';
import webpackMerge from 'webpack-merge';

// just for injection of typings
import 'webpack-dev-server';

/**
 * Лоадеры стилей
 */
import styleLoaders from './style-loaders';

/**
 * Общая часть конфига
 */
import common from './webpack.config.common';

const srcPath = path.resolve(__dirname, '../src');
const distPath = path.resolve(__dirname, '../dist');
const entry = path.join(srcPath, 'index.tsx');

export default webpackMerge(common, {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    entry
  ],
  output: {
    filename: 'bundle.js',
    path: distPath,
    publicPath: '/'
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: [
          'react-hot-loader/webpack',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            },
          }
        ]
      },
      ...styleLoaders(false),
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  devServer: {
    publicPath: '/',
    port: 3000,
    hot: true,
    open: true,
    contentBase: distPath,
    overlay: {
      errors: true,
    },
    https: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
  },
});
