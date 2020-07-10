import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import style from './main.css';
import SubscriptionForm from './SubscriptionForm';
import { ConfigContext } from '../AppContext';

const Main = () => {
  const config = useContext(ConfigContext);

  const [openedModal, setOpenedModal] = useState(false);

  function openModal() {
    setOpenedModal(true);
  }

  function closeModal() {
    setOpenedModal(false);
  }

  return (
    <div className={style.root}>
      {openedModal && (
        <div>
          <div className={style.abaModal} onClick={closeModal}></div>
          <div className={style.abaModalContent}>
            <p className={style.level2}>
              Receba nossos informativos de performance diretamente no seu
              e-mail.
            </p>
            <SubscriptionForm onClose={closeModal} />
          </div>
        </div>
      )}
      <button
        onClick={openModal}
        style={{ backgroundColor: config.buttonColor, width: '100%' }}
      >
        RECEBER RELATÓRIOS DE PERFORMANCE
      </button>
    </div>
  );
};

export default Main;
