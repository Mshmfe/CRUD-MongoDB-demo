import multer from "multer"

const productStorage = multer.diskStorage({
    //the  destination folder/where i want to store my images
    destination: function (req, file, cb) {
      cb(null, 'puplic/images/products')
    },
    //this for create the name of the file
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  
 export const upload = multer({ storage: productStorage })