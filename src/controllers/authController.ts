import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userModel } from "../models/userSchema";
import { createHttpError } from "../utility/createError";
import { dev } from "../config/server";

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //step 1 get the data from the request body
    const { email, password } = req.body;
    //step 2 check if the user exist
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw createHttpError(
        404,
        "user not found with this email address,please register"
      );
    }
    //step 3 compare the password
    //compare take two thing the data from req.body and other one from data base
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createHttpError(401, "password is not match");
    }
    //step 4 check if the user ban or not
    if (user.isBanned) {
      throw createHttpError(403, "user is banned please conant admin");
    }
    //step 5 create the token
    const accessToken = jwt.sign({ _id: user._id }, dev.app.jwtAccessKey, {
      expiresIn: "10m",
    });
    //step 6 create the cookie to store some information about login
    res.cookie("access_token", accessToken, {
      maxAge: 8 * 60 * 1000, //8 minutes
      httpOnly: true,
      sameSite: "none",
    });

    //step 5 send the response
    res.status(200).json({
      message: "user is logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //step 1 delete the cookie
    res.clearCookie("access_token");
    //step 2 send the response
    res.status(200).json({
      message: "user is logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
