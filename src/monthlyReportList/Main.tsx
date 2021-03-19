import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import style from './main.css';
import { ConfigContext, ServiceContext } from '../AppContext';
import { Text } from 'preact-i18n';
import dayjs from 'dayjs';

const Main = () => {
  const config = useContext(ConfigContext);
  const service = useContext(ServiceContext);

  const [reports, setReports] = useState({});
  const [selectedYear, setSelectedYear] = useState('');

  const search = async () => {
    try {
      let items = [];

      let result = await service?.getMonthlyReports();

      if (!result) return;

      const { pages } = result.pagination;
      items = result.data;
      for (let i = 2; i <= pages; i++) {
        result = await service?.getMonthlyReports(i);
        items = [...items, ...(result?.data || [])];
      }

      const history = {};
      items.map((report) => {
        const year = report.month.split('-')[0];
        if (!history[year]) history[year] = [];
        history[year].push(report);
      });

      setReports(history);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    search();
  }, []);

  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  return (
    <div className={style.root}>
      {Object.keys(reports)
        .reverse()
        .map((item) => (
          <div className={style.group}>
            <div
              key={item}
              onClick={() => setSelectedYear(item === selectedYear ? '' : item)}
              className={style.title}
              style={{ color: config.buttonColor }}
            >
              <div
                className={style.yearToggle}
                style={{ backgroundColor: config.buttonColor }}
              >
                <img
                  className={selectedYear === item ? style.open : style.close}
                  src="https://ticker-assets.s3.amazonaws.com/images/expand-button.svg"
                  width="20"
                />
              </div>
              {item}
            </div>
            <div
              className={`list ${
                selectedYear === item ? style.openList : style.closeList
              }`}
              style={{ display: 'block' }}
            >
              {reports[item].map((report: any) => {
                const [year, month] = report.month.split('-');
                return (
                  <a
                    href={report.path}
                    target="_blank"
                    style={{ textDecoration: 'none', color: '#262626' }}
                  >
                    <div key={month} className={style.listItem}>
                      <img
                        src="https://ticker-assets.s3.amazonaws.com/images/pdf-file.svg"
                        width="20"
                        className={style.pdfIcon}
                        style={{ borderColor: config.buttonColor }}
                      />
                      <Text id={months[month - 1]}>{months[month - 1]}</Text> /{' '}
                      {year}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Main;
