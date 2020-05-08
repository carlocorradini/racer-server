export default class ConfigurationError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
