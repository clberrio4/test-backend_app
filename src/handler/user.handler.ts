import { Err } from 'joi';
import { concat, isEmpty } from 'lodash';
import { User } from '../models/User';

export class UserHandler {
  constructor() {}

  public async saveUser(user: User): Promise<User> {
    try {
      return User.save(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async findUserByEmailOrUsername(email?: string, username?: string): Promise<User> {
    try {
      const opt: any = {};

      if (!isEmpty(email)) {
        opt.email = email;
      } else {
        opt.username = username;
      }

      const user = await User.findOne({ where: { ...opt } });

      if (user) {
        return Promise.resolve(user);
      }
      return Promise.reject(new Error('no se encontró el usuario'));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * findUserByID
   */
  public async findUserByID(id: number): Promise<User> {
    try {
      return Promise.resolve(await User.findOneOrFail(id));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * findUserByEmail
   */
  public async findUserByEmail(email: string): Promise<User> {
    try {
      return Promise.resolve(await User.findOneOrFail({ where: { email: email } }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * updateFileds
   */
  public async updateFields(opt: User, where: any): Promise<User> {
    try {
      const user = await User.findOne({ where: where });

      const dataReady: User = Object.assign(user, opt);

      const userUpdated = await User.save(dataReady);

      return Promise.resolve(userUpdated);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
