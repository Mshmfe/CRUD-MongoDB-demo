import {Request,Response,NextFunction} from 'express';

import { errorHandler } from '../middleware/errorHandler';

const getAllProduct=(req:Request,res:Response,next:NextFunction)=>{
try {
    res.json({
        message:"all product are returned",
    });
} catch (error) {
    next(error);
};
};

export default getAllProduct;