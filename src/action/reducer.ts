import { Dispatch } from 'redux';
import { RECEIVE_WECHAT_PERSONAL_INFO, RECEIVE_WECHAT_RECORDS } from '../types/constant';

export function saveWechatPersonal (dispatch: Dispatch, wechatPersonalInfo: any) {
  return dispatch({
    type: RECEIVE_WECHAT_PERSONAL_INFO,
    payload: { wechatPersonal: wechatPersonalInfo }
  });
}

export function saveWechatRecords (dispatch: Dispatch, wechatRecords: any) {
  return dispatch({
    type: RECEIVE_WECHAT_RECORDS,
    payload: { wechatRecords: wechatRecords }
  });
}