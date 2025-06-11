<template>
  <div class="p-2">
    <div class="search">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="70px">
        <el-form-item label="链接类型" prop="type">
          <el-select placeholder="" v-model="queryParams.type" clearable :value-key="'id'" style="width: 120px; margin-bottom: 0">
            <el-option v-for="item in pptTypeList" :label="item" :value="item"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="链接类型" prop="type">
          <el-input v-model="queryParams.type" :disabled="updateLoading" placeholder="链接类型" style="width: 120px; margin-bottom: 0" />
        </el-form-item>
        <!-- <el-form-item label="文件类型" prop="fileType">
          <el-select placeholder="" v-model="queryParams.fileType" clearable :value-key="'id'" style="width: 120px; margin-bottom: 0">
            <el-option v-for="item in fileTypeList" :label="item.value" :value="item.value"> </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="排序" prop="sort">
          <el-select placeholder="" v-model="queryParams.sort" clearable :value-key="'id'" style="width: 120px; margin-bottom: 0">
            <el-option v-for="item in sortList" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getList()">搜索</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="success" icon="Plus" @click="openAdd()">上传</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="list">
        <el-table-column label="序号" align="center" prop="title" width="80px">
          <template #default="scope">
            {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="主题" align="center" prop="name" />
        <el-table-column label="封面" align="center" prop="cover">
          <template #default="scope"> <img :src="scope.row.cover" class="w-[100px] h-[100px] cursor-pointer" /> </template>
        </el-table-column>
        <el-table-column label="链接类型" align="center" prop="type" />

        <!-- <el-table-column label="文件类型" align="center" prop="fileType" /> -->
        <!-- <el-table-column label="视频大小" align="center" prop="size" /> -->

        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="添加时间" align="center" prop="createTime" width="100px" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="100px" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="openAddUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="danger" icon="Delete" @click="delFile(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!---添加或者修改文件-->
    <el-dialog :title="dialogTitle" v-model="dialogButton" width="800px" append-to-body>
      <div class="flex">
        <el-form :model="addData" label-width="220px">
          <el-row :gutter="20">
            <el-form-item label="主题:">
              <el-input v-model="addData.name" :disabled="updateLoading" placeholder="请输入文件主题" />
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="链接类型:">
              <el-input v-model="addData.type" :disabled="updateLoading" placeholder="(小程序链接类型)" />
              <span style="color: red; font-size: 12px"> 多类型使用逗号(,)隔开 </span>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="封面:">
              <img class="w-[100px] h-[100px] cursor-pointer" :src="addData.cover" />
              <el-upload
                class="upload-demo ml-5"
                action="#"
                :show-file-list="false"
                :on-change="handleCover"
                :http-request="handleCover"
                :auto-upload="false"
                accept="image/*">
                <el-button type="primary" :disabled="updateLoading">
                  <el-icon><Plus />添加</el-icon></el-button
                >
              </el-upload>
            </el-form-item>
          </el-row>

          <el-row :gutter="20">
            <el-form-item label="类型:">
              <div v-if="dialogTitle == '添加文件'">
                <el-radio-group v-model="addData.fileType">
                  <el-radio-button label="img" value="img" />
                  <!-- <el-radio-button label="mp4" value="mp4" /> -->
                </el-radio-group>
              </div>
              <div v-else>{{ addData.fileType }}</div>
            </el-form-item>
          </el-row>

          <!---修改文件展示文件的内容-->
          <el-row :gutter="20" v-if="dialogTitle === '修改文件'">
            <el-form-item label="排序:"> <el-input v-model="addData.sort" /> </el-form-item>
          </el-row>

          <!---获取到图片对应的地址-->
          <el-row :gutter="20" v-if="dialogTitle === '修改文件'">
            <el-form-item label="图片:" v-if="imageList.length > 0">
              <div v-for="item in imageList">
                <img :src="item" class="w-[150px] h-[150px] cursor-pointer" />
              </div>
            </el-form-item>

            <el-form-item label="视频:" v-if="addData.fileType === 'mp4' && dialogTitle == '修改文件'">
              <video ref="videoPlayer" width="300" height="260" controls autoplay>
                <source :src="videoUrl" type="video/mp4" />
              </video>
            </el-form-item>
          </el-row>

          <el-row :gutter="20">
            <el-form-item label="图片:" v-if="addData.fileType === 'img' && dialogTitle == '添加文件'">
              <div style="min-height: 150px">
                <el-upload
                  :limit="20"
                  action="#"
                  :on-remove="handleImgRemove"
                  :on-change="handleImgChange"
                  v-model:file-list="fileImages"
                  :auto-upload="false"
                  :multiple="true"
                  list-type="picture-card">
                  <el-icon><Plus /></el-icon>
                </el-upload>
                <el-dialog>
                  <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
              </div>

              <div v-if="addData.fileType === 'mp4' && dialogTitle == '添加文件'" style="min-height: 180px">
                <el-dialog>
                  <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
              </div>
            </el-form-item>

            <el-form-item label="文件:" v-if="addData.fileType === 'mp4' && dialogTitle == '添加文件'">
              <div style="min-height: 150px">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="url"
                  :headers="uploadHeader"
                  :limit="1"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleChange"
                  :on-success="handleExceed"
                  :on-exceed="handleExceed">
                  <el-button type="primary" :disabled="updateLoading">选择附件</el-button>
                  (不超过50MB)
                </el-upload>
                <p class="ml-1">附件： {{ addData.fileName }}</p>
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <el-button class="mt-5 ml-90" type="primary" v-if="dialogTitle === '修改文件'" :disabled="updateLoading" @click="uploadFile()">修改</el-button>
      <el-button class="mt-5 ml-90" type="success" v-else :disabled="updateLoading" @click="uploadFile()">上传文件</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted, watchEffect } from 'vue'
import { listData, deleteById, addPPTFile, update, getFileById, listFileType } from '@/api/wx/ppt'
import SparkMD5 from 'spark-md5'
import { globalHeaders } from '@/utils/request'

const { proxy } = getCurrentInstance()

const list = ref([]) //文件数组
const loading = ref(true)
const updateLoading = ref(false)
const total = ref(0)
const dialogButton = ref(false)
const dialogTitle = ref('')
const addData = ref({})
const fileSize = ref(0)
const url = import.meta.env.VITE_APP_BASE_API + '/wx/upload/upload'
const uploadHeader = globalHeaders()

var fileTypeList = [
  {
    value: 'img'
  },
  {
    value: 'mp4'
  }
]

var sortList = [
  {
    label: '降序',
    value: '1'
  },
  {
    label: '升序',
    value: '-1'
  }
]

const pptTypeList = ref([])

const fileImages = ref([])
// 文件类型发变化，存储的文件图片集合清空
watchEffect(() => {
  console.log('fileType', addData.value.fileType)
  fileImages.value = []
})

// 分页查询
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    fileType: '',
    type: ''
  }
})
const { queryParams } = toRefs(data)

