import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { GlobalContext } from '../context/GlobalState';

const BombCounter = () => {
  const { currentBombsRemaining } = useContext(GlobalContext);

  return (
    <TextField
      inputProps={{ style: { textAlign: 'right' } }}
      disabled
      label="Bombas"
      size="small"
      style={{ width: 100 }}
      value={currentBombsRemaining}
      variant="outlined"
    />
  );
};

export default BombCounter;
