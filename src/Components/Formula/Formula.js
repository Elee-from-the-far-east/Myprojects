import ExcelComponent from "@core/ExcelComponent";

export default class Formula extends ExcelComponent {
  static tagName = "section";
  static className = "formula excel__formula";

  constructor($el) {
    super($el, {
      name: "Formula",
      listeners: ["input"],
    });
  }

  onInput(e) {
    console.log(e);
    console.log(this);
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
