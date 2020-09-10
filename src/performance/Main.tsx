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

  if (pools.length === 0)
    return (
      <div className={style.table}>
        <p>
          <Text id="loading">Loading</Text>...
        </p>
      </div>
    );

  return (
    <table className={style.table}>
      <thead>
        <tr className={style.header}>
          <td>
            <Text id="pool">pool</Text>
          </td>
          <td>DATA</td>
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
          <td></td>
          <td>status</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            style={{
              padding: 0,
              borderCollapse: 'collapse',
              height: '3px',
              backgroundColor: config.buttonColor,
            }}
            colSpan={11}
          ></td>
        </tr>

        {pools.map((pool) => (
          <tr id={pool.id}>
            <td>{pool.name}</td>
            <td>{pool.date && dayjs.utc(pool.date).format('DD/MM/YYYY')}</td>
            <td className={style.algRight}>
              {format({
                value: pool.quota,
                divisor: 100000000,
                locale: config.language,
                maxFraction: 8,
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
                    })}
                  </td>
                );

              return <td className={style.algRight}>-</td>;
            })}

            <td>
              {pool.start_date && (
                <div className={style.tooltip}>
                  <img
                    alt={dayjs.utc(pool.start_date).format('DD/MM/YYYY')}
                    src="https://abalustre-assets.s3.amazonaws.com/information.png"
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                    width={15}
                  />
                  <span className={style.tooltiptext}>
                    <Text id="since">Since</Text>
                    {` `}
                    {dayjs.utc(pool.start_date).format('DD/MM/YYYY')}
                  </span>
                </div>
              )}
            </td>
            <td className={style.capitalize}>
              {pool.start_date && <Text id={pool.status}>{pool.status}</Text>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Main;
