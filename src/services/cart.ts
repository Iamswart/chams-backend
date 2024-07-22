import { CartDetailsInput, FetchCartInput } from "../interfaces/cart";
import CartItem from "../models/cart";
import logger from "../logger";
import TopupService from "./topup";
import { badRequestError } from "../error";

export default class CartService {
  private topupService = new TopupService();

  public async addItemToCart(cartDetails: CartDetailsInput): Promise<any> {
    try {
      const itemsWithProductInfo = await Promise.all(
        cartDetails.items.map(async (item) => {
          if (item.type === "airtime") {
            const productInfo = await this.topupService.fetchTopupInfo(
              item.operator
            );
            if (!productInfo || productInfo.products.length === 0) {
              throw badRequestError(
                `No products found for operator ${item.operator}`
              );
            }

            const product = productInfo.products[0];
            return { ...item, productId: product.product_id };
          }
          return item;
        })
      );

      const criteria = cartDetails.userId
        ? { userId: cartDetails.userId }
        : { sessionId: cartDetails.sessionId };
      const newCartItem = new CartItem({
        ...cartDetails,
        ...criteria,
        items: itemsWithProductInfo,
      });

      await newCartItem.save();
      return newCartItem;
    } catch (error) {
      logger.error("Error adding item to cart:", error);
      throw badRequestError("Failed to add item to cart");
    }
  }



  public async fetchCartItems(input: FetchCartInput): Promise<any> {
    try {
      const criteria = input.userId
        ? { userId: input.userId }
        : { sessionId: input.sessionId };
      const cartItems = await CartItem.find(criteria);
      return cartItems;
    } catch (error) {
      logger.error(`Failed to fetch cart items:`, error);
      throw badRequestError("Failed to fetch cart items");
    }
  }
}
