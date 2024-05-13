import { HttpException, HttpStatus } from '@nestjs/common';
import { ENV } from '../../src/constants/appConstants.json';

export default () => {
  let envConfig = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    envConfig = require(
      `./config.${process.env.NODE_ENV || ENV.DEVELOPMENT}`,
    ).default;
  } catch (e) {
    throw new HttpException(e, HttpStatus.BAD_REQUEST);
  }
  return envConfig;
};
