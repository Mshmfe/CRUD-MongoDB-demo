import slugify from "slugify";
import { categoryModel } from "../models/categorySchema";
import { createHttpError } from "../utility/createError";
import { Request } from "express";

export const getCategory=async()=>{
    const category = await categoryModel.find();
    return category
};

export const deleteCategory=async(slug:string)=>{
    const category = await categoryModel.findOneAndDelete({ slug });
    if (!category) {
      const error = createHttpError(
        404,
        `category is not found with this slug: ${slug}`
      );
      throw error;
    }
return category
}

export const getCategoryBySlug=async(slug:string)=>{
    const category = await categoryModel.find({ slug });
      if (category.length == 0) {
        const error = createHttpError(
          404,
          `category is not found with this slug: ${slug}`
        );
        throw error; 
      }  
      return category  
};

export const updateSingleCategory=async(slug:string,req:Request)=>{
    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
      }
    const updateData=req.body
    const category=await categoryModel.findOneAndUpdate({slug},updateData,{new:true})
    if (!category) {
       const error = createHttpError(
         404,
         `Category is not found with this slug: ${slug}`
       );
       throw error;
     }return category
}

export const createSingleCategory=async(name:string)=>{
    const categoryExists = await categoryModel.exists({ name });
    if (categoryExists) {
      const error = createHttpError(
        409,
        "Category already exist with this name"
      );
      throw error;
    }
    
    return categoryExists
}