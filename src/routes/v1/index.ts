import { Router } from "express";
import { authRoutes } from "./auth";
import { topupRoutes } from "./topup";
import { cartRoutes } from "./cart";


const v1Routes: Router = Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/topup", topupRoutes);
v1Routes.use("/cart", cartRoutes);


export { v1Routes };
