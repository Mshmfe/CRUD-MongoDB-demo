import { NextFunction, Request, Response } from "express";
import slugify from "slugify";

import { IProduct, productModel } from "../models/productsSchema";
import { createHttpError } from "../utility/createError";
import { deleteImage } from "../helper/deleteImageHelper";

//GET->get all the product
export const getProduct = async (page = 1, limit = 3, search = "") => {
  //find how many product (document ) i have
  const count = await productModel.countDocuments();
  console.log("document number:", count);
  //total page
  const totalPage = Math.ceil(count / limit);
  console.log("total page number:", totalPage);

  //use regular exprtion for search
  //for ignore the case use i
  const searchRegExp = new RegExp(".*" + search + ".*", "i");
  //based on searchRegExp need tomake fillteration
  const fulter = {
    $or: [
      { name: { $regex: searchRegExp } },
      { description: { $regex: searchRegExp } },
    ],
  };
  const options = {
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
  const products: IProduct[] = await productModel
    //use the fulter variable in the find function
    .find(fulter, options)
    .populate("category")
    .skip(skip)
    .limit(limit)
    .sort({ price: 1 });
  return {
    products,
    totalPage,
    currentPage: page,
  };
};

//GET=>get single product
export const findProductBySlug = async (slug: string): Promise<IProduct> => {
  //i want to get the single product dased on the slug from req.params
  // find the product from the database
  // const { slug } = req.params;
  const product = await productModel.findOne({ slug: slug });
  //because i use findOne not find in this case is not aray any more
  if (!product) {
    const error = createHttpError(
      404,
      `Product is not found with this slug: ${slug}`
    );
    throw error;
  }
  return product;
};
//DELETE ->delete single product
export const deleteProductBySlug = async (slug: string): Promise<IProduct> => {
  //i want to get the single product dased on the slug from req.params
  // find the product from the database

  const product = await productModel.findOneAndDelete({ slug });
  if (product && product.image) {
    await deleteImage(product.image);
  }
  if (!product) {
    const error = createHttpError(
      404,
      `Product is not found with this slug: ${slug}`
    );
    throw error;
  }
  return product;
};

export const updateProductServices = async (
  req: Request,
  slug: string
): Promise<IProduct> => {
  if (req.body.name) {
    //update the slug value
    req.body.slug = slugify(req.body.name);
  }

  const updateData = req.body;
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
  return product;
};

//commpartion operation
//$eq:,$neq:,$in:,$nin:,$gt:,$gte: ......

//logical operation
//$and:, $or:,$nor:,$not:
