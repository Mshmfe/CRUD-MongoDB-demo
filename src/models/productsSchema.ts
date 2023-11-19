import { Schema, model } from "mongoose";

export const productsSchema = new Schema(
  {
    //image,category
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
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

//create the model-> think about as table
//need 2 thing the name of the modle and what the schema the modle go to follow
// is like the collection when i create collection =>db.createCollection('products')
//this collection "Products" will follow 1 schema called "productsSchema"
//o will use this schema everywhere so we need to exported i will use this model when i want to make crud operation on products
export const productModel = model("Products", productsSchema);
