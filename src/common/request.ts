import Secure from './Secure';
import AppConfig from '../AppBuild/config';

export function analysisUrl(url: string) {
  /**
   * [把活动的参数从query截取成json]
   */
  const arr: string[] = url.split('&');
  let params: any = {};
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      let paramItem = arr[i].split("=");
      let paramKey = paramItem[0];
      let paramValue = paramItem[1];
      params[paramKey] = paramValue;
    }
  }

  return params;
}

/**
 * @param message string 打印信息
 */
const ConsoleUtil = (message: any, title?: string): void => {
  if (title) {
    console.log(`---------------------- ${title} ----------------------`);
  }
  console.log(message);
  if (title) {
    console.log(`---------------------- ${title}结束 ----------------------`);
  }
};

/**
 * 默认错误处理函数
 * @param error RequsetError
 */
const defaultErrorCallback = async (error: any) => {
  ConsoleUtil(error, '[ERROR]');
};

export const withTimeout = (time: number) => (promise: any, option?: any) =>
  Promise.race([
    promise,
    new Promise((resolve, reject) =>
      setTimeout((_: any) => reject(
        new Error('请求超时！请检查网络连接！')
      ), time)
    )
  ]);

export const detaultTimeoutFetch = withTimeout(AppConfig.DEFAULT_FETCH_TIMEOUT);

export const request = async (
  url: string,
  ...args: Array<any>
): Promise<any> => {
  const argByType: any = {};
  const functions: any = [];
  let callback: any;
  let errorCallback = defaultErrorCallback;

  args.forEach(arg => {
    if (typeof arg === 'function') {
      functions.push(arg);
    } else {
      argByType[typeof arg] = arg;
    }
  });

  /**
   *  判断长度 第一个是 callback 第二个是 errorcallback
   */
  if (functions && functions.length > 0) {
    if (functions.length === 1) {
      callback = functions[0];
    } else if (functions.length === 2) {
      callback = functions[0];
      errorCallback = functions[1];
    }
  }

  const httpMethod = (argByType.string || 'GET').toUpperCase();
  const params = argByType.object || {};
  let options: RequestInit = {
    /* 默认method */
    method: httpMethod,
    /* 默认headers */
    headers: {
      'Content-Type': 'application/json',
    }
  };
  ConsoleUtil(params, '请求报文');

  if (options.method) {
    if (options.method.toUpperCase() !== 'GET') {
      options.body = params
        ? JSON.stringify(Secure.encryption(params))
        : '';
    }
  }

  if (url !== '/project-gateway/oauth/agent/token' && url.indexOf('project-gateway')) {
    const userInfoStr = localStorage.getItem(AppConfig.CHAT_USERINFO_KEY);
    if (userInfoStr) {
      const userInfo: any = JSON.parse(userInfoStr);
      if (userInfo && userInfo.token) {
        options.headers = {
          ...options.headers,
          Authorization: userInfo.token || ''
        };
      }
    }
  }

  try {
    return detaultTimeoutFetch(fetch(url, options), options)
      .then((response: Response) => response.json())
      .then((responseJson: any): any => {
        ConsoleUtil(responseJson, '响应报文');
        if (callback) {
          callback(responseJson);
        }
        return responseJson;
      })
      .catch((e: any) => {
        errorCallback(e);
        return { code: 'timeout', msg: '网络异常啦！请请检查网络连接！' };
      });
  } catch (error) {
    errorCallback(error);
    return { code: 'timeout', msg: '网络异常啦！请请检查网络连接！' };
  }
};