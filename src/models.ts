interface InfraConfigurations {
  element?: HTMLElement;
}

export interface AppConfigurations {
  id?: string;
  container?: string;
  buttonColor: string;
  language: string;
}

export type Configurations = InfraConfigurations & AppConfigurations;

export interface FormModel {
  email: string;
  name: string;
}

export interface PoolModel {
  id: string;
  name: string;
  organization: string;
  start_date: string;
  status: string;
  benchmark: {
    id: string;
    name: string;
    organization: string;
    start_date: string;
    status: string;
  };
}

export interface PerformanceModel {
  allTime: number;
  benchmark: {
    allTime: number;
    date: string;
    day: number;
    month: number;
    quota: number;
    twoYears: number;
    year: number;
  };
  date: string;
  day: number;
  month: number;
  quota: number;
  twoYears: number;
  year: number;
}

export interface WidgetApi {
  sendDailyForm: (model: FormModel) => Promise<void>;
  sendMonthlyForm: (model: FormModel) => Promise<void>;
  getPools: () => Promise<{ data: [PoolModel] }>;
  getPoolPerformance: (poolId: string) => Promise<{ data: PerformanceModel }>;
}
