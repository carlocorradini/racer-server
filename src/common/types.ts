// eslint-disable-next-line no-unused-vars
import { UserRole } from '@app/db/entity/User';

export namespace UTIL {
  export type ValueOf<T> = T[keyof T];
}

export namespace JWT {
  export interface Payload {
    id: string;
    role: UserRole;
  }
}
