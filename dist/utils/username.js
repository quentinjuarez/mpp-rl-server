"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const usernames_json_1 = require("./usernames.json");
const generateUsername = () => {
    const randomAdjective = usernames_json_1.adjectives[Math.floor(Math.random() * usernames_json_1.adjectives.length)];
    const randomAnimal = usernames_json_1.animals[Math.floor(Math.random() * usernames_json_1.animals.length)];
    // 4 digit random number
    const randomHash = Math.floor(1000 + Math.random() * 9000);
    return `${randomAdjective}${randomAnimal}#${randomHash}`;
};
exports.default = generateUsername;
