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
    default:
      return state;
  }
};
