"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const users_1 = require("../models/users");
const services_1 = __importDefault(require("../factories/services"));
const initGoogleStrategy = () => {
    passport_1.default.use("google-sso", new passport_google_oauth20_1.Strategy({
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        passReqToCallback: true,
    }, async (req, _accessToken, _refreshToken, profile, done) => {
        const { id, emails, photos, name } = profile;
        const email = emails?.[0].value;
        const photo = photos?.[0].value;
        const firstName = name?.givenName;
        const lastName = name?.familyName;
        if (!email)
            throw new Error("BAD_REQUEST");
        // check if user already exists
        const currentUser = await users_1.User.findOne({ externalId: id });
        const authService = services_1.default.init(req).authService();
        if (currentUser) {
            // already have the user -> login and return token
            const googleAuth = await authService.loginGoogle({
                user: currentUser,
            });
            if (!googleAuth)
                throw new Error("INTERNAL_SERVER_ERROR");
            const { token } = googleAuth;
            return done(null, token);
        }
        else {
            // register user and return token
            const googleAuth = await authService.registerGoogle({
                externalId: id,
                firstName,
                lastName,
                email,
                profilePicture: photo,
                source: "google",
            });
            if (!googleAuth)
                throw new Error("INTERNAL_SERVER_ERROR");
            const { token } = googleAuth;
            return done(null, token);
        }
    }));
};
exports.default = initGoogleStrategy;
