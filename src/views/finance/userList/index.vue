<!---设计师账户管理-->
<template>
  <div class="body p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="100px">
          <el-form-item label="设计师姓名" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入设计师姓名" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item label="设计师账号" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入设计师账号" clearable style="width: 180px; margin-bottom: 0" />
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
      <el-table-column label="姓名" align="center" prop="name" width="200px" />
      <el-table-column label="账号" align="center" prop="phonenumber" width="200px" />
      <el-table-column label="部门" align="center" prop="designerType" width="200px" />
      <el-table-column label="支付宝号" align="center" prop="zfb" width="200px" />
      <el-table-column label="余额" align="center" prop="money" width="200px" />
      <el-table-column label="注册时间" align="center" prop="createTime" />
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getData" />
  </div>
</template>

<script setup>
import { onMounted, toRefs, onUnmounted } from 'vue'
import { listsjs } from '@/api/system/user'
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
    pageSize: 10
  }
})

const { queryParams } = toRefs(data)
async function getData() {
  txLoading.value = true
  const txListRes = await listsjs(queryParams.value)
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
<style scoped>
@import './index.css';
</style>
