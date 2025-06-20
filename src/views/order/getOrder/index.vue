<!---订单列表-->
<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="订单编号" prop="type">
            <el-input v-model="queryParams.type" placeholder="请输入订单编号" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="orderList">
        <el-table-column label="序号" align="center" prop="title" width="80px">
          <template #default="scope">
            {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" align="center" prop="shop" width="200px" />
        <el-table-column label="订单标题" align="center" prop="title" />
        <el-table-column label="淘宝订单号" align="center" prop="type" width="200px" />
        <el-table-column label="提成金额" align="center" prop="money" width="100px" />
        <el-table-column label="订单状态" align="center" prop="orderStatus" width="100px" />
        <el-table-column label="对标客服" align="center" prop="kf" />
        <el-table-column label="下单时间" align="center" prop="xdTime" width="180px" />
        <el-table-column label="交付时间" align="center" prop="jfTime" width="180px" />
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px" append-to-body>
      <el-form ref="orderFormRef" :model="form" :rules="rules" label-width="150px">
        <!-- <p class="item">订单信息</p> -->
        <el-row :gutter="20">
          <el-form-item label="店铺:" prop="shop">
            <el-input v-model="form.shop" disabled placeholder="" />
          </el-form-item>
          <el-form-item label="订单标题:" prop="title">
            <el-input v-model="form.title" disabled placeholder="" />
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="提成金额" prop="money">
            <el-input v-model="form.money" disabled placeholder="" />
          </el-form-item>
          <el-form-item label="订单号" prop="type">
            <el-input v-model="form.type" disabled placeholder="" />
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="客户旺旺号" prop="wangwang">
            <el-input v-model="form.wangwang" disabled placeholder="" />
          </el-form-item>
          <el-form-item label="对标客服" prop="kf">
            <el-input v-model="form.kf" disabled placeholder="" />
          </el-form-item>
        </el-row>
        <!-- <p class="item">时间</p> -->
        <el-row :gutter="20">
          <el-form-item label="下单时间:" prop="xdTime">
            <el-date-picker style="width: 250px" clearable v-model="form.xdTime" disabled type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交付时间:" prop="jfTime">
            <el-date-picker style="width: 250px" clearable v-model="form.jfTime" disabled type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="订单创建时间:" prop="createTime">
            <el-date-picker style="width: 250px" clearable v-model="form.createTime" disabled type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="">
            </el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { listOrder } from '@/api/order'
const { proxy } = getCurrentInstance()
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const orderList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)

const queryFormRef = ref()
const orderFormRef = ref()

const dialog = reactive({
  visible: false,
  title: ''
})

const initFormData = {}
const data = reactive({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sjsPhone: '',
    deptName: ''
  }
})

const { queryParams, form } = toRefs(data)
onMounted(() => {
  getList()
})

const getList = async () => {
  loading.value = true
  queryParams.value.deptName = userStore.deptName
  queryParams.value.sjsPhone = userStore.name
  const res = await listOrder(queryParams.value)
  orderList.value = res.rows
  total.value = res.total
  loading.value = false
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData }
  orderFormRef.value?.resetFields()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 查看订单详细数据 */
const handleView = async (row) => {
  reset()
  Object.assign(form.value, row)
  dialog.visible = true
  dialog.title = '订单详情'
}
</script>
<style scoped>
.el-input {
  width: 250px;
}
.item {
  margin: 0px 20px 15px 20px;
  font-size: 16px;
  color: black;
  font-weight: 600;
}
:deep(.el-picker-width100pr .el-input__wrapper) {
  width: 100% !important;
}
</style>
