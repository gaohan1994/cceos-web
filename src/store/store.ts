import {
  RECEIVE_BASIC_INFO,
  RECEIVE_WECHAT_PERSONAL_INFO,
  RECEIVE_WECHAT_RECORDS,
  RECEIVE_WECHAT_BALANCE,
  RECEIVE_BONUS_DETAIL,
  RECEIVE_CURRENT_IMAGE
} from '../types/constant';
import { Store } from './index';

export type StoreType = {
  basicInfo: any;
  wechatPersonal: any;
  wechatRecords: any[];
  wechatRecordsTotal: number;
  wechatBalance: any;
  bonusDetail: any;
  currentImg: string;
  viewerFlag: boolean;
};

export const initState = {
  basicInfo: {},
  wechatPersonal: {},
  wechatRecords: [],
  wechatRecordsTotal: 0,
  wechatBalance: 0,
  bonusDetail: {},
  currentImg: '',
  viewerFlag: false,
};

function store(state: StoreType = initState, action: any): StoreType {
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
      const { payload: { wechatRecords, wechatRecordsTotal, wechatRecordsPage } } = action;

      if (wechatRecordsPage === 1) {
        return {
          ...state,
          wechatRecords,
          wechatRecordsTotal
        };
      } else {
        return {
          ...state,
          wechatRecords: state.wechatRecords.concat(wechatRecords),
          wechatRecordsTotal
        };
      }
    case RECEIVE_WECHAT_BALANCE:
      const { payload: { wechatBalance } } = action;
      return {
        ...state,
        wechatBalance,
      };
    case RECEIVE_BONUS_DETAIL:
      const { payload: { bonusDetail } } = action;
      const detail = {
        ...bonusDetail.bonusDetail,
        receiverList: bonusDetail.receiverList
      };
      return {
        ...state,
        bonusDetail: detail
      };
    case RECEIVE_CURRENT_IMAGE: {
      const { payload: { currentImg } } = action;
      return {
        ...state,
        currentImg,
        viewerFlag: !state.viewerFlag
      };
    }
    default:
      return state;
  }
}

export default store;

export function getBasicInfo(state: Store) {
  return state.store.basicInfo;
}

export function getWechatPersonal(state: Store) {
  return state.store.wechatPersonal;
}

export function getWechatRecord(state: Store) {
  return state.store.wechatRecords;
}

export function getRecordsTotal(state: Store) {
  return state.store.wechatRecordsTotal;
}

export function getFetchRecordsToken(state: Store, pageNum: number) {
  const total = getRecordsTotal(state);
  return pageNum * 20 < total;
}

export function getWechatBalance(state: Store) {
  return state.store.wechatBalance;
}

export function getBonusDetail(state: Store) {
  return state.store.bonusDetail;
}