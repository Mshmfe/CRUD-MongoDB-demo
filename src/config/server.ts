import "dotenv/config";

export const dev = {
  app: {
    port: Number(process.env.SERVER_PORT) || 8080,
    defaultImagePath:
      process.env.DEFAULT_IMAGE_PATH || "puplic/images/products/default.png",
    jwtUserSecret: process.env.JWT_ACTIVATION_KEY || "shhhhh",
    smtpUserName: process.env.SMTP_USERNAME || "gfhfrefheL",
    smtpUserPssword: process.env.SMTP_USERPASSWORD || "6789876543",
    jwtAccessKey: process.env.JWT_ACCESS_KEY || "shhhhh",
    //for reset password
    jwtResetPasswordKey: process.env.JWT_RESET_PASSWORD_KEY || "shhhhh",
  },
  db: {
    url: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/e-commerce-db",
  },
};
