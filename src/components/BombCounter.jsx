import React, { useContext } from 'react';
// import React from 'react';
import TextField from '@material-ui/core/TextField';
import { GlobalContext } from '../context/GlobalState';

// const TextField = (props) => {
const BombCounter = () => {
  const { currentBombsRemaining } = useContext(GlobalContext);
  return (
    <TextField
      inputProps={{ style: { textAlign: 'right' } }}
      disabled
      label="Bombas"
      size="small"
      style={{ width: 100 }}
      // value="123"
      value={currentBombsRemaining}
      variant="outlined"
    />
  );
};

export default BombCounter;
