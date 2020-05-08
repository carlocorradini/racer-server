import { Router } from 'express';
import { checkSchema } from 'express-validator';
import Puppy, { PuppyValidationGroup, PuppyGender } from '@app/db/entity/Puppy';
import { PuppyController } from '@app/controller';
import { ValidatorMiddleware, FileMiddleware } from '@app/middleware';
import { IsNumberArray } from '@app/common/validator/chain';

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
      gender: {
        in: ['query'],
        isIn: { options: [Object.values(PuppyGender)] },
        optional: true,
      },
      date_of_birth: {
        in: ['query'],
        isISO8601: true,
        optional: true,
      },
      weight: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true,
      },
      user: {
        in: ['query'],
        isUUID: true,
        optional: true,
      },
      specie: {
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
      breeds: {
        in: ['query'],
        isString: true,
        custom: {
          options: IsNumberArray,
        },
        optional: true,
      },
      personalities: {
        in: ['query'],
        isString: true,
        custom: {
          options: IsNumberArray,
        },
        optional: true,
      },
    })
  ),
  PuppyController.find
);

router.get(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Puppy id',
      },
    })
  ),
  PuppyController.findById
);

router.post(
  '',
  ValidatorMiddleware.validateClass(Puppy, PuppyValidationGroup.CREATION),
  PuppyController.create
);

router.patch(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Puppy id',
      },
    })
  ),
  ValidatorMiddleware.validateClass(Puppy, PuppyValidationGroup.UPDATE),
  PuppyController.update
);

router.patch(
  '/:id/avatar',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Puppy id',
      },
    })
  ),
  FileMiddleware.memoryLoader.single('image'),
  ValidatorMiddleware.validateFileSingle('image'),
  PuppyController.updateAvatar
);

router.delete(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isInt: true,
        errorMessage: 'Invalid Puppy id',
      },
    })
  ),
  PuppyController.delete
);

export default router;
