export type AppConfigType = {
  CCEOS_API_ENTRY: string;
  WEIXIN_API_ENTRY: string;
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
    CCEOS_API_ENTRY: 'http://172.30.20.100:18899',
    WEIXIN_API_ENTRY: 'http://172.30.200.151:8084',
  },
  production: {
    CCEOS_API_ENTRY: 'http://172.30.20.100:18899',
    WEIXIN_API_ENTRY: 'http://172.30.200.151:8084',
  },
});

export default AppConfig;

export function mergeProps (stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return Object.assign({}, ownProps, stateProps, dispatchProps);
}
    