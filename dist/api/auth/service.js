"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../../models/users");
const username_1 = __importDefault(require("../../utils/username"));
const decryptPassword_1 = __importDefault(require("../../utils/decryptPassword"));
class AuthService {
    logger;
    constructor({ logger }) {
        this.logger = logger;
    }
    async login({ email, password, }) {
        try {
            const user = await users_1.User.findOne({ email });
            if (!user)
                throw new Error("NOT_FOUND");
            const isMatch = await (0, decryptPassword_1.default)(password, user.password);
            if (isMatch) {
                const userId = String(user._id);
                const token = jsonwebtoken_1.default.sign({
                    source: user.source,
                    userId,
                }, process.env.API_KEY, { expiresIn: "1y" });
                return { token, userId };
            }
            throw new Error("WRONG_PASSWORD");
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
    async loginGoogle({ user, }) {
        try {
            const userId = String(user._id);
            const token = jsonwebtoken_1.default.sign({
                source: user.source,
                userId,
            }, process.env.API_KEY, { expiresIn: "1y" });
            return { user, token };
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
    async register({ firstName, lastName, email, password, source, }) {
        try {
            const newUser = new users_1.User({
                firstName,
                lastName,
                username: (0, username_1.default)(),
                email,
                password,
                source: source || "internal",
            });
            await newUser.save();
            return this.login({ email, password });
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
    async registerGoogle({ firstName, lastName, email, profilePicture, externalId, source, }) {
        try {
            const newUser = new users_1.User({
                username: (0, username_1.default)(),
                firstName,
                lastName,
                email,
                profilePicture,
                externalId,
                source,
            });
            const user = await newUser.save();
            return this.loginGoogle({ user });
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
