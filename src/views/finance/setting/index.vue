<!--页面-->
<template>
  <div class="body">
    <div class="leftPage">
      <div>
        <h1 style="margin-left: 32%">设置提现时间</h1>
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
          <el-button type="success" @click="updateTime">确定</el-button>
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

const timeMax = ref(30)
const timeType = [
  {
    value: 'day',
    label: '每周'
  },
  {
    value: 'month',
    label: '每月'
  }
]
const type = ref('')
const txData = ref({})
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
<style lang="scss" scoped>
.body {
  display: flex;
}
.leftPage {
  width: 35%;
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
.pull-right {
  margin-left: 5px;
}
span {
  margin-left: 10px;
}
.tx {
  width: 90%;
  height: 300px;
  border-radius: 10px;
  border: 1px solid #b1b5ba;
  margin: 10px 0px 0px 20px;
  text-align: center;
}
.item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  color: #000;
  font-size: 18px;
  margin-top: 5px;
}
.ps {
  color: #b1b5ba;
  font-size: 14px;
}

.info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  color: #000;
  font-size: 18px;
  margin-top: 5px;
  margin-top: 40px;
}
</style>
