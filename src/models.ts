interface InfraConfigurations {
  element?: HTMLElement;
}

export interface AppConfigurations {
  id: string;
}

export type Configurations = InfraConfigurations & AppConfigurations;

export interface FormModel {
  email: string;
  name: string;
}

export interface WidgetApi {
  sendDailyForm: (model: FormModel) => Promise<void>;
  sendMonthlyForm: (model: FormModel) => Promise<void>;
}
