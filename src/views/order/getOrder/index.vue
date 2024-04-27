<!--页面-->
<template>
  <div class="">订单页面</div>
</template>

<script setup>
import { ref, reactive, toRefs, watch, onMounted } from 'vue';
// import { OrderVO, OrderQuery, OrderForm } from '../../../api/system/order/types';
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from '../../../api/system/order/index';
onMounted(async ()=>{
  // 获取订单信息，并赋值
  const res = await listOrder();
  console.log(res);
})
</script>
<style lang="scss" scoped></style>
