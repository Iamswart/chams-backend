import axios, { AxiosInstance } from "axios";
import config from "../config/config";
import { authenticationError, badRequestError, seerbitError } from "../error";
import logger from "../logger";

export default class TopupService {
  private cachedToken: string | null = null;
  private tokenExpires: number = 0;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(undefined, async (error: any) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const token = await this.authenticate();
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return this.axiosInstance(originalRequest);
      }
      return Promise.reject(error);
    });
  }

  private async authenticate(): Promise<string> {
    const now = new Date().getTime();
    if (this.cachedToken && this.tokenExpires > now) {
        return this.cachedToken;
    }

    try {
        const response = await axios.post(`${config.seerbitBaseurl}/auth`, {
            username: config.seerbitUsername,
            password: config.seerbitPassword,
        });
        if (response.data && response.data.token) {
            this.cachedToken = response.data.token;
            const expiresIn = response.data.expires ? new Date(response.data.expires).getTime() - now : 3600000;
            this.tokenExpires = now + expiresIn;
            return this.cachedToken!;
        } else {
            throw new Error("Authentication failed: No token received");
        }
    } catch (error) {
        logger.error("Authentication failed:", error.response ? error.response.data : error.message);
        throw authenticationError("Authentication service failed");
    }
}


  private async getTestNumberByOperator(operator: string): Promise<string> {
    switch (operator.toLowerCase()) {
      case "mtn": return config.mtnTestNumber;
      case "glo": return config.gloTestNumber;
      case "airtel": return config.airtelTestNumber;
      case "9mobile": return config.ninemobileTestNumber;
      default: throw badRequestError("Unsupported operator");
    }
  }

  public async fetchData(endpoint: string, operator: string): Promise<any> {
    if (!endpoint) {
      throw badRequestError("Endpoint configuration is missing");
    }

    const token = await this.authenticate();
    const msisdn = await this.getTestNumberByOperator(operator);
    try {
      const response = await this.axiosInstance.get(`${config.seerbitBaseurl}/${endpoint}/${msisdn}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch ${endpoint} for ${msisdn}:`, error.response ? error.response.data : error.message);
      throw seerbitError(`Failed to fetch data from ${endpoint}`);
    }
  }

  public async fetchTopupInfo(operator: string): Promise<any> {
    return this.fetchData(config.airtimeEndpoint, operator);
  }

  public async fetchDataTopupInfo(operator: string): Promise<any> {
    return this.fetchData(config.dataEndpoint, operator);
  }

  public async fetchDataPlans(operator: string): Promise<any> {
    try {
      const dataPlans = await this.fetchData(config.dataEndpoint, operator);
      return dataPlans.products.map((product: any) => ({
        productId: product.product_id,
        price: product.price,
        dataAmount: product.data_amount,
      }));
    } catch (error) {
      logger.error(`Failed to fetch data plans for ${operator}:`, error.message);
      throw badRequestError("Failed to fetch data plans");
    }
  }
}
