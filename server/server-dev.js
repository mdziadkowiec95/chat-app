import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.js';
import { initApp } from './app';

const app = express();

// Configure serving files for development.
// webpack-dev-middleware will serve the files compiled by Webpack
app.use(
  webpackMiddleware(webpack(webpackConfig(null, { mode: 'development' })))
);

initApp(app);
