import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User, SourceTypeEnum } from "../models/users";
import AuthService from "../api/auth/service";

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
      async (_req, _accessToken, _refreshToken, profile, done) => {
        const { displayName, id, emails, photos, name } = profile;

        const email = emails?.[0].value;
        const photo = photos?.[0].value;

        const firstName = name?.givenName;
        const lastName = name?.familyName;

        if (!email) throw new Error("BAD_REQUEST");

        // check if user already exists
        const currentUser = await User.findOne({ externalId: id });

        if (currentUser) {
          // already have the user -> login and return token
          const googleAuth = await AuthService.loginGoogle({
            user: currentUser,
          });

          if (!googleAuth) throw new Error("INTERNAL_SERVER_ERROR");

          const { token } = googleAuth;

          return done(null, token);
        } else {
          // register user and return token
          const googleAuth = await AuthService.registerGoogle({
            externalId: id,
            username: displayName,
            firstName,
            lastName,
            email,
            profilePicture: photo,
            source: SourceTypeEnum.GOOGLE,
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
