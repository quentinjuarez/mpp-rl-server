"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// Définition de la configuration Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MPP RL Server API",
            version: "1.0.0",
            description: "MPP RL Server API",
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        process.env.NODE_ENV === "production" ? "**/*/routes.js" : "**/*/routes.ts",
    ],
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
