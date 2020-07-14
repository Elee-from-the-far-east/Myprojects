import ExcelComponent from "@core/ExcelComponent";
import {isEnterKeyCode} from '@/Components/Table/conditionHelpers';

export default class Formula extends ExcelComponent {
  static tagName = "section";
  static className = "formula excel__formula";

  constructor(rootElement, options) {
    super(rootElement, {
      name: "Formula",
      listeners: ["input", 'keydown'],
      ...options
    });
  }

  onInput(e) {
    const text = this.rootElement.find('.formula__content').textContent;
    this.observer.trigger("formula-input", text)
  }
  
  onKeydown(e){
    if(isEnterKeyCode(e)){
   
      this.observer.trigger('formula-enter-pressed', e)
    }
  }

  returnHTML() {
    return `<p class="formula__info">fx</p>
        <p
          class="formula__content"
          contenteditable="true"
          spellcheck="false"
        ></p>`;
  }
}
