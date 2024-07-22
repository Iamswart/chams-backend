import logger from "../logger";
import TopupService from "../services/topup";

export default class TopupController {
  private topupService = new TopupService();

  async fetchDataPlans(operator: string) {
    try {
      return await this.topupService.fetchDataPlans(operator);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
