import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import {
  createSingleCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  updateSingleCategory,
} from "../services/categoryServices";
import { createHttpError } from "../utility/createError";

export const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //now i find the product by using find function
    //get category services
    const category = await getCategory();
    //the service for get all the product
    res.send({
      message: "all category are returned",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get the data from req.body
    const { name } = req.body;
    //if i want to create new product i need name and price
    //now i create a new product with name and price
    //i can just write req.body which means any data come from req.body i want to craete product based on this data
    //also product knows about the data in schema
    //check if the product exisist or not
    const category = await createSingleCategory(name);

    //now i need to save my new product inside the database by use save function
    //maybe this process take some time so we need to used await
    // await product.save()-->like when i  push some data from req.body
    res.status(201).json({
      message: "single category created.",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSingleCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    //service for delete single product
    await deleteCategory(slug);
    res.json({
      message: "single category is dleted",
    });
  } catch (error) {
    next(error);
  }
};
export const getSingleCategory = async (
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
    const category = await getCategoryById(_id);
    res.json({
      message: "single category are returend",
      paylaod: category,
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

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const category = await updateSingleCategory(slug, req);
    res.send({
      message: "single category updated",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};
