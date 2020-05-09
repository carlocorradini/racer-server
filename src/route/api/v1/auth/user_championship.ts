// eslint-disable-next-line no-unused-vars
import { Router, Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';
import { ValidatorMiddleware, UserRoleMiddleware } from '@app/middleware';
import { UserChampionshipController } from '@app/controller';
import UserChampionship, { UserChampionshipValidationGroup } from '@app/db/entity/UserChampionship';
import { UserRole } from '@app/db/entity/User';

const router = Router();

const addChampionshipToBody = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (id !== undefined) req.body.championship = Number.parseInt(id, 10);
    next();
  };
};

router.get(
  '',
  ValidatorMiddleware.validateChain(
    checkSchema({
      limit: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      offset: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      sort: {
        in: ['query'],
        isString: true,
        optional: true,
      },
      sort_order: {
        in: ['query'],
        isString: true,
        isIn: {
          options: ['ASC, DESC'],
        },
        optional: true,
      },
      user: {
        in: ['query'],
        isUUID: true,
        optional: true,
      },
      championship: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      car: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      team: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      points: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      created_at: {
        in: ['query'],
        isISO8601: true,
        optional: true,
      },
    })
  ),
  UserChampionshipController.find
);

router.get(
  '/:championship/:user?',
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
      user: {
        in: ['params'],
        isUUID: true,
        errorMessage: 'Invalid User id',
        optional: true,
      },
    })
  ),
  UserChampionshipController.findById
);

router.post(
  '',
  ValidatorMiddleware.validateClass(UserChampionship, UserChampionshipValidationGroup.CREATION),
  UserChampionshipController.create
);

router.patch(
  '/:id',
  UserRoleMiddleware.allowOnlyWhenParams(UserRole.ADMIN, 'points'),
  addChampionshipToBody(),
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
    })
  ),
  ValidatorMiddleware.validateClass(UserChampionship, UserChampionshipValidationGroup.UPDATE),
  UserChampionshipController.update
);

router.delete(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
    })
  ),
  UserChampionshipController.delete
);

export default router;
