import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { UserFriendController } from '@app/controller';
import { ValidatorMiddleware } from '@app/middleware';
import UserFriend, { UserFriendValidationGroup, UserFriendType } from '@app/db/entity/UserFriend';

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
      friend: {
        in: ['query'],
        isUUID: true,
        optional: true,
      },
      type: {
        in: ['query'],
        isIn: { options: [Object.values(UserFriendType)] },
        optional: true,
      },
      created_at: {
        in: ['query'],
        isISO8601: true,
        optional: true,
      },
    })
  ),
  UserFriendController.find
);

router.get(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isUUID: true,
        errorMessage: 'Invalid User Friend id',
      },
    })
  ),
  UserFriendController.findById
);

router.post(
  '',
  ValidatorMiddleware.validateClass(UserFriend, UserFriendValidationGroup.CREATION),
  UserFriendController.create
);

router.patch(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isUUID: true,
        errorMessage: 'Invalid User Friend id',
      },
    })
  ),
  ValidatorMiddleware.validateClass(UserFriend, UserFriendValidationGroup.UPDATE),
  UserFriendController.update
);

router.delete(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isUUID: true,
        errorMessage: 'Invalid User Friend id',
      },
    })
  ),
  UserFriendController.delete
);

export default router;
