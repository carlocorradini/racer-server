// eslint-disable-next-line no-unused-vars
import { CustomValidator } from 'express-validator';

const IsStringArray: CustomValidator = (input) => {
  return typeof input === 'string' && /^\w+(,\w+)*$/.test(input);
};

export default IsStringArray;
