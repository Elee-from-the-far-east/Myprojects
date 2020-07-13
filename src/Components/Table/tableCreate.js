const CHAR__CODES = {
  A: 65,
  Z: 90,
};

const columnQnty = CHAR__CODES.Z - CHAR__CODES.A;

const createColName = () => {
  const colNames = [];
  for (let i = 0; i <= columnQnty; i++) {
    colNames.push(String.fromCharCode(CHAR__CODES.A + i));
  }
  return colNames;
};
const columnNames = createColName();

const createHeader = (name) => {
  return `<th class="table__column table__column--header">${name}
                <div class="table__resize-el table__resize-el--col"></div></th>`;
};

const createHeaders = () => {
  const headers = columnNames.map(createHeader);
  return headers.join("");
};

const createColumn = () => {
  return `<td class="table__column" contenteditable></td>`;
};

const createColumns = () => {
  const cols = columnNames.map(createColumn);
  return cols.join("");
};

const createRow = (number) => {
  return `<tr class="table__row">
            <td class="table__column table__column--info">${number}
            <div class="table__resize-el table__resize-el--row"></div></td>
            ${createColumns()}
            </tr>`;
};

const createRows = (qnty) => {
  let html = "";
  for (let i = 1; i <= qnty; i++) {
    html += createRow(i);
  }
  return html;
};

export const createTable = (rows) => {
  return `<table class="table">
              <tr class="table__row">
                <th class="table__column table__column--header"></th>
                ${createHeaders()}
              </tr>
              ${createRows(rows)}
            </table>`;
};
