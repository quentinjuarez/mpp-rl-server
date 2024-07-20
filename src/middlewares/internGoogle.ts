import { Request, Response, NextFunction, Express } from "express";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import session from "express-session";

// Configuration de la stratégie Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      // @ts-ignore
      clientID: process.env.GOOGLE_CLIENT_ID,
      // @ts-ignore
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACK_URL + "/api/auth/google/callback",
    },
    (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      if (!profile.emails) return done(null, false);

      const email = profile.emails[0].value;
      if (email === "jukephone.contact@gmail.com") {
        return done(null, email);
      }
      return done(null, false);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/auth/google");
};

export const initializePassport = (app: Express) => {
  app.use(
    session({
      // @ts-ignore
      secret: process.env.API_KEY,
      resave: false,
      saveUninitialized: true,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
};

export const googleAuthMiddleware = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  successRedirect: "/api",
  failureRedirect: "/",
});

// Route de déconnexion
export const googleAuthLogout = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  req.logout();
  next();
};
