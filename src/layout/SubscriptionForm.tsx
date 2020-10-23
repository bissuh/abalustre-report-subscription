import { h } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { ServiceContext } from '../AppContext';
import Field from '../components/Field';
import Checkbox from '../components/Checkbox';
import { useIsMounted } from '../hooks';
import style from './subscriptionForm.css';

interface Props {
  onClose(): void;
}

const SubscriptionForm = ({ onClose }: Props) => {
  const mounted = useIsMounted();
  const service = useContext(ServiceContext);

  const [dailyNews, setDailyNews] = useState(false);
  const [monthlyNews, setMonthlyNews] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const emailRegex = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailError = useMemo(
    () =>
      mounted.current && (!emailValue || !emailRegex.test(emailValue))
        ? 'Digite um e-mail válido.'
        : '',
    [emailValue, submitting, mounted]
  );

  const formValid = useMemo(() => ![emailError].reduce((m, n) => m + n), [
    emailError,
  ]);

  const subscribe = async () => {
    try {
      if (dailyNews) {
        await service?.sendDailyForm({ email: emailValue, name: nameValue });
        await service?.sendMonthlyForm({ email: emailValue, name: nameValue });
      }

      if (monthlyNews) {
        await service?.sendMonthlyForm({ email: emailValue, name: nameValue });
      }

      setSubmitting(false);
      setSubscribed(true);
    } catch (e) {
      setServerError(
        `Alguma coisa aconteceu e não conseguimos adicionar você. Por favor, tente mais tarde.`
      );
    }
  };

  useEffect(() => {
    if (!submitting) {
      return;
    }

    setServerError(''); // reset previous server error
    if (!formValid) {
      setSubmitting(false);
      return;
    }

    subscribe();
  }, [formValid, submitting, emailValue, nameValue]);

  if (subscribed) {
    return (
      <div className={style.thanks}>
        <p>Pronto!</p>
        <p>
          Você está na nossa lista e será informado sobre nossos resultados.
        </p>
        <button onClick={onClose}>Voltar</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitting(true);
      }}
    >
      {serverError && <div className={style.error}>{serverError}</div>}
      <Field
        name="name"
        title="Nome"
        render={(inputProps) => (
          <input
            type="text"
            disabled={submitting}
            autoFocus
            onInput={(e) => setNameValue(e.currentTarget.value)}
            {...inputProps}
          />
        )}
      />
      <Field
        name="email"
        title="E-mail"
        error={emailError}
        render={(inputProps) => (
          <input
            type="text"
            inputMode="email"
            disabled={submitting}
            onInput={(e) => setEmailValue(e.currentTarget.value)}
            {...inputProps}
          />
        )}
      />
      <Checkbox
        name="dailyReport"
        title="Relatório Diário + Mensal"
        render={(inputProps) => (
          <input
            type="checkbox"
            onChange={(e) => setDailyNews(e.currentTarget.checked)}
            {...inputProps}
          />
        )}
      />
      <Checkbox
        name="monthlyReport"
        title="Relatório Mensal"
        render={(inputProps) => (
          <input
            type="checkbox"
            onChange={(e) => setMonthlyNews(e.currentTarget.checked)}
            {...inputProps}
          />
        )}
      />
      <div className={style.actions}>
        <button className={style.secondary} onClick={onClose}>
          Cancelar
        </button>

        <button type="submit" disabled={submitting || !formValid}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
