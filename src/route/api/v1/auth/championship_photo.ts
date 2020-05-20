import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { ValidatorMiddleware } from '@app/middleware';
import { ChampionshipPhotoController } from '@app/controller';

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
    })
  ),
  ChampionshipPhotoController.find
);

router.get(
  '/:championship',
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        toInt: true,
        errorMessage: 'Invalid Championship id',
      },
    })
  ),
  ChampionshipPhotoController.findByChampionshipId
);

router.get(
  '/:championship/:photo',
  ValidatorMiddleware.validateChain(
    checkSchema({
      championship: {
        in: ['params'],
        isInt: true,
        toInt: true,
        errorMessage: 'Invalid Championship id',
      },
      photo: {
        in: ['params'],
        isString: true,
        errorMessage: 'Invalid Photo id',
      },
    })
  ),
  ChampionshipPhotoController.findById
);

export default router;
