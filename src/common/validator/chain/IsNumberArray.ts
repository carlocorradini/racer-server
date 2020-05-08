// eslint-disable-next-line no-unused-vars
import { CustomValidator } from 'express-validator';

const IsNumberArray: CustomValidator = (input) => {
  return typeof input === 'string' && /^\d+(,\d+)*$/.test(input);
};

export default IsNumberArray;
