import axios, { AxiosError, AxiosInstance } from 'axios';
import { FormModel, WidgetApi, PoolModel, PerformanceModel } from '../models';
import { HOSTS } from '../constants/hosts.constants';

interface ApiClientOptions {
  id: string;
}

interface ApiRequest<TRequest = any> {
  readonly url: string;
  readonly method?: 'GET' | 'DELETE' | 'POST' | 'PUT';
  readonly requestData?: TRequest;
}

export class ApiClient implements WidgetApi {
  private readonly client: AxiosInstance;
  private readonly id: string;

  constructor(options: ApiClientOptions) {
    this.client = axios.create();
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
      url: `${HOSTS.PROD.DAILY_REPORT}/daily-report/${this.id}/subscriber`,
      method: 'POST',
      requestData,
    });

  public sendMonthlyForm = async (requestData: FormModel) =>
    await this.callApi<void>({
      url: `${HOSTS.PROD.DAILY_REPORT}/daily-report/${this.id}/subscriber`,
      method: 'POST',
      requestData,
    });

  public getPools = async () =>
    await this.callApi<{ data: PoolModel[] }>({
      url: `${HOSTS.PROD.PROFILE}/organization/${this.id}/pool?benchmark=true`,
      method: 'GET',
    });

  public getPoolPerformance = async (poolId: string) =>
    await this.callApi<{ data: PerformanceModel[] }>({
      url: `${HOSTS.PROD.VOLUME}/pool/${poolId}/performance?benchmark=true`,
      method: 'GET',
    });

  private callApi<TResponse = any, TRequest = any>(
    request: ApiRequest<TRequest>
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      this.client
        .request<TResponse>({
          url: request.url,
          method: request.method ?? 'GET',
          data: request.requestData,
          responseType: 'json',
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
