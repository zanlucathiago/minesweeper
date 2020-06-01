export default (state, action) => {
  switch (action.type) {
    case 'REMOVE_FLAG':
      return {
        ...state,
        currentBombsRemaining: state.currentBombsRemaining + 1,
      };
    case 'ADD_FLAG':
      return {
        ...state,
        currentBombsRemaining: state.currentBombsRemaining - 1,
      };
    case 'IS_CONNECTED':
      return {
        ...state,
        isConnected: true,
      };
    case 'IS_DISCONNECTED':
      return {
        ...state,
        isConnected: false,
      };
    case 'ALERT_SHOW':
      return {
        ...state,
        alert: action.payload,
      };
    case 'ALERT_HIDE':
      return {
        ...state,
        alert: null,
      };
    case 'UPDATE_FLAGS':
      return {
        ...state,
        currentBombsRemaining: action.payload,
      };
    default:
      return state;
  }
};
