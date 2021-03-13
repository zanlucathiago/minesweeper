import io from 'socket.io-client';
import React, { useContext, useEffect } from 'react';
import { remoteBaseURL } from '../config.json';
import { GlobalContext, GlobalProvider } from '../context/GlobalState';
import AlertContainer from './AlertContainer';
import LocalStorage from '../LocalStorage';
import Actions from '../Actions';

function Listeners({ socket }) {
  const {
    alertError,
    alertSuccess,
    isConnected,
    setConnected,
    setDisconnected,
  } = useContext(GlobalContext);

  useEffect(() => {
    socket.on('connect', function () {
      if (isConnected === false) {
        alertSuccess('Conectado.');
      }

      console.log('Connected');
      const arr = LocalStorage.getRecords();

      if (arr.length) {
        Actions.addRecord(arr).then(() => {
          alertSuccess('Seus recordes foram sincronizados.');
          LocalStorage.clearRecords();
        });
      }

      setConnected();
    });

    socket.on('disconnect', function () {
      console.log('disconnected');
      alertError('Desconectado do servidor.');
      setDisconnected();
    });
  }, []);

  return <AlertContainer />;
}

function Socket() {
  const socket = io(remoteBaseURL);

  return (
    <GlobalProvider>
      <Listeners socket={socket} />
    </GlobalProvider>
  );
}

export default Socket;
