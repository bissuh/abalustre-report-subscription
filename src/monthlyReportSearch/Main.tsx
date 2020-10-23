import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import style from './main.css';
import { ConfigContext, ServiceContext } from '../AppContext';
import Spacer from '../components/Spacer';
import { Text } from 'preact-i18n';
import dayjs from 'dayjs';

const Main = () => {
  const config = useContext(ConfigContext);
  const service = useContext(ServiceContext);

  const currentYear = dayjs().year();
  const currentMonth = dayjs()
    .subtract(1, 'month')
    .format('MMMM')
    .toLowerCase();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const valueTrail = Array.from(
    { length: currentYear - 2000 },
    (_, i) => currentYear - i
  );

  const search = async () => {
    let selectedMonth = months.findIndex((item) => item === month);
    if (selectedMonth >= 0) selectedMonth += 1;

    let result = await service?.getMonthlyReport(`${year}-${selectedMonth}`);

    window.open(result?.data.path, '_blank');
  };

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
      <Spacer padding="0" space={'0'}>
        <select
          name="year"
          id="year"
          onChange={(evt: any) => setYear(evt.target.value)}
        >
          {valueTrail.map((value) => (
            <option value={value}>{value}</option>
          ))}
        </select>

        <select
          name="month"
          id="month"
          onChange={(evt: any) => setMonth(evt.target.value)}
        >
          {months.map((value, idx) => (
            <option value={idx} selected={value === currentMonth}>
              <Text id={value}>{value}</Text>
            </option>
          ))}
        </select>

        <button
          style={{ backgroundColor: config.buttonColor }}
          onClick={search}
        >
          <Text id="view">view</Text>
        </button>
      </Spacer>
    </div>
  );
};

export default Main;
