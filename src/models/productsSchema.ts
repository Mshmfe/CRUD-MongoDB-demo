import {Schema,model} from 'mongoose';

 export const productsSchema= new Schema ({
    id:String,
    name:String,
    price:Number,
});

//create the model-> think about as table 
//need 2 thing the name of the modle and what the schema the modle go to follow
// is like the collection when i create collection =>db.createCollection('products')
model('Products',productsSchema);