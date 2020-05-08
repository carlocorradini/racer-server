// eslint-disable-next-line no-unused-vars
import { Response, Request, NextFunction } from 'express';
// eslint-disable-next-line no-unused-vars
import { ValidationChain, validationResult } from 'express-validator';
// eslint-disable-next-line no-unused-vars
import { transformAndValidate, ClassType } from 'class-transformer-validator';
import logger from '@app/logger';
import { ResponseHelper, HttpStatusCode } from '@app/helper';
import { EmptyFileError } from '@app/common/error';

export default class ValidatorMiddleware {
  public static validateChain(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req);

      if (errors.isEmpty()) next();
      else {
        logger.warn(`Validation chain failed due to ${JSON.stringify(errors.array())}`);
        ResponseHelper.send(res, HttpStatusCode.UNPROCESSABLE_ENTITY, errors.array());
      }
    };
  }

  public static validateClass<T extends object>(
    classType: ClassType<T>,
    validationGroup: string | string[] = []
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      transformAndValidate(classType, req.body, {
        validator: {
          groups: Array.isArray(validationGroup) ? validationGroup : [validationGroup],
          forbidUnknownValues: true,
          validationError: {
            target: false,
            value: true,
          },
        },
      })
        .then((_class) => this.addClassToLocals(req, _class))
        .then(() => {
          next();
        })
        .catch((ex) => {
          logger.warn(`Validation failed for class ${classType.name} due to ${JSON.stringify(ex)}`);
          ResponseHelper.send(res, HttpStatusCode.UNPROCESSABLE_ENTITY, ex);
        });
    };
  }

  public static validateFileSingle(fieldName: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (req.file) next();
      else next(new EmptyFileError(`No file found in field named ${fieldName}`, fieldName));
    };
  }

  private static addClassToLocals<T extends object>(req: Request, _class: T): Promise<void> {
    req.app.locals[_class.constructor.name] = _class;
    return Promise.resolve();
  }
}
