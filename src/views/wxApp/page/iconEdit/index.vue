<template>
  <div class="p-1">
    <div class="p-2 flex flex-col search" v-loading="loading">
      <div class="flex gap-3 ml-3 p-2 items-center">
        <el-button type="primary" @click="editIcon(1)">前移</el-button>
        <el-button type="primary" @click="editIcon(-1)">后移</el-button>
        <el-button type="warning" @click="updateIcon()">编辑</el-button>
        <el-button type="success" @click="saveIcon('update')">保存</el-button>
        <el-button type="danger" @click="editIcon(0)">删除</el-button>
        <div class="ml-5">图标列表</div>
      </div>
      <div class="flex flex-wrap gap-2 p-2 ml-3 w-[400px]">
        <div v-for="(item, index) in list" :key="index" class="flex flex-col gap-3 items-center">
          <img class="icon" :id="'icon' + index" :src="item.path" @click="selectIcon(index)" />
          <div>{{ item.name }}</div>
        </div>
        <div v-if="list.length < 8" class="addIcon cursor-pointer flex mt-1 justify-center items-center" @click="add()">
          <div>+新增</div>
        </div>
      </div>
    </div>
    <el-dialog v-model="updateButton" title="修改图标" width="600px">
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
        <el-input v-model="updateData.name" placeholder="请输入图标名称" />
      </el-form-item>
      <el-button type="primary" class="ml-10 mt-3" @click="saveIcon(selectIndex)">保存</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getWxImg, addWXImg, updateImageList } from '@/api/wx/image'
const { proxy } = getCurrentInstance()

const loading = ref(false) // loading
const list = ref([]) // icon列表
const selectIndex = ref(null) // 选中的索引

onMounted(() => {
  getIconList()
})

const getIconList = async () => {
  loading.value = true
  const res = await getWxImg('图标')
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
  updateData.value = list.value[selectIndex.value]
  updateButton.value = true
}

const add = () => {
  // 取消选中图标
  if (selectIndex.value != null) {
    document.getElementById('icon' + selectIndex.value).classList.remove('iconBorder')
    selectIndex.value = null
  }

  updateData.value = { path: '', name: '', type: '图标' }
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
    await proxy?.$modal.confirm('是否删除第 ' + (selectIndex.value + 1) + ' 张图标片?')
    proxy?.$modal.msgSuccess('删除成功')
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

  setTimeout(() => {
    getIconList()
    proxy?.$modal.msgSuccess(info)
  }, 500)
}

// 文件上传到服务器中
const handleExceed = async (file) => {
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
  opacity: 0.9;
  border: 2px solid red;
}

.iconBorder {
  opacity: 0.9;
  border: 2px solid red;
}

.addIcon {
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-radius: 10px;
  background-color: #000000;
}
</style>
