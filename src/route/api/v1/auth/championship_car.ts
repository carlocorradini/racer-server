import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { ValidatorMiddleware, UserRoleMiddleware } from '@app/middleware';
import { ChampionshipCarController } from '@app/controller';
import { UserRole } from '@app/db/entity/User';
import ChampionshipCar, { ChampionshipCarValidationGroup } from '@app/db/entity/ChampionshipCar';

const router = Router();

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
      championship: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      date: {
        in: ['query'],
        isISO8601: true,
        optional: true,
      },
    })
  ),
  ChampionshipCarController.find
);

router.get(
  '/:championship',
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
    })
  ),
  ChampionshipCarController.findByChampionshipId
);

router.get(
  '/:championship/:car',
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
      circuit: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Car id',
      },
    })
  ),
  ChampionshipCarController.findById
);

router.post(
  '',
  UserRoleMiddleware.allowOnly(UserRole.ADMIN),
  ValidatorMiddleware.validateClass(ChampionshipCar, ChampionshipCarValidationGroup.CREATION),
  ChampionshipCarController.create
);

router.patch(
  '/:championship/:car',
  UserRoleMiddleware.allowOnly(UserRole.ADMIN),
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
      circuit: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Car id',
      },
    })
  ),
  ValidatorMiddleware.validateClass(ChampionshipCar, ChampionshipCarValidationGroup.UPDATE),
  ChampionshipCarController.update
);

router.delete(
  '/:championship/:car',
  UserRoleMiddleware.allowOnly(UserRole.ADMIN),
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
      circuit: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Car id',
      },
    })
  ),
  ChampionshipCarController.delete
);

export default router;
