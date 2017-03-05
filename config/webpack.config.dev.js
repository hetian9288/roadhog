const autoprefixer = require('autoprefixer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const webpack = require('webpack');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const paths = require('./paths');
const getEntry = require('../utils/getEntry');
const getConfig = require('../utils/getConfig');
const getCSSLoaders = require('../utils/getCSSLoaders');

const config = getConfig();
const publicPath = '/';
const cssLoaders = getCSSLoaders();

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: getEntry(),
  output: {
    path: paths.appBuild,
    filename: '[name].js',
    pathinfo: true,
    publicPath: publicPath,
  },
  resolve: {
    extensions: ['.js', '.coffee','.json', '.jsx', '.ts', 'tsx', ''],
  },
  resolveLoader: {
    root: paths.ownNodeModules,
    moduleTemplates: ['*-loader'],
  },
  module: {
    loaders: [
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.coffee$/,
          /\.(css|less)$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/[name].[hash:8].[ext]',
        },
      },
      { test: /\.coffee$/, loader: 'babel!coffee' },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
      },
      {
        test: /\.(css|less)$/,
        include: paths.appSrc,
        exclude: /style/,
        loader: `style!${cssLoaders.own}`,
      },
      {
        test: /\.(css|less)$/,
        include: [paths.appSrc + "/style", paths.appSrc + "/plugins"],
        loader: `style!${cssLoaders.nodeModules}`,
      },
      {
        test: /\.(css|less)$/,
        include: paths.appNodeModules,
        loader: `style!${cssLoaders.nodeModules}`,
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  babel: {
    babelrc: false,
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: [
      require.resolve('babel-plugin-add-module-exports'),
    ].concat(config.extraBabelPlugins || []),
    cacheDirectory: true,
  },
  postcss: function() {
    return [
      autoprefixer(config.autoprefixer || {
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ],
      }),
    ];
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
