import createDataContext from './createDataContext';

const defaultState = {
  player : "player1",
  currentPlayerTurn : true,
  players : {
    "player1" : {
      name : "player1",
      turns : [],
      availableShapes : null,
      score : 0,
    },
    "player2" : {
      name : "player2",
      turns : [],
      availableShapes : null,
      score : 0,
    },
  },
}


const gameDataReducer = (state,action) => {
  const newPlayers = {...state.players};

  switch(action.type) {
    case 'setCurrentPlayerTurn':
      return {...state,currentPlayerTurn:action.payload};
    case 'setPlayer':
      return {...state,player:action.payload};
    case 'setPlayerAvailableShapes':
      newPlayers[action.payload.player].availableShapes = action.payload.shapes;
      return {...state,players:newPlayers};
    case 'addPlayerTurnAndUpdateScore':
      //TODO : Needs to add to an array of turns
      const newScore = newPlayers[action.payload.player].score + action.payload.turn.score;
      const newTurns = [...state.players[action.payload.player].turns,action.payload.turn];
      newPlayers[action.payload.player].turns = newTurns;
      newPlayers[action.payload.player].score = newScore;
      console.log("THESE ARE NEW PLAYERS", newPlayers);
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

const addPlayerTurnAndUpdateScore = (dispatch) => (data) => {
  dispatch({type:'addPlayerTurnAndUpdateScore', payload:data});
}
 
export const {Provider, Context} = createDataContext (
    gameDataReducer,
    { setCurrentPlayerTurn, setPlayer, setPlayerAvailableShapes, addPlayerTurnAndUpdateScore},
    {...defaultState}
);