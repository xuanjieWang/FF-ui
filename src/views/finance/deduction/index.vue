<!--页面-->
<template>
  <div class="body">
    <div class="leftPage">
      <h1 style="margin-left: 45%">账户扣款</h1>
      <div class="tx">
        <el-form ref="orderFormRef" :model="form" :rules="rules" label-width="150px" style="margin-top: 30px">
          <el-row :gutter="20">
            <el-form-item label="设计师姓名" prop="sjsName">
              <div style="display: flex; flex-direction: column">
                <el-input v-model="testName" placeholder="" id="input" @focus="searchFocus()" />
                <div v-if="searchView" class="searchResult" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
                  <div v-for="(item, index) in searchList" :key="index">
                    <div style="display: flex; align-items: center" class="searchItem" @mousedown="checkUser(item, e)">
                      <p style="width: 90px">{{ item.name || '无姓名' }}</p>
                      <p style="width: 180px">{{ item.userName }}-{{ item.designerType }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="设计师账户" prop="sjsPhone">
              <el-input v-model="form.sjsPhone" disabled placeholder="" />
            </el-form-item>
            <el-form-item label="扣款金额" prop="money">
              <el-input v-model="form.money" placeholder="" />
            </el-form-item>
            <el-form-item label="扣款原因" prop="message">
              <el-input v-model="form.message" style="width: 250px" :rows="4" type="textarea" placeholder="请输入扣款原因" maxlength="100" />
            </el-form-item>
          </el-row>
        </el-form>
        <el-button :loading="buttonLoading" type="primary" @click="handle()" v-hasPermi="['tx:data:setTx']">扣款</el-button>
      </div>
    </div>
    <div class="rightPage">
      <div>
        <h1 style="margin-left: 48%">扣款记录</h1>
        <el-table v-loading="txLoading" :data="txList">
          <el-table-column label="序号" prop="title" width="60px">
            <template #default="scope">
              {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="sjsName" width="100px" />
          <el-table-column label="账号" align="center" prop="sjsPhone" width="120" />
          <el-table-column label="支付宝账户" align="center" prop="zfb" width="140px" />
          <el-table-column label="扣款金额" align="center" prop="money" width="120px" />
          <el-table-column label="余额" align="center" prop="balance" width="120px" />
          <el-table-column label="原因" align="center" prop="message" width="140px" />
          <el-table-column label="扣款时间" align="center" prop="txTime" width="180px">
            <template #default="scope">
              <span v-if="!scope.row.txTime" style="color: blue">审核中</span>
              <span v-else>{{ scope.row.txTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getTxList" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { searchUser } from '@/api/order'
import { setTx, listDis } from '@/api/tx'
import { onMounted, watch, reactive, toRefs } from 'vue'
const { proxy } = getCurrentInstance()
import { rules } from './rules'

const orderFormRef = ref()
const txList = ref([]) //提现列表
const txLoading = ref(false)

const txdata = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    successFlag: '3'
  }
})
const { queryParams } = toRefs(txdata)

const total = ref(0)

onMounted(async () => {
  testName.value = ' '
  getTxList()
})

//获取提交列表
async function getTxList() {
  txLoading.value = true
  const txListRes = await listDis(queryParams.value)
  console.log(txListRes.rows)
  txList.value = txListRes.rows
  total.value = txListRes.total
  txLoading.value = false
}

// 扣钱
const buttonLoading = ref(false)
function handle() {
  orderFormRef.value?.validate(async (valid) => {
    if (valid) {
      buttonLoading.value = true
      await proxy?.$modal.confirm('确认对用户 ' + form.value.sjsName + ' 扣除金额: ' + form.value.money + ' 元 ?').then(async () => {
        await setTx(form.value).then(() => {
          form.value = { ...initFormData }
          testName.value = ' '
          proxy?.$modal.msgSuccess('扣款成功')
          buttonLoading.value = false
        })
      })
    }
  })
}

const initFormData = {}
const data = reactive({
  form: { ...initFormData },
  searchParams: {
    pageNum: 1,
    pageSize: 10,
    name: ''
  }
})
const { form, searchParams } = toRefs(data)

//搜索用户
async function search() {
  if (' ' == testName.value) return
  if (!testName.value) {
    searchParams.value.name = 'all'
  } else {
    searchParams.value.name = testName.value
  }
  const res = await searchUser(searchParams.value)
  searchList.value = res.rows
  searchView.value = true
}

//选中标签
function checkUser(data) {
  form.value.sjsName = data.name
  form.value.sjsPhone = data.userName
  testName.value = data.name
  setTimeout(() => {
    searchView.value = false
  }, 100)
}

const searchView = ref(false)
const searchList = ref([])
function searchBlue() {
  searchView.value = false
}
function searchFocus() {
  searchView.value = true
  testName.value = ''
}

function onMouseEnter() {
  const ele = document.getElementById('input')
  ele.removeEventListener('blur', searchBlue)
  ele.removeEventListener('focus', searchFocus)
}
function onMouseLeave() {
  const ele = document.getElementById('input')
  ele.addEventListener('blur', searchBlue)
  ele.addEventListener('focus', searchFocus)
}

const testName = ref('')
watch(testName, () => {
  search()
})
</script>
<style lang="scss" scoped>
.body {
  display: flex;
}
.leftPage {
  width: 35%;
  min-width: 450px;
  display: flex;
  flex-direction: column;
}
.tx {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  border: 1px solid #b1b5ba;
  margin: 10px 0px 0px 20px;
  text-align: center;
}
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
.searchResult {
  position: absolute;
  top: 40px;
  z-index: 1000;
  height: 130px;
  overflow: auto;
  width: 250px;
  background: rgb(220, 214, 214);
}
.searchItem {
  height: 25px;
  width: 250px;
  font-size: 15px;
  line-height: 25px;
}
.searchItem:focus,
.searchItem:hover {
  cursor: pointer;
  background: rgb(86, 82, 82);
  color: #fff;
}
p {
  margin-left: 5px;
}
.rightPage {
  width: 68%;
  margin-left: 2%;
}
</style>
