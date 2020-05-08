import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { ValidatorMiddleware } from '@app/middleware';
import { AnimalPlaceController } from '@app/controller';
import { AnimalPlaceType } from '@app/db/entity/AnimalPlace';

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
      id: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      name: {
        in: ['query'],
        isString: true,
        optional: true,
      },
      type: {
        in: ['query'],
        isIn: { options: [Object.values(AnimalPlaceType)] },
        optional: true,
      },
      latitude: {
        in: ['query'],
        isFloat: true,
        toFloat: true,
        optional: true,
      },
      longitude: {
        in: ['query'],
        isFloat: true,
        toFloat: true,
        optional: true,
      },
      radius: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
    })
  ),
  AnimalPlaceController.find
);

router.get(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Animal Park id',
      },
    })
  ),
  AnimalPlaceController.findById
);

export default router;
