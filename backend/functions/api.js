import express, { Router } from 'express';
import serverless from 'serverless-http';

const api = express();

const router = Router();
router.post('/hello', (req, res) => res.send('Hello World!'));
router.post('/hello2', (req, res) => res.send('Hello World 2!'));

api.use('/api', router);

export const handler = serverless(api);