<!--页面-->
<template>
  <el-form ref="regisRef" :model="regisData" :rules="regisRules">
    <el-form-item prop="phone">
      <el-input v-model="regisData.phone" type="text" size="large" auto-complete="off" placeholder="手机号">
        <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="regisData.password" type="password" size="large" auto-complete="off" placeholder="密码">
        <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input v-model="regisData.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter="handleRegister">
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
    <el-form-item style="width:100%; display: flex;"></el-form-item>
    <el-form-item style="width:100%;">
      <el-button :loading="loading" size="large" type="success" style="width:100%;" @click.prevent="handleRegister"> 注册 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {RegisData } from '@/api/types';
import { regisRules } from '../rules'
import SlideVerify from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";
const router = useRouter();

const loading = ref(false);
const showCode = ref(false)
const images = reactive([])

const regisData = ref<RegisData>({
  phone: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
} as RegisData);


// 拼图验证成功回调
const onSuccess = () => {
  // ElMessage.success("验证成功！");
  showCode.value = false;

  // 获取短信验证码接口

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
  // ElMessage.error("验证不通过!")
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

 function handleRegister() {
  // await router.push('/authentication');
         router.push('/index');

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
