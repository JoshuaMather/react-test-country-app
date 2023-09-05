const initialState = {
    count: 0,
  };
   
export default (state = initialState, action: {
    population: number; type: any; 
}) => {
switch (action.type) {
    case 'COUNT_INCRESE':
    return {
        ...state,
        count: state.count + 1,
    };
    case 'COUNT_DECRESE':
    return {
        ...state,
        count: state.count - 1,
    };
    case 'COUNT_SET':
    return {
        ...state,
        count: state.count = action.population,
    };
    default:
    return state;
}
};