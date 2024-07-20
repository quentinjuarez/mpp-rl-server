import { Request, Response, NextFunction } from "express";
import UserService from "./service";
import { validateEmail } from "../../utils/validators";
import { SourceTypeEnum } from "../../models/users";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.auth;

    const user = await UserService.findById(userId);
    if (!user) throw new Error("NOT_FOUND");

    const { password, ...otherFields } = user.toObject();

    return res.status(200).json(otherFields).end();
  } catch (err) {
    return next(err);
  }
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      userId,
      user: { source },
    } = req.auth;
    const { username, email } = req.body;

    const isSSO = source !== SourceTypeEnum.INTERNAL;
    const validatedEmail = validateEmail(email);
    if (!validatedEmail) throw new Error("BAD_REQUEST");

    const user = await UserService.updateById(userId, {
      username,
      ...(isSSO ? {} : { email: validatedEmail }),
    });
    if (!user) throw new Error("UNAUTHORIZED");

    const { password, ...otherFields } = user.toObject();

    return res.status(201).json(otherFields).end();
  } catch (err) {
    return next(err);
  }
}

export async function deleteMe(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.auth;

    const result = await UserService.deleteById(userId);

    return res.status(201).json(result).end();
  } catch (err) {
    return next(err);
  }
}
