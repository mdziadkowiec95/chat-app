// const  webpack from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
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
        use: ['style-loader', 'css-loader'],
        test: /\.css$/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
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
  externals: [nodeExternals()],
  plugins: [
    new HtmlWebpackPlugin({
      // filename: './index.html',
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
