import swaggerJsdoc from "swagger-jsdoc";

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

const specs = swaggerJsdoc(options);

export default specs;
