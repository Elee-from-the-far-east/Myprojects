import { types } from "@/Redux/types";


export function reducer(state, { type, data }) {
  let pState;
  switch (type) {
    case "init":
      return (
        state || {
          columnState: {},
          cellData:{}
        }
      );
    case types.GET_CELLDATA:
      pState = state.cellData;
      pState[`${data.row}:${data.col}`]=data.value;
      return {...state, currentText:data.value};
    case types.TABLE_RESIZE:
      pState = state.columnState;
      pState[data.col] = data.value;
      return state;
    default:
      return state;
  }
}
