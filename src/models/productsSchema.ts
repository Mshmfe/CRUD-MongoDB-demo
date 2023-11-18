import { Schema, model } from "mongoose";

export const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

//create the model-> think about as table
//need 2 thing the name of the modle and what the schema the modle go to follow
// is like the collection when i create collection =>db.createCollection('products')
//this collection "Products" will follow 1 schema called "productsSchema"
//o will use this schema everywhere so we need to exported i will use this model when i want to make crud operation on products
export const productModel = model("Products", productsSchema);
