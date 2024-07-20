import type { Env } from "../config/env";
import type ServicesFactory from "../factories/services";
import type { SourceType } from "../models/users";

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }

  interface UserAuth {
    userId: string;
    source: SourceType;
  }

  namespace Express {
    interface Request {
      auth: UserAuth;
      services: ServicesFactory;
      ipAddress: string;
    }
  }
}
