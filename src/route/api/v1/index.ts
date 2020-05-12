import { Router } from 'express';
import jwt from 'express-jwt';
import config from '@app/config';
import auth from './auth';
import car from './car';
// eslint-disable-next-line camelcase
import car_manufacturer from './car_manufacturer';
import circuit from './circuit';

const router = Router();

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

router.use('/car', car);

router.use('/car_manufacturer', car_manufacturer);

router.use('/circuit', circuit);

export default router;
