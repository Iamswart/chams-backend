import { Schema, model, Document } from "mongoose";
import { IUser } from "./user";

export interface ICartItem extends Document {
  sessionId?: string;
  userId?: IUser["_id"];
  items: Array<{
    type: "airtime" | "data";
    amount: number;
    productId: string;  
    operator: string;   
    email: string;      
    // price?: number;     
    dataPlan?: string;
    phone?: string;
  }>;
}

const cartItemSchema = new Schema<ICartItem>({
  sessionId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      type: { type: String, enum: ["airtime", "data"], required: true },
      amount: { type: Number, required: true },
      productId: { type: String, required: true },
      operator: { type: String, required: true },
      email: { type: String, required: true },
      // price: { type: Number },
      dataPlan: { type: String },
      phone: {type: String},
    },
  ],
});

const CartItem = model<ICartItem>("CartItem", cartItemSchema);

export default CartItem;
