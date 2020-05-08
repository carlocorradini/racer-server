// eslint-disable-next-line no-unused-vars
import { types } from '@app/common';

declare global {
  namespace Express {
    export interface Request {
      user?: types.JWT.Payload;
    }
  }
}
