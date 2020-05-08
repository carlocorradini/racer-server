import { Router } from 'express';
import user from './user';
import car from './car';
// eslint-disable-next-line camelcase
import car_manifacturer from './car_manifacturer';
import circuit from './circuit';
import team from './team';

const router = Router();

router.use('/user', user);

router.use('/car', car);

router.use('/car_manifacturer', car_manifacturer);

router.use('/circuit', circuit);

router.use('/team', team);

export default router;
