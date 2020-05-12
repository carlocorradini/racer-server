import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { ValidatorMiddleware } from '@app/middleware';
import { CarManufacturerController } from '@app/controller';

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
    })
  ),
  CarManufacturerController.find
);

router.get(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Car Manifacturer id',
      },
    })
  ),
  CarManufacturerController.findById
);

export default router;
