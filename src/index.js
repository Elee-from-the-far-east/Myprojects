import "./SCSS/blocks/main.scss";
import "./index.html";
import Excel from '@/Components/Excel/Excel';
import Header from '@/Components/Header/Header';
import Formula from '@/Components/Formula/Formula';
import Toolbar from '@/Components/Toolbar/Toolbar';
import Table from '@/Components/Table/Table';




const excel = new Excel('#app', {
  components:[Header,Toolbar, Formula, Table]
});


excel.render()

// document.querySelectorAll('.table__column').forEach(el=>{
//  const isClass = el.className.includes('header')||el.className.includes('info');
//   if(!isClass) el.contentEditable ='true';
// });


