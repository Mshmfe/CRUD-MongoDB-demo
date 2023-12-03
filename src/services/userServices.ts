import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { dev } from "../config/server";
import { handleSendEmail } from "../helper/sendEmail";
import { IUser, userModel } from "../models/userSchema";
import { createHttpError } from "../utility/createError";

//GET->get all the product
export const getUser = async (page = 1, limit = 3, search = "") => {
  //find how many product (document ) i have
  const count = await userModel.countDocuments();
  console.log("document number:", count);
  //total page
  const totalPage = Math.ceil(count / limit);
  console.log("total page number:", totalPage);

  //use regular exprtion for search
  //for ignore the case use i
  const searchRegExp = new RegExp(".*" + search + ".*", "i");
  //based on searchRegExp need to make fillteration
  const fulter = {
    //new to returen all the user is notadmin
    isAdmin: { $ne: true },
    $or: [
      { name: { $regex: searchRegExp } },
      { email: { $regex: searchRegExp } },
      { phone: { $regex: searchRegExp } },
    ],
  };
  const options = {
    password: 0,
    __v: 0,
  };

  if (page > totalPage) {
    page = totalPage;
  }
  //i want to skip the page number 1 and go for the product in the number 2
  const skip = (page - 1) * limit;

  //current page

  // to get all the product by use find function
  //populate('category') for get the information of category when i try get the product
  //populate the data from the category model
  //!query
  //{price:{$eq:100}}here i try to find the product price=100
  //{price:{$gt:100}}i try to find all the product gretar than 100
  //{price:{$in:[100,500]}}->in 100and 500
  //{price:{$nin:[100,500]}}->anything not in 100 and 500
  // i want to make query ->product price >100&& quentity=5
  //$and:[{price:{$gt:100}},{quantity:{$eq:5}},{$}] i can use the or ,nor....
  //when i use inside the sort -1 that sort from uper to lower->des and the 1 is asc
  const users: IUser[] = await userModel
    //use the fulter variable in the find function
    // i want to avoid the password when i try to search for the users
    .find(fulter, options)
    .skip(skip)
    .limit(limit);
  return {
    users,
    totalPage,
    currentPage: page,
  };
};

export const getUserById = async (id: string): Promise<IUser> => {
  const user = await userModel.findById({ _id: id }, { password: 0 });
  if (!user) {
    const error = createHttpError(404, `user is not found with this id: ${id}`);
    throw error;
  }
  return user;
};
//handel with delete also the image
export const deleteUserById = async (id: string): Promise<IUser> => {
  const user = await userModel.findByIdAndDelete({ _id: id });
  if (!user) {
    const error = createHttpError(404, `user is not found with this id: ${id}`);
    throw error;
  }
  return user;
};

export const banUserById = async (id: string) => {
  const user = await userModel.findByIdAndUpdate(
    { _id: id },
    { isBanned: true }
  );
  if (!user) {
    const error = createHttpError(404, `user is not found with this id: ${id}`);
    throw error;
  }
};

export const unbanUserById = async (id: string) => {
  const user = await userModel.findByIdAndUpdate(
    { _id: id },
    { isBanned: false }
  );
  if (!user) {
    const error = createHttpError(404, `user is not found with this id: ${id}`);
    throw error;
  }
};

//forget
export const forgetPasswordService = async (email: string) => {
  //step 2: find the user with the email
  const user = await userModel.findOne({ email: email });
  //step 3: check if the user exist or not
  if (!user) {
    throw createHttpError(404, "User does not exist");
  }
  //step 4: create the token
  const token = jwt.sign({ email: email }, dev.app.jwtResetPasswordKey, {
    expiresIn: "15m",
  });
  // step 5: set the email
  const emailData = {
    email: email,
    subject: "Reset your password",
    html: `<h1>Hello ${user.name}</h1><p>Please reset your password by clicking the following link</p><a href="http://127.0.0.1:3002/uesrs/reset-password/${token}">Reset password`,
  };
  // this function for send the email
  handleSendEmail(emailData);

  return token;
};

export const resetPasswordService = async (token: string, password: string) => {
  //step 2: verify the token
  const decoded = jwt.verify(token, dev.app.jwtResetPasswordKey) as JwtPayload;
  //step 3:check if the token invalid or not
  if (!decoded) {
    throw createHttpError(400, "Token is invalid");
  }
  //step 4: hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  //step 5: update the user password
  //!step 1:find the user by email
  //!step 2:ubdate the user
  const updatedUser = await userModel.findOneAndUpdate(
    { email: decoded.email },
    { $set: { password: hashedPassword } },
    { new: true }
  );
  if (!updatedUser) {
    throw createHttpError(400, "Reset password was unsuccessful");
  }
};
