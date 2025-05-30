import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/users";
import ServicesFactory from "../factories/services";

const initGoogleStrategy = () => {
  passport.use(
    "google-sso",
    new GoogleStrategy(
      {
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        passReqToCallback: true,
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        const { id, emails, photos, name } = profile;

        const email = emails?.[0].value;
        const photo = photos?.[0].value;

        const firstName = name?.givenName;
        const lastName = name?.familyName;

        if (!email) throw new Error("BAD_REQUEST");

        // check if user already exists
        const currentUser = await User.findOne({ externalId: id });

        // @ts-expect-error fix for typescript error
        const authService = ServicesFactory.init(req).authService();

        if (currentUser) {
          // already have the user -> login and return token
          const googleAuth = await authService.loginGoogle({
            user: currentUser,
          });

          if (!googleAuth) throw new Error("INTERNAL_SERVER_ERROR");

          const { token } = googleAuth;

          return done(null, token);
        } else {
          // register user and return token
          const googleAuth = await authService.registerGoogle({
            externalId: id,
            firstName,
            lastName,
            email,
            profilePicture: photo,
            source: "google",
          });

          if (!googleAuth) throw new Error("INTERNAL_SERVER_ERROR");

          const { token } = googleAuth;

          return done(null, token);
        }
      },
    ),
  );
};

export default initGoogleStrategy;
