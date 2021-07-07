import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import LocalStorage from '../LocalStorage';
import Board from '../Board.json';

const getUpdatedBombs = () => {
  const { bombs } = Board[LocalStorage.getLevel()];
  return bombs;
};

// Initial state
const initialState = {
  alert: null,
  defaultBombsRemaining: getUpdatedBombs(),
  currentBombsRemaining: getUpdatedBombs(),
  isConnected: null,
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
    });
  }

  function addFlag() {
    dispatch({
      type: 'ADD_FLAG',
    });
  }

  function updateFlags() {
    dispatch({
      payload: getUpdatedBombs(),
      type: 'UPDATE_FLAGS',
    });
  }

  function setConnected() {
    dispatch({
      type: 'IS_CONNECTED',
    });
  }

  function setDisconnected() {
    dispatch({
      type: 'IS_DISCONNECTED',
    });
  }

  function alertError(msg, options) {
    dispatch({
      payload: { ...options, children: msg, severity: 'error' },
      type: 'ALERT_SHOW',
    });
  }

  function alertInfo(msg, options) {
    dispatch({
      payload: { ...options, children: msg, severity: 'info' },
      type: 'ALERT_SHOW',
    });
  }

  function alertWarning(msg, options) {
    dispatch({
      payload: { ...options, children: msg, severity: 'warning' },
      type: 'ALERT_SHOW',
    });
  }

  function alertSuccess(msg, options) {
    dispatch({
      payload: { ...options, children: msg, severity: 'success' },
      type: 'ALERT_SHOW',
    });
  }

  function hideAlert() {
    dispatch({
      type: 'ALERT_HIDE',
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        alertError,
        alertInfo,
        alertSuccess,
        alertWarning,
        hideAlert,
        removeFlag,
        addFlag,
        setConnected,
        setDisconnected,
        updateFlags,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
