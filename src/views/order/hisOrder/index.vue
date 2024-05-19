<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <!-- <el-form-item label="提交状态" prop="orderStatus">
            <el-select v-model="queryParams.orderStatus" placeholder="选择订单提交状态" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in order_push_statu" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="结算状态" prop="jsStatus">
            <el-select v-model="queryParams.jsStatus" placeholder="选择订单结算状态" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in order_balance_statu" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item> -->
          <el-form-item label="订单评价" prop="commonType">
            <el-select v-model="queryParams.commonType" placeholder="选择订单评价" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in order_common_statu" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号" prop="id">
            <el-input v-model="queryParams.id" placeholder="请输入订单编号" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item label="设计师" prop="sjsName">
            <el-input v-model="queryParams.sjsName" placeholder="请输入设计师名称" clearable style="width: 180px; margin-bottom: 0" />
          </el-form-item>
          <el-form-item label="订单类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="选择订单评价" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in the_dept" :key="dict.value" :label="dict.label" :value="dict.value" />
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
        <el-table-column type="selection" width="15" align="center" />
        <el-table-column label="序号" align="center" prop="title" width="80px">
          <template #default="scope">
            {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="订单编号" align="center" prop="id" width="180px" /> -->
        <el-table-column label="标题" align="center" prop="title" width="180px" />
        <el-table-column label="客户旺旺号" align="center" prop="wangwang" width="180px"> </el-table-column>
        <el-table-column label="设计师姓名" align="center" prop="sjsName" width="100px"> </el-table-column>
        <el-table-column label="设计师账户" align="center" prop="sjsPhone" width="150px"> </el-table-column>
        <el-table-column label="提成金额" align="center" prop="money" width="90px" />
        <el-table-column label="订单类型" align="center" prop="type" width="90px" />
        <el-table-column label="订单状态" align="center" prop="orderStatus" width="100px">
          <template #default="scope">
            <span v-if="scope.row.orderStatus == '交易完成'" style="color: green">交易完成</span>
            <span v-else style="color: red">{{ scope.row.orderStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算状态" align="center" prop="jsStatus" width="100px" />
        <el-table-column label="评论" align="center" prop="commonType" width="100px" />
        <!-- <el-table-column label="下单时间" align="center" prop="xdTime" width="110px" /> -->
        <el-table-column label="订单完成时间" align="center" prop="updateTime" width="110px" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120px">
          <template #default="scope">
            <el-tooltip content="查看" placement="top">
              <el-button link type="primary" icon="View" @click="handleView(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="评价" placement="top" v-if="scope.row.commonType === '未评'">
              <el-button link type="info" icon="ChatRound" @click="handleCommon(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加或修改【请填写功能名称】对话框 -->
      <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px" append-to-body>
        <el-form ref="detailDatas" :model="detailData" label-width="150px">
          <p class="item">订单信息</p>
          <el-row :gutter="20">
            <el-form-item label="订单编号:" prop="id">
              <el-input v-model="detailData.id" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="订单标题:" prop="title">
              <el-input v-model="detailData.title" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="提成金额" prop="money">
              <el-input v-model="detailData.money" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="订单类型" prop="type">
              <el-select v-model="detailData.type" placeholder="" disabled clearable style="width: 250px; margin-bottom: 0">
                <el-option v-for="dict in the_dept" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="客户旺旺号" prop="wangwang">
              <el-input v-model="detailData.wangwang" disabled placeholder="" />
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
          <p class="item">评论</p>
          <el-row :gutter="20">
            <el-form-item label="评论类型:" prop="commonType">
              <el-input v-model="detailData.commonType" disabled placeholder="" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="评论:" prop="common" type="textarea">
              <el-input style="width: 500px" :autosize="{ minRows: 4, maxRows: 6 }" type="textarea" v-model="detailData.common" disabled />
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <el-dialog title="订单评论" v-model="visible" width="600px" append-to-body>
      <el-form ref="orderFormRef" :model="common" :rules="commRules" label-width="60px">
        <el-row :gutter="20" style="margin-left: 20px">
          <el-form-item label="类型:" prop="commonType">
            <el-select v-model="common.commonType" placeholder="选择订单评价" clearable style="width: 180px; margin-bottom: 0">
              <el-option v-for="dict in commonType" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row :gutter="20" style="margin-left: 20px">
          <el-form-item label="评论:" prop="common" type="textarea">
            <el-input style="width: 500px" :autosize="{ minRows: 4, maxRows: 6 }" type="textarea" v-model="common.common" />
          </el-form-item>
        </el-row>
      </el-form>

      <el-button style="margin-left: 450px" type="primary" @click="subCom">提交评论</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { listHis, subComm } from '@/api/order'
const { proxy } = getCurrentInstance()
const { the_dept, order_common_statu } = toRefs(proxy?.useDict('the_dept', 'order_common_statu'))
import { commonType, commRules } from '../rules.js'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const visible = ref(false)
const orderList = ref([])
const loading = ref(true)
const total = ref(0)

const initFormData = {}
const data = reactive({
  detailData: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  common: {
    commonType: '',
    common: '',
    id: ''
  }
})

const { queryParams, detailData, common } = toRefs(data)

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

  // 设计师查询自己的历史订单，需要
  queryParams.value.deptName = userStore.deptName
  queryParams.value.sjsPhone = userStore.name
  const res = await listHis(queryParams.value)
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
  detailData.value = { ...row }
  add.value = false
  dialog.visible = true
  dialog.title = '订单详情'
}

// 提交评论
const handleCommon = async (row) => {
  common.value = {}
  visible.value = true
  common.value.id = row.id
}
const orderFormRef = ref()

async function subCom() {
  orderFormRef.value?.validate(async (valid) => {
    if (valid) {
      await subComm(common.value).then(() => {
        setTimeout(() => {
          proxy?.$modal.msgSuccess('订单评论成功!')
        }, 1000)
        visible.value = false
        getList()
      })
    }
  })
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
