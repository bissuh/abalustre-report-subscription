import { h } from 'preact';
import { ServiceContext, ConfigContext } from '../AppContext';
import { OrganizationModel, PoolModel } from '../models';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import style from './main.css';
import { Text } from 'preact-i18n';
import { numberFilters } from '../utils';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en';

dayjs.extend(localizedFormat);
dayjs.extend(utc);

const Main = () => {
  const { format } = numberFilters;
  const service = useContext(ServiceContext);
  const config = useContext(ConfigContext);
  const [pool, setPool] = useState<PoolModel | undefined>(undefined);
  const [organization, setOrganization] = useState<
    OrganizationModel | undefined
  >(undefined);
  const [description, setDescription] = useState<string[]>(['']);
  const [boxes, setBoxes] = useState<preact.JSX.Element[]>([]);
  const [clean, setClean] = useState<preact.JSX.Element[]>([]);
  const [aumAverage, setAumAverage] = useState<string>('');
  const [aumStrategy, setAumStrategy] = useState<string>('');

  dayjs.locale(config.language === 'pt-BR' ? 'pt-br' : 'en');

  const loadPools = useCallback(async () => {
    const [pools, org, aum] = await Promise.all([
      service?.getPools(),
      service?.getOrganizationById(),
      service?.getPoolAum(config.poolId || ''),
    ]);
    const poolsList = pools?.data || [];

    if (poolsList.length === 0) return;
    const temp = poolsList.find((item) => item.id === config.poolId);

    if (!temp || !aum) return;
    setPool(temp);
    setOrganization(org?.data);
    setDescription(temp.description?.split(/\r?\n/g) || ['']);
    setAumAverage(aum.data.aum_average);
    setAumStrategy(aum.data.aum_strategy);

    const boxOn: preact.JSX.Element[] = [];
    for (let i = 1; i <= (temp.risk || 0); i++) {
      boxOn.push(<div className={style.risk}></div>);
    }
    boxOn.map((item) => item);
    setBoxes(boxOn);

    const boxOff: preact.JSX.Element[] = [];
    for (let i = 1; i <= 50 - (temp.risk || 0); i++) {
      boxOff.push(<div className={style['non-risk']}></div>);
    }
    boxOff.map((item) => item);
    setClean(boxOff);
  }, []);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  const copyToClipboard = () => {
    const copyText = document.getElementById('tocopy');

    if (!copyText) return;

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand('copy');
    document.getElementById('copy-feedback').style.visibility = 'visible';
  };

  return (
    <table className={style.main}>
      <tr className={style.row}>
        <td className={style.label}>
          <Text id="about">description</Text>
        </td>
        <td className={style.body}>
          {description.map((item) => (
            <p>{item}</p>
          ))}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="recommended_investors">Recommended Investors</Text>
        </td>
        <td className={style.body}>{pool?.recommended_investors}</td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="risk_profile">Risk Profile</Text>
        </td>
        <td className={style.body}>
          <div className={style['risk-box']}>
            {boxes.map((item) => item)}
            {clean.map((item) => item)}
            <div style={{ width: '10px' }}></div>
            {format({
              value: pool?.risk || 0,
              divisor: 10,
              locale: config.language,
              maxFraction: 1,
              minFraction: 1,
              nullValue: '-',
            })}{' '}
            /{' '}
            {format({
              value: 50,
              divisor: 10,
              locale: config.language,
              maxFraction: 1,
              minFraction: 1,
              nullValue: '-',
            })}
          </div>
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="minimum_first_application">Minimum first application</Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.first_application,
            divisor: 100,
            locale: config.language,
            maxFraction: 2,
            minFraction: 2,
            nullValue: '-',
            type: 'BRL',
          })}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="minimum_transaction">Minimum transaction</Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.minimum_transaction,
            divisor: 100,
            locale: config.language,
            maxFraction: 2,
            minFraction: 2,
            nullValue: '-',
            type: 'BRL',
          })}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="minimum_balance">Minimum balance</Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.minimum_balance,
            divisor: 100,
            locale: config.language,
            maxFraction: 2,
            minFraction: 2,
            nullValue: '-',
            type: 'BRL',
          })}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="minimum_first_application_pco">
            PCO minimum first application
          </Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.first_application_pco,
            divisor: 100,
            locale: config.language,
            maxFraction: 2,
            minFraction: 2,
            nullValue: '-',
            type: 'BRL',
          })}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="minimum_transaction_pco">PCO minimum transaction</Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.minimum_transaction_pco,
            divisor: 100,
            locale: config.language,
            maxFraction: 2,
            minFraction: 2,
            nullValue: '-',
            type: 'BRL',
          })}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="minimum_balance_pco">PCO minimum balance</Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.minimum_balance_pco,
            divisor: 100,
            locale: config.language,
            maxFraction: 2,
            minFraction: 2,
            nullValue: '-',
            type: 'BRL',
          })}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="quota_application">quota application</Text>
        </td>
        <td className={style.body}>
          {`${pool?.quota_application || ''} `}
          <Text id={`${pool?.quota_application_day_type}_days`}>
            {pool?.quota_application_day_type}
          </Text>
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="quota_redemption">quota redemption</Text>
        </td>
        <td className={style.body}>
          {`${pool?.quota_redemption || ''} `}
          <Text id={`${pool?.quota_redemption_day_type}_days`}>
            {pool?.quota_redemption_day_type}
          </Text>
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="redemption_payment">redemption payment</Text>
        </td>
        <td className={style.body}>
          {`${pool?.redemption_payment || ''} `}
          <Text id={`${pool?.redemption_payment_day_type}_days`}>
            {pool?.redemption_payment_day_type}
          </Text>
          {` `}
          <Text id="after_quotization">after quotization</Text>
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="redemption_payment">redemption payment</Text>
        </td>
        <td className={style.body}>
          {`${pool?.redemption_payment || ''} `}
          <Text id={`${pool?.redemption_payment_day_type}_days`}>
            {pool?.redemption_payment_day_type}
          </Text>
          {` `}
          <Text id="after_quotization">after quotization</Text>
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="administrative_fee">administrative fee</Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.administrative_fee,
            divisor: 10000,
            locale: config.language,
            nullValue: '-',
            unit: 'percent',
          })}
          {` `}
          {pool?.administrative_fee_base || ''}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="performance_fee">performance fee</Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.performance_fee,
            divisor: 10000,
            locale: config.language,
            nullValue: '-',
            unit: 'percent',
          })}
          {` `}
          {pool?.performance_fee_base || ''}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="taxing">taxing</Text>
        </td>
        <td className={style.body}>
          {format({
            value: pool?.taxing,
            divisor: 10000,
            locale: config.language,
            nullValue: '-',
            unit: 'percent',
          })}
          {` `}
          {pool?.taxing_base || ''}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="manager">manager</Text>
        </td>
        <td className={style.body}>{organization?.formal_name}</td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="administrator">administrator</Text>
        </td>
        <td className={style.body}>{pool?.administrator}</td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="custodian">custodian</Text>
        </td>
        <td className={style.body}>{pool?.custodian}</td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="auditor">auditor</Text>
        </td>
        <td className={style.body}>{pool?.auditor}</td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="anbima">anbima category</Text>
        </td>
        <td className={style.body}>{pool?.anbima}</td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="bloomberg_code">bloomberg code</Text>
        </td>
        <td className={style.body}>
          <input
            id="tocopy"
            className={style.invisibleInput}
            readonly
            value={pool?.bloomberg_code}
          />
          <button
            id="copy-button"
            className={style.copy}
            onClick={copyToClipboard}
          >
            <Text id="copy">copy</Text>
          </button>
          <span id="copy-feedback" className={style.copyFeedback}>
            <Text id="copied">copied</Text>!
          </span>
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="document">registration number</Text>
        </td>
        <td className={style.body}>{pool?.document}</td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="since">started at</Text>
        </td>
        <td className={style.body}>
          {dayjs.utc(pool?.start_date).format('DD MMMM YYYY')}
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="aum_average">aum average</Text>
        </td>
        <td className={style.body}>
          {format({
            value: parseInt(aumAverage, 10),
            divisor: 100000000,
            locale: config.language,
            maxFraction: 2,
            minFraction: 2,
            nullValue: '-',
            type: 'BRL',
          })}{' '}
          MM (<Text id="last_12_months">last 12 months</Text>)
        </td>
      </tr>

      <tr className={style.row}>
        <td className={style.label}>
          <Text id="aum_strategy">aum strategy</Text>
        </td>
        <td className={style.body}>
          {format({
            value: parseInt(aumStrategy, 10),
            divisor: 100000000,
            locale: config.language,
            maxFraction: 2,
            minFraction: 2,
            nullValue: '-',
            type: 'BRL',
          })}{' '}
          MM
        </td>
      </tr>
    </table>
  );
};

export default Main;
