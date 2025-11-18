import createDataContext from './createDataContext';

const defaultState = {
  player : "player1",
  currentPlayerTurn : true,
  players : {},
}


const gameDataReducer = (state,action) => {
  switch(action.type) {
    case 'setCurrentPlayerTurn':
      return {...state,currentPlayerTurn:action.payload};
    case 'setPlayer':
      return {...state,player:action.payload};
    case 'setPlayerAvailableShapes':
      const newPlayers = {...state.players};
      //Get the current player
      let currentPlayer;
      if(Object.keys(newPlayers).includes(action.payload.player) ) {
        // currentPlayer = state.players[state.player];
        // currentPlayer.availableShapes = action.payload;
        newPlayers[state.player].availableShapes = action.payload.shapes;
      } else {
        currentPlayer = {
            player : action.payload.player,
            availableShapes : action.payload.shapes,
        };
        newPlayers[action.payload.player] = currentPlayer;
      }
      return {...state,players:newPlayers}; 
    default:
      return defaultState;
  }
};

//Setters


const setCurrentPlayerTurn = (dispatch) => (data) => {
  dispatch({type:'setCurrentPlayerTurn', payload:data});
}

const setPlayer = (dispatch) => (data) => {
  dispatch({type:'setPlayer', payload:data});
}


const setPlayerAvailableShapes = (dispatch) => (data) => {
  dispatch({type:'setPlayerAvailableShapes', payload:data});
}
 
export const {Provider, Context} = createDataContext (
    gameDataReducer,
    { setCurrentPlayerTurn, setPlayer, setPlayerAvailableShapes},
    {...defaultState}
);