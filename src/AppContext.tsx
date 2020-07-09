import { h, createContext, ComponentChildren } from "preact";
import { ApiClient } from "./services/apiClient";
import { useRef } from "preact/hooks";
import { AppConfigurations, WidgetApi } from "./models";

export const ConfigContext = createContext<AppConfigurations>(
  {} as AppConfigurations
);
export const ServiceContext = createContext<WidgetApi | undefined>(undefined);

interface Props {
  children: ComponentChildren;
  config: AppConfigurations;
}

export const AppContext = ({ children, config }: Props) => {
  const services = useRef(new ApiClient({ id: config.id }));
  return (
    <ConfigContext.Provider value={config}>
      <ServiceContext.Provider value={services.current}>
        {children}
      </ServiceContext.Provider>
    </ConfigContext.Provider>
  );
};
