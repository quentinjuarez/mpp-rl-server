import { Request, Response, NextFunction } from "express";
import errorHandler from "../../src/middlewares/errorHandler";

jest.mock("../../src/config/logger");

describe("errorHandler middleware", () => {
  let error: Error;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    error = new Error("Some error message");
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as Response;
    next = jest.fn();

    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log the error in development environment", () => {
    process.env.NODE_ENV = "development";
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: error.message,
      stack: error.stack,
    });
    expect(res.end).toHaveBeenCalled();
  });

  it("should not log the error in non-development environment", () => {
    process.env.NODE_ENV = "production";
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(res.end).toHaveBeenCalled();
  });

  it("should handle known error messages", () => {
    const knownErrorMessage = "BAD_REQUEST";
    error = new Error(knownErrorMessage);
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Bad Request" });
    expect(res.end).toHaveBeenCalled();
  });

  it("should handle unknown error messages", () => {
    const unknownErrorMessage = "UNKNOWN_ERROR";
    error = new Error(unknownErrorMessage);
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    expect(res.end).toHaveBeenCalled();
  });
});
