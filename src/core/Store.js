import {deepClone} from '@core/utils';

export default class Store {
  constructor(reducer, initialState){
    this.state = reducer(initialState, {type: 'init'});
    this.handlers =[];
    this.reducer=reducer;
  }
  subscribe(handler){
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter(cb=>cb!==handler)
    };
  }
  dispatch(action){
    this.state = this.reducer(this.state, action);
    this.handlers.forEach(handler=>handler(this.state))
  }
  getState(){
    return deepClone(this.state)
  }
}
