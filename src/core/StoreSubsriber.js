import {isEqual} from '@core/utils';

export default class StoreSubscriber {
  constructor(store) {
    this.store = store;
    this.prevState = {};
    this.sub = null;
  }

  storeSubscribe(components) {
    this.prevState = this.store.getState();
    this.sub = this.store.subscribe((state) => {
     
     Object.keys(state).forEach(key=>{
       if(!isEqual(this.prevState[key],state[key])){
         components.forEach(component=>{
           if(component.subscribes.includes(key))component.getChanges({[key]: state[key]})
         })
       }
     });
      this.prevState = this.store.getState();
    })
  }

  storeUnsubscribe() {
    this.sub.unsubscribe();
  }
}
