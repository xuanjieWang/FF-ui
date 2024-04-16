<!--页面-->
<template>
  <div>
    <el-form ref="smsRef" :model="smsLoginData" :rules="smsRules">
      <el-form-item prop="username">
        <el-input v-model="smsLoginData.phonenumber" type="text" size="large" auto-complete="off" placeholder="请输入手机号">
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input v-model="smsLoginData.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter="handleLogin">
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="sms-code" @click="getSmsCode">
          <span v-if="!sendSmsButton">获取验证码</span>
          <span v-else>重发验证（{{ smsTime }}s）</span>
        </div>
      </el-form-item>
      <el-card style="position: fixed; z-index: 999; margin-top: -8%" v-if="showCode">
        <slide-verify ref="slide" class="slide" slider-text="向右滑动->" :imgs="images" @success="onSuccess" @fail="onFail"></slide-verify>
      </el-card>
      <el-form-item style="width:100%; display: flex;"> </el-form-item>
      <el-form-item style="width:100%; margin-top: 120px;">
        <el-button :loading="loading" size="large" type="primary" style="width:100%;" @click.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {SmsLoginData } from '@/api/types';
import { smsRules } from '../rules'
import SlideVerify from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";
import { useUserStore } from '@/store/modules/user';
import { to } from 'await-to-js';
const router = useRouter();

const userStore = useUserStore();

const showCode = ref(false)

const images = reactive([])

const loading = ref(false);
const smsLoginData = ref<SmsLoginData>({
  phonenumber: '',
  rememberMe: false,
  smsCode: '',
  uuid: '',
  grantType: 'sms'
} as SmsLoginData);


//短信登录
async function handleLogin() {
const [err] = await to(userStore.loginSMS(smsLoginData.value));
      if (!err) {
        await router.push('/index');
        loading.value = false;
      } else {
        loading.value = false;
        // 重新获取验证码
      }
}
// 拼图验证成功回调
const onSuccess = async () => {
  // ElMessage.success("验证成功！");
  showCode.value = false;

  // 获取短信验证码接口
const [err] = await to(userStore.loginSMS(smsLoginData.value));
      if (!err) {
        await router.push('/index');
        loading.value = false;
      } else {
        loading.value = false;
        // 重新获取验证码
      }

   smsTimer.value = setInterval(() => {
    if (smsTime.value > 0 && smsTime.value <= 60) {
      smsTime.value--;
    } else {
      clearInterval(smsTimer.value);
      sendSmsButton.value = false;
    }
  }, 1000);
}

const onFail=()=>{
  ElMessage.error("验证不通过!")
}

// 验证码开关
const sendSmsButton = ref(false);
const smsTime = ref(60)
const smsTimer = ref(<number>0);
function getSmsCode() {
  if(sendSmsButton.value) return;
  sendSmsButton.value = true;
  showCode.value = true;
}
</script>
<style lang="scss" scoped>
  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }

.sms-code{
  width: 33%;
  height: 40px;
  line-height: 40px;
text-align: center;
margin-left: 13px;
border-radius: 5px;
border: 1px solid rgba(0, 0, 0, 0.06);
  user-select: none;
}
.sms-code:hover{
  cursor: pointer;
  background: rgba(0, 0, 0, 0.06);
}
</style>
