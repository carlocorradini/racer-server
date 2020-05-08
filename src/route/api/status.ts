// eslint-disable-next-line no-unused-vars
import { Router, Request, Response } from 'express';
import { HttpStatusCode } from '@app/helper';

const router = Router();

const status = (_req: Request, res: Response) => {
  res.status(HttpStatusCode.OK.code).end();
};

router.get('/', status);
router.head('/', status);

export default router;
