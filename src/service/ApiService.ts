import { request } from '../common/request';
import { apiMap } from './apiMap';
import { ResponseBasic } from '../types/type';
import AppConfig from '../AppBuild/config';

const API_PATH = {
  third: 'cceos-third',
  gateway: 'cceos-gateway',
};

export const jsonToQueryString = (json: any) => {
  const field = Object.keys(json)
    .map(function (key: any) {
      if (json[key] !== undefined) {
        return key + '=' + json[key];
      }
      return '';
    })
    .filter((item) => !!item)
    .join('&');
  return field.length > 0 ? `?${field}` : '';
};

class ApiService {

  public wechatValid = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatValid}`,
      'post',
      { ...params }
    );
  }

  public wechatBasic = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatBasic}`,
      'post',
      {
        ...params
      }
    );
  }

  public bonusGrab = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CCEOS_API_ENTRY}/${API_PATH.gateway}/${apiMap.bonusGrab}`,
      'post',
      {
        ...params
      }
    );
  }

  public bonusDetail = async (params: string): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CCEOS_API_ENTRY}/${API_PATH.gateway}/${apiMap.bonusDetail(params)}`
    );
  }

  public bonusBind = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CCEOS_API_ENTRY}/${API_PATH.gateway}/${apiMap.bonusBind}`,
      'post',
      { ...params }
    );
  }

  public wechatBind = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatBind}`,
      'post',
      { ...params }
    );
  }

  public wechatPersonal = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatPersonal}`,
      'post',
      { ...params }
    );
  }

  public wechatRecords = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatRecords}`,
      'post',
      { ...params }
    );
  }

  public wechatBalance = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatBalance}`,
      'post',
      { ...params }
    );
  }

  public wechatVoucher = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.WEIXIN_API_ENTRY}/${API_PATH.third}/${apiMap.wechatVoucher}`,
      'post',
      { ...params }
    );
  }

  /**
   * @todo 客户聊天记录
   * @param params 
   */
  public chatLogHistory = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CHART_API_ENTRY}/project-gateway/api/chatLog/customer/history${jsonToQueryString(params)}`,
      'get',
    );
  }

  /**
   * @todo 获取客户token
   * @param params 
   */
  public chatToken = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CHART_API_ENTRY}/project-gateway/oauth/customer/token`,
      'post',
      { ...params }
    );
  }

  /**
   * @todo 聊天图片上传
   * @param params 
   */
  public chatImgUpload = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CHART_API_ENTRY}/project-gateway/api/chatLog/img`,
      'post',
      { ...params }
    );
  }

  /**
   * @todo 查询本系统下问题分类
   * @param params 
   */
  public questionCategory = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CHART_API_ENTRY}/project-gateway/api/question/category${jsonToQueryString(params)}`,
      'get',
    );
  }

  /**
   * @todo 根据分类id查询具体问题
   * @param params 
   */
  public questionQuestion = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CHART_API_ENTRY}/project-gateway/api/question/question${jsonToQueryString(params)}`,
      'get',
    );
  }

  /**
   * @todo 根据问题id查询问题答案
   * @param params 
   */
  public questionAnswer = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CHART_API_ENTRY}/project-gateway/api/question/answer${jsonToQueryString(params)}`,
      'get',
    );
  }

  /**
   * @todo 查询空闲客服
   * @param params 
   */
  public agentIdle = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${AppConfig.CHART_API_ENTRY}/project-gateway/api/agent/idle${jsonToQueryString(params)}`,
      'get',
    );
  }
}

export default new ApiService();