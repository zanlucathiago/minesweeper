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
    default:
      return state;
  }
};
