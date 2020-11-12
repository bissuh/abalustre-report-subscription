import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import style from './main.css';
import dayjs from 'dayjs';
import { Text } from 'preact-i18n';
import { ConfigContext, ServiceContext } from '../AppContext';

const Main = () => {
  const config = useContext(ConfigContext);
  const service = useContext(ServiceContext);
  const [loading, setLoading] = useState(false);

  const openModal = async ({ monthsBack = 1 }) => {
    setLoading(true);
    try {
      console.log(monthsBack - 2);
      const response = await service?.getMonthlyReport(
        dayjs().subtract(monthsBack, 'month').format('YYYY-MM-DD')
      );

      const data = response?.data;
      window.location.href = data?.path || '#';
    } catch (e) {
      await openModal({ monthsBack: monthsBack + 1 });
    }
    setLoading(false);
  };

  return (
    <div className={style.root}>
      <button
        disabled={loading}
        onClick={() => openModal({})}
        style={{ backgroundColor: config.buttonColor, width: '100%' }}
      >
        {loading ? (
          <Text id="loading">loading</Text>
        ) : (
          <Text id="monthly-report">monthly report</Text>
        )}
      </button>
    </div>
  );
};

export default Main;
