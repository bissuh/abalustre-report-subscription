import { Fragment, h } from 'preact';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import dayjs from 'dayjs';
import { Text } from 'preact-i18n';

import { ServiceContext } from '../AppContext';
import { ConfigContext } from '../AppContext';
import { WidgetPool } from '../models';
import { numberFilters } from '../utils';
import { PERIODS } from '../constants';
import parseStyle from '../ParseStyle';

import styles from './main.css';

const DEFAULT_STYLES = {
  table: {
    self: {
      padding: '32px',
      margin: '10px',
      fontFamily: 'sans-serif',
      borderCollapse: 'collapse',
    },
    thead: {
      self: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        borderTop: 'solid 3px #000',
        borderBottom: 'solid 3px #000',
      },
      td: {
        padding: '12px',
      },
    },
    tbody: {
      tr: {
        borderBottom: 'solid 1px rgba(0, 0, 0, 0.1)',
      },
      td: {
        self: {
          padding: '12px',
        },
        a: {
          color: '#000',
        },
      },
    },
  },
};

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

  const { style } = config;

  const finalStyle = parseStyle(style, DEFAULT_STYLES);

  return (
    <table style={finalStyle('table')}>
      <thead style={finalStyle('table-thead')}>
        <tr style={finalStyle('table-thead-tr')}>
          <td style={finalStyle('table-thead-td')}>
            <Text id="fund">fund</Text>
          </td>
          <td style={finalStyle('table-thead-td')}></td>
          <td style={finalStyle('table-thead-td')}>
            <Text id="date">date</Text>
          </td>
          <td style={finalStyle('table-thead-td')}>
            <Text id="quota">quota</Text>
          </td>
          <td style={finalStyle('table-thead-td')}>
            <Text id="day">day</Text>
          </td>
          {widget?.data.periods.map((item: string) => (
            <td style={finalStyle('table-thead-td')}>
              <Text id={item}>{PERIODS.DETAILS[item].label}</Text>
            </td>
          ))}
          <td
            style={
              { ...finalStyle('table-thead-td'), textAlign: 'center' } ?? {}
            }
          >
            status
          </td>
        </tr>
      </thead>
      <tbody style={finalStyle('table-tbody')}>
        {pools.map((pool) => (
          <tr style={finalStyle('table-tbody-tr')} id={pool.id}>
            <td style={{ ...finalStyle('table-tbody-td') } ?? {}}>
              {pool.details_webpage ? (
                <a
                  style={finalStyle('table-tbody-td-a')}
                  href={`${pool.details_webpage}?utm_source=website&utm_medium=widget`}
                >
                  {pool.name}
                </a>
              ) : (
                pool.name
              )}
            </td>

            <td style={finalStyle('table-tbody-td')}>
              {pool.start_date && (
                <div className={styles.tooltipContainer}>
                  <img
                    style={{
                      ...finalStyle('table-tbody-td-img'),
                      cursor: 'pointer',
                    }}
                    src="https://abalustre-assets.s3.amazonaws.com/information.png"
                    width={15}
                    className={styles.tooltipTrigger}
                  />
                  <div className={styles.tooltip}>
                    {dayjs.utc(pool.start_date).format('DD/MM/YYYY')}
                  </div>
                </div>
              )}
            </td>

            <td style={finalStyle('table-tbody-td')}>
              {pool.date && dayjs.utc(pool.date).format('DD MMM YY')}
            </td>

            <td style={finalStyle('table-tbody-td')}>
              {format({
                value: pool.quota,
                divisor: 100000000,
                locale: config.language,
                maxFraction: 8,
                minFraction: pool.decimal_places,
                nullValue: '-',
              })}
            </td>

            <td style={finalStyle('table-tbody-td')}>
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
                  <td style={finalStyle('table-tbody-td')}>
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

              return <td style={finalStyle('table-tbody-td')}>-</td>;
            })}

            <td style={finalStyle('table-tbody-td')}>
              {pool.start_date && <Text id={pool.status}>{pool.status}</Text>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Main;
