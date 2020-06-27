import polka from 'polka';
import bodyParser from 'body-parser';
import cors from 'cors';

import build from './build';
import { Response } from './jsonApiTypes';

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
  .post('/survey', build)
  .listen(PORT, () => console.log(`✅ Running JS Screening API on port ${PORT}`));
