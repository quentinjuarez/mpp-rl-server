import checkEnvVariables, {
  requiredEnvVariables,
} from "../../src/utils/config";
import l from "../../src/utils/logger";

jest.mock("../../src/utils/logger");

describe("checkEnvVariables", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = {} as NodeJS.ProcessEnv;
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("should exit the process if any required environment variable is missing", () => {
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });

    try {
      checkEnvVariables();
    } catch (error) {}

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(exitSpy).toHaveBeenCalledTimes(1);
  });

  it("should not exit the process if all required environment variables are present", () => {
    const exitSpy = jest.spyOn(process, "exit");

    for (const envVariable of [
      "PORT",
      "API_KEY",
      "APP_ID",
      "LOG_LEVEL",
      "NODE_ENV",
      "NOTION_TOKEN",
      "MONGODB_URI",
      "FRONT_URL",
      "BACK_URL",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
    ]) {
      process.env[envVariable] = "someValue";
    }

    try {
      checkEnvVariables();
    } catch (error) {}

    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("should log an error for each missing required environment variable", () => {
    try {
      checkEnvVariables();
    } catch (error) {}

    expect(l.error).toHaveBeenCalledTimes(requiredEnvVariables.length);
    for (const envVariable of requiredEnvVariables) {
      expect(l.error).toHaveBeenCalledWith(
        `Missing required environment variable: ${envVariable}`,
      );
    }
  });
});
