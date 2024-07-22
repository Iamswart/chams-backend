import dotenv from "dotenv";

dotenv.config({});

import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import config from "./config/config";
import dbConnect from "./db";
import { handleError, unknownResourceError } from "./error";
import httpLogger from "./httpLogger";
import logger from "./logger";
import { routes } from "./routes";
import cookieParser from 'cookie-parser';


const app = express();

app.use(helmet());
app.use(express.json());

const corsOptions = {
    origin: config.frontendUrl, 
    credentials: true,
  };
app.use(cors(corsOptions));
app.use(cookieParser());

dbConnect();
app.use(httpLogger);
app.use(routes);




process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err);
  logger.error(err.name, err.message);
  process.exit(1);
});

app.use(function (request: Request, response: Response) {
  logger.error(`Route not found: ${request.path}`);
  throw unknownResourceError(
    `The route you are trying to reach (${request.path}) does not exist`
  );
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

const PORT = config.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));