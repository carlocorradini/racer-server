import { isUUID } from 'class-validator';

export default class StringUtil {
  public static readonly STRING_ARRAY_SEPARATOR = ',';

  public static toStringArray(str: string | undefined): string[] {
    if (typeof str !== 'string' || str === undefined) return [];

    return str.toString().split(this.STRING_ARRAY_SEPARATOR);
  }

  public static toNumberArray(str: string | undefined): number[] {
    if (typeof str !== 'string' || str === undefined) return [];

    return this.toStringArray(str)
      .map((n) => Number.parseInt(n, 10))
      .filter((n) => !Number.isNaN(n));
  }

  public static toUUIDArray(str: string | undefined): string[] {
    if (typeof str !== 'string' || str === undefined) return [];

    return this.toStringArray(str).filter((uuid) => isUUID(uuid));
  }
}
