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

    <el-dialog :title="dialogTitle" v-model="dialogButton" width="500px" append-to-body>
      <div class="flex jus">
        <el-form :model="addData" label-width="160px">
          <el-row :gutter="20">
            <el-form-item label="名称:">
              <el-input v-model="addData.name" placeholder="请输入文件名称" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="链接类型:">
              <el-input v-model="addData.type" placeholder="请选择类型(链接跳转)" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="文件封面:">
              <el-input v-model="addData.cover" placeholder="请上传PPT封面" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="文件(ppt/mp4):">
              <el-upload
                class="upload-demo"
                action="#"
                :show-file-list="false"
                :on-change="handleExceed"
                :http-request="handleExceed"
                :auto-upload="false"
                accept="ppt/mp4">
                <el-button type="info"
                  ><el-icon><Upload /></el-icon>上传附件</el-button
                >
              </el-upload>
              <span class="ml-5">附件： {{ addData.fileName }} </span>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="文件类型:">
              <el-input v-model="addData.fileType" disabled="" placeholder="" />
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <el-button class="mt-2 ml-50" type="primary" @click="addPPT()">确认</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { listData, deleteById, addPPTFile, update } from '@/api/wx/ppt'
import { uploadFile } from '@/api/wx/upload'
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
  dialogTitle.value = '修改文件'
}

const openAdd = () => {
  dialogButton.value = true
  dialogTitle.value = '添加文件'
  addData.value = {}
}

const addPPT = async () => {
  let res = null
  if (dialogTitle.value == '修改文件') {
    res = await update(addData.value)
    res.code == 200 ? proxy?.$modal.msgSuccess('修改PPT成功！') : proxy?.$modal.msgError('修改PPT失败！')
  } else {
    // 大文件，设置为大文件上传
    if (chunkSize > fileSize.value) {
      res = await batchUpload()
    } else {
      // 单文件直接进行上传
      res = await addPPTFile(addData.value)
      res.code == 200 ? proxy?.$modal.msgSuccess('添加文件成功！') : proxy?.$modal.msgError('添加文件失败！')
    }
  }
  dialogButton.value = false
  getList()
  addData.value = {}
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
// 设置分片的大小为8mb
let chunkSize = 8 * 1024 * 1024
const fileSize = ref(0)
const handleExceed = async (file) => {
  const suffix = file.name.split('.')[1]
  if (suffix != 'ppt' && suffix != 'mp4' && suffix != 'pptx') {
    proxy?.$modal.msgError('请上传PPT/视频文件')
    return
  }
  addData.value.fileName = file.name // 文件名称
  addData.value.fileType = suffix // 文件类型

  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = async () => {
    addData.value.fileSize = file.size // 文件大小
    addData.value.path = reader.result // 文件内容
    fileSize.value = file.size
  }
  console.log(addData.value)
}

const cancelUpload = ref(false)
const batchUpload = async () => {
  addData.value.md5 = getFileMd5()
  let chunkCount = Math.ceil(fileSize.value / chunkSize)

  for (let i = 0; i < chunkCount; i++) {
    if (cancelUpload.value) return
    const res = await uploadChunkFile(i)
    if (res.code !== 200) {
      dialogVisible.value = false
      ElMessageBox({ message: `${fileData.value.name}上传失败`, title: '提示' })
      return
    }

    // 合并切片,合并之后再添加PPT文件信息
    if (i === chunkCount - 1) {
      setTimeout(async () => {
        dialogVisible.value = false
        const res = await mergeUpload(addData.value.md5)
        if (res.code == 200) {
          addData.value.path = ''
          res = await addPPTFile(addData.value)
          ElMessageBox({ message: `${fileData.value.name}上传成功`, title: '提示' })
        }
      }, 500)
    }
  }
}

// 切片开始索引，切片文件
const uploadChunkFile = async (index) => {
  const chunkFile = addData.value.path.slice(index * chunkSize, Math.min(fileSize.value, index * chunkSize + chunkSize))

  // 分片上传， md5,index,file，上传切片
  const res = await uploadFile({
    md5: addData.value.md5,
    index: index + 1,
    path: chunkFile
  })
  if (res.code != 200) {
    dialogVisible.value = false
    proxy?.$modal.msgError('上传文件失败!' + index + 1)
  }
}

// 重构项目没有断点续传等功能，故不需要做hash计算，只需要保证唯一即可，后端会拿这个值新建文件夹保存切片
let counter = 0
const getFileMd5 = () => {
  let guid = (+new Date()).toString(32)
  for (let i = 0; i < 5; i++) {
    guid += Math.floor(Math.random() * 65535).toString(32)
  }
  return 'wu_' + guid + (counter++).toString(32)
}
</script>
<style scoped></style>
