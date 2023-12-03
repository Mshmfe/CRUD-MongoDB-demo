import { Request, Response, NextFunction } from "express";

//now i use the interface because when i try to use  status the error is not know about the status and that give me the error in my code
import { Error } from "../types";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(error.status || 500).send({
    message: error.message,
  });
};
