import uniqid from 'uniqid';


export default class ShoppingList {
  constructor(){
    this.items = [];
  }
  addItem({count,text,unit}){
    const newItem ={
      count,
      unit,
      text,
      id: uniqid(),
    };
    this.items.push(newItem);
    return newItem;
  }
  deleteItem (id){
    const index = this.items.findIndex(el=>el.id===id);
    this.items.splice(index,1);
  }
}

