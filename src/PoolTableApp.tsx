import { h } from 'preact';
import { Configurations } from './models';
import Main from './poolTable/Main';
import { AppContext } from './AppContext';
import { IntlProvider } from 'preact-i18n';
import pt from './i18n/pt-BR.json';

type Props = Configurations;
export const PoolTableApp = ({ element, ...appSettings }: Props) => {
  const languages = { 'pt-BR': pt };

  return (
    <IntlProvider definition={languages[appSettings.language]}>
      <AppContext config={appSettings}>
        <Main />
      </AppContext>
    </IntlProvider>
  );
};
