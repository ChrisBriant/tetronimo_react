import createDataContext from './createDataContext';

const defaultState = {
  player : "player1",
  currentPlayerTurn : true,
  players : {
    "player1" : {
      name : "player1",
      turn : null,
      availableShapes : null,
      score : 0,
    },
    "player2" : {
      name : "player2",
      turn : null,
      availableShapes : null,
      score : 0,
    },
  },
}


const gameDataReducer = (state,action) => {
  const newPlayers = {...state.players};
  //Initialize the current player
  //let currentPlayer;
  // if(Object.keys(newPlayers).includes(action.payload.player) ) {
  //   // currentPlayer = state.players[state.player];
  //   // currentPlayer.availableShapes = action.payload;
  //   newPlayers[state.player].availableShapes = action.payload.shapes;
  // } else {
  //   currentPlayer = {
  //       player : action.payload.player,
  //       availableShapes : action.payload.shapes,
  //   };
  //   newPlayers[action.payload.player] = currentPlayer;
  // }

  console.log("NEW PLAYERS", newPlayers, action.type);

  // if(!Object.keys(newPlayers).includes(action.payload.player)) {
  //       console.log("SETTING CURRENT PLAYER", action.payload.player)
  //       currentPlayer = {
  //       player : action.payload.player,
  //       availableShapes : null,
  //   };
  // }

  switch(action.type) {
    case 'setCurrentPlayerTurn':
      return {...state,currentPlayerTurn:action.payload};
    case 'setPlayer':
      return {...state,player:action.payload};
    case 'setPlayerAvailableShapes':
      // if(Object.keys(newPlayers).includes(action.payload.player) ) {
      //   currentPlayer = state.players[state.player];
      //   currentPlayer.availableShapes = action.payload;
      //   newPlayers[action.payload.player].availableShapes = action.payload.shapes;
      // } else {
      //   currentPlayer = {
      //       player : action.payload.player,
      //       availableShapes : action.payload.shapes,
      //   };
        // currentPlayer = state.players[state.player];
        // currentPlayer.availableShapes = action.payload;

      //}
      newPlayers[action.payload.player].availableShapes = action.payload.shapes;
      //newPlayers[action.payload.player] = currentPlayer;
      return {...state,players:newPlayers};
    case 'addPlayerTurnAndUpdateScore':
      // const newPlayers = {...state.players};
      // //Get the current player
      // let currentPlayer;
      // if(Object.keys(newPlayers).includes(action.payload.player) ) {
      //   currentPlayer = state.players[state.player];
      //   currentPlayer.turn = action.payload.turn;
      //   //Update score
      //   const newScore = currentPlayer.score + action.payload.score;

      //   newPlayers[action.payload.player] = currentPlayer;
      // } else {
      //   currentPlayer = {
      //       player : action.payload.player,
      //       turn : action.payload.turn,
      //       score : action.payload.turn.score,
      //   };

      //}
      const newScore = newPlayers[action.payload.player].score + action.payload.turn.score;
      newPlayers[action.payload.player].turn = action.payload.turn;
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