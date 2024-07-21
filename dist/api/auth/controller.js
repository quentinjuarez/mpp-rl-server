"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
const validators_1 = require("../../utils/validators");
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new Error("BAD_REQUEST");
        const result = await req.services.authService().login({
            email,
            password,
        });
        if (!result)
            throw new Error("UNAUTHORIZED");
        const { token } = result;
        return res.status(200).json(token).end();
    }
    catch (err) {
        return next(err);
    }
}
async function register(req, res, next) {
    const { email, password, firstName, lastName } = req.body;
    try {
        if (!email || !password)
            throw new Error("BAD_REQUEST");
        const validatedEmail = (0, validators_1.validateEmail)(email);
        if (!validatedEmail)
            throw new Error("BAD_REQUEST");
        if (!(0, validators_1.isValidPassword)(password))
            throw new Error("BAD_REQUEST");
        const result = await req.services.authService().register({
            firstName,
            lastName,
            email: validatedEmail,
            password,
        });
        if (!result)
            throw new Error("BAD_REQUEST");
        const { token } = result;
        return res.status(201).json(token).end();
    }
    catch (err) {
        return next(err);
    }
}
