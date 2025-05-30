"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.updateMe = updateMe;
exports.updatePassword = updatePassword;
exports.checkUsername = checkUsername;
exports.getLeaderboard = getLeaderboard;
exports.getUser = getUser;
const validators_1 = require("../../utils/validators");
async function getMe(req, res, next) {
    try {
        const user = await req.services.userService().getMe();
        if (!user)
            throw new Error("NOT_FOUND");
        const otherFields = user.toObject();
        delete otherFields.password;
        return res.status(200).json(otherFields).end();
    }
    catch (err) {
        return next(err);
    }
}
async function updateMe(req, res, next) {
    try {
        const { username } = req.body;
        if (!(0, validators_1.isValidUsername)(username))
            throw new Error("BAD_REQUEST");
        const user = await req.services.userService().updateProfile({
            username,
        });
        if (!user)
            throw new Error("UNAUTHORIZED");
        const otherFields = user.toObject();
        delete otherFields.password;
        return res.status(201).json(otherFields).end();
    }
    catch (err) {
        return next(err);
    }
}
async function updatePassword(req, res, next) {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!(0, validators_1.isValidPassword)(oldPassword) || !(0, validators_1.isValidPassword)(newPassword))
            throw new Error("BAD_REQUEST");
        const result = await req.services
            .userService()
            .updatePassword({ oldPassword, newPassword });
        if (!result)
            throw new Error("UNAUTHORIZED");
        return res.status(204).end();
    }
    catch (err) {
        return next(err);
    }
}
async function checkUsername(req, res, next) {
    try {
        const { username } = req.body;
        if (!username)
            throw new Error("BAD_REQUEST");
        const result = await req.services.userService().checkUsername(username);
        return res.status(200).json(result).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getLeaderboard(req, res, next) {
    try {
        const { serie_id } = req.query;
        const users = await req.services.userService().getUsers();
        const points = await req.services
            .forecastService()
            .getPoints(serie_id ? Number(serie_id) : undefined);
        const leaderboard = users.map((user) => ({
            ...user.toObject(),
            points: points[user._id] || 0,
        }));
        return res.status(200).json({ leaderboard }).end();
    }
    catch (err) {
        return next(err);
    }
}
async function getUser(req, res, next) {
    try {
        const { username } = req.params;
        if (!username)
            throw new Error("BAD_REQUEST");
        const user = await req.services.userService().getUser(username);
        if (!user)
            throw new Error("NOT_FOUND");
        const forecastService = req.services.forecastService();
        const points = await forecastService.getPointsByUser(user._id);
        const forecasts = await forecastService.getByUser(user._id, true);
        const userFields = user.toObject();
        userFields.points = points;
        userFields.forecasts = forecasts;
        return res.status(200).json(userFields).end();
    }
    catch (err) {
        return next(err);
    }
}
