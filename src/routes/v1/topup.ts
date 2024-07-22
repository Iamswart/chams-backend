import { celebrate, Segments } from "celebrate";
import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
  apiKeyAuthMiddleware, protect
} from "../../middleware/auth";
import {
  operatorSchema,
} from "../../utils/validationSchema";
import TopupController from "../../controller/topup";

const topupRoutes: Router = Router();
const topupController = new TopupController();

topupRoutes.get(
    "/get-data-plans/:operator",
    apiKeyAuthMiddleware,
    protect,
    celebrate({ [Segments.PARAMS]: operatorSchema }),  
    asyncHandler(async (request, response) => {
      const operator = request.params.operator; 
      try {
        const data = await topupController.fetchDataPlans(operator);
        response.status(200).json(data);
      } catch (error) {
        response.status(400).json({ message: error.message });
      }
    })
  );



export { topupRoutes };
