<!--页面-->
<template>
  <div class="body">
    <div class="leftPage">
      <div>
        <h1>设置提现时间</h1>
      </div>
      <div class="tx">
        <div class="item" style="margin-top: 30px">
          <span>提现类别:</span>
          <el-select v-model="type" placeholder="Select" style="width: 180px">
            <el-option v-for="item in timeType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="item">
          <span>开始时间:</span>
          <el-input-number v-model="txData.beginTime" :max="timeMax" :min="1" step-strictly />
        </div>
        <div class="item">
          <span>结束时间:</span>
          <el-input-number v-model="txData.endTime" :max="timeMax" :min="1" step-strictly />
        </div>
        <div class="info">
          <span class="ps">ps: 提现类别可设置为按月或按周</span>
          <el-button type="success" @click="updateTime" v-hasPermi="['system:money:setTime']">确定</el-button>
        </div>
      </div>
    </div>
    <div class="rightPage"></div>
  </div>
</template>

<script setup>
import { getTxTime, setTxTime } from '@/api/order'
import { onMounted, watch } from 'vue'
const { proxy } = getCurrentInstance()

const timeMax = ref(30) // 时间最大值
const timeType = [
  // 时间类型选项
  {
    value: 'day',
    label: '每周'
  },
  {
    value: 'month',
    label: '每月'
  }
]
const type = ref('') // 选中的时间类型
const txData = ref({}) // 提现时间数据
onMounted(async () => {
  const res = await getTxTime()
  txData.value = res.data
  type.value = txData.value.type
})

// 设置提交时间
async function updateTime() {
  txData.value.type = type.value
  await setTxTime(txData.value)
  setTimeout(() => {
    proxy?.$modal.msgSuccess('提现时间设置成功')
  }, 300)
}

// 监听type
watch(type, () => {
  if (type.value != txData.value.type) {
    if ('month' == type.value) {
      timeMax.value = 31
      txData.value.beginTime = 15
      txData.value.endTime = 15
    } else {
      timeMax.value = 7
      txData.value.beginTime = 1
      txData.value.endTime = 1
    }
  }
  if ('day' == type.value) {
    timeMax.value = 7
  } else {
    timeMax.value = 31
  }
})
</script>
<style lang="scss" scoped src="./index.css"></style>
