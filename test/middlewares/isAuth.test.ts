import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import isAuth from "../../src/middlewares/isAuth";

interface CustomRequest extends Request {
  auth: UserAuth;
}

describe("isAuth middleware", () => {
  let req: CustomRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    } as CustomRequest;
    res = {} as Response;
    next = jest.fn();

    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw an error if authorization header is missing", () => {
    isAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("UNAUTHORIZED"));
  });

  it("should throw an error if token is missing", () => {
    req.headers.authorization = "Bearer ";
    isAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("UNAUTHORIZED"));
  });

  it("should throw an error if token is malformed", () => {
    req.headers.authorization = "mock_token";
    isAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("UNAUTHORIZED"));
  });

  it("should verify the token and set req.auth if token is valid", () => {
    process.env.API_KEY = "secretKey";
    const token = jwt.sign({ origin: "mock_origin.com" }, process.env.API_KEY, {
      expiresIn: "1h",
    });
    req.headers.authorization = `Bearer ${token}`;
    isAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    // You can also assert req.auth to check if it's set correctly
    expect(req.auth).toMatchObject({ origin: "mock_origin.com" });
  });

  it("should throw an error if token verification fails", () => {
    const invalidToken = "invalid-token";
    req.headers.authorization = `Bearer ${invalidToken}`;
    isAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("UNAUTHORIZED"));
  });
});
