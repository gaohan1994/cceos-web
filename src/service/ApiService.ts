import { request } from '../common/request';
import { apiMap } from './apiMap';
import { ResponseBasic } from '../types/type';
import AppConfig from '../AppBuild/config';

const API_PATH = {
  third: 'cceos-third',
  gateway: 'cceos-gateway',
};

class ApiService {

  public wechatBasic = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatBasic}`,
      'post',
      {
        ...params
      }
    );
  }

  public bonusAuth = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CCEOS_API_ENTRY}/${API_PATH.gateway}/${apiMap.bonusAuth(params)}`,
      'get'
    );
  }

  public bonusBind = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CCEOS_API_ENTRY}/${API_PATH.gateway}/${apiMap.bonusBind}`,
      'post',
      {...params}
    );
  }

  public wechatBind = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatBind}`,
      'post',
      {...params}
    );
  }

  public wechatPersonal = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatPersonal}`,
      'post',
      {...params}
    );
  }

  public wechatRecords = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatRecords}`,
      'post',
      {...params}
    );
  }
  
  public wechatBalance = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatBalance}`,
      'post',
      {...params}
    );
  }
  
  public wechatVoucher = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatVoucher}`,
      'post',
      {...params}
    );
  }
}

export default new ApiService();