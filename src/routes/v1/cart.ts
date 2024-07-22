import { celebrate } from "celebrate";
import { Response, Router } from "express";
import asyncHandler from "express-async-handler";
import {
  CustomRequest,
  apiKeyAuthMiddleware,
  protect,
} from "../../middleware/auth";
import {
  cartItemSchema,
} from "../../utils/validationSchema";
import CartController from "../../controller/cart";
import { CartDetailsInput, FetchCartInput } from "../../interfaces/cart";

const cartRoutes: Router = Router();
const cartController = new CartController();

cartRoutes.post(
  "/add-items-to-cart",
  apiKeyAuthMiddleware,
  protect,
  celebrate({ body: cartItemSchema }),
  asyncHandler(async (request: CustomRequest, response: Response) => {
    const { items } = request.body;
    const cartDetails: CartDetailsInput = {
      items,
      sessionId: response.locals.isGuest ? request.sessionId : undefined,
      userId: response.locals.user ? response.locals.user.id : undefined,
    };
    const data = await cartController.addItemToCart(cartDetails);

    response.status(201).json(data).end();
  })
);

cartRoutes.get(
  "/fetch-cart-items",
  apiKeyAuthMiddleware,
  protect,
  asyncHandler(async (request: CustomRequest, response: Response) => {
    try {
      const sessionId = response.locals.isGuest ? request.sessionId : undefined;
      const userId = response.locals.user ? response.locals.user.id : undefined;
      
      const fetchInput: FetchCartInput = {
        sessionId,
        userId,
      };
      const data = await cartController.fetchCartItems(fetchInput);
      response.status(200).json(data);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  })
);

export { cartRoutes };
