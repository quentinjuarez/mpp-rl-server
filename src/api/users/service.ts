import type { Logger } from "pino";
import { User } from "../../models/users";
import type { UserDocument } from "../../models/users";

export class UserService {
  private logger: Logger;
  private userId: string;

  constructor({ logger, userId }: { logger: Logger; userId: string }) {
    this.logger = logger;
    this.userId = userId;
  }

  private async get(userId: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) return null;

      return user;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  private async update(
    payload: Partial<UserDocument>,
  ): Promise<UserDocument | false> {
    try {
      const user = await User.findOneAndUpdate({ _id: this.userId }, payload, {
        returnOriginal: false,
      });
      if (!user) return false;

      return user;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  async getMe(): Promise<UserDocument | null> {
    return this.get(this.userId);
  }

  async updateProfile({
    firstName,
    lastName,
    username,
  }: {
    firstName: string;
    lastName: string;
    username: string;
  }): Promise<UserDocument | false> {
    return this.update({ username, firstName, lastName });
  }

  async updatePassword({ password }: { password: string }): Promise<boolean> {
    try {
      const user = await User.findOne({ _id: this.userId });
      if (!user) return false;

      user.password = password;

      await user.save();

      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}

export default UserService;
