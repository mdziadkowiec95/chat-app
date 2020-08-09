import express from 'express';
import path from 'path';
import { initApp } from './app';

const app = express();

// Configure serving files for production
app.use(express.static(path.join(__dirname, '../client')));

initApp(app);
