<template>
  <div class="login">
    <div class="login-form">
      <h3 class="title">风飞接单管理系统</h3>
      <el-tabs v-model="activeName" class="demo-tabs" stretch="true">
        <el-tab-pane label="登录" name="one">
          <el-form ref="loginRef" :model="loginForm" :rules="loginRules">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="请输入手机号">
                <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码" @keyup.enter="handleLogin">
                <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
              <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter="handleLogin">
                <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img" />
              </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
            <el-form-item style="width: 100%">
              <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="three">
          <SMSRegis />
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2023 .</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCodeImg } from '@/api/login'
import { useUserStore } from '@/store/modules/user'
import { LoginData } from '@/api/types'
import { to } from 'await-to-js'
import { loginRules } from './rules'
import SMSRegis from './smsRegis/index.vue'
const userStore = useUserStore()
const router = useRouter()

const loginForm = ref<LoginData>({
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData) // 登录表单数据

const codeUrl = ref('') // 验证码图片URL
const loading = ref(false) // 登录加载状态
const captchaEnabled = ref(true) // 验证码启用状态
const loginRef = ref<ElFormInstance>() // 登录表单引用
const activeName = ref('one') // 当前激活的标签页

const handleLogin = () => {
  loginRef.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true
      // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        localStorage.setItem('username', String(loginForm.value.username))
        localStorage.setItem('password', String(loginForm.value.password))
        localStorage.setItem('rememberMe', String(loginForm.value.rememberMe))
      } else {
        // 否则移除
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        localStorage.removeItem('rememberMe')
      }
      const [err] = await to(userStore.login(loginForm.value))
      if (!err) {
        await to(userStore.getUserStatusInfo())
        // 注册中跳转完善信息页面
        if ('注册中' === userStore.regisStatus) {
          await router.push('/information')
        } else if ('审核中' === userStore.regisStatus) {
          loading.value = false
          await router.push('/auditing')
        } else if ('审核不通过' === userStore.regisStatus) {
          loading.value = false
          await router.push('/reject')
        } else {
          await router.push('/index')
        }
        loading.value = false
      } else {
        loading.value = false
        if (captchaEnabled.value) {
          await getCode()
        }
      }
    }
  })
}

/**
 * 获取验证码
 */
const getCode = async () => {
  const res = await getCodeImg() // 获取验证码图片响应
  const { data } = res // 解构响应数据
  captchaEnabled.value = true
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + data.img // 设置验证码图片URL
    loginForm.value.uuid = data.uuid // 设置验证码UUID
  }
}

const getLoginData = () => {
  const username = localStorage.getItem('username') // 获取记住的用户名
  const password = localStorage.getItem('password') // 获取记住的密码
  const rememberMe = localStorage.getItem('rememberMe') // 获取记住密码状态
  loginForm.value = {
    username: username === null ? String(loginForm.value.username) : username,
    password: password === null ? String(loginForm.value.password) : String(password),
    rememberMe: rememberMe === null ? false : Boolean(rememberMe)
  } as LoginData
}

onMounted(() => {
  getCode() // 获取验证码
  getLoginData() // 获取登录数据
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e0f2fe 75%, #f0f9ff 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

// 网格背景
.login::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 1;
}

// 装饰性几何图案
.login::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 45% 10%, rgba(139, 92, 246, 0.05) 0%, transparent 35%),
    radial-gradient(circle at 75% 40%, rgba(245, 158, 11, 0.04) 0%, transparent 30%),
    radial-gradient(circle at 25% 80%, rgba(239, 68, 68, 0.04) 0%, transparent 35%);
  pointer-events: none;
  z-index: 2;
}

// 添加管理系统风格的装饰元素
.login {
  &::before {
    background-image: linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
      radial-gradient(circle at 20px 20px, rgba(59, 130, 246, 0.1) 2px, transparent 2px);
    background-size: 40px 40px, 40px 40px, 80px 80px;
  }
}

// 添加浮动的几何装饰
.login {
  &::after {
    background: radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 45% 10%, rgba(139, 92, 246, 0.04) 0%, transparent 45%),
      radial-gradient(circle at 75% 40%, rgba(245, 158, 11, 0.03) 0%, transparent 40%),
      radial-gradient(circle at 25% 80%, rgba(239, 68, 68, 0.03) 0%, transparent 45%),
      linear-gradient(45deg, transparent 48%, rgba(148, 163, 184, 0.02) 49%, rgba(148, 163, 184, 0.02) 51%, transparent 52%);
    background-size: 300px 300px, 250px 250px, 200px 200px, 180px 180px, 220px 220px, 60px 60px;
    animation: float 20s ease-in-out infinite;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(1deg);
  }
  50% {
    transform: translateY(-5px) rotate(-1deg);
  }
  75% {
    transform: translateY(-15px) rotate(0.5deg);
  }
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #1e293b;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.login-form {
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%);
  width: 420px;
  max-width: 90vw;
  padding: 40px 35px 25px 35px;
  min-height: 480px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 0 100px rgba(59, 130, 246, 0.05);
  backdrop-filter: blur(20px);
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: all 0.4s ease;
  position: relative;
  z-index: 10;
}

