// eslint-disable-next-line no-unused-vars
import { CustomValidator } from 'express-validator';
import { isUUID } from 'class-validator';

const IsUUIDArray: CustomValidator = (input) => {
  return typeof input === 'string' && input.split(',').every((uuid) => isUUID(uuid));
};

export default IsUUIDArray;
