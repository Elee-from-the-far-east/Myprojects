/* eslint-disable no-invalid-this */
import ExcelComponent from "@core/ExcelComponent";
import {
  resizeHandler,
} from "@/Components/Table/resize";
import { createTable } from "@/Components/Table/tableCreate";
import {Selection} from '@/Components/Table/Selection';

export default class Table extends ExcelComponent {
  static tagName = "section";
  static className = "excel__table";
  static selectors ={
    tableColumn:'.table__column',
    tableRow:'.table__row',
    resizeEl:'.table__resize-el',
    defaultCell: '[data-col="1"][data-row="1"]',
    selectedCell: ''
  };
  static attributes = {
  
  };

  constructor(componentElement) {
    super(componentElement, {
      name: "Table",
      listeners: ["mousedown"],
    });
  }
  
  init(){
    this.selection = new Selection();
    this.selection.select(this.componentElement.find(Table.selectors.defaultCell))
    
  }

  onMousedown(e) {
    resizeHandler(e, this);
    if(e.target.dataset.col) {
      this.selection.select(e.target)
    }
  }

  

  returnHTML() {
    return createTable(20);
  }
}
