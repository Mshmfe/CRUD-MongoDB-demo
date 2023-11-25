import slugify from "slugify";
import { Request } from "express";

import { ICategory, categoryModel } from "../models/categorySchema";
import { createHttpError } from "../utility/createError";

export const getCategory=async()=>{
    const category:ICategory[] = await categoryModel.find();
    return category
};
// the return type is the promise because we use async await
//and inside the promise define the return type from this function ->in this case i try to return the interface ICategory 
export const deleteCategory=async(slug:string):Promise<ICategory>=>{
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

export const getCategoryById=async(id:string):Promise<ICategory>=>{
    const category = await categoryModel.findOne({ _id:id });
      if (!category) {
        const error = createHttpError(
          404,
          `category is not found with this id: ${id}`
        );
        throw error; 
      }  
      return category  
};

export const updateSingleCategory=async(slug:string,req:Request):Promise<ICategory>=>{
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
// !not sure
export const createSingleCategory=async(name:string)=>{
    const categoryExists = await categoryModel.exists({ name });
    if (categoryExists) {
      const error = createHttpError(
        409,
        "Category already exist with this name"
      );
      throw error;
    }
    const category:ICategory = new categoryModel({
      name,
      slug: slugify(name),
    })
    await category.save()
    
    return category
}