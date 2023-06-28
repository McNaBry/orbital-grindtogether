import express, { Router } from 'express';
import serverless from 'serverless-http';

const api = express();

// const router = Router();
// router.post('/hello', (req, res) => res.send('Hello World!'));

api.post('/hello', (req, res) => res.send('Hello World!'));

export const handler = serverless(api);