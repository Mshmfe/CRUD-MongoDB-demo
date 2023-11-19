import { Request, Response, NextFunction } from "express";
import slugify from "slugify";

import { productModel } from "../models/productsSchema";
import { productInput } from "../types";

const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //now i find the product by using find function now i can for pagenation pass the limit
    //for pagenation i need 2 thing 1- the limit 2-the page number
    let page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    //find how many product (document ) i have
    const count = await productModel.countDocuments();
    console.log("document number:", count);
    //total page
    const totalPage = Math.ceil(count / limit);
    console.log("total page number:", totalPage);

    if (page > totalPage) {
      page = totalPage;
    }
    //i want to skip the page number 1 and go for the product in the number 2
    const skip = (page - 1) * limit;

    //current page

    // to get all the product by use find function
    const products = await productModel.find().skip(skip).limit(limit);
    res.json({
      message: "all product are returned",
      payload: {
        products,
        totalPage,
        currentPage: page,
      },
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
    const { name, price, description, sold, quantity } = req.body;
    //if i want to create new product i need name and price
    //now i create a new product with name and price
    //i can just write req.body which means any data come from req.body i want to craete product based on this data
    //also product knows about the data in schema
    //check if the product exisist or not
    const productExists = await productModel.exists({ name });
    if (productExists) {
      throw new Error("Product already exist with this name");
    }
    const product = new productModel({
      name,
      price,
      slug: slugify(name),
      description,
      sold,
      quantity,
    });
    //now i need to save my new product inside the database by use save function
    //maybe this process take some time so we need to used await
    // await product.save()-->like when i  push some data from req.body
    await product.save();
    res.status(201).json({
      message: "single product created.",
      payload: product,
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
    //i want to get the single product dased on the slug from req.params
    // find the product from the database
    const { slug } = req.params;
    const product = await productModel.find({ slug });
    if (product.length == 0) {
      throw new Error(`Product is not found with this slug: ${slug}`);
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
    const { slug } = req.params;
    const response = await productModel.findOneAndDelete({ slug });
    if (!response) {
      throw new Error(`Product is not found with this slug: ${slug}`);
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
    if (req.body.name) {
      //update the slug value
      req.body.slug = slugify(req.body.name);
    }
    const { slug } = req.params;
    const updateData: productInput = req.body;
    //in this function i base 2 things 1- is id 2- is udated data and i will get this data from req.body
    const product = await productModel.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });
    if (!product) {
      throw new Error(`Product is not found with this id: ${slug}`);
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
