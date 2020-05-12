import { Router } from 'express';
import user from './user';
// eslint-disable-next-line camelcase
import user_championship from './user_championship';
import team from './team';
import championship from './championship';
// eslint-disable-next-line camelcase
import championship_circuit from './championship_circuit';
// eslint-disable-next-line camelcase
import championship_game_setting from './championship_game_setting';
// eslint-disable-next-line camelcase
import game_setting from './game_setting';

const router = Router();

router.use('/user', user);

router.use('/user_championship', user_championship);

router.use('/team', team);

router.use('/championship', championship);

router.use('/championship_circuit', championship_circuit);

router.use('/championship_game_setting', championship_game_setting);

router.use('/game_setting', game_setting);

export default router;
