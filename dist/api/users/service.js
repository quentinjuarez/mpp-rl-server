"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const users_1 = require("../../models/users");
const decryptPassword_1 = __importDefault(require("../../utils/decryptPassword"));
class UserService {
    logger;
    userId;
    constructor({ logger, userId }) {
        this.logger = logger;
        this.userId = userId;
    }
    async get(userId) {
        try {
            const user = await users_1.User.findOne({ _id: userId });
            if (!user)
                return null;
            return user;
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
    async update(payload) {
        try {
            const user = await users_1.User.findOneAndUpdate({ _id: this.userId }, payload, {
                returnOriginal: false,
            });
            if (!user)
                return false;
            return user;
        }
        catch (err) {
            this.logger.error(err);
            return false;
        }
    }
    async getMe() {
        return this.get(this.userId);
    }
    async updateProfile({ username, }) {
        return this.update({ username });
    }
    async updatePassword({ oldPassword, newPassword, }) {
        try {
            const user = await users_1.User.findOne({ _id: this.userId });
            if (!user)
                return false;
            const isValid = await (0, decryptPassword_1.default)(oldPassword, user.password);
            if (!isValid)
                throw new Error("WRONG_PASSWORD");
            user.password = newPassword;
            await user.save();
            return true;
        }
        catch (err) {
            this.logger.error(err);
            return false;
        }
    }
    async checkUsername(username) {
        try {
            const user = await users_1.User.findOne({ username });
            return !user;
        }
        catch (err) {
            this.logger.error(err);
            return false;
        }
    }
    async getUsers() {
        try {
            const users = await users_1.User.find().select("_id username");
            return users;
        }
        catch (err) {
            this.logger.error(err);
            return [];
        }
    }
    async getUser(username) {
        try {
            const user = await users_1.User.findOne({
                username,
            }).select("_id username");
            return user;
        }
        catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}
exports.UserService = UserService;
exports.default = UserService;
