import "./SCSS/blocks/main.scss";
import "./index.html";

document.querySelectorAll('.table__column').forEach(el=>{
 const isClass = el.className.includes('header')||el.className.includes('info');
  if(!isClass) el.contentEditable ='true';
});
