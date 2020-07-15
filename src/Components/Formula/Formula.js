import ExcelComponent from "@core/ExcelComponent";
import { shouldSwitchToTable } from "@/Components/Table/conditionHelpers";

export default class Formula extends ExcelComponent {
  static tagName = "section";
  static className = "formula excel__formula";

  constructor(rootElement, options) {
    super(rootElement, {
      name: "Formula",
      listeners: ["input", "keydown"],
      subscribes: ["currentText"],
      ...options,
    });
  }

  init() {
    super.init();
    this.rootElement
      .find(".formula__content")
      .addEventListener("blur", function (e) {
        e.target.textContent = "";
      });
    this.formulaText = this.rootElement.find(".formula__content");
    this.observer.add("on-cell-switch", (text) => {
      this.formulaText.textContent = text;
    });
  }

  onInput(e) {
    this.observer.trigger("formula-input", this.formulaText.textContent);
  }

  onKeydown(e) {
    if (shouldSwitchToTable(e)) {
      e.preventDefault();
      this.observer.trigger("formula-enter-pressed");
    }
  }

  getChanges(changes) {
    if (changes.currentText) {
      this.formulaText.textContent = changes.currentText;
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
