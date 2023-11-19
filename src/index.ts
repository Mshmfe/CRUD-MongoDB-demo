import express, { Application } from "express";

import { dev } from "./config/server";
import { errorHandler } from "./middleware/errorHandler";
import productRoutes from "./routes/productsRoutes";
import { connectDB } from "./config/db";
import morgan from "morgan";

const app: Application = express();
const port: number = dev.app.port;

app.listen(port, () => {
  console.log(`Server running at: http://127.0.0.1:${port}/`);
  //call the function for DB
  connectDB();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use("/products", productRoutes);
app.use(errorHandler);
