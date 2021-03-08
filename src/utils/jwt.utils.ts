import { sign, verify, decode } from 'jsonwebtoken';
export interface JwtData {
  email: string;
}
export class JwtUtils {
  private _jwtSecret: string;
  private _expiresIn: string;
  constructor() {
    this._jwtSecret =
      typeof process.env.JWT_SECRET === 'undefined'
        ? 'adfs"!#*SADSFD"!#""##5446'
        : process.env.JWT_SECRET;

    this._expiresIn =
      typeof process.env.EXPIRE_IN_JWT === 'undefined' ? '2 days' : process.env.EXPIRE_IN_JWT;
  }

  public getToken(data: JwtData): string {
    const token = sign(data, this._jwtSecret, { expiresIn: this._expiresIn });
    return token;
  }

  /**
   * decodeToken
   */
  public decodeToken(token: string): string | object {
    return verify(token, this._jwtSecret);
  }
  /**
   * decodeAfterExpired
   */
  public decodeAfterExpired(token: string) {
    return decode(token, { json: true });
  }
}
