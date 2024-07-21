import { Request, Response, NextFunction } from "express";
import { isValidPassword, isValidUsername } from "../../utils/validators";

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

    if (!isValidUsername(username)) throw new Error("BAD_REQUEST");

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
    const { oldPassword, newPassword } = req.body;

    if (!isValidPassword(oldPassword) || !isValidPassword(newPassword))
      throw new Error("BAD_REQUEST");

    const result = await req.services
      .userService()
      .updatePassword({ oldPassword, newPassword });

    if (!result) throw new Error("UNAUTHORIZED");

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

export async function checkUsername(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = req.body;

    if (!username) throw new Error("BAD_REQUEST");

    const result = await req.services.userService().checkUsername(username);

    return res.status(200).json(result).end();
  } catch (err) {
    return next(err);
  }
}

export async function getLeaderboard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await req.services.userService().getUsers();

    const userIds = users.map((user) => user._id);

    const points = await req.services
      .forecastService()
      .getPointsByUsers(userIds);

    const leaderboard = users.map((user) => ({
      ...user.toObject(),
      points: points[user._id] || 0,
    }));

    return res.status(200).json({ leaderboard }).end();
  } catch (err) {
    return next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;

    if (!username) throw new Error("BAD_REQUEST");

    const user = await req.services.userService().getUser(username);

    if (!user) throw new Error("NOT_FOUND");

    const otherFields = user.toObject();
    delete otherFields.password;

    return res.status(200).json(otherFields).end();
  } catch (err) {
    return next(err);
  }
}
