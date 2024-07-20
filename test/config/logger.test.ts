import logger from "../../src/config/logger";

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
    expect(logger.info).toHaveBeenCalledWith("This is an info message");
  });

  it("should log error message", () => {
    logger.error("This is an error message");
    expect(logger.error).toHaveBeenCalledWith("This is an error message");
  });
});
