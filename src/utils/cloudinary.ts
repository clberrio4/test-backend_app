import { v2 } from 'cloudinary';

v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadFile = (filePath: string, folder: string): Promise<string> => {
  return new Promise((res, rej) => {
    v2.uploader.upload(filePath, { public_id: filePath, tags: folder }, (err, img) => {
      if (err) return rej(err.message);
      return res(img?.url !== undefined ? img.url : '');
    });
  });
};
