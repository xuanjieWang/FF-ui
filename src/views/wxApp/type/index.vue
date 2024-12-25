<template>
  <div class="p-2">
    <el-form :model="queryParams" class="mt-2" :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="success" @click="openAddType()">添加</el-button>
      </el-form-item>
    </el-form>
    <el-card shadow="never">
      <el-table v-loading="loading" :data="list">
        <el-table-column label="序号" align="center" prop="title" width="80px">
          <template #default="scope">
            {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="类别" align="center" prop="type" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改类型" placement="top">
              <el-button link type="primary" icon="Edit" @click="openAddUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="danger" icon="Delete" @click="deleteType(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="dialogTitle" v-model="dialogButton" width="400px" append-to-body>
      <el-form :model="addData" label-width="80px">
        <el-row :gutter="20">
          <el-form-item label="PPT类型:">
            <el-input v-model="addData.type" placeholder="请输入PPT类型" />
          </el-form-item>
        </el-row>
      </el-form>
      <el-button type="primary" @click="addType()">确认</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { listType, deleteById, add, update } from '@/api/wx/type'
const { proxy } = getCurrentInstance()

const list = ref([])
const loading = ref(true)
const total = ref(0)
const dialogButton = ref(false)
const dialogTitle = ref('')
const addData = ref({})

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
})

const { queryParams } = toRefs(data)
onMounted(() => {
  getList()
})

const getList = async () => {
  loading.value = true
  const res = await listType(queryParams.value)
  list.value = res.rows
  total.value = res.total
  loading.value = false
}

const openAddUpdate = (data) => {
  addData.value = data
  dialogButton.value = true
  dialogTitle.value = '修改类型'
}

const openAddType = () => {
  dialogButton.value = true
  dialogTitle.value = '添加类型'
  addData.value = {}
}

const addType = async () => {
  if (dialogTitle.value == '修改类型') {
    const res = await update(addData.value)
    if (res.code == 200) {
      proxy?.$modal.msgSuccess('修改成功')
      dialogButton.value = false
      getList()
    }
  } else {
    const res = await add(addData.value)
    if (res.code == 200) {
      proxy?.$modal.msgSuccess('添加成功')
      dialogButton.value = false
      getList()
    }
  }
}

const deleteType = async (row) => {
  await ElMessageBox.confirm('是否删除 ' + row.type + '?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  const res = await deleteById(row.id)
  if (res.code == 200) {
    proxy?.$modal.msgSuccess('删除成功')
    getList()
  }
}
</script>
<style scoped></style>
