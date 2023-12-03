import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { createHttpError } from "../utility/createError";
import { dev } from "../config/server";
import { CusomRequest } from "../types";
import { userModel } from "../models/userSchema";

export const isLoggedIn = async (
  req: CusomRequest, //i use CusomRequest interface to know about the userId
  res: Response,
  next: NextFunction
) => {
  try {
    //step1: check if have cooke already or not
    //need the package to get the data from the cookies
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      throw createHttpError(401, "you are not logged in");
    }
    //step 2 check if the accessToken is valid or not
    const decoded = (await jwt.verify(
      accessToken,
      dev.app.jwtAccessKey
    )) as JwtPayload;
    if (!decoded) {
      throw createHttpError(401, "invalid access token");
    }
    req.userId = decoded._id;

    next();
  } catch (error) {
    next(error);
  }
};

export const isLoggedOut = async (
  req: CusomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //step1: if you have the accessToken wich mean you are logged in
    const accessToken = req.cookies.access_token;
    if (accessToken) {
      throw createHttpError(401, "you are Already logged in");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (
  req: CusomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if the user is admin or not
    const user = await userModel.findById(req.userId);
    if (user?.isAdmin) {
      next();
    } else {
      throw createHttpError(403, "you are not admin");
    }
  } catch (error) {
    next(error);
  }
};
