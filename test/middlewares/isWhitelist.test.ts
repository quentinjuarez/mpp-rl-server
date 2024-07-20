import { Request, Response, NextFunction } from "express";
import isWhitelist from "../../src/middlewares/isWhitelist";

describe("isWhitelist middleware", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    } as Request;
    res = {} as Response;
    next = jest.fn();
  });

  it("should call next() if origin is in whitelist", () => {
    req.headers.origin = "https://www.jukephone.fr";

    isWhitelist(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should throw an error if origin is not in whitelist", () => {
    req.headers.origin = "https://unauthorized.com";

    isWhitelist(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("UNAUTHORIZED"));
  });

  it("should throw an error if origin is missing", () => {
    isWhitelist(req, res, next);
    expect(next).toHaveBeenCalledWith(new Error("UNAUTHORIZED"));
  });
});
