import { Application } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth.midd';
import validator from '../validators/validator';
export class UserRouter {
  private _us: UserController;

  constructor(app: Application, private prefix: string) {
    const authMiddleware: AuthMiddleware = new AuthMiddleware();
    this._us = new UserController();

    app.route(this.prefix + '/signup').post(validator('signup'), this._us.signup);

    app.route(this.prefix + '/login').post(validator('login'), this._us.login);

    app.route(this.prefix + '/').get(authMiddleware.protectRoute, this._us.getUsers);

    //logic delete
    app
      .route(this.prefix + '/disable/:id')
      .delete(authMiddleware.protectRoute, this._us.disableUser);

    app
      .route(this.prefix + '/:id')
      .put(validator('updateUser'), authMiddleware.protectRoute, this._us.updateUser);
  }
}
