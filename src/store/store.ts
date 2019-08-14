import { 
  RECEIVE_BASIC_INFO, 
  RECEIVE_WECHAT_PERSONAL_INFO, 
  RECEIVE_WECHAT_RECORDS,
  RECEIVE_WECHAT_BALANCE,
} from '../types/constant';
import { Store } from './index';

export type StoreType = {
  basicInfo: any;
  wechatPersonal: any;
  wechatRecords: any;
  wechatRecordsTotal: number;
  wechatBalance: any;
};

export const initState = {
  basicInfo: {},
  wechatPersonal: {},
  wechatRecords: {},
  wechatRecordsTotal: 0,
  wechatBalance: 0,
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
      const { payload: { wechatRecord, wechatRecordsTotal } } = action;
      return {
        ...state,
        wechatRecord,
        wechatRecordsTotal
      };
    case RECEIVE_WECHAT_BALANCE:
      const { payload: { wechatBalance } } = action;
      return {
        ...state,
        wechatBalance,
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

export function getRecordsTotal (state: Store) {
  return state.store.wechatRecordsTotal;
}

export function getFetchRecordsToken (state: Store, pageNum: number) {
  const total = getRecordsTotal(state);
  return pageNum * 20 < total;
}

export function getWechatBalance (state: Store) {
  return state.store.wechatBalance;
}