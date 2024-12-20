<template>
  <div class="p-1">
    <div class="p-2 flex flex-col search" v-loading="iconLoading">
      <div class="flex gap-3 ml-3 p-2 items-center">
        <el-button type="primary" @click="editIcon(1)">前移</el-button>
        <el-button type="primary" @click="editIcon(-1)">后移</el-button>
        <el-button type="warning" @click="updateIcon()">编辑</el-button>
        <el-button type="success" @click="saveIcon()">保存</el-button>
        <el-button type="danger" @click="editIcon(0)">删除</el-button>
        <div class="ml-5">图标列表</div>
      </div>
      <div class="flex flex-wrap gap-2 p-2 ml-3 w-[400px]">
        <div v-for="(item, index) in iconList" :key="index" class="flex flex-col gap-3 items-center">
          <img class="icon" :id="'icon' + index" :src="item.path" @click="selectIcon(index)" />
          <div>标题</div>
        </div>
        <div v-if="iconList.length < 8" class="addIcon cursor-pointer flex mt-1 justify-center items-center" @click="add()">
          <div>+新增</div>
        </div>
      </div>
    </div>
    <el-dialog v-model="update" title="修改图标" width="600px">
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
      <el-button type="primary" class="ml-10 mt-3" @click="saveIcon(iconIndex)">保存</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getWxImg, addWXImg, updateImageList } from '@/api/wx/image'
const { proxy } = getCurrentInstance()

const iconLoading = ref(false)

const iconList = ref([])
const iconIndex = ref(null)
const update = ref(false)
const updateData = ref({})

onMounted(() => {
  geticonData()
})

const updateIcon = async () => {
  if (iconIndex.value == null) {
    proxy?.$modal.msgError('请先选择图片!')
    return
  }
  updateData.value = iconList.value[iconIndex.value]
  update.value = true
}

const add = () => {
  updateData.value = { path: '', name: '' }
  update.value = true
}
const geticonData = async () => {
  iconLoading.value = true
  const res = await getWxImg('图标')
  // iconList.value = res.data || []
  iconList.value = [{ path: 'https://xuanjie22.oss-cn-beijing.aliyuncs.com/blog/ppt02638.png', name: '标题1' }]
  setTimeout(() => {
    iconLoading.value = false
  }, 200)
}

// 选中图标
const selectIcon = (index) => {
  if (iconIndex.value === index) {
    document.getElementById('icon' + iconIndex.value).classList.remove('iconBorder')
    iconIndex.value = null
    return
  }
  if (iconIndex.value != null) {
    document.getElementById('icon' + iconIndex.value).classList.remove('iconBorder')
  }
  var newEle = document.getElementById('icon' + index)
  newEle.classList.add('iconBorder')
  iconIndex.value = index
}

// 移动图标
const editIcon = async (data) => {
  if (iconIndex.value == null) {
    proxy?.$modal.msgError('请先选择图片!')
    return
  }
  if (data == 0) {
    await proxy?.$modal.confirm('是否删除第 ' + (iconIndex.value + 1) + ' 张图标片?')
    proxy?.$modal.msgSuccess('删除成功')
  }
  if (iconIndex.value == 0 && data == 1) {
    proxy?.$modal.msgError('已经是第一张了!')
    return
  }
  if (iconIndex.value == iconList.value.length - 1 && data == -1) {
    proxy?.$modal.msgError('已经是最后一张了!')
    return
  }
  var temp = iconList.value[iconIndex.value]

  // 变换位置
  iconList.value[iconIndex.value] = iconList.value[iconIndex.value - data]
  iconList.value[iconIndex.value - data] = temp

  // 修改排序
  let sort = iconList.value[iconIndex.value].sort
  iconList.value[iconIndex.value].sort = iconList.value[iconIndex.value - data].sort
  iconList.value[iconIndex.value - data].sort = sort
  selectIcon(iconIndex.value - data)
}

const saveIcon = async (data) => {
  if (data) {
    await updateImageList([updateData.value])
  } else {
    await updateImageList(iconList.value)
  }
  setTimeout(() => {
    geticonData()
    proxy?.$modal.msgSuccess('保存成功！')
  }, 500)
}

// 文件上传到服务器中
const handleExceed = async (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = async () => {
    console.log(reader.result)
    await addWXImg({ type: '图标', img: reader.result }).then(() => {
      proxy?.$modal.msgSuccess('图标文件上传成功')
      geticonData()
    })
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
