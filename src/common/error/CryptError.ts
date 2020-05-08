export default class CryptError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
