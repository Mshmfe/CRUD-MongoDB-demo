import { Error } from "../types";

export const createHttpError = (status: number, message: string) => {
  const error: Error = new Error();
  //the error not know about status so that reason i see the error when i try to use status
  //in this case shoud be use interfase
  error.message = message;
  error.status = status;
  return error;
};
