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
                ref="upload"
                class="upload-demo"
                :action="url"
                :headers="uploadHeader"
                :limit="1"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChange"
                :on-exceed="handleExceed">
                <el-button type="primary">选择附件</el-button>
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
import { getToken } from '@/utils/auth'
import { globalHeaders } from '@/utils/request'
import SparkMD5 from 'spark-md5'
const uploadHeader = globalHeaders()

const { proxy } = getCurrentInstance()

const list = ref([])
const loading = ref(true)
const total = ref(0)
const dialogButton = ref(false)
const dialogTitle = ref('')
const addData = ref({})
const url = import.meta.env.VITE_APP_BASE_API + '/wx/upload/upload'

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
    if (addData.value.fileSize > chunkSize) {
      const fileList = proxy.$refs.upload
      uploadChunkFile()
      // proxy.$refs.upload.submit()
    } else {
      const fileList = proxy.$refs.upload
      console.log('fileList', fileList)

      proxy.$refs.upload.submit()
    }

    // 添加文件信息
    // res = await addPPTFile(addData.value)
    // res.code == 200 ? proxy?.$modal.msgSuccess('添加文件成功！') : proxy?.$modal.msgError('添加文件失败！')
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
// 设置分片的大小为10mb
let chunkSize = 10 * 1024 * 1024
const upload = ref()
const handleExceed = async (file) => {
  proxy.$refs.upload.clearFiles() // 清除文件列表
  proxy.$nextTick(() => {
    proxy.$refs.upload.handleStart(file[0])
  })
}

const saveFile = ref(null)
const handleChange = async (file) => {
  const suffix = file.name.split('.')[1]
  if (suffix != 'ppt' && suffix != 'mp4' && suffix != 'pptx') {
    proxy?.$modal.msgError('请上传PPT/视频文件')
    proxy.$refs.upload.clearFiles()
    return
  }
  addData.value.fileName = file.name // 文件名称
  addData.value.fileType = suffix // 文件类型
  addData.value.fileSize = file.size // 文件大小

  saveFile.value = file

  const fileReader = new FileReader()
  fileReader.readAsDataURL(file.raw)
  fileReader.onload = () => {
    let hexHash = SparkMD5.hash(fileReader.result)
    // 获取文件的md5值
    console.log(hexHash, file.name)
    file.name = hexHash + '.' + suffix
    console.log(file.name)
  }
}
// 切片开始索引，切片文件
const uploadChunkFile = async () => {
  console.log('saveFile.value--------------', saveFile.value)

  const data = new FormData().append('file', saveFile.value)
  console.log('----------', data.value)

  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + getToken(),
      clientid: import.meta.env.VITE_APP_CLIENT_ID,
      'Content-Type': 'multipart/form-data'
    },
    body: data.value
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
<style scoped></style>
