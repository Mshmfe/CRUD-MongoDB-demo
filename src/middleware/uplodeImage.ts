import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const productStorage = multer.diskStorage({
  //the  destination folder/where i want to store my images
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "puplic/images/products");
  },
  //this for create the name of the file
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const usertStorage = multer.diskStorage({
  //the  destination folder/where i want to store my images
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "puplic/images/users");
  },
  //this for create the name of the file
  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  //to check if the file type is image or not
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("File is not an image"));
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("File type is not allowed!"));
  }
  cb(null, true);
};

export const uploadProduct = multer({ storage: productStorage });

export const uploadUser = multer({
  storage: usertStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});
