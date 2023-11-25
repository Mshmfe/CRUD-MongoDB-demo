export type Product = {
  _id: string;
  name: string;
  price: number;
  slug: string;
  description: string;
  sold: number;
  quantity: number;
  createdAt?:NativeDate;
  updatedAt?:NativeDate;

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
export type categoryInput = Omit<Category, " _id">;
