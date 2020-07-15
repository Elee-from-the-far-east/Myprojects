import Table from "@/Components/Table/Table";

export const resize = (e) => {
  return new Promise((resolve) => {
    const resizeEl = e.target.closest(Table.selectors.resizeEl);
    e.preventDefault();
    const elementToRz = resizeEl.closest(Table.selectors.tableColumn);
    const startCoords = resizeEl.getBoundingClientRect();
    let newCoords;
    let wasMove=false;

    document.onmousemove = (e) => {
      e.preventDefault();
      wasMove=true;
      if (resizeEl.className.includes("col")) {
        newCoords = startCoords.x - e.clientX;
        resizeEl.style = `right: ${newCoords}px;`;
      } else {
        newCoords = startCoords.y - e.clientY;
        resizeEl.style = `bottom: ${newCoords}px;`;
      }
    };

    document.onmouseup = () => {
      if(!wasMove)return;
      resizeEl.style = ``;
      let value;
      if (resizeEl.className.includes("col") && newCoords) {
        elementToRz.style = `width: ${value = elementToRz.offsetWidth - newCoords}px`;
      } else if (!resizeEl.className.includes("col") && newCoords) {
        elementToRz.style = `height: ${value = elementToRz.offsetHeight - newCoords}px`;
      }
      resolve({
        col: elementToRz.textContent.trim(),
        value,
        
      });
      document.onmousemove = null;
      document.onmouseup = null;
    };
  });
};
