import React, { useContext } from 'react';
import Alert from '../components/Alert';
import App from '../App';
import { GlobalContext } from '../context/GlobalState';

function AlertContainer() {
  const {
    alert,
    alertError,
    alertInfo,
    alertSuccess,
    alertWarning,
    updateFlags,
  } = useContext(GlobalContext);

  return (
    <>
      {alert && <Alert {...alert} />}
      <App
        alertError={alertError}
        alertInfo={alertInfo}
        alertSuccess={alertSuccess}
        alertWarning={alertWarning}
        updateFlags={updateFlags}
      />
    </>
  );
}

export default AlertContainer;
