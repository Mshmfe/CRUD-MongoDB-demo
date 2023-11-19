export type Product = {
  id: string;
  name: string;
  price: number; 
};

export type productInput = Omit<Product, "id">;
