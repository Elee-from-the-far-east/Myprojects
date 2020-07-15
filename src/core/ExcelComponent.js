import DOMListeners from "@core/DOMListeners";

export default class ExcelComponent extends DOMListeners {
  constructor(rootElement, { listeners, name, observer, store } = {}) {
    super(rootElement, listeners);
    this.name = name;
    this.observer = observer;
    this.store = store;
    this.unsubscribe = [];
  }

  returnHTML() {
    return ``;
  }
  
  subscribe (fn){
    this.unsubscribe.push(this.store.subscribe(fn));
  }
  
  dispatch(action){
    this.store.dispatch(action);
  }
  
  getState(){
    return this.store.getState();
  }
  
  init(){
    this.addDOMListeners();
  }
}
