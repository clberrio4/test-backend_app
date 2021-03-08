import { Application } from 'express';
import { UploadController } from '../controllers/upload_controller';
import { AuthMiddleware } from '../middlewares/auth.midd';
import multer from '../utils/multer';
export class UploadRouter {
  private _sv: UploadController;

  constructor(app: Application, private prefix: string) {
    const authMiddleware: AuthMiddleware = new AuthMiddleware();
    this._sv = new UploadController();

    app
      .route(this.prefix + '/photo')
      .post(authMiddleware.protectRoute, multer.single('picture'), this._sv.loadPicture);
    app.route(this.prefix).get(authMiddleware.protectRoute, this._sv.getAllPictures);
  }
}
