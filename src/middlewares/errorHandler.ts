import { Request, Response, NextFunction } from "express";
import l from "../config/logger";

interface ErrorResponse {
  statusCode: number;
  message: string;
}

const ERROR_MAP: Record<string, ErrorResponse> = {
  BAD_REQUEST: { statusCode: 400, message: "Bad Request" },
  UNAUTHORIZED: { statusCode: 401, message: "Unauthorized" },
  FORBIDDEN: { statusCode: 403, message: "Forbidden" },
  NOT_FOUND: { statusCode: 404, message: "Not Found" },
  INTERNAL_SERVER_ERROR: { statusCode: 500, message: "Internal Server Error" },
};

export default function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    l.error(error);
  }

  const { statusCode, message } =
    (error.message && ERROR_MAP[error.message]) ||
    ERROR_MAP.INTERNAL_SERVER_ERROR;

  res
    .status(statusCode)
    .json(isDev ? { statusCode, message, stack: error.stack } : message)
    .end();
}
