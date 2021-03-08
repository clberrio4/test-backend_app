import multer from 'multer';
import path from 'path';
import { includes, split } from 'lodash';
import { v4 } from 'uuid';
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!checkImg(ext)) {
      cb(new Error(`invalid picture format [png|jpg|gif]`), '');
    }
    const file_name = v4();
    cb(null, file_name + ext);
  },
});
export default multer({ storage, limits: { fileSize: 1920 * 1080 } });

const checkImg = (ext: string): boolean => {
  const extPath = split(ext, '.')[1];
  if (includes(['png', 'jpg', 'gif'], extPath)) {
    return true;
  }
  return false;
};
