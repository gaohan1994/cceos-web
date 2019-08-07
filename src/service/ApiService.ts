import { request } from '../common/request';
import { apiMap } from './apiMap';
import { ResponseBasic } from '../types/type';

const API_ENTRY = 'http://172.30.200.151:8084';
const API_PATH = {
  third: 'cceos-third'
};

class ApiService {

  public wechatBasic = async (params: any): Promise<ResponseBasic<any>> => {
    return request(
      `${API_ENTRY}/${API_PATH.third}/${apiMap.wechatBasic}`,
      'post',
      {
        ...params
      }
    );
  }
}

export default new ApiService();