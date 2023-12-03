import { NextFunction, Request, Response } from "express";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import bcrypt from "bcrypt";

import { userModel } from "../models/userSchema";
import { createHttpError } from "../utility/createError";
import { dev } from "../config/server";
import { handleSendEmail } from "../helper/sendEmail";
import {
  banUserById,
  deleteUserById,
  forgetPasswordService,
  getUser,
  getUserById,
  resetPasswordService,
  unbanUserById,
} from "../services/userServices";
import mongoose from "mongoose";
import { userType } from "../types";
import { deleteImage } from "../helper/deleteImageHelper";

export const processRegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //fetch the data from the request body
    const { name, email, password, address, phone } = req.body;
    const imagePath = req.file?.path;
    const hashSync = bcrypt.hashSync(password, 10);

    //check if the user ids exist in the database
    const isUserExist = await userModel.exists({ email: email });
    if (isUserExist) {
      const error = createHttpError(409, "User already exist");
      return error;
    }
    //now i can get the data

    const tokenPayload: userType = {
      name,
      email,
      password: hashSync,
      address,
      phone,
      image: imagePath,
    };
    if (imagePath) {
      tokenPayload.image = imagePath;
    }
    //create the token
    const token = jwt.sign(
      //here whate i want to store inside the token
      tokenPayload,
      dev.app.jwtUserSecret,
      { expiresIn: "5m" }
    );
    //send an email here->token inside the email
    const emailDate = {
      email: email,
      subject: "Activate your account",
      html: `<h1>Hello ${name}</h1><p>Please activate your account by clicking the following link</p><a href="http://127.0.0.1:3002/uesrs/activate/${token}">Activate`,
    };
    //send the email
    handleSendEmail(emailDate);
    //activate the user

    // await user.save();
    res.status(200).json({
      message: "check your email to activate your account",
      payload: {
        token: token,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.body.token;
    console.log(token);
    //if the user not pass any token
    if (!token) {
      throw createHttpError(404, "token is required");
    }
    //verify the token
    const decoded = jwt.verify(token, dev.app.jwtUserSecret);
    console.log(decoded);

    //save the user in the database
    //to store the user information in decoded way will be use the information inside the decoded
    await userModel.create(decoded);
    res.status(201).json({
      message: "user is registered successfully",
    });
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      const errorMassege =
        error instanceof TokenExpiredError
          ? "token is expired"
          : "Invalid Token";
      next(createHttpError(401, errorMassege));
    } else {
      next(error);
    }
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //now i find the user by using find function now i can for pagenation pass the limit
    //for pagenation i need 2 thing 1- the limit 2-the page number
    let page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const search = req.query.search as string;
    // console.log(search)
    //the service for get all the user
    let { users, totalPage, currentPage } = await getUser(page, limit, search);
    res.json({
      message: "all user are returned",
      payload: {
        users,
        totalPage,
        currentPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //i want to get the single category  dased on the _id from req.params
    // find the product from the database
    //how to handel the mongoose id error
    const { _id } = req.params;
    //services
    const user = await getUserById(_id);
    res.json({
      message: "single user are returend",
      paylaod: user,
    });
  } catch (error) {
    // for chick if its mongoose casting error
    //here i want to check if its error instance of MongooseError
    //because in the mongoose data base have the specific id format
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, `Id format is not valid `);
      next(error);
    } else {
      next(error);
    }
  }
};

export const deleteleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //i want to get the single category  dased on the _id from req.params
    // find the product from the database
    //how to handel the mongoose id error
    const { _id } = req.params;
    //services
    const user = await deleteUserById(_id);
    if (user && user.image) {
      await deleteImage(user.image);
    }
    res.json({
      message: "single user are deleted",
      paylaod: user,
    });
  } catch (error) {
    // for chick if its mongoose casting error
    //here i want to check if its error instance of MongooseError
    //because in the mongoose data base have the specific id format
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, `Id format is not valid `);
      next(error);
    } else {
      next(error);
    }
  }
};

//!ban and unban

export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //i want to get the single category  dased on the _id from req.params
    // find the product from the database
    //how to handel the mongoose id error
    const { _id } = req.params;
    //services
    await banUserById(_id);
    res.json({
      message: "banned the user ",
    });
  } catch (error) {
    // for chick if its mongoose casting error
    //here i want to check if its error instance of MongooseError
    //because in the mongoose data base have the specific id format
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, `Id format is not valid `);
      next(error);
    } else {
      next(error);
    }
  }
};
export const unbanUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //i want to get the single category  dased on the _id from req.params
    // find the product from the database
    //how to handel the mongoose id error
    const { _id } = req.params;
    //services
    await unbanUserById(_id);
    res.json({
      message: "unbanned the user ",
    });
  } catch (error) {
    // for chick if its mongoose casting error
    //here i want to check if its error instance of MongooseError
    //because in the mongoose data base have the specific id format
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, `Id format is not valid `);
      next(error);
    } else {
      next(error);
    }
  }
};

///////////////////////////////////////////////////////////////
//POST :/user/forget-password-> handle forget password
export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //step 1:get the email address from req.body
    const { email } = req.body;
    const token = await forgetPasswordService(email);
    
    res.status(200).json({
      message: 'Check your email to reset your password',
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};
//!2
//  PUT :/user/reset-password-> handle reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //step 1:get the  password and the token from req.body
    const { token, password } = req.body;
    await resetPasswordService(token, password);
    
    res.status(200).json({
      message: 'Reset password was successful',
    });
  } catch (error) {
    next(error);
  }
};