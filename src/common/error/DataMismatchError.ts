export default class DataMismatchError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
