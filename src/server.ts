import { Application } from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import * as winston from 'winston';
import * as path from 'path';
import { errorHandler, unCoughtErrorHandler } from './handler/errorHandler';
import Routes from './routes/main.router';
import cors from 'cors';
import hpp from 'hpp';
import compression from 'compression';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { UserRouter } from './routes/user_router';
import { AppError } from './utils/app.error';
export default class Server {
  public userRouter: UserRouter;

  constructor(app: Application) {
    //configs
    this.config(app);

    //router
    new Routes(app);

    app.use(errorHandler);

    app.use(unCoughtErrorHandler);

    app.all('*', (req, _res, next) => {
      return next(new AppError(`Doesn't exist ${req.originalUrl} on this server!`, 404));
    });
  }

  public config(app: Application): void {
    dotenv.config({ path: './.env' });

    app.use(cors({ origin: '*' }));

    app.use(bodyParser.urlencoded({ extended: true, limit: '20kb' }));

    app.use(bodyParser.json());

    app.use(
      hpp({
        whitelist: [
          'duration',
          'ratingsQuantity',
          'ratingsAverage',
          'maxGroupSize',
          'difficulty',
          'price',
        ],
        checkBody: true,
        checkQuery: true,
      })
    );

    //intentar comprimir el body de cada request
    app.use(compression());

    app.use(helmet());

    if (process.env.NODE_ENV === 'dev') {
      app.use(
        morgan('short', {
          stream: {
            write: (msm) => logger.info(msm.trim()),
          },
        })
      );
    }
  }
}

process.on('beforeExit', function (err) {
  winston.error(JSON.stringify(err));
  console.error(err);
});
