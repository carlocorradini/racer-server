import { Router } from 'express';
import { checkSchema } from 'express-validator';
import UserVerification from '@app/db/entity/UserVerification';
import { ValidatorMiddleware } from '@app/middleware';
import { UserVerificationController } from '@app/controller';

const router = Router();

router.post(
  '',
  ValidatorMiddleware.validateClass(UserVerification),
  UserVerificationController.verify
);
router.post(
  '/:id/resend',
  ValidatorMiddleware.validateChain(
    checkSchema({
      id: {
        in: ['params'],
        isUUID: true,
        errorMessage: 'Invalid User id',
      },
    })
  ),
  UserVerificationController.resend
);

export default router;
