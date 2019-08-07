import CryptoJS from 'crypto-js';

type EncryptionParams<T> = {
  nonceStr: string;
  timestamp: string;
  sign: string;  
} & T;

class Secure {

  public randomValue = (): string => {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
  }

  public signEncrypt = (message: string) => {
    const encrypted = CryptoJS.SHA512(message);
    return encrypted.toString();
  }

  /**
   * @param {接口加密算法}
   */
  public encryption = <T>(params: T): EncryptionParams<T> => {

    /**
     * @param {nonceStr} 随机字符串
     * @param {timestamp} 时间戳
     */
    const nonceStr = this.randomValue();
    const timestamp = new Date().getTime().toString();

    const SIGN_PARAMS = {
      nonceStr,
      timestamp,
    };

    const paramsKeys: string[] = [
      'timestamp',
      'nonceStr',
    ];

    for (let key in params) {
      if (key) {
        paramsKeys.push(key);
      }
    }
    /**
     * [按照升序排序]
     */
    const sortParamsKeys = paramsKeys.sort();

    let perpareSignParams: string[] = [];
    sortParamsKeys.forEach((key, index: number) => {
      if (key === 'timestamp' || key === 'nonceStr') {
        perpareSignParams.push(`${key}=${SIGN_PARAMS[key]}`);
      } else {
        perpareSignParams.push(`${key}=${params[key]}`);
      }
    });

    const perpareSignParamsString = perpareSignParams.join('&');
    const signedString = this.signEncrypt(perpareSignParamsString);

    const encryedParams = {
      ...params,
      nonceStr,
      timestamp,
      sign: signedString
    };
    return encryedParams;
  }
}

export default new Secure();