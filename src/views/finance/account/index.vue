<!---结算记录-->
<template>
  <div class="body p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
          <el-form-item label="设计师姓名" prop="sjsName">
            <el-input v-model="queryParams.sjsName" placeholder="请输入设计师姓名" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item label="设计师账号" prop="sjsPhone">
            <el-input v-model="queryParams.sjsPhone" placeholder="请输入设计师账号" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item label="淘宝订单号" prop="tbOrderId">
            <el-input v-model="queryParams.tbOrderId" placeholder="请输入淘宝订单号" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
    <el-table v-loading="txLoading" :data="txList">
      <el-table-column label="序号" align="center" prop="title" width="80px">
        <template #default="scope">
          {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="sjsName" width="120px" />
      <el-table-column label="账户" align="center" prop="sjsPhone" width="120px" />
      <el-table-column label="淘宝订单号" align="center" prop="tbOrderId" />
      <el-table-column label="支付宝号" align="center" prop="zfb" width="160px" />
      <el-table-column label="提现金额(元)" align="center" prop="money" width="120px" />
      <el-table-column label="账户余额(元)" align="center" prop="balance" width="120px" />
      <el-table-column label="提现申请时间" align="center" prop="createTime" width="180px" />
      <el-table-column label="审核时间" align="center" prop="txTime" width="180px" />
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getData" />
  </div>
</template>

<script setup>
import { onMounted, toRefs, onUnmounted } from 'vue'
import { list } from '@/api/tx'
const { proxy } = getCurrentInstance()

const txList = ref([]) //提现列表
const total = ref(0)
const txLoading = ref(false)
const queryFormRef = ref()

let timer = ''
onMounted(() => {
  getData()
  timer = setInterval(() => {
    getData()
  }, 10000)
})
onUnmounted(() => {
  clearInterval(timer)
})

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    successFlag: 0
  }
})

const { queryParams } = toRefs(data)
async function getData() {
  txLoading.value = true
  const txListRes = await list(queryParams.value)
  txList.value = txListRes.rows
  total.value = txListRes.total
  txLoading.value = false
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getData()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}
</script>
<style lang="scss" scoped></style>
