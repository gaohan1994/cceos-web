import { RECEIVE_BASIC_INFO, RECEIVE_WECHAT_PERSONAL_INFO, RECEIVE_WECHAT_RECORDS } from '../types/constant';
import { Store } from './index';

export type StoreType = {
  basicInfo: any;
  wechatPersonal: any;
  wechatRecords: any;
};

export const initState = {
  basicInfo: {},
  wechatPersonal: {},
  wechatRecords: {},
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
    case RECEIVE_WECHAT_PERSONAL_INFO:
      const { payload: { wechatPersonal } } = action;
      return {
        ...state,
        wechatPersonal
      };

    case RECEIVE_WECHAT_RECORDS:
      const { payload: { wechatRecord } } = action;
      return {
        ...state,
        wechatRecord
      };
    default:
      return state;
  }
}

export default store;

export function getBasicInfo (state: Store) {
  return state.store.basicInfo;
}

export function getWechatPersonal (state: Store) {
  return state.store.wechatPersonal;
}

export function getWechatRecord (state: Store) {
  return state.store.wechatRecords;
}