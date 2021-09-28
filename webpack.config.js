const path = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pathsNames = {
  src: 'src',
  dist: 'dist',
  assets: 'assets',
  static: 'static',
};

const paths = {
  src: path.join(__dirname, pathsNames.src),
  dist: path.join(__dirname, pathsNames.dist),
  assets: path.join(__dirname, pathsNames.src, pathsNames.assets),
  static: path.join(__dirname, pathsNames.src, pathsNames.static),
};

const createBaseConfig = (configPaths, meta) => ({
  entry: {
    app: `${configPaths.src}`,
  },
  output: {
    filename: `[name].js`,
    // filename: `[name].[contenthash].min.js`,
    path: paths.dist,
    publicPath: '/', // relative to dist
    // publicPath: './' // absolute to dist
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { esmodules: true },
                  bugfixes: true,
                  shippedProposals: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-import', 'postcss-csso'],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      // examples for '~':
      //
      //   import { component } from '~/app/component';
      //   import style from '~/styles/style.scss';
      //   import '~/index.scss';
      //
      '~': `${configPaths.src}`,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      // filename: '[name].[contenthash].min.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${configPaths.assets}`,
          to: `${configPaths.assets.split(path.sep).slice(-1)[0]}`,
          noErrorOnMissing: true,
        },
        {
          from: `${configPaths.static}`,
          to: '',
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: `${configPaths.src}/index.html`,
      filename: `index.html`,
      templateParameters: {
        version: meta.version,
        license: meta.license,
      },
    }),
  ],
});

const createWatchConfig = (configPaths, meta) =>
  merge(createBaseConfig(configPaths, meta), {
    name: 'watch',
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      port: 1337,
      liveReload: true,
      watchFiles: [`${configPaths.src}/**/*`],
      static: {
        publicPath: '/',
        directory: `${configPaths.dist}`,
      },
      client: {
        overlay: {
          warnings: true,
          errors: true,
        },
      },
    },
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
      }),
    ],
  });

const createBuildConfig = (configPaths, meta) =>
  merge(createBaseConfig(configPaths, meta), {
    name: 'build',
    mode: 'production',
    plugins: [],
  });

module.exports = [
  createWatchConfig(paths, require('./package.json')),
  createBuildConfig(paths, require('./package.json')),
];
