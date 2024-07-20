import { Request, Response, NextFunction } from "express";

export default function attachIp(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.ipAddress = req.headers["x-forwarded-for"] as string;
  next();
}
