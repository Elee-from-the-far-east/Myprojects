export class Selection {
  constructor() {
    this.selected = [];
  }

  select(element) {
    this.clear();
    this.selected.push(element);
    element.classList.add('table__column--selected');
    
  }
  
  clear(){
    this.selected.forEach(el=>el.classList.remove('table__column--selected'))
  }

  // selectgroup() {}
}
