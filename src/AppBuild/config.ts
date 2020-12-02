export type AppConfigType = {
  CCEOS_API_ENTRY: string;
  WEIXIN_API_ENTRY: string;
  CHART_API_ENTRY: string;
  DEFAULT_FETCH_TIMEOUT: number;
  CHAT_USERINFO_KEY: string;
};

export function select (params: any) {
  for (let key in params) {
    if (key === process.env.NODE_ENV) {
      return params[key];
    }
  }
}

const AppConfig: AppConfigType = select({
  development: {
    CCEOS_API_ENTRY: 'http://202.101.149.132:8090',
    WEIXIN_API_ENTRY: 'http://202.101.149.132:8090',
    CHART_API_ENTRY: 'http://121.37.239.209:8080' ,
    DEFAULT_FETCH_TIMEOUT: 18000,
    CHAT_USERINFO_KEY: 'CENTERM_CHAT_USERINFO_KEY'
  },
  production: {
    CCEOS_API_ENTRY: 'http://202.101.149.130:18282',
    WEIXIN_API_ENTRY: 'http://202.101.149.130:18282',
    CHART_API_ENTRY: 'http://121.37.239.209:8080',
    DEFAULT_FETCH_TIMEOUT: 18000,
    CHAT_USERINFO_KEY: 'CENTERM_CHAT_USERINFO_KEY'
  },
});

export default AppConfig;

export function mergeProps (stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return Object.assign({}, ownProps, stateProps, dispatchProps);
}
    