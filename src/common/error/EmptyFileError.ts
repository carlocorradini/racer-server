/* eslint-disable camelcase */

export default class EmptyFileError extends Error {
  public readonly file_name: string;

  constructor(m: string, file_name: string) {
    super();
    this.name = EmptyFileError.name;
    this.message = m;
    this.file_name = file_name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
