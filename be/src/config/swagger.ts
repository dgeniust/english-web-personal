import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vocabulary Mastery API",
      version: "1.0.0",
      description:
        "Tài liệu RESTful API cho ứng dụng Học & Ôn tập từ vựng (Spaced Repetition)",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            'Nhập JWT Token nhận được từ API login/register (không cần gõ từ "Bearer")',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // Đường dẫn đến các file chứa Annotation Swagger (JSDoc)
  apis: ["./src/routes/*.ts", "./src/docs/*.yaml", "./src/index.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
