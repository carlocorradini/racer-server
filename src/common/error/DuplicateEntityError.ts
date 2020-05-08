export interface Duplicate {
  property: string;
  value: any;
}

export default class DuplicateError extends Error {
  public readonly errors: Duplicate[] | undefined;

  constructor(m: string, errors?: Duplicate[]) {
    super(m);
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
