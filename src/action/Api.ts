import ApiService from "../service/ApiService";
import { ApiBasic } from '../types/type';

class Api {

  public wechatBasic = async (params: any): Promise<ApiBasic<any>> => {
    const result = await ApiService.wechatBasic(params);
    console.log('result: ', result);
    return { success: true, result };
  }
}

export default new Api();