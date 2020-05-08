// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from 'express';
import { ResponseHelper, HttpStatusCode } from '@app/helper';

export default class NotFoundMiddleware {
  // eslint-disable-next-line no-unused-vars
  public static handle(_req: Request, res: Response, _next: NextFunction) {
    ResponseHelper.send(res, HttpStatusCode.NOT_FOUND);
  }
}
