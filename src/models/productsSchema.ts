import { Document } from "mongoose";
import { Schema, model } from "mongoose";

import { ICategory } from "./categorySchema";
export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  description: string;
  sold: number;
  quantity: number;
  //insude the category schema idefine the id for category
  //and i use here to make relation ship between product and category
  category: ICategory["_id"];
  image: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}
export const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [300, "Product name must be at most 300 characters "],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Product description must be at least 3 characters long"],
    },
    sold: {
      type: Number,
      default: 0,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      // ! typo error shoud be public not puplic
      default: "puplic/images/products/default.png",
    },
    //to make relation between product to the category
    //Schema.Types.ObjectId the id from the collection of category
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

//create the model-> think about as table
//need 2 thing the name of the modle and what the schema the modle go to follow
// is like the collection when i create collection =>db.createCollection('products')
//this collection "Products" will follow 1 schema called "productsSchema"
//o will use this schema everywhere so we need to exported i will use this model when i want to make crud operation on products
//and shoud be the schema know about the interface i created
export const productModel = model<IProduct>("Products", productsSchema);
