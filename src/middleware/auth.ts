import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { authenticationError } from "../error";
import logger from "../logger";
import { JWTUser } from "../utils/jwt-user";
import { v4 as uuidv4 } from "uuid";

export interface CustomRequest extends Request {
  sessionId?: string;
}

export const protect = asyncHandler(
  async (request: CustomRequest, response: Response, next: NextFunction) => {
    try {
      const token = getAuthToken(request);
      if (token) {
        const decodedValue = decodeToken(token);
        response.locals.user = new JWTUser(decodedValue);
        logger.info(
          `User ${response.locals.user.id} accessed ${request.url} route`
        );
      } else {
        let sessionId = request.cookies.sessionId;
        if (!sessionId) {
          sessionId = uuidv4();
          response.cookie("sessionId", sessionId, {
            httpOnly: true,
            secure: true,
          });
        }
        request.sessionId = sessionId;
        logger.info(
          `Guest with session ${sessionId} accessed ${request.url} route`
        );
        response.locals.isGuest = true;
      }
    } catch (error) {
      logger.error(`Authentication error: ${error.message}`);
      response.locals.isGuest = true;
    }
    next();
  }
);

function getAuthToken(request: Request): string | null {
  let token = request.headers["authorization"];
  if (token && token.startsWith("Bearer ")) {
    return token.split(" ")[1];
  }
  return null;
}

function decodeToken(token: string) {
  try {
    console.log(token, config.jwtSecret);
    const decodedToken = jwt.verify(token, config.jwtSecret as string);

    return decodedToken;
  } catch (error) {
    throw authenticationError("Error occured while validating token");
  }
}

export const apiKeyAuthMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const receivedApiKey = request.get("x-api-key");

  if (!receivedApiKey || receivedApiKey !== config.apiKey) {
    throw authenticationError("Unauthorized. API key is missing or invalid");
  }
  next();
};
