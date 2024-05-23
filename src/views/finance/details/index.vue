<template>
  <div class="p-2">
    <el-card shadow="never">
      <el-table v-loading="loading" :data="orderList">
        <el-table-column label="序号" align="center" prop="title" width="80px">
          <template #default="scope">
            {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="订单编号" align="center" prop="orderId" width="180px" />
        <el-table-column label="标题" align="center" prop="orderTitle" width="180px" />
        <el-table-column label="客户旺旺号" align="center" prop="wangwang" width="180px"> </el-table-column>
        <el-table-column v-if="userStore.deptName != '设计师部门'" label="设计师姓名" align="center" prop="sjsName" width="100px"> </el-table-column>
        <el-table-column v-if="userStore.deptName != '设计师部门'" label="设计师账户" align="center" prop="sjsPhone" width="150px"> </el-table-column>
        <el-table-column label="淘宝订单号" align="center" prop="orderType" width="200px" />
        <el-table-column label="订单金额" align="center" prop="money" width="90px" />
        <el-table-column label="余额" align="center" prop="balance" width="90px" />
        <el-table-column label="结算状态" align="center" prop="jsStatus" width="100px" />
        <el-table-column label="结算时间" align="center" prop="createTime" width="170px" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="订单详情" placement="top">
              <el-button link type="primary" icon="View" @click="handleView(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加或修改【请填写功能名称】对话框 -->
      <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px" append-to-body>
        <el-form ref="detailDatas" :model="detailData" label-width="150px">
          <p class="item">订单信息</p>
          <el-row :gutter="20">
            <!-- <el-form-item label="订单编号:" prop="id">
              <el-input v-model="detailData.id" disabled placeholder="" />
            </el-form-item> -->
            <el-form-item label="订单标题:" prop="title">
              <el-input v-model="detailData.title" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="淘宝订单号:" prop="type">
              <el-input v-model="detailData.type" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="提成金额:" prop="money">
              <el-input v-model="detailData.money" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="客户旺旺号:" prop="wangwang">
              <el-input v-model="detailData.wangwang" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="对标客服:" prop="kf">
              <el-input v-model="detailData.kf" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <p class="item">设计师信息</p>
          <el-row :gutter="20">
            <el-form-item label="设计师姓名:" prop="sjsName">
              <el-input v-model="detailData.sjsName" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="设计师账户:" prop="sjsPhone">
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
          <!-- <p class="item">评论</p>
          <el-row :gutter="20">
            <el-form-item label="评论类型:" prop="commonType">
              <el-input v-model="detailData.commonType" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="评论:" prop="common" type="textarea">
              <el-input style="width: 500px" :autosize="{ minRows: 4, maxRows: 6 }" type="textarea" v-model="detailData.common" disabled />
            </el-form-item>
          </el-row> -->
        </el-form>
      </el-dialog>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { listAccount } from '@/api/account'
import { getOrder } from '@/api/order'
const { proxy } = getCurrentInstance()
const { the_dept, order_common_statu } = toRefs(proxy?.useDict('the_dept', 'order_common_statu'))
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const orderList = ref([])
const loading = ref(true)
const total = ref(0)

const initFormData = {}
const data = reactive({
  detailData: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
})

const { queryParams, detailData } = toRefs(data)

onMounted(() => {
  getList()
})
const queryFormRef = ref()

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 查询【请填写功能名称】列表 */
const getList = async () => {
  loading.value = true
  queryParams.value.deptName = userStore.deptName
  queryParams.value.sjsPhone = userStore.name
  const res = await listAccount(queryParams.value)
  console.log(res.rows)
  orderList.value = res.rows
  total.value = res.total
  loading.value = false
}
const add = ref(false)
const dialog = reactive({
  visible: false,
  title: ''
})
/** 查看按钮 */
const handleView = async (row) => {
  const res = await getOrder(row.orderId)
  console.log(res.data)
  detailData.value = { ...res.data }
  add.value = false
  dialog.visible = true
  dialog.title = '交易详情'
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
