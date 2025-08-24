<template>
  <div class="p-2">
    <el-card>
      <el-table v-loading="loading" :data="info">
        <el-table-column label="账号" align="center" prop="phonenumber" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="设计师类别" align="center" prop="designerType" />
        <el-table-column label="支付宝账户" align="center" prop="zfb" />
        <el-table-column label="QQ" align="center" prop="qq" />
        <el-table-column label="QQ邮箱" align="center" prop="qqMail" />
        <el-table-column label="在职工作" align="center" prop="work" />
        <el-table-column label="特长" align="center" prop="proficient" />
        <el-table-column label="注册时间" align="center" prop="createTime" width="180"> </el-table-column>
        <el-table-column label="邀请人" align="center" prop="invitePeople" />

        <el-table-column label="审核通过" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="审核通过" placement="top">
              <el-button link type="success" icon="Check" @click="Audit(scope.row, true)" v-hasPermi="['audit:data:audit']">通过</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="审核不通过" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="审核不通过" placement="top">
              <el-button link type="danger" icon="Close" @click="Audit(scope.row, false)" v-hasPermi="['audit:data:audit']">不通过</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted, onUnmounted } from 'vue'
import { getAuditList, handleAudit } from '@/api/audit'
import { useUserStore } from '@/store/modules/user'
const { proxy } = getCurrentInstance()

const userStore = useUserStore() // 用户状态管理
const loading = ref(true) // 加载状态
const total = ref(10) // 总数据量

const info = ref([]) // 审核列表数据
const params = reactive({
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  handle: {
    userId: '',
    audit: 'no'
  }
})
const { queryParams } = toRefs(params)

let listTimer = '' // 定时器
onMounted(() => {
  getList()
  listTimer = setInterval(() => {
    getList()
  }, 20000)
})

// 销毁定时器
onUnmounted(() => {
  clearInterval(listTimer)
})

// /** 查询【请填写功能名称】列表 */
const getList = async () => {
  loading.value = true
  const res = await getAuditList(userStore.name)
  info.value = res.data || []
  loading.value = false
}

// 审核按钮
async function Audit(data, flag) {
  var params = {
    // 审核参数
    id: data.id,
    userId: data.userId,
    audit: ''
  }
  params.audit = flag ? 'yes' : 'no'
  let title = flag ? '通过' : '不通过' // 操作标题
  await proxy?.$modal.confirm(' ' + title + ' 用户: ' + data.name + '  的用户申请？').then(async () => await handleAudit(params))

  setTimeout(() => {
    getList()
  }, 200)
}
</script>
<style src="./index.css" scoped></style>
