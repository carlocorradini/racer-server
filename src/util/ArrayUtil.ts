export default class ArrayUtil {
  public static contains(from: any[], elements: any[]): boolean {
    return elements.every((e) => from.includes(e));
  }
}
