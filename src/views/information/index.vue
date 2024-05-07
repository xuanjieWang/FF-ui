<!--页面-->
<template>
  <div class="">实名认证页面</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const router = useRouter();


onMounted(async ()=>{
  console.log(11111111111111,userStore.regisStatus);
  userStore.logout()
})
      // 直接跳转到实名认证界面

      //注册成功跳转到信息完善页面
      //QQ号（请填写接单QQ号）、
      //QQ邮箱（请填写邮箱）、
      //支付宝账号（请填写打款的支付宝账号）、
      //姓名（真实姓名，与支付宝绑定的姓名一致，如果不一致，不结算）、
      //在职工作、擅长方向、身份证号（可以不填）、身份证照片（可以不上传）。
      //这里注意，在提现时若设计师没有上传身份证号和身份证照片，就提示它先上传了才能使用提现功能）。

      // 提交成功根据邀请码提交到对应的客服进行审核

      // 在前端显示正在审核的页面
</script>
<style lang="scss" scoped></style>
