const path = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const package = require('./package.json');

const paths = {
  src: path.join(__dirname, `src`),
  dist: path.join(__dirname, `dist`),
  assets: `assets`,
};

const baseConfig = {
  externals: {
    paths: paths,
  },
  entry: {
    app: paths.src,
  },
  output: {
    filename: `[name].min.js`,
    // filename: `[name].[contenthash].min.js`,
    path: paths.dist,
    publicPath: '/', // relative to dist
    // publicPath: './' // absolute to dist
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
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
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
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
                plugins: ['postcss-csso'],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
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
                plugins: ['postcss-csso'],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      // examples for '~':
      //
      //   import { component } from '~/app/component';
      //   import style from '~/styles/style.scss';
      //   import '~/index.scss';
      //
      '~': `${paths.src}`,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      // filename: '[name].[contenthash].min.css',
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${paths.src}/${paths.assets}/images`,
          to: `${paths.assets}/images`,
        },

        {
          from: `${paths.src}/static`,
          to: '',
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: `${paths.src}/index.html`,
      filename: `./index.html`,
      templateParameters: {
        version: package.version,
        license: package.license,
      },
    }),
  ],
};

const serveConfig = merge(baseConfig, {
  name: 'serve',
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    publicPath: '/',
    contentBase: baseConfig.externals.paths.dist,
    port: 1337,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
});

const buildConfig = merge(baseConfig, {
  name: 'build',
  mode: 'production',
  plugins: [],
});

module.exports = [serveConfig, buildConfig];
