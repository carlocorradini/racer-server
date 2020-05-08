// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from 'express';
import { UnauthorizedError } from 'express-jwt';
import multer from 'multer';
import logger from '@app/logger';
import { EnvUtil } from '@app/util';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import { EmptyFileError } from '@app/common/error';

export default class ErrorMiddleware {
  // eslint-disable-next-line no-unused-vars
  public static handle(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof UnauthorizedError) {
      logger.warn(`Authentication with JWT failed due to ${err.message}`);
      ResponseHelper.send(res, HttpStatusCode.UNAUTHORIZED);
    } else if (err instanceof SyntaxError) {
      logger.warn(`Malformed JSON due to ${err.message}`);
      ResponseHelper.send(res, HttpStatusCode.BAD_REQUEST, [err.message]);
    } else if (err instanceof multer.MulterError) {
      logger.warn(`File uploading error due to ${err.message}`);
      switch (err.code) {
        case 'LIMIT_PART_COUNT':
        case 'LIMIT_FILE_SIZE':
        case 'LIMIT_FILE_COUNT':
        case 'LIMIT_FIELD_KEY':
        case 'LIMIT_FIELD_VALUE':
        case 'LIMIT_FIELD_COUNT':
        case 'LIMIT_UNEXPECTED_FILE': {
          ResponseHelper.send(res, HttpStatusCode.BAD_REQUEST, err);
          break;
        }
        default: {
          ResponseHelper.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR);
          break;
        }
      }
    } else if (err instanceof EmptyFileError) {
      logger.warn(`File uploading error due to ${err.message}`);
      ResponseHelper.send(res, HttpStatusCode.BAD_REQUEST, err);
    } else {
      logger.error(`Internal Server error due to ${err.message}`);
      ResponseHelper.send(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        EnvUtil.isDevelopment() ? err.stack : undefined
      );
    }
  }
}
