
type apiMap = {
  wechatBasic: string;
  bonusGrab: string;
  bonusDetail: (bonusToken: string) => string;
  bonusBind: string;
  wechatBind: string;
  wechatPersonal: string;
  wechatRecords: string;
  wechatBalance: string;
  wechatVoucher: string;
  wechatValid: string;
};

const apiMap = {
  wechatBasic: 'wechat/basic',
  bonusGrab: 'wx/bonus/grab',
  bonusDetail: (bonusToken: string) => `wx/bonus/detail/${bonusToken}`,
  bonusBind: 'wx/bonus/bind',
  wechatBind: 'wechat/bind',
  wechatPersonal: 'wechat/personal',
  wechatRecords: 'wechat/records',
  wechatBalance: 'wechat/balance',
  wechatVoucher: 'wechat/voucher',
  wechatValid: 'wechat/valid',
};

export { apiMap };