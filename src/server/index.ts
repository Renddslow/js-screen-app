import dotenv from 'dotenv';
import polka from 'polka';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

import build from './build';
import { Response } from './utils/jsonApiTypes';

const PORT = process.env.PORT || 8080;

const json = (req, res, next) => {
  res.json = (value: Response, status: number = 200) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = status;
    return res.end(JSON.stringify(value));
  };
  next();
};

polka()
  .use(bodyParser.json(), cors(), json)
  .post('/surveys', build)
  .post('/surveys/:id/responses', (req, res) => {
    return res.json({
      hello: '',
    });
  })
  .get('/surveys/:id/responses/:responseId', (req, res) => {})
  .get('/token', (req, res) => {
    const { data } = req.body;
    if (data.type !== 'token') {
      //
    }
    // send email with token
  })
  .listen(PORT, () => console.log(`✅ Running JS Screening API on port ${PORT}`));
