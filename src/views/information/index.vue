<!--页面-->
<template>
  <div class="body">
    <el-button type="info" class="logout" @click.prevent="logout">返回登录界面</el-button>
    <h1>请完善您的个人信息</h1>
    <div class="info">
      <el-form ref="regisRef" :model="info" :rules="rules">
        <el-form-item prop="name">
          <el-input v-model="info.name" type="text" auto-complete="off" placeholder="">
            <template #prefix> <p>姓名:</p> </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="zfb">
          <el-input v-model="info.zfb" type="text" auto-complete="off" placeholder="请确保支付宝账号和姓名相同">
            <template #prefix> <p>支付宝账号:</p> </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="qq">
          <el-input v-model="info.qq" type="text" auto-complete="off" placeholder="">
            <template #prefix> <p>QQ号码:</p> </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="qqMail">
          <el-input v-model="info.qqMail" type="text" auto-complete="off" placeholder="">
            <template #prefix> <p>QQ邮箱:</p> </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="work">
          <el-input v-model="info.work" type="text" auto-complete="off" placeholder="您目前从事的工作">
            <template #prefix> <p>在职工作:</p> </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="proficient">
          <el-input v-model="info.proficient" type="text" auto-complete="off" placeholder="您的擅长方向">
            <template #prefix> <p>擅长方向:</p> </template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="sfz">
          <el-input v-model="info.sfz" type="text" auto-complete="off" placeholder="请输入身份证号">
            <template #prefix> <p>身份证号: </p> </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="sfzimg">
          <el-input v-model="info.sfzimg" type="text" auto-complete="off">
            <template #prefix> <p>身份证照片: </p> </template>
          </el-input>
        </el-form-item> -->
        <el-button type="primary" @click.prevent="submit" :disabled="isDisabled"> 提交 </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { rules } from './rules'
import { addRealInfo } from '@/api/audit'

const userStore = useUserStore() // 用户状态管理
const router = useRouter() // 路由实例

const info = ref({
  // 用户信息表单数据
  userId: null,
  qq: null,
  qqMail: null,
  zfb: null,
  name: null,
  work: null,
  proficient: null,
  sfz: null,
  sfzImg: null
})

onUnmounted(() => {
  userStore.logout()
})

// 返回到登录页面
async function logout() {
  userStore.logout()
  setTimeout(async () => {
    await router.push('/login')
  }, 200)
}

// 提交表达信息，讲信息提交到用户信息中
const isDisabled = ref(false) // 提交按钮禁用状态
async function submit() {
  isDisabled.value = true
  info.value.userId = userStore.userId
  ElMessage.success('信息提交成功,请等待审核！')
  setTimeout(() => {
    router.push('/auditing')
  }, 500)
  await addRealInfo(info.value)
}
</script>
<style src="./index.css" scoped></style>
