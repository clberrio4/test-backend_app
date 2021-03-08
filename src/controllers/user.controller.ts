import { NextFunction, Response, Request } from 'express';
import { isEmpty } from 'lodash';
import { catchAsync } from '../utils/catch.async';
import { JwtUtils } from '../utils/jwt.utils';
import { HandleRespose } from '../utils/responses';
import { AppError } from '../utils/app.error';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { User } from '../models/User';

export class UserController {
  private handle: HandleRespose;
  private jwt: JwtUtils;

  constructor() {
    this.jwt = new JwtUtils();

    this.handle = new HandleRespose();
  }

  public signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      let user = new User();
      const data: any = req.body;

      user.name = data.name;
      user.email = data.email;
      user.password = data.password;

      user.password = data.password;
      user.hashPassword();

      const userSaved: User = await User.save(user);

      const token: string = this.jwt.getToken({ email: userSaved.email });

      this.handle.responseNotData({ statusCode: 201, token: token, message: 'user created' }, res);
    } catch (error) {
      next(new AppError(error['message'], 500));
    }
    return;
  });

  public login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      let username: string = req.body.username || undefined;
      let email: string = req.body.email || undefined;
      let password: string = req.body.password || undefined;
      const user = await User.createQueryBuilder('a')
        .where('email=:email', { username, email })
        .getOne();

      if (!user || typeof user === 'undefined') {
        return next(new AppError('Incorrect email or password', 401));
      }

      const isValid = user.checkIfUnencryptedPasswordIsValid(password);

      if (!isValid) {
        return this.handle.responseNotData(
          { statusCode: 400, message: 'Credentials  are incorrect..!' },
          res
        );
      }
      const token: string = this.jwt.getToken({ email: user.email });
      return this.handle.responseNotData({ token: token, statusCode: 200 }, res);
    } catch (error) {
      next(new AppError(error['message'], 500));
    }
  });

  /**
   * getUsers
   */
  public getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      let nextPage: string = '';
      let previusPage: string = '';
      let order: number = 1;
      let limit: number = 10;

      if (!isEmpty(req.query.afterCursor)) {
        nextPage = String(req.query.afterCursor);
      }

      if (!isEmpty(req.query.beforeCursor)) {
        previusPage = String(req.query.beforeCursor);
      }

      if (!isEmpty(req.query.order)) {
        order = parseInt(String(req.query.beforeCursor));
      }

      if (!isEmpty(req.query.limit)) {
        limit = parseInt(String(req.query.limit));
      }

      const queryUser = User.createQueryBuilder('user').where('deleted=:deleted', {
        deleted: false,
      });

      const paginator = buildPaginator({
        entity: User,
        query: {
          limit: limit,
          order: order === 1 ? 'ASC' : 'DESC',
          afterCursor: nextPage,
          beforeCursor: previusPage,
        },
      });
      const data = await paginator.paginate(queryUser);

      return res.json(data);
    } catch (e) {
      return next(new AppError(e['message'], 500));
    }
  });

  public disableUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id: number = parseInt(req.params.id);

      const user = await User.findOne({ where: { id } });
      if (typeof user === 'undefined') {
        return next(new AppError("don't exists", 404));
      }
      user.deleted = !user.deleted;

      await User.save(user);

      this.handle.responseNotData({ statusCode: 200, message: 'success' }, res);
    } catch (error) {
      return next(new AppError(error['message'], 500));
    }
  });

  public updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id: number = parseInt(req.params.id);

      const user: User = req.body;

      const _user = await User.findOne({ where: { id } });

      if (typeof _user === 'undefined') {
        return next(new AppError("don't exists", 404));
      }

      const updt: User = Object.assign(_user, user);

      await User.save(updt);

      this.handle.responseNotData({ statusCode: 200, message: 'updated' }, res);
    } catch (error) {
      return next(new AppError(error['message'], 500));
    }
  });
}
