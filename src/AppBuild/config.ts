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
    CCEOS_API_ENTRY: 'http://202.101.149.132:8090',
    WEIXIN_API_ENTRY: 'http://202.101.149.132:8090',
  },
  production: {
    CCEOS_API_ENTRY: 'http://202.101.149.132:8090',
    WEIXIN_API_ENTRY: 'http://202.101.149.132:8090',
  },
});

export default AppConfig;

export function mergeProps (stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return Object.assign({}, ownProps, stateProps, dispatchProps);
}
    