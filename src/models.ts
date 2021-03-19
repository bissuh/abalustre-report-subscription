interface InfraConfigurations {
  element?: HTMLElement;
}

export interface Pagination {
  pages: number;
  items: number;
  current: number;
}

export interface AumReportModel {
  aum_average: string;
  aum_strategy: string;
}

export interface AppConfigurations {
  buttonColor: string;
  buttonLabel: string;
  container?: string;
  id?: string;
  language: string;
  poolId?: string;
  widgetId?: string;
}

export type Configurations = InfraConfigurations & AppConfigurations;

export interface FormModel {
  email: string;
  name: string;
}

export interface MonthlyReport {
  month: string;
  path: string;
}

export interface WidgetPool {
  data: {
    periods: [string];
    pools: [PoolModel];
  };
}

export interface OrganizationModel {
  id: string;
  formal_name?: string;
}

export interface PoolModel {
  administrator?: string;
  administrative_fee?: number;
  administrative_fee_base?: string;
  anbima?: string;
  auditor?: string;
  bloomberg_code?: string;
  custodian?: string;
  description?: string;
  document?: string;
  first_application?: number;
  first_application_pco?: number;
  id: string;
  minimum_balance?: number;
  minimum_balance_pco?: number;
  minimum_transaction?: number;
  minimum_transaction_pco?: number;
  name: string;
  organization: string;
  performance_fee: number;
  performance_fee_base: string;
  quota_application?: number;
  quota_application_day_type?: string;
  quota_redemption?: string;
  quota_redemption_day_type?: string;
  recommended_investors?: string;
  redemption_payment?: string;
  redemption_payment_day_type?: string;
  risk?: number;
  start_date: string;
  status: string;
  taxing?: number;
  taxing_base?: string;
  poolId: string;
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
  getOrganizationById: () => Promise<{ data: OrganizationModel }>;
  getPools: () => Promise<{ data: [PoolModel] }>;
  getPoolAum: (poolId: string) => Promise<{ data: AumReportModel }>;
  getPoolPerformance: (poolId: string) => Promise<{ data: PerformanceModel }>;
  getWidgetPools: () => Promise<WidgetPool>;
  getMonthlyReport: (month: string) => Promise<{ data: MonthlyReport }>;
  getMonthlyReports: (
    page?: number
  ) => Promise<{
    data: [MonthlyReport];
    pagination: Pagination;
  }>;
}
