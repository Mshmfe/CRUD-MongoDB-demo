import { Request, Response, NextFunction } from "express";

import { productModel } from "../models/productsSchema";
import { productInput } from "../types";

const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // to get all the product by use find function
    const products = await productModel.find();
    res.json({
      message: "all product are returned",
      payload: products,
    });
  } catch (error) {
    next(error);
  }
};

export const createSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get the data from req.body
    const { name, price } = req.body;
    //if i want to create new product i need name and price
    //now i create a new product with name and price
    //i can just write req.body which means any data come from req.body i want to craete product based on this data
    //also product knows about the data in schema
    const product = new productModel({ name, price });
    //now i need to save my new product inside the database by use save function
    //maybe this process take some time so we need to used await
    // await product.save()-->like when i  push some data from req.body
    await product.save();
    res.status(201).json({
      message: "single product created.",
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //i want to get the single product dased on the id from req.params
    // find the product from the database
    const id = req.params.id;
    const product = await productModel.findById(id);
    if (!product) {
      throw new Error(`Product is not found with this id: ${id}`);
    }
    res.json({
      message: "single product are returend",
      paylaod: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const response = await productModel.findByIdAndDelete(id);
    if (!response) {
      throw new Error(`Product is not found with this id: ${id}`);
    }
    res.json({
      message: "single product is dleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updateSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const updateData: productInput = req.body;
    //in this function i base 2 things 1- is id 2- is udated data and i will get this data from req.body
    const product = await productModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!product) {
      throw new Error(`Product is not found with this id: ${id}`);
    }
    res.json({
      message: " product is updated",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllProduct;
