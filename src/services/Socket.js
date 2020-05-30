/**
 * Socket
 */
import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import React, { useContext } from 'react';
import { localBaseURL, remoteBaseURL } from '../config.json';
import { GlobalContext, GlobalProvider } from '../context/GlobalState';
import App from '../App';

function Listeners({ socket }) {
  const context = useContext(GlobalContext);

  socket.on('connect', function() {
    context.setConnected();
  });

  socket.on('disconnect', function() {
    context.setDisconnected();
  });

  return <App />;
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
