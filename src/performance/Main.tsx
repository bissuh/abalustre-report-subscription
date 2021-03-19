import { h } from 'preact';
import style from './main.css';
import { Text } from 'preact-i18n';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { ServiceContext } from '../AppContext';
import { ConfigContext } from '../AppContext';
import { WidgetPool } from '../models';
import { numberFilters } from '../utils';
import { PERIODS } from '../constants';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/en';

dayjs.extend(localizedFormat);
dayjs.extend(utc);

const Main = () => {
  const { format } = numberFilters;
  const config = useContext(ConfigContext);
  const [pools, setPools] = useState<any[]>([]);
  const [widget, setWidget] = useState<WidgetPool | undefined>(undefined);
  const service = useContext(ServiceContext);

  dayjs.locale(config.language === 'pt-BR' ? 'pt-br' : 'en');

  const loadPools = useCallback(async () => {
    const widgetResponse = await service?.getWidgetPools();
    const poolsList = widgetResponse?.data.pools || [];
    setWidget(widgetResponse);

    if (poolsList.length === 0) return;

    const responses = await Promise.all(
      poolsList.map((pool) => service?.getPoolPerformance(pool.poolId))
    );

    if (!responses) setPools([]);
    const newPools: any[] = [];

    poolsList.forEach((pool, idx) => {
      newPools.push({ ...pool, ...responses[idx]?.data });
    });

    setPools(newPools);
  }, []);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  return (
    <table
      className={style.table}
      style={{ borderTop: `3px solid ${config.buttonColor}` }}
    >
      <thead>
        <tr className={style.header}>
          <td>
            <Text id="fund">fund</Text>
          </td>
          <td></td>
          <td>
            <Text id="date">date</Text>
          </td>
          <td className={style.algRight}>
            <Text id="quota">quota</Text>
          </td>
          <td className={style.algRight}>
            <Text id="day">day</Text>
          </td>
          {widget?.data.periods.map((item: string) => (
            <td className={style.algRight}>
              <Text id={item}>{PERIODS.DETAILS[item].label}</Text>
            </td>
          ))}
          <td style={{ textAlign: 'center' }}>status</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            style={{
              padding: 0,
              borderCollapse: 'collapse',
              height: '2px',
              backgroundColor: '#9f9f9f',
            }}
            colSpan={11}
          ></td>
        </tr>

        {pools.map((pool) => (
          <tr id={pool.id}>
            <td style={{ verticalAlign: 'top' }}>
              {pool.details_webpage ? (
                <a
                  className={style.cleanLink}
                  href={`${pool.details_webpage}?utm_source=website&utm_medium=widget`}
                >
                  {pool.name}
                </a>
              ) : (
                pool.name
              )}
            </td>

            <td>
              {pool.start_date && (
                <div className={style.tooltip}>
                  <img
                    alt={dayjs.utc(pool.start_date).format('DD/MM/YYYY')}
                    src="https://abalustre-assets.s3.amazonaws.com/information.png"
                    style={{ cursor: 'pointer' }}
                    width={15}
                  />
                  <span className={style.tooltiptext}>
                    <strong>
                      <p>{pool.fullname || pool.name}</p>
                    </strong>
                    <p>CNPJ: {pool.document}</p>
                    <p>
                      <Text id="since">Since</Text>
                      {`: `}
                      {dayjs.utc(pool.start_date).format('DD MMMM YYYY')}
                    </p>
                  </span>
                </div>
              )}
            </td>
            <td style={{ minWidth: '75px' }}>
              {pool.date && dayjs.utc(pool.date).format('DD MMM YY')}
            </td>
            <td className={style.algRight}>
              {format({
                value: pool.quota,
                divisor: 100000000,
                locale: config.language,
                maxFraction: 8,
                minFraction: pool.decimal_places,
                nullValue: '-',
              })}
            </td>
            <td className={style.algRight}>
              {format({
                value: pool.day,
                locale: config.language,
                unit: 'percent',
                nullValue: '-',
                divisor: 1,
                maxFraction: 2,
                minFraction: 2,
              })}
            </td>
            {widget?.data.periods.map((item: string) => {
              if (pool[item])
                return (
                  <td className={style.algRight}>
                    {format({
                      value: pool[item],
                      locale: config.language,
                      unit: 'percent',
                      nullValue: '-',
                      divisor: 1,
                      maxFraction: 2,
                      minFraction: 2,
                    })}
                  </td>
                );

              return <td className={style.algRight}>-</td>;
            })}

            <td className={style.capitalize} style={{ textAlign: 'center' }}>
              {pool.start_date && <Text id={pool.status}>{pool.status}</Text>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Main;
