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
    <el-form-item prop="password1">
      <el-input v-model="password1" type="password" size="large" auto-complete="off" placeholder="确认密码">
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
      <div class="sms-code">
        <div v-if="!sendSmsButton" id="captcha-button">获取短信验证码</div>
        <span style="color: #1c1c1c" v-else>重发（{{ smsTime }}s）</span>
      </div>
    </el-form-item>
    <div id="captcha-element"></div>
    <el-form-item style="width: 100%">
      <el-button :loading="loading" size="large" type="success" style="width: 100%" @click.prevent="handleRegister"> 注册 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { getCurrentInstance, reactive, ref, toRefs, onMounted, onUnmounted } from 'vue'
import { regisRules } from '../rules'
import { useUserStore } from '@/store/modules/user'
import api from '@/api/system/user'
import { to } from 'await-to-js'
import 'vue3-slide-verify/dist/style.css'
import { getInviteCode, getSmsCode } from '@/api/login'
import { getResult } from '@/api/sms'
import { the_dept } from '../rules'
const { proxy } = getCurrentInstance()

// const { the_dept } = toRefs(proxy?.useDict('the_dept'))

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)

// 验证码集合
var InviteCodeList = []

const regisData = ref({
  phonenumber: '',
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: '',
  designerType: '',
  inviteCode: '',
  invitePeople: ''
})

const password1 = ref('')

const captcha = ref(null)
var captchaButton = reactive({})

onMounted(async () => {
  const res = await getInviteCode()
  InviteCodeList = res.data || []
  captchaButton = document.getElementById('captcha-button')
  window.initAliyunCaptcha({
    SceneId: '20sopjw2', // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
    prefix: '10ebzz', // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
    mode: 'popup', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
    element: '#captcha-element', // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
    button: '#captcha-button', // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
    captchaVerifyCallback: captchaVerifyCallback, // 业务请求(带验证码校验)回调函数，无需修改
    onBizResultCallback: onBizResultCallback, // 业务请求结果回调函数，无需修改
    getInstance: getInstance, // 绑定验证码实例函数，无需修改
    slideStyle: {
      width: 360,
      height: 40
    }, // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
    language: 'cn' // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
  })
})

function getInstance(instance) {
  captcha.value = instance
}
async function captchaVerifyCallback(captchaVerifyParam) {
  // 确认滑块是否成功
  const result = await getResult(captchaVerifyParam)
  if (result.data) {
    return {
      captchaResult: true // 验证码验证是否通过，boolean类型，必选
    }
  } else {
    return {
      captchaResult: false // 验证码验证是否通过，boolean类型，必选
    }
  }
}

// 验证码开关
const sendSmsButton = ref(false)
const smsTime = ref(60)
const smsTimer = ref(null)

async function onBizResultCallback() {
  regisRef.value?.validate(async (valid) => {
    if (!valid) return
    if (password1.value != regisData.value.password) {
      ElMessage.error('请确认输入密码一致!')
      return
    }
    if (!checkCode(regisData.value.inviteCode)) {
      ElMessage.error('请输入正确的邀请码!')
      return
    }
    sendSmsButton.value = true
    smsTimer.value = setInterval(() => {
      if (smsTime.value > 0 && smsTime.value <= 60) {
        smsTime.value--
      } else {
        sendSmsButton.value = false
        clearInterval(smsTimer.value)
      }
    }, 1000)
    await getSmsCode(regisData.value.phonenumber)
  })
}

onUnmounted(() => {
  captchaButton = {}
  // 必须删除相关元素，否则再次mount多次调用 initAliyunCaptcha 会导致多次回调 captchaVerifyCallback
  document.getElementById('aliyunCaptcha-mask')?.remove()
  document.getElementById('aliyunCaptcha-window-popup')?.remove()
})

// 检查邀请码是不是在其中
function checkCode(inviteCode) {
  for (let i = 0; i < InviteCodeList.length; i++) {
    if (inviteCode == InviteCodeList[i].inviteCode) {
      regisData.value.invitePeople = InviteCodeList[i].invitePeople
      return true
    }
  }
  return false
}

// 注册方法
const regisRef = ref()
async function handleRegister() {
  regisRef.value?.validate(async (valid) => {
    if (!valid) return
    if (password1.value != regisData.value.password) {
      ElMessage.error('请确认您的密码!')
      return
    }
    if (!checkCode(regisData.value.inviteCode)) {
      ElMessage.error('请输入正确的邀请码!')
      return
    }
    if (!regisData.value.code) {
      ElMessage.error('请输入短信验证码!')
      return
    }

    regisData.value.username = regisData.value.phonenumber
    await api.RegisUser(regisData.value).then(async () => {
      ElMessage.success('注册成功!')
      const [err] = await to(userStore.smsLogin(regisData.value))
      if (!err) {
        // 进入注册中状态
        await router.push('/information')
        loading.value = false
      }
    })
  })
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

.sms-code {
  width: 33%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-left: 13px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  user-select: none;
}
.sms-code:hover {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.06);
}

#captcha-button {
  z-index: 99;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  background-color: hsla(160, 100%, 37%, 1);
  color: #fff;
  padding: 8px 0;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}
</style>
