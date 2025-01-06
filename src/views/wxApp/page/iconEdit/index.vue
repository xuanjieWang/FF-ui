<template>
  <div class="page">
    <div class="flex items-center">
      <div class="flex flex-col w-[800px]" v-loading="loading">
        <div class="flex gap-3 ml-3 p-2 items-center">
          <el-button type="primary" @click="editIcon(1)">前移</el-button>
          <el-button type="primary" @click="editIcon(-1)">后移</el-button>
          <el-button type="warning" @click="updateIcon()">编辑</el-button>
          <el-button type="success" @click="saveIcon('update')">保存</el-button>
          <el-button type="danger" @click="editIcon(0)">删除</el-button>
        </div>
        <div class="flex flex-wrap gap-2 ml-5 w-[400px]">
          <div v-for="(item, index) in list" :key="index" class="flex flex-col gap-1 items-center">
            <img v-if="item.path" class="icon" :id="'icon' + index" :src="item.path" @click="selectIcon(index)" />
            <img v-else class="icon" src="../loading.png" />
            <div>{{ item.pptType }}</div>
          </div>
          <div v-if="list.length < 8" class="addIcon cursor-pointer flex mt-1 justify-center items-center" @click="add()">
            <div>+新增</div>
          </div>
        </div>
      </div>
      <div>
        <img src="./icon.png" style="width: 300px; height: 150px" />
      </div>
    </div>

    <el-dialog v-model="updateButton" :title="dialogTitle" width="600px">
      <el-form-item label="图片:">
        <img class="w-[100px] h-[100px] cursor-pointer" :src="updateData.path" />
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
      <el-form-item label="名称:">
        <el-input v-model="updateData.pptType" placeholder="请输入图标名称(及PPT类别)" />
      </el-form-item>
      <el-button type="primary" class="ml-10 mt-3" @click="saveIcon(selectIndex)">保存</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getWxImg, addWXImg, updateImageList, delWxImg } from '@/api/wx/image'
const { proxy } = getCurrentInstance()

const loading = ref(false) // loading
const list = ref([]) // icon列表
const selectIndex = ref(null) // 选中的索引
const dialogTitle = ref('')

onMounted(() => {
  getIconList()
})

const getIconList = async () => {
  loading.value = true
  const res = await getWxImg('icon')
  list.value = res.data || []
  setTimeout(() => {
    loading.value = false
  }, 200)
}

const updateButton = ref(false)
const updateData = ref(null)
// 更新图标信息
const updateIcon = async () => {
  if (selectIndex.value == null) {
    proxy?.$modal.msgError('请先选择图片!')
    return
  }
  dialogTitle.value = '修改图标'
  updateData.value = list.value[selectIndex.value]
  updateButton.value = true
}

const add = () => {
  // 取消选中图标
  if (selectIndex.value != null) {
    document.getElementById('icon' + selectIndex.value).classList.remove('iconBorder')
    selectIndex.value = null
  }
  dialogTitle.value = '新增图标'
  updateData.value = { path: '', pptType: '', type: 'icon' }
  updateButton.value = true
}

// 选中图标
const selectIcon = (index) => {
  if (selectIndex.value === index) {
    document.getElementById('icon' + selectIndex.value).classList.remove('iconBorder')
    selectIndex.value = null
    return
  }
  if (selectIndex.value != null) {
    document.getElementById('icon' + selectIndex.value).classList.remove('iconBorder')
  }
  var newEle = document.getElementById('icon' + index)
  newEle.classList.add('iconBorder')
  selectIndex.value = index
}

// 移动图标
const editIcon = async (data) => {
  if (selectIndex.value == null) {
    proxy?.$modal.msgError('请先选择图片!')
    return
  }
  if (data == 0) {
    await ElMessageBox.confirm('是否删除第 ' + (selectIndex.value + 1) + ' 项数据?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await delWxImg(list.value[selectIndex.value].id)

    setTimeout(() => {
      getIconList()
      proxy?.$modal.msgSuccess('删除成功')
    }, 500)
    selectIndex.value = null
    return
  }
  if (selectIndex.value == 0 && data == 1) {
    proxy?.$modal.msgError('已经是第一张了!')
    return
  }
  if (selectIndex.value == list.value.length - 1 && data == -1) {
    proxy?.$modal.msgError('已经是最后一张了!')
    return
  }
  var temp = list.value[selectIndex.value]

  // 变换位置
  list.value[selectIndex.value] = list.value[selectIndex.value - data]
  list.value[selectIndex.value - data] = temp

  // 修改排序
  let sort = list.value[selectIndex.value].sort
  list.value[selectIndex.value].sort = list.value[selectIndex.value - data].sort
  list.value[selectIndex.value - data].sort = sort
  selectIcon(selectIndex.value - data)
}

// 新增或者是位置信息更新
const saveIcon = async (data) => {
  let info = ''
  if ('update' == data) {
    info = '修改图片排序成功！'
    await updateImageList(list.value)
  } else if (selectIndex.value == null) {
    info = '新增数据成功'
    await addWXImg(updateData.value)
  } else {
    info = '编辑数据成功'
    await updateImageList([updateData.value])
  }

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
  width: 80px;
  height: 80px;
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
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-radius: 10px;
  background-color: #000000;
}
.page {
  width: 100%;
  height: 100%;
  border: 1px solid #696767;
  border-radius: 10px;
  margin: 0px 10px 10px 10px;
  background: #1d1e1f;
}
</style>
