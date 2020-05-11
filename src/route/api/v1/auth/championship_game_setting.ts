import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { ValidatorMiddleware, UserRoleMiddleware } from '@app/middleware';
import { ChampionshipGameSettingController } from '@app/controller';
import { UserRole } from '@app/db/entity/User';
import ChampionshipGameSetting, {
  ChampionshipGameSettingValidationGroup,
} from '@app/db/entity/ChampionshipGameSetting';

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
      game_setting: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
    })
  ),
  ChampionshipGameSettingController.find
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
  ChampionshipGameSettingController.findByChampionshipId
);

router.get(
  '/:championship/:game_setting',
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
      game_setting: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Game Setting id',
      },
    })
  ),
  ChampionshipGameSettingController.findById
);

router.post(
  '',
  UserRoleMiddleware.allowOnly(UserRole.ADMIN),
  ValidatorMiddleware.validateClass(
    ChampionshipGameSetting,
    ChampionshipGameSettingValidationGroup.CREATION
  ),
  ChampionshipGameSettingController.create
);

router.patch(
  '/:championship/:game_setting',
  UserRoleMiddleware.allowOnly(UserRole.ADMIN),
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
      game_setting: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Game Setting id',
      },
    })
  ),
  ValidatorMiddleware.validateClass(
    ChampionshipGameSetting,
    ChampionshipGameSettingValidationGroup.UPDATE
  ),
  ChampionshipGameSettingController.update
);

router.delete(
  '/:championship/:game_setting',
  UserRoleMiddleware.allowOnly(UserRole.ADMIN),
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Championship id',
      },
      game_setting: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Game Setting id',
      },
    })
  ),
  ChampionshipGameSettingController.delete
);

export default router;