.login-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(16, 185, 129, 0.01) 50%, rgba(139, 92, 246, 0.02) 100%);
  border-radius: 20px;
  pointer-events: none;
  z-index: -1;
}

.login-form:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 35px 70px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 0 120px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.login-form .el-input {
  height: 45px;
  margin-bottom: 8px;

  input {
    height: 45px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
    border: 2px solid rgba(226, 232, 240, 0.6);
    border-radius: 12px;
    color: #1e293b;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  input:focus {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(239, 246, 255, 0.9) 100%);
    border-color: rgba(59, 130, 246, 0.6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  input::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
}

.input-icon {
  height: 39px;
  width: 16px;
  margin-left: 2px;
  color: #475569;
}

.login-form .el-button--primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
  border: none;
  border-radius: 12px;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.login-form .el-button--primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  transition: left 0.5s ease;
}

.login-form .el-button--primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e3a8a 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.login-form .el-button--primary:hover::before {
  left: 100%;
}

.login-form .el-button--primary:active {
  transform: translateY(0);
}

.login-form .el-checkbox {
  color: #475569;
  font-weight: 500;
}

.login-form .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.login-form .el-tabs {
  margin-top: -15px;
}

.login-form .el-tabs__header {
  margin-bottom: 25px;
}

.login-form .el-tabs__item {
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.login-form .el-tabs__item.is-active {
  color: #1e293b;
  font-weight: 700;
}

.login-form .el-tabs__active-bar {
  background: linear-gradient(90deg, #3b82f6, #10b981);
  height: 3px;
  border-radius: 2px;
}

.login-form .el-tabs__nav-wrap::after {
  background-color: rgba(226, 232, 240, 0.4);
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #94a3b8;
  margin-top: 15px;
}

.login-code {
  width: 33%;
  height: 45px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
    border-radius: 10px;
    border: 2px solid rgba(226, 232, 240, 0.6);
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  img:hover {
    border-color: rgba(59, 130, 246, 0.6);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
    transform: scale(1.02);
  }
}

.login-code-img {
  height: 41px;
  padding-left: 12px;
}

.sms-code {
  width: 33%;
  height: 45px;
  line-height: 41px;
  text-align: center;
  margin-left: 13px;
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 0.6);
  user-select: none;
  color: #475569;
  font-weight: 500;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sms-code:hover {
  cursor: pointer;
  background: linear-gradient(135deg, rgba(239, 246, 255, 0.9) 0%, rgba(219, 234, 254, 0.8) 100%);
  border-color: rgba(59, 130, 246, 0.6);
  color: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

.el-login-footer {
  height: 50px;
  line-height: 50px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #475569;
  font-family: 'Segoe UI', Arial, serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  z-index: 20;
}

.demo-tabs {
  margin-top: -20px;
  width: 100%;
}

.demo-tabs > * {
  width: 50%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login {
    padding: 15px;

    &::before {
      background-size: 30px 30px, 30px 30px, 60px 60px;
    }
  }

  .login-form {
    width: 100%;
    max-width: 380px;
    padding: 30px 25px 20px 25px;
    min-height: 420px;
  }

  .title {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }

  .login-form .el-input {
    height: 42px;

    input {
      height: 42px;
      font-size: 0.9rem;
    }
  }

  .login-form .el-button--primary {
    height: 44px;
    font-size: 0.95rem;
  }

  .login-code {
    height: 42px;
  }

  .login-code-img {
    height: 38px;
  }

  .sms-code {
    height: 42px;
    line-height: 38px;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 25px 20px 15px 20px;
  }

  .title {
    font-size: 1.4rem;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.login-form {
  animation: fadeInUp 0.8s ease-out;
}

.title {
  animation: slideInFromLeft 0.6s ease-out 0.2s both;
}

.el-login-footer {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

/* 加载状态优化 */
.login-form .el-button.is-loading {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

.login-form .el-button.is-loading:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  transform: none;
}

/* 表单验证状态 */
.login-form .el-form-item.is-error .el-input input {
  border-color: rgba(239, 68, 68, 0.6);
  background: linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.login-form .el-form-item.is-success .el-input input {
  border-color: rgba(16, 185, 129, 0.6);
  background: linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* 专业管理系统装饰元素 */
.login {
  &::before {
    background-image: 
      // 主网格
      linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px),
      // 次网格
      linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px),
      // 装饰点
      radial-gradient(circle at 20px 20px, rgba(59, 130, 246, 0.08) 2px, transparent 2px);
    background-size: 60px 60px, 60px 60px, 20px 20px, 20px 20px, 120px 120px;
  }
}
</style>
