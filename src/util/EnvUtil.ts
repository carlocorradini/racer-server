import config from '@app/config';

export default class EnvUtil {
  public static isProduction(): boolean {
    return config.NODE.ENV === 'production';
  }

  public static isDevelopment(): boolean {
    return config.NODE.ENV === 'development';
  }
}
