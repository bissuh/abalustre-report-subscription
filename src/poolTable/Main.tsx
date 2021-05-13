import { h } from 'preact';
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
  'last-column': {
    textTransform: 'capitalize',
  },
  'info-icon': {
    cursor: 'pointer',
  },
};

const Main = () => {
  const { format } = numberFilters;
  const service = useContext(ServiceContext);
  const config = useContext(ConfigContext);
  const [pools, setPools] = useState<any[]>([]);
  const [widget, setWidget] = useState<WidgetPool | undefined>(undefined);

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
                  <svg
                    style={finalStyle('info-icon')}
                    stroke-width="0"
                    viewBox="0 0 16 16"
                    height="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.tooltipTrigger}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z"
                      clip-rule="evenodd"
                    />
                    <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z" />
                    <circle cx="8" cy="4.5" r="1" />
                  </svg>
                  <div className={styles.tooltip} style={finalStyle('tooltip')}>
                    <p>
                      <b>{pool.fullname}</b>
                    </p>
                    <p>
                      <Text id="since">Since</Text>
                      {': '}
                      {dayjs.utc(pool.date).format('DD MMM YY')}
                    </p>
                    <p>CNPJ: {pool.document}</p>
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

            <td
              style={{
                ...finalStyle('table-tbody-td'),
                ...finalStyle('last-column'),
              }}
            >
              {pool.start_date && <Text id={pool.status}>{pool.status}</Text>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Main;
