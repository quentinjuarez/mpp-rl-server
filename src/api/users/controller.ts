import { Request, Response, NextFunction } from "express";

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await req.services.userService().getMe();
    if (!user) throw new Error("NOT_FOUND");

    const otherFields = user.toObject();
    delete otherFields.password;

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
    const { username } = req.body;

    if (!username) throw new Error("BAD_REQUEST");

    const user = await req.services.userService().updateProfile({
      username,
    });

    if (!user) throw new Error("UNAUTHORIZED");

    const otherFields = user.toObject();
    delete otherFields.password;

    return res.status(201).json(otherFields).end();
  } catch (err) {
    return next(err);
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { password } = req.body;

    if (!password) throw new Error("BAD_REQUEST");

    const result = await req.services
      .userService()
      .updatePassword({ password });

    if (!result) throw new Error("UNAUTHORIZED");

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}
