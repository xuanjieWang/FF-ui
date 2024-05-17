<template>
  <el-form ref="userRef" :model="userForm" :rules="rules" label-width="100px">
    <el-form-item label="账号" prop="userName">
      <el-input v-model="userForm.userName" disabled maxlength="11" />
    </el-form-item>
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="userForm.nickName" disabled maxlength="30" />
    </el-form-item>
    <el-form-item label="支付宝账号" prop="zfb">
      <el-input v-model="userForm.zfb" disabled maxlength="30" />
    </el-form-item>
    <el-form-item label="设计师类别" prop="designerType">
      <el-input v-model="userForm.designerType" disabled maxlength="30" />
    </el-form-item>
    <el-form-item label="在职工作" prop="work"> <el-input v-model="userForm.work" disabled maxlength="30" /></el-form-item>
    <el-form-item label="特长" prop="proficient">
      <el-input v-model="userForm.proficient" disabled maxlength="30" />
    </el-form-item>
    <!-- <el-form-item label="微信" prop="wx">
      <el-input v-model="userForm.wx" maxlength="30" />
    </el-form-item> -->
    <el-form-item label="QQ" prop="qq">
      <el-input v-model="userForm.qq" disabled maxlength="50" />
    </el-form-item>
    <el-form-item label="QQ邮箱" prop="qqMail">
      <el-input v-model="userForm.qqMail" disabled maxlength="50" />
    </el-form-item>
    <el-form-item label="账户余额" prop="money">
      <el-input v-model="userForm.money" disabled maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="userForm.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { updateUserProfile } from '@/api/system/user'

const props = defineProps({
  user: {
    type: Object as PropType<any>,
    required: true
  }
})
const userForm = computed(() => props.user)
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const userRef = ref<ElFormInstance>()
const rules = ref<ElFormRules>({
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  // email: [{ required: true, message: "邮箱地址不能为空", trigger: "blur" }, {
  //   type: "email",
  //   message: "请输入正确的邮箱地址",
  //   trigger: ["blur", "change"]
  // }],
  phonenumber: [
    {
      required: true,
      message: '手机号码不能为空',
      trigger: 'blur'
    },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

/** 提交按钮 */
const submit = () => {
  userRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await updateUserProfile(props.user)
      proxy?.$modal.msgSuccess('修改成功')
    }
  })
}
/** 关闭按钮 */
const close = () => {
  proxy?.$tab.closePage()
}
</script>