//获取数据
onMounted(() => {
  getFileTypeList()
  getList()
})

const getList = async () => {
  loading.value = true
  const res = await listData(queryParams.value)
  list.value = res.rows
  total.value = res.total
  loading.value = false
}

// 获取到链接跳转类型
const getFileTypeList = async () => {
  const res = await listFileType()
  pptTypeList.value = res.data
}

// 修改文件 查询出图片列表
const imageList = ref([])
const videoUrl = ref('')
const openAddUpdate = async (data) => {
  if (updateLoading.value) return proxy?.$modal.msgSuccess('请等待文件上传完成')
  addData.value = data
  dialogButton.value = true
  dialogTitle.value = '修改文件'
  fileSize.value = addData.value.size

  if (data.fileType === 'img') {
    const res = await getFileById(data.id)
    imageList.value = res.data.fileImages || []
  } else {
    videoUrl.value = import.meta.env.VITE_APP_BASE_API + '/wx/ppt/getMp4/' + addData.value.id
  }
}

// 添加按钮
const openAdd = () => {
  if (updateLoading.value) return proxy?.$modal.msgSuccess('请等待文件上传完成')
  dialogButton.value = true
  dialogTitle.value = '添加文件'
  addData.value = {}
  addData.value.fileType = 'img'
}
// 上传文件
async function addFile() {
  // if (!fileIsUpload.value && addData.value.fileType === 'mp4') {
  //   return proxy?.$modal.msgError('请先上传视频文件')
  // }

  // 文件设置为上传中
  updateLoading.value = true
  if (addData.value.fileType === 'mp4') {
    proxy?.$modal.msgSuccess('请等待文件上传')
  }

  setTimeout(async () => {
    const res = await addPPTFile(addData.value)
    res.code == 200 ? proxy?.$modal.msgSuccess('添加成功！') : proxy?.$modal.msgError('添加失败！')
    getList()
    addData.value = {}
    updateLoading.value = false
    dialogButton.value = false
  }, (addData.value.size / 1024 / 1024 / 5) * 3000)
}

// 修改文件
const updateFile = async () => {
  addData.value.fileImages = null
  const res = await update(addData.value)
  res.code == 200 ? proxy?.$modal.msgSuccess('修改成功！') : proxy?.$modal.msgError('修改失败！')

  setTimeout(() => {
    dialogButton.value = false
    addData.value = {}
    getList()
  }, 500)
}

// 添加或者修改文件
const uploadFile = async () => {
  if (updateLoading.value) return proxy?.$modal.msgSuccess('请等待文件上传完成')

  // 修改文件
  if (dialogTitle.value == '修改文件') {
    updateFile()
    return
  }
  addFile()
}

// 删除文件
const delFile = async (row) => {
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

// 封面文件上传到服务器中
const handleCover = async (file) => {
  let suffix = file.name.split('.')[1].toLowerCase()
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

// 文件变化
const handleImgChange = () => {
  var imgList = []
  setTimeout(() => {
    fileImages.value.forEach(async (item) => {
      const reader = new FileReader()
      reader.readAsDataURL(item.raw)
      reader.onload = async () => {
        imgList.push(reader.result)
      }
    })
  }, 500)

  addData.value.fileImages = imgList
}

const handleImgRemove = () => {}

const saveFile = ref(null)
const upload = ref()
const fileIsUpload = ref(false)
// 生成文件名称，文件类型，文件大小，文件md5信息，文件发生变化直接清除掉数据
const handleChange = async (file) => {
  fileIsUpload.value = false // 文件是否上传标志
  const list = file.name.split('.')
  const suffix = list[list.length - 1]

  if (suffix != 'mp4') {
    proxy?.$modal.msgError('请上传视频文件!')
    proxy.$refs.upload.clearFiles()
    return
  }
  fileIsUpload.value = true
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

const handleExceed = async (file) => {
  setTimeout(() => {
    upload.value.clearFiles() // 清除文件列表
    proxy.$nextTick(() => {
      upload.value.handleStart(file[0])
    })
  }, 500)
}
</script>
<style scoped></style>
