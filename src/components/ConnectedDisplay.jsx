import { BsCircleFill } from 'react-icons/bs';
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

function ConnectedDisplay() {
  const { isConnected } = useContext(GlobalContext);

  return (
    <BsCircleFill
      color={isConnected ? '#64bb08' : '#e64c1b'}
      style={{ margin: 15 }}
    />
  );
}

export default ConnectedDisplay;
