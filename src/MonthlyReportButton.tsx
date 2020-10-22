import { h } from 'preact';
import { Configurations } from './models';
import Main from './monthlyReportButton/Main';
import { AppContext } from './AppContext';

type Props = Configurations;
export const MonthlyReportButton = ({ element, ...appSettings }: Props) => (
  <AppContext config={appSettings}>
    <Main />
  </AppContext>
);
