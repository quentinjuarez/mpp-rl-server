"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUsername = exports.isValidPassword = exports.validateEmail = void 0;
const validateEmail = (text) => {
    return String(text)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)?.[0];
};
exports.validateEmail = validateEmail;
const isValidPassword = (text) => {
    return !!text.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+-])[A-Za-z\d@$!%*?&+-]{6,}$/);
};
exports.isValidPassword = isValidPassword;
const isValidUsername = (text) => {
    return !!text.match(/^[a-zA-Z0-9_]{1,30}$/);
};
exports.isValidUsername = isValidUsername;
