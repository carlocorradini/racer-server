export default class StringUtil {
  public static readonly STRING_ARRAY_SEPARATOR = ',';

  public static toNumberArray(str: string | undefined): number[] {
    if (typeof str !== 'string' || str === undefined) return [];

    return str
      .toString()
      .split(this.STRING_ARRAY_SEPARATOR)
      .map((n) => Number.parseInt(n, 10))
      .filter((n) => !Number.isNaN(n));
  }
}
