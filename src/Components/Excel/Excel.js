import DOMElement from "@core/DOMElement";
import Observer from "@core/Observer";
import StoreSubscriber from '@core/StoreSubsriber';

export default class Excel {
  constructor(selector, { components, store }) {
    this.element = document.querySelector(selector);
    this.components = components || [];
    this.observer = new Observer();
    this.store = store;
    this.storeSubscriber = new StoreSubscriber(this.store);
    this.componentsOptions = {
      observer: this.observer,
      store: this.store,
    };
  }

  getRootElement() {
    const root = new DOMElement("div", "excel");
    this.components = this.components.map((Component) => {
      const rootElement = new DOMElement(
        Component.tagName,
        Component.className
      );
      const component = new Component(rootElement, this.componentsOptions);
      rootElement.setHTML(component.returnHTML());
      root.append(rootElement.get());
      return component;
    });
    return root.get();
  }

  render() {
    this.element.append(this.getRootElement());
    this.components.forEach((component) => component.init());
    this.storeSubscriber.storeSubscribe(this.components);
      }
      
}
