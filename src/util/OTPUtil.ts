export default class OTPUtil {
  public static readonly DIGITS = '0123456789';

  public static readonly ALPHABET: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  public static digits(length: number): Promise<string> {
    let otp = '';

    for (let i = 0; i < length; i += 1) {
      otp += this.DIGITS.charAt(Math.floor(Math.random() * this.DIGITS.length));
    }

    return Promise.resolve(otp);
  }

  public static alphanumerical(length: number): Promise<string> {
    let otp = '';

    for (let i = 0; i < length; i += 1) {
      otp += this.ALPHABET.charAt(Math.floor(Math.random() * this.ALPHABET.length));
    }

    return Promise.resolve(otp);
  }
}
