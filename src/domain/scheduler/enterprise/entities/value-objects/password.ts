import bcrypt from 'bcrypt';

export class Password {
  private readonly _value: string;

  constructor (value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static async create(plainText: string): Promise<Password> {
    const hash = await bcrypt.hash(plainText, 12);

    return new Password(hash);
  }

  static async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}