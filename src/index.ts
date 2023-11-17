import express, { Application, Request, Response } from "express";

import { dev } from "./config/server";
import { errorHandler } from "./middleware/errorHandler";
import productRoutes from "./routes/productsRoutes";
import { connectDB } from "./config/db";

const app: Application = express();
const port:number= dev.app.port;

app.listen(port, () => {
    console.log(`Server running at: http://127.0.0.1:${port}/`);
    //call the function for DB
     connectDB();
  });
  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/products',productRoutes);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({message:"hello in my server"});
});



