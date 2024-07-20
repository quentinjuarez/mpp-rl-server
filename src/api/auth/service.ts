import type { Logger } from "pino";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/users";
import type { SourceType, UserDocument } from "../../models/users";
import generateUsername from "../../utils/username";

const decryptPassword = async (
  candidatePassword: string,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, password);
};

export class AuthService {
  private logger: Logger;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ token: string; userId: string } | null> {
    try {
      const user = await User.findOne({ email });

      if (!user) throw new Error("NOT_FOUND");

      const isMatch = await decryptPassword(password, user.password);

      if (isMatch) {
        const userId = String(user._id);

        const token = jwt.sign(
          {
            source: user.source,
            userId,
          },
          process.env.API_KEY as string,
          { expiresIn: "1y" },
        );

        return { token, userId };
      }

      throw new Error("WRONG_PASSWORD");
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  async loginGoogle({
    user,
  }: {
    user: UserDocument;
  }): Promise<{ user: UserDocument; token: string } | null> {
    try {
      const userId = String(user._id);

      const token = jwt.sign(
        {
          source: user.source,
          userId,
        },
        process.env.API_KEY,
        { expiresIn: "1y" },
      );

      return { user, token };
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  async register({
    firstName,
    lastName,
    email,
    password,
    source,
  }: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    source?: SourceType;
  }): Promise<{ token: string; userId: string } | null> {
    try {
      const newUser = new User({
        firstName,
        lastName,
        username: generateUsername(),
        email,
        password,
        source: source || "internal",
      });

      await newUser.save();

      return this.login({ email, password });
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  async registerGoogle({
    username,
    firstName,
    lastName,
    email,
    profilePicture,
    externalId,
    source,
  }: {
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profilePicture?: string;
    externalId: string;
    source: string;
  }): Promise<{ user: UserDocument; token: string } | null> {
    try {
      const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        profilePicture,
        externalId,
        source,
      });

      const user = await newUser.save();

      return this.loginGoogle({ user });
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}

export default AuthService;
