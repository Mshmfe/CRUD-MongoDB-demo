import jwt from "jsonwebtoken";

const createJsonWebToken = (payload = {}, expiresIn = "", secretKey = "") => {
  try {
    if (secretKey === "") {
      throw new Error("secretKey must be a non-empty ");
    }
    const token = jwt.sign(payload, secretKey, {
      expiresIn: expiresIn,
    });

    return token;
  } catch (error) {
    throw error;
  }
};

export default createJsonWebToken;
