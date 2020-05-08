import path from 'path';
// eslint-disable-next-line no-unused-vars
import multer from 'multer';
import convert from 'convert-units';

export default class FileMiddleware {
  public static readonly memoryLoader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: convert(2).from('Mb').to('b'),
    },
  });

  public static readonly diskLoader = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '../tmp/upload'));
      },
    }),
    limits: {
      fileSize: convert(64).from('Mb').to('b'),
    },
  });
}
