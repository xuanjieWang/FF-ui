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
        <el-table-column label="链接类型" align="center" prop="type" />
        <el-table-column label="封面" align="center" prop="cover">
          <template #default="scope"> <img :src="scope.row.cover" class="w-[100px] h-[100px] cursor-pointer" /> </template>
        </el-table-column>
        <el-table-column label="文件名称" align="center" prop="fileName" />
        <el-table-column label="文件类型" align="center" prop="fileType" />
        <el-table-column label="本地地址" align="center" prop="url" />
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
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

    <el-dialog :title="dialogTitle" v-model="dialogButton" width="800px" append-to-body>
      <div class="flex">
        <el-form :model="addData" label-width="220px">
          <el-row :gutter="20">
            <el-form-item label="链接类型:">
              <el-input v-model="addData.type" :disabled="updateLoading" placeholder="请选择类型(链接跳转)" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="文件展示封面:">
              <img class="w-[100px] h-[100px] cursor-pointer" :src="addData.cover" />
              <el-upload
                class="upload-demo ml-5"
                action="#"
                :show-file-list="false"
                :on-change="handleCover"
                :http-request="handleCover"
                :auto-upload="false"
                accept="image/*">
                <el-button type="success" :disabled="updateLoading">
                  <el-icon><Plus /></el-icon>上传图片</el-button
                >
              </el-upload>
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
                <el-button type="primary" :disabled="updateLoading">选择附件</el-button>
              </el-upload>
              <span class="ml-5">附件： {{ addData.fileName }} </span>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="名称:">
              <el-input v-model="addData.fileName" disabled placeholder="请先上传附件" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="文件类型:">
              <el-input v-model="addData.fileType" disabled placeholder="请先上传附件" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="文件大小:">
              <el-input v-model="fileSize" disabled />
            </el-form-item>
          </el-row>
          <el-row :gutter="20" v-if="dialogTitle === '修改文件'">
            <el-form-item label="排序:">
              <el-input v-model="addData.sort" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20" v-if="dialogTitle === '修改文件'">
            <el-form-item label="文件内容:">
              <div class="flex flex-wrap gap-1">
                <div v-for="(item, index) in addData.fileImages"><img :src="item" class="w-[100px] h-[100px] cursor-pointer" /></div>
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <el-button class="mt-5 ml-90" type="primary" v-if="dialogTitle === '修改文件'" :disabled="updateLoading" @click="addPPT()">修改</el-button>
      <el-button class="mt-5 ml-90" type="success" v-else :disabled="updateLoading" @click="addPPT()">上传</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { listData, deleteById, addPPTFile, update } from '@/api/wx/ppt'
import { getToken } from '@/utils/auth'
import { globalHeaders } from '@/utils/request'
import SparkMD5 from 'spark-md5'
const uploadHeader = globalHeaders()

const { proxy } = getCurrentInstance()

const list = ref([])
const loading = ref(true)
const updateLoading = ref(false)
const total = ref(0)
const dialogButton = ref(false)
const dialogTitle = ref('')
const addData = ref({})
const fileSize = ref(0)
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

// 修改文件
const openAddUpdate = (data) => {
  if (updateLoading.value) return proxy?.$modal.msgSuccess('请等待文件上传完成')
  addData.value = data
  dialogButton.value = true
  dialogTitle.value = '修改文件'
  fileSize.value = addData.value.size
}

// 添加按钮
const openAdd = () => {
  if (updateLoading.value) return proxy?.$modal.msgSuccess('请等待文件上传完成')
  dialogButton.value = true
  dialogTitle.value = '添加文件'
  addData.value = {}
}

// 修改文件
async function updateFile() {
  addData.value.cover = null
  addData.value.fileImages = null
  const res = await update(addData.value)
  res.code == 200 ? proxy?.$modal.msgSuccess('修改PPT成功！') : proxy?.$modal.msgError('修改PPT失败！')

  setTimeout(() => {
    dialogButton.value = false
    addData.value = {}
    getList()
  }, 500)
}

// 上传文件
async function addFile() {
  let time = (addData.value.size / 1024 / 1024 / 5) * 3000
  proxy?.$modal.msgSuccess('文件上传中，上传时间根据文件大小等待')

  updateLoading.value = true
  setTimeout(async () => {
    // 等待大文件上传
    const res = await addPPTFile(addData.value)
    res.code == 200 ? proxy?.$modal.msgSuccess('添加文件成功！') : proxy?.$modal.msgError('添加文件失败！')
    getList()
    addData.value = {}
    updateLoading.value = false
    dialogButton.value = false
  }, time)
}

// 添加或者修改文件
const addPPT = async () => {
  if (updateLoading.value) return proxy?.$modal.msgSuccess('请等待文件上传完成')
  if (dialogTitle.value == '修改文件') {
    updateFile()
    return
  }
  addFile()
}

// 删除文件
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

// 封面文件上传到服务器中
const handleCover = async (file) => {
  const suffix = file.name.split('.')[1]
  if (suffix != 'jpg' && suffix != 'png') {
    proxy?.$modal.msgError('请上传jpg/png文件')
    return
  }
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = async () => {
    addData.value.cover = reader.result
  }
}

const saveFile = ref(null)
const handleChange = async (file) => {
  const suffix = file.name.split('.')[1]
  if (suffix != 'mp4' && suffix != 'pptx') {
    proxy?.$modal.msgError('请上传PPT/视频文件')
    proxy.$refs.upload.clearFiles()
    return
  }
  addData.value.fileName = file.name // 文件名称
  addData.value.fileType = suffix // 文件类型
  addData.value.size = file.size // 文件大小
  fileSize.value = file.size / 1024 / 1024
  saveFile.value = file

  const fileReader = new FileReader()
  fileReader.readAsDataURL(file.raw)
  fileReader.onload = () => {
    let hexHash = SparkMD5.hash(fileReader.result)
    addData.value.md5 = hexHash
    proxy.$refs.upload.submit()
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
}
</script>
<style scoped></style>
