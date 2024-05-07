<!--页面-->
<template>
  <el-form ref="regisRef" :model="regisData" :rules="regisRules">
    <el-form-item prop="phonenumber">
      <el-input v-model="regisData.phonenumber" type="text" size="large" auto-complete="off" placeholder="手机号">
        <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="regisData.password" type="password" size="large" auto-complete="off" placeholder="密码">
        <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="regisData.password" type="password" size="large" auto-complete="off" placeholder="确认密码">
        <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
      </el-input>
    </el-form-item>

    <el-form-item prop="designerType">
      <el-select v-model="regisData.designerType" type="text" size="large" auto-complete="off" placeholder="请选择部门">
        <el-option v-for="dict in the_dept" :key="dict.value" :label="dict.label" :value="dict.value" />
      </el-select>
    </el-form-item>

    <el-form-item prop="inviteCode">
      <el-input v-model="regisData.inviteCode" type="text" size="large" auto-complete="off" placeholder="邀请码">
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
    <el-card style="position: fixed; z-index: 999; margin-top: -18%" v-if="showCode">
      <slide-verify ref="slide" class="slide" slider-text="向右滑动->" :imgs="images" @success="onSuccess" @fail="onFail"></slide-verify>
    </el-card>
    <el-form-item style="width:100%;">
      <el-button :loading="loading" size="large" type="success" style="width:100%;" @click.prevent="handleRegister"> 注册 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getCurrentInstance, reactive, ref, toRefs,onMounted } from 'vue'
import { regisRules,the_dept } from '../rules'
import { useUserStore } from '@/store/modules/user';
import api from "@/api/system/user"
import { to } from 'await-to-js';
import SlideVerify from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";
import { getInviteCode } from '@/api/login';
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const showCode = ref(false)
const images = reactive([])

const regisData = ref({
  phonenumber: '',
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: '',
  designerType: '',
  inviteCode: '',
  invitePeople: '',
} );

// 验证码集合
var InviteCodeList: string[]
onMounted(async ()=>{

  // 获取邀请码
  const res = await getInviteCode();
  InviteCodeList = res.data || []
  console.log(InviteCodeList);

})

// 检查验证码是不是在其中
function checkCode(inviteCode:string){
  for (let i = 0; i < InviteCodeList.length; i++) {
    if(inviteCode == InviteCodeList[i].inviteCode){
      regisData.value.invitePeople = InviteCodeList[i].invitePeople
      return true
    }
  }
  return false;
}


// 注册方法
const regisRef = ref<ElFormInstance>();
 async function handleRegister() {
     regisRef.value?.validate(async (valid: boolean, fields: any) => {
      if(!valid) return
      if (!checkCode(regisData.value.inviteCode)){
        ElMessage.error("请输入正确的邀请码!")
        return;
      }
      console.log("获取到注册的数据-----",regisData.value);
      regisData.value.username = regisData.value.phonenumber
      await api.RegisUser(regisData.value);
      ElMessage.success("注册成功!")
      const [err] = await to(userStore.smsLogin(regisData.value));
      if (!err) {
        // 进入注册中状态
        await router.push('/information');
        loading.value = false;
      }
  });
}


// 拼图验证成功回调
const onSuccess = () => {
  showCode.value = false;
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
