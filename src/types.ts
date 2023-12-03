import { Request, request } from "express";

export type Product = {
  _id: string;
  name: string;
  price: number;
  slug: string;
  description: string;
  sold: number;
  quantity: number;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
};
export type productInput = Omit<Product, " slug">;
export interface Error {
  status?: number;
  message?: string;
}
export type Category = {
  _id: string;
  name: string;
  slug: string;
};
export type EmailDataType = {
  email: string;
  subject: string;
  html: string;
};
export type categoryInput = Omit<Category, " _id">;
export type userType = {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  image?: string;
};

export interface CusomRequest extends Request {
  userId?: string;
}
