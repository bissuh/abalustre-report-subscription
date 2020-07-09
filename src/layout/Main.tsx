import { h } from 'preact';
import { useState } from 'preact/hooks';
import style from './main.css';
import clsx from 'clsx';
import SubscriptionForm from './SubscriptionForm';

const Main = () => {
  const [openedModal, setOpenedModal] = useState(false);

  function openModal() {
    setOpenedModal(true);
  }

  function closeModal() {
    setOpenedModal(false);
  }

  return (
    <div className={clsx(style.root)}>
      {openedModal && (
        <div>
          <div className={clsx(style.abaModal)} onClick={closeModal}></div>
          <div className={clsx(style.abaModalContent)}>
            <p className={style.level2}>
              Receba nossos informativos de performance diretamente no seu
              e-mail.
            </p>
            <SubscriptionForm onClose={closeModal} />
          </div>
        </div>
      )}
      <button onClick={openModal}>RECEBER RELATÓRIOS DE PERFORMANCE</button>
    </div>
  );
};

export default Main;
