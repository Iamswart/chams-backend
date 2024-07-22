import dotenv from "dotenv";

dotenv.config({});

export const VERSION = {
    v1: "/api/v1",
};

export default {
  mongo_uri: process.env.MONGO_URI,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: Number(process.env.JWT_EXPIRATION),
  apiKey: process.env.API_KEY,
  frontendUrl: process.env.FRONTEND_URL,
  seerbitBaseurl: process.env.SEERBIT_BASE_URL as string,
  seerbitUsername: process.env.SEERBIT_USERNAME as string,
  seerbitPassword: process.env.SEERBIT_PASSWORD as string,
  mtnTestNumber: process.env.MTN_TEST_NUMBER as string,
  airtelTestNumber: process.env.AIRTEL_TEST_NUMBER as string,
  gloTestNumber: process.env.GLO_TEST_NUMBER as string,
  ninemobileTestNumber: process.env.NINEMOBILE_TEST_NUMBER as string,
  airtimeEndpoint: process.env.AIRTIME_ENDPOINT as string,
  dataEndpoint: process.env.DATA_ENDPOINT as string
};