import { Router } from 'express';
import user from './user';
// eslint-disable-next-line camelcase
import user_championship from './user_championship';
import car from './car';
// eslint-disable-next-line camelcase
import car_manifacturer from './car_manifacturer';
import circuit from './circuit';
import team from './team';
import championship from './championship';
// eslint-disable-next-line camelcase
import championship_circuit from './championship_circuit';

const router = Router();

router.use('/user', user);

router.use('/user_championship', user_championship);

router.use('/car', car);

router.use('/car_manifacturer', car_manifacturer);

router.use('/circuit', circuit);

router.use('/team', team);

router.use('/championship', championship);

router.use('/championship_circuit', championship_circuit);

export default router;
