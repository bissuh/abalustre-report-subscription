import axios, { AxiosError, AxiosInstance } from "axios";
import { FormModel, WidgetApi } from "../models";

interface ApiClientOptions {
  id: string;
}

interface ApiRequest<TRequest = any> {
  readonly url: string;
  readonly method?: "GET" | "DELETE" | "POST" | "PUT";
  readonly requestData?: TRequest;
}

export class ApiClient implements WidgetApi {
  private readonly client: AxiosInstance;
  private readonly id: string;

  constructor(options: ApiClientOptions) {
    this.client = axios.create({
      baseURL: "https://qmk6lnstqb.execute-api.us-east-1.amazonaws.com/prod/",
    });
    this.id = options.id;

    this.client.interceptors.response.use(undefined, (error: AxiosError) => {
      console.log(
        `Failed to call API`,
        error.response?.status,
        error.response?.data
      );
      return Promise.reject(error);
    });
  }

  public sendDailyForm = async (requestData: FormModel) =>
    await this.callApi<void>({
      url: `/daily-report/${this.id}/subscriber`,
      method: "POST",
      requestData,
    });

  public sendMonthlyForm = async (requestData: FormModel) =>
    await this.callApi<void>({
      url: `/daily-report/${this.id}/subscriber`,
      method: "POST",
      requestData,
    });

  private callApi<TResponse = any, TRequest = any>(
    request: ApiRequest<TRequest>
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      this.client
        .request<TResponse>({
          url: request.url,
          method: request.method ?? "GET",
          data: request.requestData,
          responseType: "json",
        })
        .then((response) =>
          response?.status && response.status >= 200 && response.status < 400
            ? resolve(response?.data)
            : reject(response?.data)
        )
        .catch((error: AxiosError) => reject(error.response ?? error.message));
    });
  }
}
