export default class DOMElement {
  element;

  constructor(tagName, classNames = "") {
    this.element = document.createElement(tagName);
    this.element.className = classNames;
  }

  setHTML(html) {
    this.element.innerHTML = html;
  }

  clearHTML() {
    this.element.innerHTML = "";
  }

  get() {
    return this.element;
  }
  
  append(node){
    this.element.appendChild(node)
  }

  addListener(type, callback) {
    this.element.addEventListener(type, callback)
  }
  
  removeListener(type,callback){
    this.element.removeEventListener(type,callback)
  }
}
