import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

import { dev } from "../config/server";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  address: string;
  phone: string;
  isAdmin: boolean;
  isBanned: boolean;
}
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    require: [true, "please give the name of the user"],
    trim: true,
    minlength: [3, " name must be at least 3 characters long"],
    maxlength: [300, " name must be at most 300 characters "],
  },
  email: {
    type: String,
    require: [true, "please give the email address "],
    trim: true,
    unique: true,
    lowercase: true,
    //to  chick if the email is valid or not
    validate: {
      validator: (email: string) => {
        const re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      message: (props: any) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    require: [true, "please give the password address "],
    minlength: [6, " passwoed must be at least 8 characters long"],
    trim: true,
    // ANY VALUE THE USER WILL GIVE IT WILL BE STORE INSIDE THE password THEN USE THE bcrypt BACKAGE TO HASH THE PASSWORD
    //10 THIS MEAN THE PASS WILL BE CHANGE 10 TIME 
    // set:(password:string)=> bcrypt.hashSync(password,10)
    
  },
  image: {
    type: String,
    default:dev.app.defaultImagePath,
  },
  address: {
    type: String,
    require: [true, "please give the address "],
    trim:true,
    minlength: [3, " address must be at least 3 characters long"],

  },
  phone: {
    type: String,
    require: [true, "please give the phone number"],
    trim:true,
  },
  isAdmin: {
    type: Boolean,
    default:false,
  },
  isBanned: {
    type: Boolean,
    default:false,
  },
},{timestamps:true});

export const userModel = model<IUser>("User", userSchema);
