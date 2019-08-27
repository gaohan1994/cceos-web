
export interface ApiBasic<T> {
  success: boolean;
  result: T;
}

export interface ResponseBasic<T> {
  code: number | string;
  data: T;
  msg: string;
}

export interface FetchListField {
  pageNum: number;
  pageSize: number;
}

export type BasicInfo = {
  name: string;
  department: string;
  email: string;
  mobile: string;
  workNumber: string;
};

export type VoucherInfo = {
  purchase: number;
  unused: number;
  used: number;
};

export type WechatPersonalInfo = {
  voucherInfo: VoucherInfo;
  cc: string;
  headImageUrl: string;
  basicInfo: BasicInfo;
};

export type WechatBalance = {
  balance: number;
  rate: string;
};

export type BonusDetail = {
  amount: number;
  bonusNo: string;
  bonusToken: string;
  comment: string;
  number: number;
  recvAmount: number;
  recvNum: number;
  sender: string;
  status: number;
  type: number;
  sex: number;
};

export type Receiver = {
  amount: number;
  bestLuck: number;
  receiver: string;
  sex: number;
  recvTime: string;
  openId: string;
  userEosAccount: string;
};