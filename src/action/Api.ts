import { Modal, Toast } from 'antd-mobile';
import ApiService from "../service/ApiService";
import { ApiBasic } from '../types/type';
import { AppStore } from '../AppBuild/App';
import { RECEIVE_BASIC_INFO } from '../types/constant';
import AppConfig from '../AppBuild/config';
import md5 from 'js-md5';
import { useQueryParam } from '../common/util';

const alert = Modal.alert;
class Api {

  public wechatValid = async (params: any): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.wechatValid(params);
    if (code === 1) {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

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

  public bonusGrab = async (params: any): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.bonusGrab(params);
    if (code === 'response.success') {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

  public bonusDetail = async (params: string): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.bonusDetail(params);
    if (code === 'response.success') {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
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

  public wechatRecords = async (params: { openId: string }): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.wechatRecords(params);
    if (code === 1) {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

  public wechatBalance = async (params: any): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.wechatBalance(params);
    if (code === 1) {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

  public wechatVoucher = async (params: any): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.wechatVoucher(params);
    if (code === 1) {
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

  public defaultAuthorize = async (func: any, params: any, callback?: any) => {
    const { code, data, msg } = await func(params);
    const customerId = useQueryParam('id');
    let result: any = {};
    if (code === 'response.success') {
      result = { success: true, result: data };
    } else if (code === 'unauthorized') {
      result = { success: false, result: false };
      alert('提示', '用户还未授权，请先进行授权！', [
        {
          text: '确定', onPress: () =>
            new Promise(async (resolve) => {
              const params = {
                username: customerId,
                password: md5('123456')
              }
              Toast.loading('授权中...');
              const res = await this.chatToken(params);
              Toast.hide();
              if (res.success) {
                Toast.success('授权成功!');
                history.go(0);
                // this.defaultAuthorize(func, params, callback);
                resolve();
              } else {
                Toast.fail(res.result || '授权失败，请重试！')
              }
            }),
        },
      ]);
    } else {
      result = { success: false, result: msg };
    }
    if (callback) {
      callback(result);
    }
    return result;
  }

  public chatLogHistory = async (params: any, callback?: any): Promise<ApiBasic<any>> => {
    const result = await this.defaultAuthorize(ApiService.chatLogHistory, params, callback);
    return result;
  }

  public chatToken = async (params: any): Promise<ApiBasic<any>> => {
    const { code, data, msg } = await ApiService.chatToken(params);
    if (code === 'response.success') {
      localStorage.setItem(AppConfig.CHAT_USERINFO_KEY, JSON.stringify(data));
      return { success: true, result: data };
    } else {
      return { success: false, result: msg };
    }
  }

  public chatImgUpload = async (params: any, callback?: any): Promise<ApiBasic<any>> => {
    const result = await this.defaultAuthorize(ApiService.chatImgUpload, params, callback);
    return result;
  }

  public questionCategory = async (params: any, callback?: any): Promise<ApiBasic<any>> => {
    const result = await this.defaultAuthorize(ApiService.questionCategory, params, callback);
    return result;
  }

  public questionQuestion = async (params: any, callback?: any): Promise<ApiBasic<any>> => {
    const result = await this.defaultAuthorize(ApiService.questionQuestion, params, callback);
    return result;
  }

  public questionAnswer = async (params: any, callback?: any): Promise<ApiBasic<any>> => {
    const result = await this.defaultAuthorize(ApiService.questionAnswer, params, callback);
    return result;
  }

  public agentIdle = async (params: any, callback?: any): Promise<ApiBasic<any>> => {
    const result = await this.defaultAuthorize(ApiService.agentIdle, params, callback);
    return result;
  }
}

export default new Api();