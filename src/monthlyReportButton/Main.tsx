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

  const openModal = async () => {
    setLoading(true);
    try {
      let response = await service?.getMonthlyReport(
        dayjs().subtract(1, 'month').format('YYYY-MM-DD')
      );

      if (!response?.data) {
        response = await service?.getMonthlyReport(
          dayjs().subtract(2, 'month').format('YYYY-MM-DD')
        );
      }

      const data = response?.data;

      window.open(
        `https://abalustre.com/${config.id}/monthly-report/${data?.month}`,
        '_blank'
      );
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className={style.root}>
      <button
        disabled={loading}
        onClick={openModal}
        style={{ backgroundColor: config.buttonColor, width: '100%' }}
      >
        {loading && (
          <img
            src="https://ticker-assets.s3.amazonaws.com/images/loading.svg"
            style={{ margin: 0, marginRight: '10px' }}
            width={14}
          />
        )}
        <Text id="monthly-report">monthly report</Text>
      </button>
    </div>
  );
};

export default Main;
