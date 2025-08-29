<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="88px">
          <el-form-item label="设计师姓名" prop="sjsName">
            <el-input v-model="queryParams.sjsName" placeholder="请输入设计师名称" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item label="淘宝订单号" prop="type">
            <el-input v-model="queryParams.type" placeholder="请输入淘宝订单号" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item label="订单标题" prop="title">
            <el-select v-model="queryParams.title" placeholder="选择订单标题" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in the_order_title" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
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
        <el-table-column label="序号" align="center" prop="title" width="60px">
          <template #default="scope"> {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }} </template>
        </el-table-column>
        <el-table-column label="店铺名称" align="center" prop="shop" width="100px" />
        <el-table-column label="订单标题" align="center" prop="title" width="180px" />
        <el-table-column label="设计师姓名" align="center" prop="sjsName" width="100px"> </el-table-column>
        <el-table-column label="淘宝订单号" align="center" prop="type" width="150px" />
        <el-table-column label="提成金额" align="center" prop="money" width="90px" />
        <el-table-column label="设计师账户" align="center" prop="sjsPhone" width="150px"> </el-table-column>
        <el-table-column label="对标客服" align="center" prop="kf" width="100px" />
        <el-table-column label="客户旺旺号" align="center" prop="wangwang" width="180px"> </el-table-column>
        <!-- <el-table-column label="订单状态" align="center" prop="orderStatus" width="100px">
          <template #default="scope">
            <span v-if="scope.row.orderStatus == '交易完成'" style="color: green">交易完成</span>
            <span v-else style="color: red">{{ scope.row.orderStatus }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="核验状态" align="center" prop="jsStatus">
          <template #default="scope">
            <span v-if="scope.row.jsStatus == '已结算'" style="color: green">核验完成</span>
            <span v-if="scope.row.jsStatus == '订单取消'" style="color: red">订单取消</span>
            <span v-if="scope.row.jsStatus == '订单失败'" style="color: red">订单失败</span>
            <span v-if="scope.row.jsStatus == '订单核验中'" style="color: blue">售后中</span>
          </template>
        </el-table-column>
        <el-table-column label="提现状态" align="center" prop="txStatus" width="100px">
          <template #default="scope">
            <span v-if="scope.row.txStatus == '提现成功'" style="color: green">提现成功</span>
            <span v-if="scope.row.txStatus == '提现失败'" style="color: red">提现失败</span>
          </template>
        </el-table-column>
        <el-table-column label="订单完成时间" align="center" prop="updateTime" width="105px" />
        <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="查看" placement="top">
              <el-button link type="primary" icon="View" @click="handleView(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" v-if="userStore.deptName != '设计师部门'">
              <el-button link type="danger" icon="Delete" @click="handleDel(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加或修改【请填写功能名称】对话框 -->
      <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px" append-to-body>
        <el-form ref="detailDatas" :model="detailData" label-width="150px">
          <p class="item">订单信息</p>
          <el-row :gutter="20">
            <el-form-item label="店铺名称:" prop="shop">
              <el-input v-model="detailData.shop" placeholder="" disabled clearable style="width: 250px; margin-bottom: 0"> </el-input>
            </el-form-item>
            <el-form-item label="订单标题:" prop="title">
              <el-input v-model="detailData.title" placeholder="" disabled clearable style="width: 300px; margin-bottom: 0"> </el-input>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="淘宝订单号" prop="type">
              <el-input v-model="detailData.type" disabled placeholder="" />
            </el-form-item>

            <el-form-item label="客户旺旺号" prop="wangwang">
              <el-input v-model="detailData.wangwang" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="提成金额" prop="money">
              <el-input v-model="detailData.money" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="对标客服" prop="kf">
              <el-input v-model="detailData.kf" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <p class="item">设计师信息</p>
          <el-row :gutter="20">
            <el-form-item label="设计师姓名" prop="sjsName">
              <el-input v-model="detailData.sjsName" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="设计师账户" prop="sjsPhone">
              <el-input v-model="detailData.sjsPhone" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <p class="item">时间</p>
          <el-row :gutter="20">
            <el-form-item label="下单时间:" prop="xdTime">
              <el-date-picker
                style="width: 250px"
                clearable
                v-model="detailData.xdTime"
                disabled
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="交付时间:" prop="jfTime">
              <el-date-picker
                style="width: 250px"
                clearable
                v-model="detailData.jfTime"
                disabled
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="订单创建时间:" prop="createTime">
              <el-date-picker
                style="width: 250px"
                clearable
                v-model="detailData.createTime"
                disabled
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订单完成时间:" prop="updateTime">
              <el-date-picker
                style="width: 250px"
                clearable
                v-model="detailData.updateTime"
                disabled
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { listHis, delOrder } from '@/api/order'
const { proxy } = getCurrentInstance()
const { the_order_title } = toRefs(proxy?.useDict('the_order_title'))
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const orderList = ref([]) // 订单列表数据
const loading = ref(true) // 加载状态
const total = ref(0) // 总数据量

const initFormData = {}
const data = reactive({
  detailData: { ...initFormData }, // 详情数据
  queryParams: {
    // 查询参数
    pageNum: 1,
    pageSize: 10
  }
})

const { queryParams, detailData } = toRefs(data)

onMounted(() => {
  getList()
})
const queryFormRef = ref() // 查询表单引用

const getList = async () => {
  loading.value = true

  // 设计师查询自己的历史订单，需要查询自己的部门
  console.log(userStore.deptName)

  if (userStore.deptName === '软件开发' || userStore.deptName === '设计师部门' || userStore.deptName === '客服部门') {
    queryParams.value.deptName = userStore.deptName
    queryParams.value.sjsPhone = userStore.name
  }

  if (userStore.deptName === ('设计师部门' || '客服部门' || '软件开发')) {
    console.log(111)

    queryParams.value.deptName = userStore.deptName
    queryParams.value.sjsPhone = userStore.name
  }
  console.log(queryParams.value)

  const res = await listHis(queryParams.value)

  orderList.value = res.rows
  total.value = res.total
  loading.value = false
}
const add = ref(false) // 是否为新增模式
const dialog = reactive({
  // 弹窗配置
  title: '',
  visible: false
})
const handleView = async (row) => {
  detailData.value = { ...row }
  add.value = false
  dialog.visible = true
  dialog.title = '订单详情'
}
// 删除方法
async function handleDel(row) {
  await proxy?.$modal.confirm('是否确认删除设计师: ' + row.sjsName + ' ,金额： ' + row.money + ' 的订单?')
  loading.value = true
  await delOrder(row.id).finally(() => (loading.value = false))
  await getList()
  proxy?.$modal.msgSuccess('删除成功')
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}
</script>

<style scoped>
@import './index.css';

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
