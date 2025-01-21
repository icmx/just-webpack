import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const { SourceMapDevToolPlugin } = webpack;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NAMES = {
  src: 'src',
  dist: 'dist',
  assets: 'assets',
  static: 'static',
};

const PATHS = {
  src: join(__dirname, NAMES.src),
  dist: join(__dirname, NAMES.dist),
  assets: join(__dirname, NAMES.src, NAMES.assets),
  static: join(__dirname, NAMES.src, NAMES.static),
};

const createBaseConfig = ({ paths }) => ({
  entry: {
    app: `${paths.src}`,
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
        test: /\.js/,
        resolve: {
          fullySpecified: false,
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
      '~': `${paths.src}`,
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
          from: `${paths.assets}`,
          to: `${paths.assets.split(/\/|\\/).slice(-1)[0]}`,
          noErrorOnMissing: true,
        },
        {
          from: `${paths.static}`,
          to: '',
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: `${paths.src}/index.html`,
      filename: `index.html`,
    }),
  ],
});

const createWatchConfig = ({ paths, port }) =>
  merge(createBaseConfig({ paths }), {
    name: 'watch',
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      port,
      liveReload: true,
      watchFiles: [`${paths.src}/**/*`],
      static: {
        publicPath: '/',
        directory: `${paths.dist}`,
      },
      client: {
        overlay: {
          warnings: true,
          errors: true,
        },
      },
    },
    plugins: [
      new SourceMapDevToolPlugin({
        filename: '[file].map',
      }),
    ],
  });

const createBuildConfig = ({ paths }) =>
  merge(createBaseConfig({ paths }), {
    name: 'build',
    mode: 'production',
    plugins: [],
  });

export default [
  createWatchConfig({ paths: PATHS, port: 1337 }),
  createBuildConfig({ paths: PATHS }),
];
