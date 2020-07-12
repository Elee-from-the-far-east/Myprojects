import ExcelComponent from '@core/ExcelComponent';

export default class Toolbar extends ExcelComponent {
  static tagName = 'section';
  static className = 'toolbar excel__toolbar';
  constructor($el){
    super($el,{
      name: 'Toolbar',
      listeners:[]
    })
  }
  returnHTML() {
    return `<button class="toolbar__button btn">
          <span class="material-icons btn__icon">
            format_align_left
          </span>
        </button>
        <button class="toolbar__button btn">
          <span class="material-icons btn__icon">
            format_align_center
          </span>
        </button>
        <button class="toolbar__button btn">
          <span class="material-icons btn__icon">
            format_align_right
          </span>
        </button>
        <button class="toolbar__button btn">
          <span class="material-icons btn__icon">
            format_bold
          </span>
        </button>
        <button class="toolbar__button btn">
          <span class="material-icons btn__icon">
            format_italic
          </span>
        </button>
      </section>`
  }
}
