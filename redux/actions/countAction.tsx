export const increment = () => {
    return {
      type: 'COUNT_INCRESE',
    };
};
   
  export const decrement = () => {
    return {
      type: 'COUNT_DECRESE',
    };
  };

  export const set = (pop: any) => {
    return {
      type: 'COUNT_SET',
      population: pop
    };
  };