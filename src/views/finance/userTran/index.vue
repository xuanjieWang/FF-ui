<template>
  <div class="body p-2">
    <el-table v-loading="txLoading" :data="txList">
      <el-table-column label="序号" align="center" prop="title" width="80px">
        <template #default="scope">
          {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="sjsName" width="120px" />
      <el-table-column label="账户" align="center" prop="sjsPhone" width="120px" />
      <el-table-column label="支付宝号" align="center" prop="zfb" width="140px" />
      <el-table-column label="提现金额(元)" align="center" prop="money" width="120px" />
      <el-table-column label="账户余额(元)" align="center" prop="balance" width="120px" />
      <el-table-column label="提现申请时间" align="center" prop="createTime" width="180px" />
      <el-table-column label="审核状态" align="center" prop="successFlag" width="120px">
        <template #default="scope">
          <div v-if="scope.row.successFlag">
            <el-switch
              v-model="scope.row.successFlag"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; height: 40px"
              active-value="0"
              inactive-value="1" />
          </div>
          <div v-else>
            <p style="color: #ff4949">待审核</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="txTime" width="180px" />
      <el-table-column label="审核" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <div v-if="!scope.row.successFlag">
            <el-button link type="primary" icon="Edit" v-hasPermi="['tx:data:adopt', 'system:order:getTxOrder']" @click="handleView(scope.row)"></el-button>
          </div>
          <div v-else>{{ scope.row.successFlag == '0' ? '通过' : '不通过' }}</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getData" />
    <el-dialog title="提现审核" v-model="buttonDis" width="500px" append-to-body>
      <span class="info">请确认打款信息!</span>
      <div class="item">
        <span>姓名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ viewData.sjsName }}</span>
        <span>支付宝：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ viewData.zfb }} </span>
        <span>打款总金额：&nbsp;&nbsp; {{ viewData.money }}</span>
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
      <el-button style="margin-left: 350px" type="primary" @click="adoptTx('0')">通&nbsp;&nbsp;过</el-button>
      <el-button style="margin-left: 250px; margin-top: -56px" type="danger" @click="adoptTx('1')">不通过</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, toRefs, onUnmounted } from 'vue'
import { list, adopt, getDisOrder } from '@/api/tx'
import { getTxOrder } from '@/api/order'

const { proxy } = getCurrentInstance()

const txList = ref([]) //提现列表
const total = ref(0)
const txLoading = ref(false)
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
  txLoading.value = true
  const txListRes = await list(queryParams.value)
  txList.value = txListRes.rows
  total.value = txListRes.total
  txLoading.value = false
}

function adoptTx(success) {
  viewData.value.successFlag = success
  viewData.value.createTime = null
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
  const res = await getTxOrder(data.sjsPhone)
  const disOrderRes = await getDisOrder(data.sjsPhone)
  disOrder.value = disOrderRes.data || []

  txOrder.value = res.data || []
  buttonDis.value = true
  viewData.value = data
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
  font-size: 14px;
  margin-top: 10px;
}
.order {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.txOrder {
  margin-top: 10px;
  min-height: 30px;
  max-height: 200px;
  overflow-y: auto;
  margin-left: 20px;
}
</style>
