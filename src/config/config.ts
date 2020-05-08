import envalid, { str, port, bool, num, url } from 'envalid';
import logger from '@app/logger';

export interface Configuration {
  NODE: {
    ENV: string;
    PORT: number;
  };
  DATABASE: {
    TYPE: string;
    URL: string;
    SSL: boolean;
    SYNCHRONIZE: boolean;
    LOGGING: boolean;
    ENTITIES: string;
    MIGRATIONS: string;
    SUBSCRIBERS: string;
  };
  SERVICE: {
    EMAIL: {
      HOST: string;
      PORT: number;
      SECURE: boolean;
      USERNAME: string;
      PASSWORD: string;
    };
    IMAGE: {
      CLOUD: string;
      KEY: string;
      SECRET: string;
    };
  };
  SECURITY: {
    OTP: {
      EMAIL: {
        DIGITS: number;
      };
      PHONE: {
        DIGITS: number;
      };
    };
    TOKEN: {
      PASSWORD: {
        LENGTH: number;
        EXPIRES_IN: number;
      };
    };
    BCRYPT: {
      SALT_ROUNS: number;
    };
    JWT: {
      SECRET: string;
      EXPIRES_IN: string;
    };
  };
}

const cleanConfig = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({ default: 'production', choices: ['production', 'development'] }),
    PORT: port({ devDefault: 8080 }),
    DATABASE_URL: url(),
    DATABASE_SSL: bool({ default: true, devDefault: false }),
    DATABASE_SYNCHRONIZE: bool({ default: false, devDefault: true }),
    DATABASE_LOGGING: bool({ default: false }),
    SERVICE_EMAIL_HOST: str(),
    SERVICE_EMAIL_PORT: port(),
    SERVICE_EMAIL_SECURE: bool({ default: true, devDefault: false }),
    SERVICE_EMAIL_USERNAME: str(),
    SERVICE_EMAIL_PASSWORD: str(),
    SERVICE_IMAGE_CLOUD: str(),
    SERVICE_IMAGE_KEY: str(),
    SERVICE_IMAGE_SECRET: str(),
    SECURITY_BCRYPT_SALT_ROUNDS: num({
      default: 12,
      choices: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32],
    }),
    SECURITY_JWT_SECRET: str(),
    SECURITY_JWT_EXPIRES_IN: str({
      default: '32d',
      choices: ['1d', '2d', '4d', '8d', '16d', '32d'],
    }),
  },
  {
    strict: true,
  }
);

logger.debug('Environment variables loaded');

const config: Configuration = {
  NODE: {
    ENV: cleanConfig.NODE_ENV,
    PORT: cleanConfig.PORT,
  },
  DATABASE: {
    TYPE: 'postgres',
    URL: cleanConfig.DATABASE_URL,
    SSL: cleanConfig.DATABASE_SSL,
    SYNCHRONIZE: cleanConfig.DATABASE_SYNCHRONIZE,
    LOGGING: cleanConfig.DATABASE_LOGGING,
    ENTITIES: `./db/entity/**/*.${cleanConfig.NODE_ENV === 'production' ? 'js' : 'ts'}`,
    MIGRATIONS: `./db/migration/**/*.${cleanConfig.NODE_ENV === 'production' ? 'js' : 'ts'}`,
    SUBSCRIBERS: `/./db/subscriber/**/*.${cleanConfig.NODE_ENV === 'production' ? 'js' : 'ts'}`,
  },
  SERVICE: {
    EMAIL: {
      HOST: cleanConfig.SERVICE_EMAIL_HOST,
      PORT: cleanConfig.SERVICE_EMAIL_PORT,
      SECURE: cleanConfig.SERVICE_EMAIL_SECURE,
      USERNAME: cleanConfig.SERVICE_EMAIL_USERNAME,
      PASSWORD: cleanConfig.SERVICE_EMAIL_PASSWORD,
    },
    IMAGE: {
      CLOUD: cleanConfig.SERVICE_IMAGE_CLOUD,
      KEY: cleanConfig.SERVICE_IMAGE_KEY,
      SECRET: cleanConfig.SERVICE_IMAGE_SECRET,
    },
  },
  SECURITY: {
    OTP: {
      EMAIL: { DIGITS: 5 },
      PHONE: { DIGITS: 5 },
    },
    TOKEN: {
      PASSWORD: { LENGTH: 32, EXPIRES_IN: 30 },
    },
    BCRYPT: {
      SALT_ROUNS: cleanConfig.SECURITY_BCRYPT_SALT_ROUNDS,
    },
    JWT: {
      SECRET: cleanConfig.SECURITY_JWT_SECRET,
      EXPIRES_IN: cleanConfig.SECURITY_JWT_EXPIRES_IN,
    },
  },
};

logger.info('Configuration object constructed');

export default config;
