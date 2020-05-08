// eslint-disable-next-line no-unused-vars
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/privacy', (_req: Request, res: Response) => {
  res.render('legal/privacy', {
    title: 'Privacy Policy',
  });
});

router.get('/terms', (_req: Request, res: Response) => {
  res.render('legal/terms', {
    title: 'Terms of Service',
  });
});

router.get('/eula', (_req: Request, res: Response) => {
  res.render('legal/eula', {
    title: 'EULA',
  });
});

export default router;
