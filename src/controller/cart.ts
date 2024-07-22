import { CartDetailsInput, FetchCartInput } from "../interfaces/cart";
import logger from "../logger";
import CartService from "../services/cart";

export default class CartController {
  private cartService = new CartService();

  async fetchCartItems(input: FetchCartInput) {
    try {
      return await this.cartService.fetchCartItems(input);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async addItemToCart (cartDetails: CartDetailsInput) {
    try {
      return await this.cartService.addItemToCart(cartDetails);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
