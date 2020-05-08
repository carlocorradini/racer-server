import { Router } from 'express';
import user from './user';
// eslint-disable-next-line camelcase
import user_friend from './user_friend';
import puppy from './puppy';
// eslint-disable-next-line camelcase
import animal_personality from './animal_personality';
// eslint-disable-next-line camelcase
import animal_specie from './animal_specie';
// eslint-disable-next-line camelcase
import animal_breed from './animal_breed';
// eslint-disable-next-line camelcase
import animal_place from './animal_place';

const router = Router();

router.use('/user', user);

router.use('/user_friend', user_friend);

router.use('/puppy', puppy);

router.use('/animal_personality', animal_personality);

router.use('/animal_specie', animal_specie);

router.use('/animal_breed', animal_breed);

router.use('/animal_place', animal_place);

export default router;
