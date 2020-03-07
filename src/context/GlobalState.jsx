import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import LocalStorage from '../LocalStorage';
import Board from '../Board.json';

const { bombs } = Board[LocalStorage.getLevel()];

// Initial state
const initialState = {
  defaultBombsRemaining: bombs,
  currentBombsRemaining: bombs,
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  function removeFlag() {
    dispatch({
      type: 'REMOVE_FLAG',
      // payload: id,
    });
  }

  function addFlag() {
    dispatch({
      type: 'ADD_FLAG',
      // payload: transaction,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        removeFlag,
        addFlag,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
