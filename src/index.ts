import express, { Application } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { dev } from "./config/server";
import { errorHandler } from "./middleware/errorHandler";
import productRoutes from "./routes/productsRoutes";
import { connectDB } from "./config/db";
import { createHttpError } from "./utility/createError";
import categoryRouter from "./routes/categoryRoutes";
import userRouter from "./routes/userRoutes";
import authRoter from "./routes/authRote";

const app: Application = express();
const port: number = dev.app.port;

app.listen(port, () => {
  console.log(`Server running at: http://127.0.0.1:${port}/`);
  //call the function for DB
  connectDB();
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/products", productRoutes);
app.use("/category",categoryRouter)
app.use("/user",userRouter)
app.use('/auth',authRoter)
//clint error
app.use((req, res, next) => {
  const error = createHttpError(404, "Route Not Found");
  next(error);
});
app.use(errorHandler);


