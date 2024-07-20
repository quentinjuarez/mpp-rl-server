import { Request, Response, NextFunction } from "express";
import { validateEmail, isValidPassword } from "../../utils/validators";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("BAD_REQUEST");

    const result = await req.services.authService().login({
      email,
      password,
    });

    if (!result) throw new Error("UNAUTHORIZED");

    const { token } = result;

    return res.status(200).json(token).end();
  } catch (err) {
    return next(err);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password, firstName, lastName } = req.body;

  try {
    if (!email || !password) throw new Error("BAD_REQUEST");

    const validatedEmail = validateEmail(email);
    if (!validatedEmail) throw new Error("BAD_REQUEST");
    if (!isValidPassword(password)) throw new Error("BAD_REQUEST");

    const result = await req.services.authService().register({
      firstName,
      lastName,
      email: validatedEmail,
      password,
    });

    if (!result) throw new Error("BAD_REQUEST");

    const { token } = result;

    return res.status(201).json(token).end();
  } catch (err) {
    return next(err);
  }
}
