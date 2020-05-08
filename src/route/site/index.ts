// eslint-disable-next-line no-unused-vars
import { Router, Request, Response, NextFunction } from 'express';
import { getManager } from 'typeorm';
import moment from 'moment';
import config from '@app/config';
import UserPasswordReset from '@app/db/entity/UserPasswordReset';
// eslint-disable-next-line no-unused-vars
import User from '@app/db/entity/User';
import legal from './legal';

const router = Router();

router.use('/legal', legal);

router.get('/password_reset/:token', async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  let options: { user?: User; token?: string; used?: boolean } = {
    user: undefined,
    token: undefined,
    used: undefined,
  };

  try {
    const userPasswordReset = await getManager().findOne(UserPasswordReset, {
      where: { token },
      relations: ['user'],
    });

    if (
      userPasswordReset &&
      !userPasswordReset.used &&
      moment(new Date()).diff(userPasswordReset.updated_at, 'minutes') <=
        config.SECURITY.TOKEN.PASSWORD.EXPIRES_IN
    ) {
      options = {
        user: userPasswordReset.user,
        token: userPasswordReset.token,
        used: false,
      };
    } else if (userPasswordReset && userPasswordReset.used) {
      options = {
        user: userPasswordReset.user,
        used: true,
      };
    } else if (userPasswordReset) {
      options = {
        user: userPasswordReset.user,
      };
    }

    res.render('password_reset', { title: 'Password reset', ...options });
  } catch (ex) {
    next(ex);
  }
});

export default router;
