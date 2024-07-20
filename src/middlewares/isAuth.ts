import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function isAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        statusCode: 401,
        error: "Unauthorized: Missing Authorization Header",
      });
    }

    const match = authorization.match(/Bearer\s+(\S+)/);

    if (!match) {
      return res
        .status(401)
        .json({ statusCode: 401, error: "Unauthorized: Invalid Token Format" });
    }

    const token = match[1];

    const decoded = jwt.verify(token, process.env.API_KEY);
    req.auth = decoded as UserAuth;

    next();
    return; // Explicit return here
  } catch (error) {
    return res
      .status(401)
      .json({ statusCode: 401, error: "Unauthorized: Invalid Token" });
  }
}
