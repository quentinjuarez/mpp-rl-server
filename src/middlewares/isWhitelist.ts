import { Request, Response, NextFunction } from "express";

import { whitelist } from "../config/constant";

export default function isAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const { origin } = req.headers;

    if (!origin || !whitelist.includes(origin)) throw new Error("UNAUTHORIZED");

    next();
  } catch (error) {
    next(error);
  }
}
