import { Dispatch } from 'redux';
import { 
  RECEIVE_WECHAT_PERSONAL_INFO, 
  RECEIVE_WECHAT_RECORDS,
  RECEIVE_WECHAT_BALANCE,
  RECEIVE_BONUS_DETAIL,
} from '../types/constant';

export function saveWechatPersonal (dispatch: Dispatch, wechatPersonalInfo: any) {
  return dispatch({
    type: RECEIVE_WECHAT_PERSONAL_INFO,
    payload: { wechatPersonal: wechatPersonalInfo }
  });
}

export function saveWechatRecords (dispatch: Dispatch, wechatRecords: any) {
  return dispatch({
    type: RECEIVE_WECHAT_RECORDS,
    payload: { wechatRecords: wechatRecords.rows, wechatRecordsTotal: wechatRecords.total }
  });
}

export function saveWechatBalance (dispatch: Dispatch, wechatBalance: any) {
  return dispatch({
    type: RECEIVE_WECHAT_BALANCE,
    payload: { wechatBalance }
  });
}

export function saveBonusDetail (dispatch: Dispatch, bonusDetail: any) {
  return dispatch({
    type: RECEIVE_BONUS_DETAIL,
    payload: { bonusDetail }
  });
}