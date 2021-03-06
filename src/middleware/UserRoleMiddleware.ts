// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from 'express';
// eslint-disable-next-line no-unused-vars
import { UserRole } from '@app/db/entity/User';
import logger from '@app/logger';
import { ResponseHelper, HttpStatusCode } from '@app/helper';

export default class UserRoleMiddleware {
  public static allowOnly(roles: UserRole | UserRole[]) {
    const roleArray: UserRole[] = Array.isArray(roles) ? roles : [roles];

    return async (req: Request, res: Response, next: NextFunction) => {
      if (
        req.user === undefined ||
        req.user.role === undefined ||
        !roleArray.includes(req.user.role)
      ) {
        logger.warn(
          `User ${req.user?.id} with role ${req.user?.role} has not been authorized for ${req.method} -> ${req.originalUrl}`
        );
        ResponseHelper.send(res, HttpStatusCode.UNAUTHORIZED);
      } else next();
    };
  }

  public static allowOnlyWhenParams(roles: UserRole | UserRole[], params: string | string[]) {
    const roleArray: UserRole[] = Array.isArray(roles) ? roles : [roles];
    const paramArray: string[] = Array.isArray(params) ? params : [params];

    return async (req: Request, res: Response, next: NextFunction) => {
      if (
        req.user === undefined ||
        req.user.role === undefined ||
        (paramArray.filter((param) => req.body[param] !== undefined).length !== 0 &&
          !roleArray.includes(req.user.role))
      ) {
        logger.warn(
          `User ${req.user?.id} with role ${req.user?.role} has not been authorized when params for ${req.method} -> ${req.originalUrl}`
        );
        ResponseHelper.send(res, HttpStatusCode.UNAUTHORIZED);
      } else next();
    };
  }
}
