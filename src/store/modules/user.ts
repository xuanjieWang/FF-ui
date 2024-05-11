import { to } from 'await-to-js';
import defAva from '@/assets/images/profile.jpg';
import store from '@/store';
import { getToken, removeToken, setToken } from '@/utils/auth';
import { login as loginApi, logout as logoutApi, getInfo as getUserInfo, smsLoginAPI } from '@/api/login';
import { LoginData, SmsLoginData } from '@/api/types';

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken());
  const name = ref('');
  const nickname = ref('');
  const userId = ref<string | number>('');
  const avatar = ref('');
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const permissions = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限
  const regisStatus = ref<string>(''); //用户角色信息
  const designerType = ref<string>('');
  const deptName = ref<string>('');

  /**
   * 登录
   * @param userInfo
   * @returns
   */
  const login = async (userInfo: LoginData): Promise<void> => {
    const [err, res] = await to(loginApi(userInfo));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  const smsLogin = async (regisData: any) => {
    const [err, res] = await to(smsLoginAPI(regisData));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 短信登录
  const loginSMS = async (userInfo: SmsLoginData): Promise<void> => {
    const [err, res] = await to(loginApi(userInfo));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 获取用户信息
  const getInfo = async (): Promise<void> => {
    const [err, res] = await to(getUserInfo());
    if (res) {
      const data = res.data;
      const user = data.user;
      const profile = user.avatar == '' || user.avatar == null ? defAva : user.avatar;
      console.log('登录信息getInfo---', res.data.user);

      if (data.roles && data.roles.length > 0) {
        // 验证返回的roles是否是一个非空数组
        roles.value = data.roles;
        permissions.value = data.permissions;
      } else {
        roles.value = ['ROLE_DEFAULT'];
      }

      name.value = user.userName;
      nickname.value = user.nickName;
      avatar.value = profile;
      userId.value = user.userId;
      regisStatus.value = user.regisStatus;
      designerType.value = user.designerType;
      deptName.value = user.dept.deptName;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 获取用户信息，用于登录的时候获取状态
  const getUserStatusInfo = async (): Promise<void> => {
    const [err, res] = await to(getUserInfo());
    if (res) {
      const data = res.data;
      const user = data.user;
      userId.value = user.userId;
      regisStatus.value = user.regisStatus;
      designerType.value = user.designerType;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 注销
  const logout = async (): Promise<void> => {
    await logoutApi();
    token.value = '';
    roles.value = [];
    userId.value = '';
    regisStatus.value = '';
    designerType.value = '';
    permissions.value = [];
    removeToken();
  };

  const setAvatar = (value: string) => {
    avatar.value = value;
  };

  const setUser = () => {
    regisStatus.value = '注册中';
  };

  return {
    name,
    userId,
    token,
    nickname,
    avatar,
    roles,
    permissions,
    regisStatus,
    designerType,
    deptName, // 部门
    login,
    smsLogin,
    loginSMS,
    getInfo,
    logout,
    setAvatar,
    getUserStatusInfo,
    setUser
  };
});

export default useUserStore;
// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
