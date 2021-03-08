import { Application } from 'express';
import { UploadRouter } from './upload_router';
import { UserRouter } from './user_router';
export default class Routes {
  constructor(app: Application) {
    const prefix: string = '/api/v' + process.env.API_VERSION;
    //Routes
    new UserRouter(app, prefix + '/user');
    new UploadRouter(app, prefix + '/upload');
  }
}
