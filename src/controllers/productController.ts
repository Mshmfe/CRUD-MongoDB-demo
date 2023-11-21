import { Request, Response, NextFunction } from "express";
import slugify from "slugify";

import { productModel } from "../models/productsSchema";
import { productInput } from "../types";
import { createHttpError } from "../utility/createError";
import { deleteProductBySlug, findProductBySlug, getProduct } from "../services/productService";

const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //now i find the product by using find function now i can for pagenation pass the limit
    //for pagenation i need 2 thing 1- the limit 2-the page number
    let page = Number(req.query.page);
    const limit = Number(req.query.limit);
    //the service for get all the product
   let{ products, totalPage, currentPage } = await getProduct(page, limit);
    res.json({
      message: "all product are returned",
      payload: {
        products,
        totalPage,
        currentPage,
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
    const { name, price, description, sold, quantity,category  } = req.body;
    //if i want to create new product i need name and price
    //now i create a new product with name and price
    //i can just write req.body which means any data come from req.body i want to craete product based on this data
    //also product knows about the data in schema
    //check if the product exisist or not
    const productExists = await productModel.exists({ name });
    if (productExists) {
      const error = createHttpError(
        404,
        "Product already exist with this name"
      );
      throw error;
    }
    const product = new productModel({
      name,
      price,
      slug: slugify(name),
      description,
      sold,
      quantity,
      category,
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
    //service for get single product
    const product = await findProductBySlug(slug)
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
    //service for delete single product
    await deleteProductBySlug(slug);
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
      const error = createHttpError(
        404,
        `Product is not found with this slug: ${slug}`
      );
      throw error;
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
