import { Response,Request,NextFunction } from "express";
import { productModel } from "../models/productsSchema";
import { createHttpError } from "../utility/createError";

//GET->get all the product
export const getProduct = async (page = 1, limit = 3) => {
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
  return {
    products,
    totalPage,
    currentPage: page,
  };
};

//GET=>get single product
export const findProductBySlug=async(slug:string)=>{
   
        //i want to get the single product dased on the slug from req.params
        // find the product from the database
        // const { slug } = req.params;
        const product = await productModel.find({ slug:slug });
        if (product.length == 0) {
          const error = createHttpError(
            404,
            `Product is not found with this slug: ${slug}`
          );
          throw error;
        }
       return product
}
//