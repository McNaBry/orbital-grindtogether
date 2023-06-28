const { express, Router } = require('express');
const serverless = require('serverless-http');

const api = express();

const router = Router();
router.post('/hello', (req, res) => res.send('Hello World!'));
router.post('/hello2', (req, res) => res.send('Hello World 2!'));

api.use('/api/h', router);

if (process.env.NODE_ENV == "development") {
  api.listen(5000, () => console.log("Listening on " + 5000))
}

export const handler = serverless(api);