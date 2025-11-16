import createDataContext from './createDataContext';
import Shape from '../shapes/Shape';

const defaultState = {
  selectedShape : null,
};


const shapeDataReducer = (state,action) => {
  switch(action.type) {
    case 'setSelectedShape':
      return {...state,selectedShape:action.payload};
    default:
      return defaultState;
  }
};

//Setters


const setSelectedShape = (dispatch) => (data) => {
  dispatch({type:'setSelectedShape', payload:data});
}


 
export const {Provider, Context} = createDataContext (
    shapeDataReducer,
    { setSelectedShape},
    {...defaultState}
);