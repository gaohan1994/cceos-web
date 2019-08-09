
export interface ApiBasic<T> {
  success: boolean;
  result: T;
}

export interface ResponseBasic<T> {
  code: number;
  data: T;
  msg: string;
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