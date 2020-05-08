import { Router } from 'express';
import { checkSchema } from 'express-validator';
import User, { UserValidationGroup, UserGender, UserRole } from '@app/db/entity/User';
import UserPasswordReset from '@app/db/entity/UserPasswordReset';
import { UserController } from '@app/controller';
import { ValidatorMiddleware, FileMiddleware } from '@app/middleware';

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
        isUUID: true,
        optional: true,
      },
      username: {
        in: ['query'],
        isString: true,
        optional: true,
      },
      role: {
        in: ['query'],
        isIn: { options: [Object.values(UserRole)] },
        optional: true,
      },
      name: {
        in: ['query'],
        isString: true,
        optional: true,
      },
      surname: {
        in: ['query'],
        isString: true,
        optional: true,
      },
      gender: {
        in: ['query'],
        isIn: { options: [Object.values(UserGender)] },
        optional: true,
      },
      date_of_birth: {
        in: ['query'],
        isISO8601: true,
        optional: true,
      },
      created_at: {
        in: ['query'],
        isISO8601: true,
        optional: true,
      },
    })
  ),
  UserController.find
);
router.get('/me', UserController.me);
router.get(
  '/:id',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isUUID: true,
        errorMessage: 'Invalid User id',
      },
    })
  ),
  UserController.findById
);

router.post(
  '',
  ValidatorMiddleware.validateClass(User, UserValidationGroup.CREATION),
  UserController.create
);
router.post(
  '/sign_in',
  ValidatorMiddleware.validateClass(User, UserValidationGroup.SIGN_IN),
  UserController.signIn
);
router.post(
  '/password_reset/:email',
  ValidatorMiddleware.validateChain(
    checkSchema({
      email: {
        in: ['params'],
        isEmail: true,
        errorMessage: 'Invalid email',
      },
    })
  ),
  UserController.passwordResetRequest
);
router.post(
  '/password_reset',
  ValidatorMiddleware.validateClass(UserPasswordReset),
  UserController.passwordReset
);

router.patch(
  '',
  ValidatorMiddleware.validateClass(User, UserValidationGroup.UPDATE),
  UserController.update
);

router.patch(
  '/avatar',
  FileMiddleware.memoryLoader.single('image'),
  ValidatorMiddleware.validateFileSingle('image'),
  UserController.updateAvatar
);

router.delete('', UserController.delete);

export default router;
