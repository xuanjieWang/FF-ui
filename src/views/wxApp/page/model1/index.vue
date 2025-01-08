<template>
  <div class="page">
    <div class="flex items-center">
      <div class="flex w-[800px] flex-col" v-loading="loading">
        <div class="ml-5 text-2xl w-[309px] mt-3 gap-3 flex">
          <el-form-item label="标题:">
            <el-input v-model="text.pptType" placeholder="请输入标题" />
          </el-form-item>
          <el-button type="success" @click="edit('updateText')">保存</el-button>
        </div>
        <div class="flex gap-3 ml-5 items-center">
          <el-button type="primary" @click="edit(1)">前移</el-button>
          <el-button type="primary" @click="edit(-1)">后移</el-button>
          <el-button type="warning" @click="update()">编辑</el-button>
          <el-button type="success" @click="save('update')">保存</el-button>
          <el-button type="danger" @click="edit('delete')">删除</el-button>
        </div>
        <div class="flex flex-wrap gap-2 p-2 ml-3">
          <div v-for="(item, index) in list" :key="index" class="flex items-center cursor-pointer">
            <img v-if="item.path" class="img" :id="'img1' + index" :src="item.path" @click="selectImg(index)" />
            <img v-else class="img" src="../loading.png" />
            <div v-if="index < 2" class="ml-2">-></div>
          </div>
          <div v-if="list.length < 3" class="addIcon cursor-pointer flex mt-1 justify-center items-center" @click="add()">
            <div>+新增</div>
          </div>
        </div>
      </div>
      <div>
        <img src="./model1.png" style="width: 300px; height: 150px" />
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
      <el-form-item label="链接跳转类别:">
        <el-input v-model="updateData.pptType" placeholder="请输入PPT类别" />
      </el-form-item>
      <el-button type="primary" class="ml-10 mt-3" @click="save(selectIndex)">保存</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getWxImg, addWXImg, updateImageList, delWxImg } from '@/api/wx/image'
const { proxy } = getCurrentInstance()

const text = ref({})

const loading = ref(false)
const list = ref([])
const selectIndex = ref(null)
const updateData = ref({})
const dialogTitle = ref('')
const updateButton = ref(false)

onMounted(() => {
  getData()
})

const getData = async () => {
  loading.value = true
  const res = await getWxImg('model1')
  list.value = res.data || []
  text.value = list.value[0]
  list.value.splice(0, 1)

  setTimeout(() => {
    loading.value = false
  }, 200)
}

const add = () => {
  // 取消选中图标
  if (selectIndex.value != null) {
    document.getElementById('img1' + selectIndex.value).classList.remove('imageBorder')
    selectIndex.value = null
  }
  dialogTitle.value = '新增模块一图片'
  updateData.value = { path: '', name: '', type: 'model1' }
  updateButton.value = true
}

// 选中图片
const selectImg = (index) => {
  if (selectIndex.value === index) {
    document.getElementById('img1' + selectIndex.value).classList.remove('imageBorder')
    selectIndex.value = null
    return
  }
  if (selectIndex.value != null) {
    document.getElementById('img1' + selectIndex.value).classList.remove('imageBorder')
  }
  var newEle = document.getElementById('img1' + index)
  newEle.classList.add('imageBorder')
  selectIndex.value = index
}
// 更新图标信息
const update = async () => {
  if (selectIndex.value == null) {
    proxy?.$modal.msgError('请先选择图片!')
    return
  }
  dialogTitle.value = '修改模块一图片信息'
  updateData.value = list.value[selectIndex.value]
  updateButton.value = true
}

// 移动轮播图
const edit = async (data) => {
  if (data == 'updateText') {
    await updateImageList([text.value])

    setTimeout(() => {
      getData()
      proxy?.$modal.msgSuccess('修改标题成功！')
    }, 500)
    return
  }

  if (selectIndex.value == null) {
    proxy?.$modal.msgError('请先选择图片!')
    return
  }
  if (data == 'delete') {
    await ElMessageBox.confirm('是否删除模块1第 ' + (selectIndex.value + 1) + ' 张图片?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await delWxImg(list.value[selectIndex.value].id)

    setTimeout(() => {
      getData()
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
  selectImg(selectIndex.value - data)
}

const save = async (data) => {
  let info = ''
  loading.value = true

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
    getData()
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
.img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
.img:hover {
  opacity: 0.5;
}

.imageBorder {
  opacity: 0.9;
  border: 4px solid red;
}

.addImage {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-radius: 10px;
  background-color: #f5f5f5;
}
.page {
  width: 100%;
  height: 100%;
  border: 1px solid #696767;
  border-radius: 10px;
  margin: 0px 10px 10px 10px;
  background: #1d1e1f;
}
.addIcon {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-radius: 10px;
  background-color: #000000;
}
</style>
