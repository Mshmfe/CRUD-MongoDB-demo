import { Document, Schema, model } from "mongoose";
export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  __v:number
}
const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export const categoryModel = model<ICategory>("Category", categorySchema);

//hash/hashsync and comparse