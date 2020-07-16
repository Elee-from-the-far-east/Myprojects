import {types} from '@/Redux/types';

export function tableResize(data) {
  return {
    type: types.TABLE_RESIZE,
    data
  }
}

export function getCellData(data) {
  return {
    type:types.GET_CELLDATA,
    data
  }
}



