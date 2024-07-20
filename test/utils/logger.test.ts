import logger, { pinoLogger } from "../../src/utils/logger";

jest.mock("pino", () => {
  return jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    error: jest.fn(),
  }));
});

describe("Logger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log info message", () => {
    logger.info("This is an info message");
    expect(pinoLogger.info).toHaveBeenCalledWith("This is an info message");
  });

  it("should log info message with entity", () => {
    logger.info("This is an info message with entity", "Entity");
    expect(pinoLogger.info).toHaveBeenCalledWith(
      "Entity: This is an info message with entity",
    );
  });

  it("should log error message", () => {
    logger.error("This is an error message");
    expect(pinoLogger.info).toHaveBeenCalledWith("This is an error message");
  });

  it("should log error message with entity", () => {
    logger.error("This is an error message with entity", "Entity");
    expect(pinoLogger.info).toHaveBeenCalledWith(
      "Entity: This is an error message with entity",
    );
  });
});
