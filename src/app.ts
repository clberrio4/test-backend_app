import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Application } from 'express';
import { Database } from './configuration/Database';

import Server from './server';

const app: Application = express();

new Server(app);
const port: number = parseInt(typeof process.env.PORT === 'undefined' ? '8000' : process.env.PORT);

Database.connect();

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
