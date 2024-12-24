<template>
  <div class="p-1">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="p-2 flex flex-col search" v-loading="lbtLoading">
        <div class="flex ml-3 gap-3 p-2 items-center">
          <el-button type="primary" @click="editImg(1)">前移</el-button>
          <el-button type="primary" @click="editImg(-1)">后移</el-button>
          <el-button type="success" @click="saveImg()">保存</el-button>
          <el-button type="danger" @click="editImg(0)">删除</el-button>
          <div class="ml-5">轮播图</div>
        </div>
        <div class="flex flex-wrap gap-2 p-2 ml-3">
          <div v-for="(item, index) in lbtList" :key="index" class="flex items-center cursor-pointer">
            <img v-if="item.path" class="lbt" :id="'lbt' + index" :src="item.path" @click="selectImg(index)" />
            <img v-else class="lbt" src="../loading.png" />
            <div class="ml-2">-></div>
          </div>
          <div class="addLbt cursor-pointer flex justify-center items-center">
            <el-upload
              class="upload-demo"
              action="#"
              :show-file-list="false"
              :on-change="handleExceed"
              :http-request="handleExceed"
              :auto-upload="false"
              accept="image/*">
              +新增
            </el-upload>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getWxImg, addWXImg, updateImageList, delWxImg } from '@/api/wx/image'
const { proxy } = getCurrentInstance()

const lbtLoading = ref(false)
const lbtList = ref([])
const lbtIndex = ref(null)

onMounted(() => {
  getLBTData()
})

const getLBTData = async () => {
  lbtLoading.value = true
  const res = await getWxImg('轮播图')
  lbtList.value = res.data || []
  setTimeout(() => {
    lbtLoading.value = false
  }, 200)
}

// 选中轮播图
const selectImg = (index) => {
  if (lbtIndex.value === index) {
    document.getElementById('lbt' + lbtIndex.value).classList.remove('lbtBorder')
    lbtIndex.value = null
    return
  }
  if (lbtIndex.value != null) {
    document.getElementById('lbt' + lbtIndex.value).classList.remove('lbtBorder')
  }
  var newEle = document.getElementById('lbt' + index)
  newEle.classList.add('lbtBorder')
  lbtIndex.value = index
}

// 移动轮播图
const editImg = async (data) => {
  if (lbtIndex.value == null) {
    proxy?.$modal.msgError('请先选择图片!')
    return
  }
  // 删除
  if (data == 0) {
    await ElMessageBox.confirm('是否删除第 ' + (lbtIndex.value + 1) + ' 张轮播图片?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await delWxImg(lbtList.value[lbtIndex.value].id)

    setTimeout(() => {
      getLBTData()
      proxy?.$modal.msgSuccess('删除成功')
    }, 500)
    lbtIndex.value = null
    return
  }
  if (lbtIndex.value == 0 && data == 1) {
    proxy?.$modal.msgError('已经是第一张了!')
    return
  }
  if (lbtIndex.value == lbtList.value.length - 1 && data == -1) {
    proxy?.$modal.msgError('已经是最后一张了!')
    return
  }
  var temp = lbtList.value[lbtIndex.value]

  // 变换位置
  lbtList.value[lbtIndex.value] = lbtList.value[lbtIndex.value - data]
  lbtList.value[lbtIndex.value - data] = temp

  // 修改排序
  let sort = lbtList.value[lbtIndex.value].sort
  lbtList.value[lbtIndex.value].sort = lbtList.value[lbtIndex.value - data].sort
  lbtList.value[lbtIndex.value - data].sort = sort
  selectImg(lbtIndex.value - data)
}

const saveImg = async () => {
  lbtLoading.value = true
  lbtList.value.forEach((item) => {
    item.path = null
  })
  await updateImageList(lbtList.value)
  setTimeout(() => {
    getLBTData()
    proxy?.$modal.msgSuccess('保存成功！')
  }, 500)
}

// 文件上传到服务器中
const handleExceed = async (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = async () => {
    console.log(reader.result)
    await addWXImg({ type: '轮播图', path: reader.result }).then(() => {
      proxy?.$modal.msgSuccess('轮播图文件上传成功')
      getLBTData()
    })
  }
}
</script>
<style scoped>
.lbt {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
.lbt:hover {
  opacity: 0.9;
  border: 2px solid red;
}

.lbtBorder {
  opacity: 0.9;
  border: 2px solid red;
}

.addLbt {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-radius: 10px;
  background-color: #000;
}
</style>
