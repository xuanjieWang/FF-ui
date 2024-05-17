<template>
  <div class="body">
    <div class="leftPage">
      <div>
        <h1 style="margin-left: 45%">个人信息</h1>
        <ul class="list-group list-group-striped">
          <li class="list-group-item">
            <svg-icon icon-class="user" /><span>账号名称</span>
            <div class="pull-right">{{ userData.nickName }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="user" /><span>账号:</span>
            <div class="pull-right">{{ userData.userName }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="phone" /><span>手机号码:</span>
            <div class="pull-right">{{ userData.phonenumber }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="people" /><span>真实姓名:</span>
            <div class="pull-right">{{ userData.name }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="qq" /><span>QQ:</span>
            <div class="pull-right">{{ userData.qq }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="email" /><span>QQ邮箱:</span>
            <div class="pull-right">{{ userData.qqMail }}</div>
          </li>

          <li class="list-group-item">
            <svg-icon icon-class="row" /><span>部门:</span>
            <div class="pull-right">{{ userData.designerType }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="job" /><span>在职工作:</span>
            <div class="pull-right">{{ userData.work }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="shopping" /><span>支付宝账户:</span>
            <div class="pull-right">{{ userData.zfb }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="money" /><span>账户余额：</span>
            <div class="pull-right">{{ userData.money }}</div>
          </li>
        </ul>
      </div>
      <div class="tx" v-if="!txButtn">
        <div class="txTime" style="color: red">目前不能进行提现</div>
        <div class="txTime">
          <span v-if="'day' == time.type">提现时间为每周的周{{ time.beginTime }}-周{{ time.endTime }}</span>
          <span v-else>提现时间为每月的{{ time.beginTime }}-{{ time.endTime }}日</span>
        </div>
      </div>
      <div class="tx" v-else>
        <div class="txTime" style="color: green">目前可以进行提现</div>
        <div class="txTime2">
          <div>账户余额: {{ userData.money || 0 }}</div>
          <el-button style="margin-left: 10%" type="success" @click="buttonDis = true" :disabled="buttonDis">提现</el-button>
        </div>
        <div style="left: 1%; margin-top: 5%; color: #b1b8bd">
          <span v-if="'day' == time.type">ps(提现时间为每周的{{ time.beginTime }}-{{ time.endTime }}日)</span>
          <span v-else>ps(提现时间为每月的{{ time.beginTime }}-{{ time.endTime }}日)</span>
        </div>
      </div>
    </div>
    <div class="rightPage">
      <div>
        <h1 style="margin-left: 45%">提现记录</h1>
        <el-table v-loading="txLoading" :data="txList">
          <el-table-column label="序号" align="center" prop="title" width="80px">
            <template #default="scope">
              {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="sjsName" />
          <el-table-column label="账户" align="center" prop="sjsPhone" width="120px" />
          <el-table-column label="支付宝号" align="center" prop="zfb" width="140px" />
          <el-table-column label="提现金额" align="center" prop="money" />
          <el-table-column label="账户余额" align="center" prop="balance" />
          <el-table-column label="提现时间" align="center" prop="createTime" width="110px" />
        </el-table>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getTxList" />
      </div>
    </div>
    <el-dialog title="提现" v-model="buttonDis" width="500px" append-to-body>
      <div style="flex">
        <span>提现金额： </span>
        <el-input-number v-model="TX.money" :max="userData.money" :precision="2" :min="10" />
        <span>元</span>
      </div>
      <p style="margin: 20px 0 0 10px">当前提现金额: {{ TX.money.toFixed(2) }}, 体现后余额: {{ (userData.money - TX.money).toFixed(2) }}</p>
      <el-button style="margin-left: 350px" type="success" @click="subTX">提现</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { getInfo } from '@/api/login'
import { getTxTime } from '@/api/order'
import { onMounted, toRefs } from 'vue'
import { list, setTx } from '@/api/tx'
const { proxy } = getCurrentInstance()

const userData = ref({}) // 用户信息
const txList = ref([]) //提现列表
const time = ref({}) // 提现时间

const total = ref(0)
const txLoading = ref(false)

onMounted(() => {
  getData()
})

const buttonDis = ref(false)
// 提现申请列表
const TX = ref({
  money: 10
})

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
})
const { queryParams } = toRefs(data)

async function subTX() {
  TX.value.sjsPhone = userData.value.userName
  TX.value.sjsName = userData.value.name

  await setTx(TX.value)
  setTimeout(() => {
    proxy?.$modal.msgSuccess('提现申请成功')
    buttonDis.value = false
    getData()
  }, 500)
}

const txButtn = ref(false)
function checkTxtime(data) {
  var currentDate = new Date()
  let time = 0
  if ('day' == data.type) {
    var daysOfWeek = ['7', '1', '2', '3', '4', '5', '6']
    time = daysOfWeek[currentDate.getDay()]
  } else {
    time = currentDate.getDate()
  }
  if (data.beginTime <= data.endTime) {
    if (time >= data.beginTime && time <= data.endTime) {
      txButtn.value = true
      return
    }
  } else {
    if (time <= data.beginTime || time >= data.endTime) {
      txButtn.value = true
      return
    }
  }
}

async function getData() {
  const res = await getInfo()
  userData.value = res.data.user
  if ('设计师部门' == res.data.user.dept.deptName) {
    queryParams.value.sjsPhone = userData.value.userName
  }

  // 获取提现时间
  const txres = await getTxTime()
  time.value = txres.data
  checkTxtime(txres.data)

  getTxList()
}
//获取提交列表
async function getTxList() {
  txLoading.value = true
  const txListRes = await list(queryParams.value)
  txList.value = txListRes.rows
  total.value = txListRes.total
  txLoading.value = false
}
</script>
<style lang="scss" scoped src="./index.scss"></style>
