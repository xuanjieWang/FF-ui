<template>
  <div class="page">
    <div class="flex items-center">
      <div class="flex flex-col w-[800px]" v-loading="loading">
        <div class="flex gap-3 ml-3 p-2 items-center">
          <el-button type="danger" @click="editIcon()">删除</el-button>
        </div>
        <div class="flex flex-wrap gap-2 ml-5 w-[1000px]">
          <div v-for="(item, index) in list" :key="index" class="flex flex-col gap-1 items-center">
            <img :src="item.path" class="w-[120px] h-[120px]" />
          </div>
          <div v-if="list.length < 1" class="addIcon cursor-pointer flex mt-1 justify-center items-center" @click="add()">
            <div>+添加</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="updateButton" title="新增客服链接" width="600px">
      <el-form-item label="客服二维码:">
        <img class="w-[120px] h-[120px] cursor-pointer" :src="updateData.path" />
        <el-upload
          class="upload-demo ml-5"
          action="#"
          :show-file-list="false"
          :on-change="handleExceed"
          :http-request="handleExceed"
          :auto-upload="false"
          accept="image/*">
          <el-button type="success">
            <el-icon><Plus /></el-icon>上传图片</el-button
          >
        </el-upload>
      </el-form-item>
      <el-button type="primary" class="ml-10 mt-3" @click="saveIcon()">添加</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getWxImg, addWXImg, delWxImg } from '@/api/wx/image'
const { proxy } = getCurrentInstance()

const loading = ref(false) // loading
const list = ref([]) // icon列表

onMounted(() => {
  getIconList()
})

const getIconList = async () => {
  loading.value = true
  const res = await getWxImg('kf')
  list.value = res.data || []
  setTimeout(() => {
    loading.value = false
  }, 200)
}
const editIcon = async () => {
  await ElMessageBox.confirm('是否删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  delWxImg(list.value[0].id)
  setTimeout(() => {
    getIconList()
  }, 1000)
}

const updateButton = ref(false)
const updateData = ref(null)
const add = () => {
  updateData.value = { path: '', type: 'kf' }
  updateButton.value = true
}

const saveIcon = async () => {
  let info = '添加二维码成功！'
  await addWXImg(updateData.value)
  updateButton.value = false

  setTimeout(() => {
    getIconList()
    proxy?.$modal.msgSuccess(info)
  }, 500)
}

// 文件上传到服务器中
const handleExceed = async (file) => {
  const suffix = file.name.split('.')[1]
  if (suffix != 'jpg' && suffix != 'png') {
    proxy?.$modal.msgError('请上传jpg/png文件')
    return
  }
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = async () => {
    updateData.value.path = reader.result
  }
}
</script>
<style scoped>
.icon {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}
.icon:hover {
  opacity: 0.5;
}

.iconBorder {
  opacity: 0.9;
  border: 3px solid red;
}

.addIcon {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-radius: 10px;
  background-color: #ffffff;
}
.page {
  width: 100%;
  height: 100%;
  border: 1px solid #696767;
  border-radius: 10px;
  margin: 0px 10px 10px 10px;
  background: #ffffff;
}
</style>
