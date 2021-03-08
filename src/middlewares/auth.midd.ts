import { NextFunction, Request, Response } from 'express';
import { isEmpty, split } from 'lodash';
import { User } from '../models/User';
import { AppError } from '../utils/app.error';
import { catchAsync } from '../utils/catch.async';
import { JwtUtils } from '../utils/jwt.utils';

export class AuthMiddleware {
  private jwt: JwtUtils;
  constructor() {
    this.jwt = new JwtUtils();
  }

  /**
   * protectRoute
   */
  public protectRoute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token: string = req.headers.authorization || '';

    if (!isEmpty(token) && token.startsWith('Bearer')) {
      token = split(token, ' ', 2)[1];
    }

    if (!token || typeof token === 'undefined') {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    const decoded: any = this.jwt.decodeToken(token);

    let user = await User.findOne({
      where: { email: decoded.email, deleted: false },
    });
    if (typeof user === 'undefined' || !user) {
      return next(new AppError('El usuario ha actualizado sus datos o ha sido eliminado ', 401));
    }

    res.locals['user'] = { email: user.email };
    next();
  });
}
