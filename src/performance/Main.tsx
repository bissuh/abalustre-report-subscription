import { h } from 'preact';
import style from './main.css';
import { Text } from 'preact-i18n';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { ServiceContext } from '../AppContext';
import { ConfigContext } from '../AppContext';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const Main = () => {
  const config = useContext(ConfigContext);
  const [pools, setPools] = useState<any[]>([]);
  const service = useContext(ServiceContext);

  const loadPools = useCallback(async () => {
    const poolsResponse = await service?.getPools();

    if (!poolsResponse) return;

    const responses = await Promise.all(
      poolsResponse.data.map((pool) => service?.getPoolPerformance(pool.id))
    );

    if (!responses) setPools([]);
    const newPools: any[] = [];

    poolsResponse.data.forEach((pool, idx) => {
      const benchmark = responses[idx];
      newPools.push({ ...pool, ...benchmark?.data });
      newPools.push({ ...pool.benchmark, ...benchmark?.data.benchmark });
    });

    setPools(newPools);
  }, []);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  if (pools.length === 0)
    return (
      <div className={style.table}>
        <p>Loading...</p>
      </div>
    );

  console.log(pools);

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
          <td className={style.algRight}>
            <Text id="month">month</Text>
          </td>
          <td className={style.algRight}>
            <Text id="year">year</Text>
          </td>
          <td className={style.algRight}>24M</td>
          <td className={style.algRight}>
            <Text id="alltime">all time</Text>
          </td>
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
            colSpan={10}
          ></td>
        </tr>
        {pools.map((pool) => (
          <tr id={pool.id}>
            <td>
              <strong>{pool.name}</strong>
            </td>
            <td>{pool.date && dayjs.utc(pool.date).format('DD/MM/YYYY')}</td>
            <td className={style.algRight}>
              {pool.quota ? (pool.quota / 100000000).toFixed(2) : '-'}
            </td>
            <td className={style.algRight}>
              {pool.day ? `${(pool.day * 100).toFixed(2)}%` : '-'}
            </td>
            <td className={style.algRight}>
              {pool.month ? `${(pool.month * 100).toFixed(2)}%` : '-'}
            </td>
            <td className={style.algRight}>
              {pool.year ? `${(pool.year * 100).toFixed(2)}%` : '-'}
            </td>
            <td className={style.algRight}>
              {pool.twoYears ? `${(pool.twoYears * 100).toFixed(2)}%` : '-'}
            </td>
            <td className={style.algRight}>
              {pool.allTime ? `${(pool.allTime * 100).toFixed(2)}%` : '-'}
            </td>
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
