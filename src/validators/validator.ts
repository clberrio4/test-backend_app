import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';
import { validators } from './joi.models';
import { map } from 'lodash';

export default (schemaName: string) => {
  return (req: Request, _resp: Response, next: NextFunction) => {
    const schema = validators.find((x) => x.name === schemaName);
    if (!schema) {
      return next(new AppError(`no existe el validador con nombre ${schemaName}`, 500));
    }
    const { error } = schema.model.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (typeof error !== 'undefined') {
      return next(new AppError(map(error.details, (x) => x.message).toString(), 400));
    } else {
      next();
    }
  };
};
