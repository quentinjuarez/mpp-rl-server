import l from "./logger";

export interface Env {
  PORT: string;
  API_KEY: string;
  APP_ID: string;
  LOG_LEVEL: string;
  NODE_ENV: string;
  MONGODB_URI: string;
  FRONT_URL: string;
  BACK_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  PANDASCORE_TOKEN: string;
}

export const requiredEnvVariables: Array<keyof Env> = [
  "PORT",
  "API_KEY",
  "APP_ID",
  "LOG_LEVEL",
  "NODE_ENV",
  "MONGODB_URI",
  "FRONT_URL",
  "BACK_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
  "PANDASCORE_TOKEN",
];

const checkEnvVariables = () => {
  let failed = false;
  for (const envVariable of requiredEnvVariables) {
    if (!process.env[envVariable]) {
      l.error(`Missing required environment variable: ${envVariable}`);
      failed = true;
    }
  }
  if (failed) {
    process.exit(1);
  }
};

export default checkEnvVariables;
