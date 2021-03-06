const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { log } = require('../util/log');
const { resolveDir, resolveCwd, pcwd } = require('../util/path');
const project = require('../config/project.config');
const kitConfig = require(resolveCwd('react-kits.config')).config(project);

const devMode = project.globals.__DEV__;
let config = {
  context: pcwd,
  mode: devMode ? 'development' : 'production',
  stats: {
    hash: false,
    modules: false,
    entrypoints: false,
    colors: true,
    children: false
  },
  resolveLoader: {
    modules: [resolveDir('../../node_modules'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.woff(\?.*)?$/,
        loader:
          'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?.*)?$/,
        loader:
          'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2'
      },
      {
        test: /\.otf(\?.*)?$/,
        loader:
          'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype'
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader:
          'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]'
      },
      {
        test: /\.svg(\?.*)?$/,
        loader:
          'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: true
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [new webpack.DefinePlugin(project.globals)]
};

/**
 * Allow webpack overrides
 */
let custom = {};
if (kitConfig.baseWebpack) {
  const webpackConfig = kitConfig.baseWebpack(config);
  if (!webpackConfig) {
    log('`baseWebpack` field should return config.');
  } else {
    log('`baseWebpack` modify is applied.');
    custom = webpackConfig;
  }
}

module.exports = merge(config, custom);
