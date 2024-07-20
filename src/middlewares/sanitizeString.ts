import DOMPurify from "isomorphic-dompurify";
import { Request, Response, NextFunction } from "express";

const MAX_LENGTH = 128;

const purifyString = (dirtyString: string, disableLimit: boolean): string => {
  const text = DOMPurify.sanitize(dirtyString, { ALLOWED_TAGS: [] }).trim();
  if (disableLimit) return text;

  if (text.length > MAX_LENGTH) {
    return text.slice(0, MAX_LENGTH);
  }

  return text;
};

const sanitizeString =
  (keys: string[], disableLimit = false) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const { body } = req;

    keys.forEach((key) => {
      if (body[key]) {
        const newValue = purifyString(body[key], disableLimit);

        if (newValue !== body[key]) {
          body[key] = newValue;
          req.body[`${key}Sanitized`] = true;
        }
      }
    });

    next();
  };

export default sanitizeString;
