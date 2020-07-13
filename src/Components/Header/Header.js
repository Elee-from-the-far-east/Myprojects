import ExcelComponent from "@core/ExcelComponent";

export default class Header extends ExcelComponent {
  static tagName = "header";
  static className = "header excel__header";
  returnHTML() {
    return ` <input class="header__input" type="text" value="Новая таблица" />
      <div class="header__button-container">
        <button class="header__button btn">
          <span class="material-icons btn__icon">
            delete
          </span>
        </button>
        <button class="header__button btn">
          <span class="material-icons btn__icon">
            exit_to_app
          </span>
        </button>
      </div>`;
  }
}
