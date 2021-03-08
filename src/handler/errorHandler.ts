import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import { AppError } from '../utils/app.error';
import { logger } from '../utils/logger';

export function unCoughtErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log({ err });

  winston.error(JSON.stringify(err));
  res.json({ errors: err });
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  const env = process.env.NODE_ENV || 'dev';

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (error.message.startsWith('Does exist')) {
    (err.message = "Doesn't exist such route"), (err.statusCode = 404);
  }
  if (error.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again!';
    error.statusCode = 401;
  }
  if (error.name === 'TokenExpiredError') {
    error.message = 'Your token has expired! Please log in again';
    error.statusCode = 401;
  }
  if (error.message.startsWith('invalid input syntax for type integer')) {
    err.message = 'debes enviar un entero';
  }
  logger.error(err.message);

  if (env === 'dev' || env === 'development')
    res.status(err.statusCode).json({
      stack: err.stack,
      detail: err.message,
      name: err.name,
      operational: err.isOperational,
      status: err.status,
    });
  if (env === 'prod' || env === 'production')
    res.status(err.statusCode).json({ detail: err.message, status: err.status });
}
