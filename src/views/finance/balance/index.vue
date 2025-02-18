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
          <el-button v-if="txxbutton" style="margin-left: 10%" type="success" @click="handleBut()" :disabled="buttonDis">提现</el-button>
        </div>
        <div style="left: 1%; margin-top: 5%; color: #b1b8bd">
          <span v-if="'day' == time.type">ps(提现时间为每周的{{ time.beginTime }}-{{ time.endTime }}日)</span>
          <span v-else>ps(提现时间为每月的{{ time.beginTime }}-{{ time.endTime }}日)</span>
        </div>
      </div>
    </div>
    <div class="rightPage">
      <div>
        <h1 style="margin-left: 45%">提现/扣款记录</h1>
        <el-table v-loading="txLoading" :data="txList">
          <el-table-column label="序号" prop="title" width="60px">
            <template #default="scope">
              {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="sjsName" width="100px" />
          <el-table-column label="账户" align="center" prop="sjsPhone" width="120" />
          <el-table-column label="支付宝号" align="center" prop="zfb" width="140px" />
          <el-table-column label="类型" align="center" width="80px">
            <template #default="scope">
              <span v-if="!scope.row.message" style="color: green">提现</span>
              <span v-else style="color: red">扣款</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="center" prop="money" width="80px" />
          <el-table-column label="余额" align="center" prop="balance" width="80px" />
          <el-table-column label="扣款原因" align="center" prop="message" width="140px" />
          <el-table-column label="打款/扣款时间" align="center" prop="txTime" width="180px">
            <template #default="scope">
              <span v-if="!scope.row.txTime" style="color: blue">审核中</span>
              <span v-else>{{ scope.row.txTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getTxList" />
      </div>
    </div>
    <el-dialog title="提现" v-model="buttonDis" width="500px" append-to-body>
      <span>请确认提现金额： {{ userData.money }} &nbsp;元</span>
      <el-button :disabled="txButton" style="margin-left: 350px; margin-top: 20px" type="primary" @click="subTX">提现</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { getInfo } from '@/api/login'
import { getTxTime } from '@/api/order'
import { onMounted, toRefs, onUnmounted } from 'vue'
import { listDis, setTx } from '@/api/tx'
const { proxy } = getCurrentInstance()

const userData = ref({}) // 用户信息
const txList = ref([]) //提现列表
const time = ref({}) // 提现时间

const total = ref(0)
const txLoading = ref(false)
const txxbutton = ref(true)

const txButton = ref(false)

let list = ''
onMounted(() => {
  getData()
  list = setTimeout(() => {
    getData()
  }, 1000 * 10)
})

onUnmounted(() => {
  clearTimeout(list)
})

const buttonDis = ref(false)
// 提现申请列表

// 判断余额是否充足
async function handleBut() {
  if (!userData.value.money || userData.value.money <= 0) {
    // proxy?.$modal.msgError('账户余额不足')
    return
  }
  buttonDis.value = true
}

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
})
const { queryParams } = toRefs(data)

// 提现全部金额
async function subTX() {
  txButton.value = true
  let tx = {
    sjsPhone: userData.value.userName,
    sjsName: userData.value.name,
    money: userData.value.money
  }

  await setTx(tx).then(
    setTimeout(() => {
      proxy?.$modal.msgSuccess('提现申请成功,预计1-3日到账,请耐心等待！')
      buttonDis.value = false
      getData()
      txButton.value = false
    }, 300)
  )
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

//获取用户详细信息
async function getData() {
  const res = await getInfo()
  console.log(res)

  userData.value = res.data.user
  if (!userData.value.money || userData.value.money <= 0) {
    txxbutton.value = false
  } else {
    txxbutton.value = true
  }
  if ('1' == res.data.user.isDesigner) {
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
  const txListRes = await listDis(queryParams.value)
  txList.value = txListRes.rows
  total.value = txListRes.total
  txLoading.value = false
}
</script>
<style lang="scss" scoped src="./index.scss"></style>
