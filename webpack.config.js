const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

const clientConfig = {
  target: 'web',
  mode: 'development',
  entry: './client/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'bundle.[hash].js',
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            // options: {
            //   sourceMap: true,
            // },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  grid: 'autoplace',
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),
  ],
};

const serverConfig = (argv) => ({
  target: 'node',
  entry:
    argv.mode === 'production'
      ? './server/server-prod.js'
      : './server/server-dev.js',
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    filename: 'server.js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
});

module.exports = (env, argv) => {
  const configs = [clientConfig];

  // Use server config only for production build
  // For development there is 'babel-node' and 'weback-dev-middleware' used
  if (argv.mode === 'production') configs.push(serverConfig(argv));

  return configs;
};
