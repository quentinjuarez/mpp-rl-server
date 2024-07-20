import type { Request, Response, NextFunction } from "express";
import ServicesFactory from "../factories/services";

export default function attachServices(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    req.services = ServicesFactory.init(req);

    next();
    return;
  } catch (error) {
    return res.status(500);
  }
}
