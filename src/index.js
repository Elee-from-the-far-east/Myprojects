import "./SCSS/blocks/main.scss";
import "./index.html";
import Excel from "@/Components/Excel/Excel";
import Header from "@/Components/Header/Header";
import Formula from "@/Components/Formula/Formula";
import Toolbar from "@/Components/Toolbar/Toolbar";
import Table from "@/Components/Table/Table";
import Store from '@core/Store';
import {reducer} from '@/Redux/reducer';
import {storage} from '@core/utils';



const store = new Store(reducer, storage('excel-state'));

store.subscribe((state) => {
  storage('excel-state', state)
});

const excel = new Excel("#app", {
  components: [Header, Toolbar, Formula, Table],
  store
});

excel.render();

// document.querySelectorAll('.table__column').forEach(el=>{
//  const isClass = el.className.includes('header')||el.className.includes('info');
//   if(!isClass) el.contentEditable ='true';
// });
