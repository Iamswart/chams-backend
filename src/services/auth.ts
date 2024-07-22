import bcrypt from "bcrypt";
import { badRequestError } from "../error";
import {
  LoginInterface,
  RegisterInterface
} from "../interfaces/auth";
import User from "../models/user";


export default class AuthService {
  async register(input: RegisterInterface) {
    const { email, password, phone } = input;

    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      throw badRequestError(
        "Email address already exist, please login to continue"
      );
    }

    const phoneExist = await User.findOne({ phone: phone });
    if (phoneExist) {
      throw badRequestError("Phone Number already exist");
    }

    const user = await User.create({
      email,
      phone,
      password,
    });
    
    const accessToken = user.generateAuthToken();
   
    return {
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
      },
      accessToken
    };
  }

  async login(input: LoginInterface) {
    const { email, phone, password } = input;

    let loginCriteria = {};
    if (email) {
      loginCriteria = { email };
    } else if (phone) {
      loginCriteria = { phone };
    } else {
      throw badRequestError("Login method not provided");
    }

    const user = await User.findOne(loginCriteria);
    if (!user) {
      throw badRequestError("Email/Phone or Password Incorrect");
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      throw badRequestError("Email/Phone or Password Incorrect");
    }

    const accessToken = user.generateAuthToken();
   
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
      },
      accessToken
    };
  }

}