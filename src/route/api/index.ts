import { Router } from 'express';
import status from './status';
import v1 from './v1';

const router = Router();

router.use('/status', status);
router.use('/v1', v1);

export default router;
