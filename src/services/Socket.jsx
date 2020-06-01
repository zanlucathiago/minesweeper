import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import React, { useContext } from 'react';
import { localBaseURL, remoteBaseURL } from '../config.json';
import { GlobalContext, GlobalProvider } from '../context/GlobalState';
import AlertContainer from './AlertContainer';

function Listeners({ socket }) {
  const {
    alertError,
    alertSuccess,
    isConnected,
    setConnected,
    setDisconnected,
  } = useContext(GlobalContext);

  socket.on('connect', function() {
    if (isConnected === false) {
      alertSuccess('Conectado.');
    }

    setConnected();
  });

  socket.on('disconnect', function() {
    alertError('Desconectado do servidor.');
    setDisconnected();
  });

  return <AlertContainer />;
}

function Socket() {
  const socket = io(
    process.env.NODE_ENV === 'development' ? localBaseURL : remoteBaseURL,
  );

  // Init feathers app
  const app = feathers();

  // Register socket.io to talk to server
  app.configure(feathers.socketio(socket));

  return (
    <GlobalProvider>
      <Listeners socket={socket} />
    </GlobalProvider>
  );
}

export default Socket;
