import ApiService from "../service/ApiService";
import { ApiBasic } from '../types/type';
import { AppStore } from '../AppBuild/App';
import { RECEIVE_BASIC_INFO } from '../types/constant';
class Api {

  public wechatBasic = async (params: any): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.wechatBasic(params);
    if (code === 1) {
      AppStore.dispatch({
        type: RECEIVE_BASIC_INFO,
        payload: { basicInfo: data }
      });
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

  public bonusAuth = async (params: any): Promise<ApiBasic<any>> => {
    const result = await ApiService.bonusAuth(params);
    return { success: true, result };
  }

  public bonusBind = async (params: any): Promise<ApiBasic<any>> => {
    const result = await ApiService.bonusBind(params);
    return { success: true, result };
  }

  public wechatBind = async (params: any): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.wechatBind(params);
    if (code === 1) {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

  public wechatPersonal = async (params: { openId: string }): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.wechatPersonal(params);
    if (code === 1) {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

  public wechatRecords = async (params: { workNumber: string }): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.wechatRecords(params);
    if (code === 1) {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }
}

export default new Api();