import DOMListeners from "@core/DOMListeners";

export default class ExcelComponent extends DOMListeners {
  constructor(rootElement, { listeners, name, observer, store, subscribes } = {}) {
    super(rootElement, listeners);
    this.name = name;
    this.observer = observer;
    this.store = store;
    this.subscribes =subscribes||[];
    this.unsubscribe = [];
  }

  returnHTML() {
    return ``;
  }
  
  
  dispatch(action){
    this.store.dispatch(action);
  }
  
  getState(){
    return this.store.getState();
  }
  
  getChanges(){
  }
  
  init(){
    this.addDOMListeners();
  }
  
  removeAll(){
    this.removeDOMListeners()
  }
}
