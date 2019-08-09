
type apiMap = {
  wechatBasic: string;
  bonusAuth: (params: string) => string;
  bonusBind: string;
  wechatBind: string;
  wechatPersonal: string;
  wechatRecords: string;
};

const apiMap = {
  wechatBasic: 'wechat/basic',
  bonusAuth: (bonusToken: string) => `wx/bonus/auth/${bonusToken}`,
  bonusBind: 'wx/bonus/bind',
  wechatBind: 'wechat/bind',
  wechatPersonal: 'wechat/personal',
  wechatRecords: 'wechat/records',
};

export { apiMap };