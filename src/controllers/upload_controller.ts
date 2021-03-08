import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catch.async';
import { AppError } from '../utils/app.error';
import { HandleRespose } from '../utils/responses';
import { isEmpty } from 'lodash';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { uploadFile } from '../utils/cloudinary';
import { User } from '../models/User';
import { Upload } from '../models/upload';

export class UploadController {
  private handle: HandleRespose;
  constructor() {
    this.handle = new HandleRespose();
  }

  public loadPicture = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const upload: Upload = new Upload();
      upload.path = req.file.path;
      upload.about = req.body['about'];
      upload.name = req.body['name'];

      const fileUrl = await uploadFile(req.file.path, 'uploads');
      upload.path = fileUrl;

      const user = await User.findOneOrFail({
        where: {
          email: res.locals['user'].email,
        },
      });

      upload.user = user;
      await Upload.save(upload);

      this.handle.responseNotData({ statusCode: 200, message: 'success' }, res);
    } catch (error) {
      next(new AppError(error['message'], 500));
    }
  });

  public getAllPictures = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

      const queryUploads = Upload.createQueryBuilder('upload').where('deleted=:deleted', {
        deleted: false,
      });

      const paginator = buildPaginator({
        entity: Upload,
        query: {
          limit: limit,
          order: order === 1 ? 'ASC' : 'DESC',
          afterCursor: nextPage,
          beforeCursor: previusPage,
        },
      });
      const data = await paginator.paginate(queryUploads);

      return res.json(data);
    } catch (e) {
      return next(new AppError(e['message'], 500));
    }
  });
}
