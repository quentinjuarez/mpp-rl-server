import { Request, Response, NextFunction } from "express";

export default function attachIp(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  // @ts-ignore
  req.ipAddress = req.headers["x-forwarded-for"];
  next();
}
