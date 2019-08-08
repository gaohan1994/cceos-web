import { RECEIVE_BASIC_INFO } from '../types/constant';
import { Store } from './index';

export type StoreType = {
  basicInfo: any
};

export const initState = {
  basicInfo: {}
};

function store (state: any = initState, action: any): StoreType {
  switch (action.type) {
    case RECEIVE_BASIC_INFO:
      const { payload } = action;
      const { basicInfo } = payload;
      return {
        ...state,
        basicInfo
      };
    default:
      return state;
  }
}

export default store;

export function getBasicInfo (state: Store) {
  return state.store.basicInfo;
}