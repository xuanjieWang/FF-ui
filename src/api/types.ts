/**
 * 登录请求
 */
export interface LoginData {
  tenantId?: string;
  username?: string;
  password?: string;
  rememberMe?: boolean;
  socialCode?: string;
  socialState?: string;
  source?: string;
  code?: string;
  uuid?: string;
  clientId: string;
  grantType: string;
}

/**
 * 短信登录
 */
export interface SmsLoginData {
  tenantId?: string;
  phonenumber?: string;
  rememberMe?: boolean;
  code?: string;
  uuid?: string;
  smsCode: string;
  clientId: string;
  grantType: string;
}

/**
 * 短信注册
 */
export interface RegisData {
  phone?: string;
  password?: string;
  rememberMe?: boolean;
  code?: string;
  uuid?: string;
}

/**
 * 登录响应
 */
export interface LoginResult {
  access_token: string;
}

/**
 * 验证码返回
 */
export interface VerifyCodeResult {
  captchaEnabled: boolean;
  uuid?: string;
  img?: string;
}

/**
 * 租户
 */
export interface TenantVO {
  companyName: string;
  domain: any;
  tenantId: string;
}

export interface TenantInfo {
  tenantEnabled: boolean;
  voList: TenantVO[];
}
