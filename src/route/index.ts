// eslint-disable-next-line no-unused-vars
import { Router, Request, Response } from 'express';
import api from './api';
import site from './site';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.redirect('/site');
});
router.use('/api', api);
router.use('/site', site);

export default router;
