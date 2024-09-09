import type { Logger } from "pino";
import { User } from "../../models/users";
import type { UserDocument } from "../../models/users";
import decryptPassword from "../../utils/decryptPassword";

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
    username,
  }: {
    username: string;
  }): Promise<UserDocument | false> {
    return this.update({ username });
  }

  async updatePassword({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }): Promise<boolean> {
    try {
      const user = await User.findOne({ _id: this.userId });
      if (!user) return false;

      const isValid = await decryptPassword(oldPassword, user.password);

      if (!isValid) throw new Error("WRONG_PASSWORD");

      user.password = newPassword;

      await user.save();

      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    try {
      const user = await User.findOne({ username });

      return !user;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  async getUsers(): Promise<UserDocument[]> {
    try {
      const users = await User.find().select("_id username");

      return users;
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }

  async getUser(username: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({
        username,
      }).select("_id username");

      return user;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  async getByIds(ids: string[]): Promise<UserDocument[]> {
    try {
      const users = await User.find({ _id: { $in: ids } }).select(
        "_id username",
      );

      return users;
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }
}

export default UserService;
