import { Router } from 'express';
import jwt from 'express-jwt';
import config from '@app/config';
// eslint-disable-next-line camelcase
import user_verification from './user_verification';
import auth from './auth';

const router = Router();

router.use('/user_verification', user_verification);

router.use(
  '/auth',
  jwt({
    secret: config.SECURITY.JWT.SECRET,
  }).unless({
    path: [
      { url: '/api/v1/auth/user', methods: ['POST'] },
      {
        url: '/api/v1/auth/user/sign_in',
        methods: ['POST'],
      },
      {
        url: /\/api\/v1\/auth\/user\/password_reset\/*/,
        methods: ['POST'],
      },
    ],
  }),
  auth
);

export default router;
