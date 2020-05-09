import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { ValidatorMiddleware, UserRoleMiddleware } from '@app/middleware';
import { ChampionshipCircuitController } from '@app/controller';
import ChampionshipCircuit, {
  ChampionshipCircuitValidationGroup,
} from '@app/db/entity/ChampionshipCircuit';
import { UserRole } from '@app/db/entity/User';

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
      circuit: {
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
  ChampionshipCircuitController.find
);

router.get(
  '/:championship/:circuit',
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
        errorMessage: 'Invalid Circuit id',
      },
    })
  ),
  ChampionshipCircuitController.findById
);

router.post(
  '',
  UserRoleMiddleware.allowOnly(UserRole.ADMIN),
  ValidatorMiddleware.validateClass(
    ChampionshipCircuit,
    ChampionshipCircuitValidationGroup.CREATION
  ),
  ChampionshipCircuitController.create
);

router.patch(
  '/:championship/:circuit',
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
        errorMessage: 'Invalid Circuit id',
      },
    })
  ),
  ValidatorMiddleware.validateClass(ChampionshipCircuit, ChampionshipCircuitValidationGroup.UPDATE),
  ChampionshipCircuitController.update
);

router.delete(
  '/:championship/:circuit',
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
        errorMessage: 'Invalid Circuit id',
      },
    })
  ),
  ChampionshipCircuitController.delete
);

export default router;
