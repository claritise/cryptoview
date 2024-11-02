import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js App Router API",
      version: "1.0.0",
      description: "API documentation for Next.js App Router",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/app/api/*/route.ts"], // Path to the API files
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
