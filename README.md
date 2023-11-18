# Express MongoDB TypeScript 

# Products CRUD operation
step1=> connect mongodb from the express server inside index.ts file  and the package help us to do this connect is mongoose

step2=> create Schema and model insid models folder and the packeg help us to do this schema is mongoose

step3 => now i can do the CRUD operation any req in db i will do by using the model (Products)

1- get all the product ->which means find all the product -->using productModel.find()

2- to find or get single product i can used this function findById() and base the id inside this function 

3-to delete single product i can used this function findByIdAndDelete(id) and base the id inside this function 

4-and to save the new data in my database i can used .save();

5- to update rhe single product i can used this function findByIdAndUpdate(id);
when i want to get the new vertion i can used {new:true }inside the findByIdAndUpdate function  