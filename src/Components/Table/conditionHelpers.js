import Table from "@/Components/Table/Table";

export function isResize(e) {
  return e.target.closest(Table.selectors.resizeEl);
}

export function isCell(e) {
  return e.target.dataset.col;
}

export function isKeyCode(e) {
  const keys = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  return keys.includes(e.key)
}
