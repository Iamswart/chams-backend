import jwt from "jsonwebtoken";
import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/config";


interface IUserDocument extends Document {
  generateAuthToken(expirationTime?: string): string;
  generateRefreshToken(): string;
}

export interface IUser extends IUserDocument {
  email: string;
  phone: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 1024 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
});

userSchema.methods.generateAuthToken = function (expirationTime?: string) {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.jwtSecret as string,
    { expiresIn: expirationTime || config.jwtExpiration }
  );
  return token;
};

userSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = model<IUser>("User", userSchema);

export default User;
