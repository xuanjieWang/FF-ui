<!--页面-->
<template>
  <div class="body">
    <div class="leftPage">
      <div>
        <h1 style="margin-left: 45%">个人信息</h1>
        <ul class="list-group list-group-striped">
          <li class="list-group-item">
            <svg-icon icon-class="user" /><span>账号名称</span>
            <div class="pull-right">{{ userData.nickName }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="user" /><span>账号:</span>
            <div class="pull-right">{{ userData.userName }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="phone" /><span>手机号码:</span>
            <div class="pull-right">{{ userData.phonenumber }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="people" /><span>真实姓名:</span>
            <div class="pull-right">{{ userData.name }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="qq" /><span>QQ:</span>
            <div class="pull-right">{{ userData.qq }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="email" /><span>QQ邮箱:</span>
            <div class="pull-right">{{ userData.qqMail }}</div>
          </li>

          <li class="list-group-item">
            <svg-icon icon-class="row" /><span>部门:</span>
            <div class="pull-right">{{ userData.designerType }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="job" /><span>在职工作:</span>
            <div class="pull-right">{{ userData.work }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="shopping" /><span>支付宝账户:</span>
            <div class="pull-right">{{ userData.zfb }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="money" /><span>账户余额：</span>
            <div class="pull-right">{{ userData.money }}</div>
          </li>
        </ul>
      </div>
      <div class="tx">
        <div class="txTime">距离提现还有--时间</div>
        <div class="txTime">可以进行提现</div>
        <!-- <el-button type="success">提现</el-button> -->
      </div>
    </div>
    <div class="rightPage">
      <div>echarts图</div>
    </div>
  </div>
</template>

<script setup>
import { getInfo } from '@/api/login';
import { onMounted } from 'vue';

// let time  = ""
const userData = ref({})
 onMounted(async ()=>{

  const res= await getInfo();
  userData.value = res.data.user;
  console.log(res.data.user);
 })
</script>
<style lang="scss" scoped>
.body{
  display: flex;
}
.leftPage{
  width: 30%;
  display: flex;
  flex-direction: column;
}

.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group {
  padding-left: 0px;
  list-style: none;
}

.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0px;
  font-size: 16px;
  margin-left: 10px;
}
.pull-right{
  margin-left: 5px;
}
span{
  margin-left: 10px;
}
.tx{
  width: 90%;
  height: 200px;
  border-radius: 10px;
  border: 1px solid #b1b5ba;
  margin: 10px 0px 0px 20px;
  text-align: center;
}
.txTime{
  font-size: 20px;
  padding: 20px;

}
</style>
