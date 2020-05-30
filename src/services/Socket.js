/**
 * Socket
 */
import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import React, { useContext } from 'react';
import { localBaseURL, remoteBaseURL } from '../config.json';
import { GlobalContext } from '../context/GlobalState';

function Socket() {
  const context = useContext(GlobalContext);

  const socket = io(
    process.env.NODE_ENV === 'development' ? localBaseURL : remoteBaseURL,
  );

  // Init feathers app
  const app = feathers();

  // Register socket.io to talk to server
  app.configure(feathers.socketio(socket));

  socket.on('connect', function() {
    context.setConnected();
  });

  socket.on('disconnect', function() {
    context.setDisconnected();
  });

  return <div />;
}

export default Socket;
