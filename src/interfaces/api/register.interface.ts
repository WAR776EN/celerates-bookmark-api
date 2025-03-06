export interface IRegisterReq {
  email: string;
  password: string;
}

export interface IRegisterRes {
  message: string,
  token: string
}