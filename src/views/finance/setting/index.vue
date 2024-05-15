<!--页面-->
<template>
  <div class="body">
    <div class="leftPage">
      <div>
        <h1 style="margin-left: 35%">设置提现时间</h1>
      </div>
      <div class="tx">
        <!---时间选择，每个月或每周的-->
        <div class="txTime">距离提现还有--时间</div>
        <div class="txTime">可以进行提现</div>
        <!-- <el-button type="success">提现</el-button> -->
      </div>
    </div>
    <div class="rightPage"></div>
  </div>
</template>

<script setup>
import { getTxTime , setTxTime } from '@/api/order';
import { onMounted } from 'vue';

const txData = ref({})
 onMounted(async ()=>{
  const res= await getTxTime();
  txData.value=res.data;
  console.log(res.data);
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
