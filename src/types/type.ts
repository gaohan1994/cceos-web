
export interface ApiBasic<T> {
  success: boolean;
  result: T;
}

export interface ResponseBasic<T> {
  code: number;
  data: T;
  msg: string;
}