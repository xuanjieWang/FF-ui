<template>
  <div class="p-2">
    <el-form :model="queryParams" class="mt-2" :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="success" @click="openAdd()">添加</el-button>
      </el-form-item>
    </el-form>
    <el-card shadow="never">
      <el-table v-loading="loading" :data="list">
        <el-table-column label="序号" align="center" prop="title" width="80px">
          <template #default="scope">
            {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center" prop="name" />
        <el-table-column label="类型" align="center" prop="type" />
        <el-table-column label="文件类型" align="center" prop="fileType" />
        <el-table-column label="排序" align="center" prop="sort" />
        <!-- <el-table-column label="文件地址" align="center" prop="path" /> -->
        <!-- <el-table-column label="封面" align="center" prop="cover" /> -->
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改类型" placement="top">
              <el-button link type="primary" icon="Edit" @click="openAddUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="danger" icon="Delete" @click="deletePPT(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="dialogTitle" v-model="dialogButton" width="600px" append-to-body>
      <el-form :model="addData" label-width="150px">
        <el-row :gutter="20">
          <el-form-item label="标题:">
            <el-input v-model="addData.name" placeholder="请输入PPT标题" />
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="类型(用于类型跳转):">
            <el-input v-model="addData.type" placeholder="请选择PPT类型" />
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="文件类型:">
            <el-input v-model="addData.type" placeholder="请选择文件类型" />
          </el-form-item>
        </el-row>
        <el-row v-if="dialogTitle == '添加(PPT/视频)文件'" :gutter="20">
          <el-form-item label="PPT类型:">
            <el-input v-model="addData.type" placeholder="请输入PPT类型" />
          </el-form-item>
        </el-row>

        <el-row v-if="dialogTitle == '添加(PPT/视频)文件'" :gutter="20">
          <el-form-item label="PPT类型:">
            <el-upload
              class="upload-demo"
              action="#"
              :show-file-list="false"
              :on-change="handleExceed"
              :http-request="handleExceed"
              :auto-upload="false"
              accept="ppt/mp4">
              <el-button type="primary">上传附件</el-button>
            </el-upload>
            <span class="ml-5">附件： {{ addData.fileName }} </span>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button class="mt-5 ml-120" type="success" @click="addPPT()">确认</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { listData, deleteById, addPPTFile, update } from '@/api/wx/ppt'
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
  const res = await listData(queryParams.value)
  console.log(res)

  list.value = res.rows
  total.value = res.total
  loading.value = false
}

const openAddUpdate = (data) => {
  addData.value = data
  dialogButton.value = true
  dialogTitle.value = '修改(PPT/视频)文件'
}

const openAdd = () => {
  dialogButton.value = true
  dialogTitle.value = '添加(PPT/视频)文件'
  addData.value = {}
}

const addPPT = async () => {
  if (dialogTitle.value == '修改(PPT/视频)文件') {
    const res = await update(addData.value)
    if (res.code == 200) {
      proxy?.$modal.msgSuccess('修改PPT成功！')
      dialogButton.value = false
      getList()
    }
  } else {
    console.log(addData.value)

    const res = await addPPTFile(addData.value)
    if (res.code == 200) {
      proxy?.$modal.msgSuccess('添加PPT成功!')
      dialogButton.value = false
      getList()
    }
  }
}

const deletePPT = async (row) => {
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

const handleExceed = async (file) => {
  const suffix = file.name.split('.')[1]
  console.log(suffix, suffix == 'pptx')

  if (suffix != 'ppt' && suffix != 'mp4' && suffix != 'pptx') {
    proxy?.$modal.msgError('请上传PPT/视频文件')
    return
  }
  addData.value.fileName = file.name

  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = async () => {
    addData.value.path = reader.result
  }
}
</script>
<style scoped></style>
