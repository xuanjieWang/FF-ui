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
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getData">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-table :data="txList">
      <el-table-column label="序号" align="center" prop="title" width="80px">
        <template #default="scope">
          {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="sjsName" />
      <el-table-column label="账户/手机号" align="center" prop="sjsPhone" width="120px" />
      <el-table-column label="支付宝" align="center" prop="zfb" width="180px" />
      <el-table-column label="提现金额(元)" align="center" prop="money" width="120px" />
      <el-table-column label="余额(元)" align="center" prop="balance" width="120px" />
      <el-table-column label="提现申请时间" align="center" prop="createTime" width="180px" />
      <el-table-column label="审核时间" align="center" prop="txTime" width="180px" />
      <el-table-column label="审核状态" align="center" prop="successFlag" width="120px">
        <template #default="scope">
          <div v-if="scope.row.successFlag">
            <el-switch
              v-model="scope.row.successFlag"
              disabled
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; height: 40px"
              active-value="0"
              inactive-value="1" />
          </div>
          <div v-else>
            <p style="color: #ff4949">待审核</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <div v-if="!scope.row.successFlag">
            <el-button link type="primary" icon="Edit" v-hasPermi="['tx:data:adopt', 'system:order:getTxOrder']" @click="handleView(scope.row)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getData" />
    <el-dialog title="提现审核" v-model="buttonDis" width="700px" append-to-body>
      <div class="item">
        <span>姓名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ viewData.sjsName }}</span>
        <span>账户: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ viewData.sjsPhone }}</span>
        <span>支付宝：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ viewData.zfb }} </span>
        <span>打款金额：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ viewData.money }} 元</span>
      </div>
      <div class="txOrder">
        <span style="color: red" v-if="disOrder.length > 0">共有 {{ disOrder.length }}&nbsp;个扣款的订单</span>
        <div class="order" v-for="(item, index) in disOrder" :key="index">
          <span style="color: red">扣款订单：{{ index + 1 }}</span>
          <span>扣款金额: {{ item.money }}</span>
          <span>扣款原因: {{ item.message }}</span>
          <span>扣款时间: {{ item.createTime }}</span>
        </div>
      </div>
      <div class="txOrder">
        <span style="color: green" v-if="txOrder.length > 0">共有 {{ txOrder.length }}&nbsp;个交易完成的订单</span>
        <div class="order" v-for="(item, index) in txOrder" :key="index">
          <span style="color: green">交易订单{{ index + 1 }}</span>
          <span>订单标题: {{ item.title }}</span>
          <span>金额: {{ item.money }}</span>
          <span>淘宝订单号: {{ item.type }}</span>
          <span>客户旺旺号: {{ item.wangwang }}</span>
          <span>下单时间: {{ item.createTime }}</span>
        </div>
      </div>
      <div class="mt-5 ml-100">ps(提现不通过，订单设置为失败状态)</div>
      <div>
        <el-button style="margin-left: 250px; margin-top: 20px" type="danger" @click="adoptTx('1')">不通过</el-button>
        <el-button style="margin-left: 350px; margin-top: -50px" type="success" @click="adoptTx('0')">通&nbsp;&nbsp;&nbsp;过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, toRefs, onUnmounted } from 'vue'
import { listTx, adopt, getDisOrder } from '@/api/tx'
import { getTxOrder } from '@/api/order'

const { proxy } = getCurrentInstance()

const txList = ref([]) //提现列表
const total = ref(0)
const txOrder = ref([])

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

const buttonDis = ref(false)
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
})
const { queryParams } = toRefs(data)
async function getData() {
  const txListRes = await listTx(queryParams.value)

  txList.value = txListRes.rows
  total.value = txListRes.total
}

function adoptTx(success) {
  viewData.value.successFlag = success
  buttonDis.value = false
  adopt(viewData.value).then(() => {
    setTimeout(() => {
      getData()
    }, 300)
  })
}

const viewData = ref({})
const disOrder = ref({})
async function handleView(data) {
  var params = {
    sjsPhone: data.sjsPhone,
    createTime: data.createTime
  }
  // 获取提现订单
  const res = await getTxOrder(params)

  // 获取扣款订单
  const disOrderRes = await getDisOrder(params)
  disOrder.value = disOrderRes.data || []

  txOrder.value = res.data || []
  buttonDis.value = true
  viewData.value = data
}
const queryFormRef = ref()

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  getData()
}
</script>
<style lang="scss" scoped>
.info {
  font-size: 16px;
  margin-left: 15px;
}
.item {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  font-size: 15px;
  font-weight: 600;
}
.order {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.txOrder {
  margin-top: 10px;
  min-height: 30px;
  max-height: 250px;
  overflow-y: auto;
  margin-left: 20px;
}
</style>
