import { h } from 'preact';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import dayjs from 'dayjs';
import { Text } from 'preact-i18n';

import { ServiceContext } from '../AppContext';
import { ConfigContext } from '../AppContext';
import { WidgetPool } from '../models';
import { numberFilters } from '../utils';
import { PERIODS } from '../constants';

const Main = () => {
  const { format } = numberFilters;
  const service = useContext(ServiceContext);
  const config = useContext(ConfigContext);
  const [pools, setPools] = useState<any[]>([]);
  const [widget, setWidget] = useState<WidgetPool | undefined>(undefined);

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
    <table>
      <thead>
        <tr>
          <td>
            <Text id="fund">fund</Text>
          </td>
          <td></td>
          <td>
            <Text id="date">date</Text>
          </td>
          <td>
            <Text id="quota">quota</Text>
          </td>
          <td>
            <Text id="day">day</Text>
          </td>
          {widget?.data.periods.map((item: string) => (
            <td>
              <Text id={item}>{PERIODS.DETAILS[item].label}</Text>
            </td>
          ))}
          <td style={{ textAlign: 'center' }}>status</td>
        </tr>
      </thead>
      <tbody>
        {pools.map((pool) => (
          <tr id={pool.id}>
            <td style={{ verticalAlign: 'top' }}>
              {pool.details_webpage ? (
                <a
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
                <div>
                  <img
                    alt={dayjs.utc(pool.start_date).format('DD/MM/YYYY')}
                    src="https://abalustre-assets.s3.amazonaws.com/information.png"
                    style={{ cursor: 'pointer' }}
                    width={15}
                  />
                </div>
              )}
            </td>

            <td>{pool.date && dayjs.utc(pool.date).format('DD MMM YY')}</td>

            <td>
              {format({
                value: pool.quota,
                divisor: 100000000,
                locale: config.language,
                maxFraction: 8,
                minFraction: pool.decimal_places,
                nullValue: '-',
              })}
            </td>

            <td>
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
                  <td>
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

              return <td>-</td>;
            })}

            <td style={{ textAlign: 'center' }}>
              {pool.start_date && <Text id={pool.status}>{pool.status}</Text>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Main;
