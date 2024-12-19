<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="p-5 flex flex-col search" v-loading="carouselImgloading">
        <div class="ml-5">轮播图-播放顺序由左至右&nbsp;&nbsp;(&nbsp;点击图片选中移动&nbsp;)&nbsp;&nbsp;</div>
        <div class="flex gap-3 p-5 items-center">
          <el-button type="primary" @click="editImg(1)">前移</el-button>
          <el-button type="primary" @click="editImg(-1)">后移</el-button>
          <el-button type="success" @click="saveImg()">保存</el-button>
          <el-button type="danger" @click="editImg(0)">删除</el-button>
        </div>
        <div class="flex flex-wrap gap-2 p-2 ml-3">
          <div v-for="(item, index) in lbtList" :key="index" class="flex items-center">
            <img class="img" :id="'carouseImg' + index" :src="item.path" @click="selectImg(index)" />
            <div class="ml-2">-></div>
          </div>
          <div class="addImage flex justify-center items-center" @click="addCarouselImg()">
            <p>点击添加</p>
          </div>
        </div>
      </div>
    </transition>
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" style="padding: 10px; disabled: flex; flex-direction: column">
        <div>icon区域</div>
        <div>列表展示所有的数据，点击修改图标，文字，ppt类型</div>
      </div>
    </transition>
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" style="padding: 10px; disabled: flex; flex-direction: column">
        <div>下方区域1</div>
        <div>点击修改标题</div>
        <div>列表展示所有的数据，点击修改图片,ppt类型</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { getWxImg, addWXImg } from '@/api/wx/image'
const { proxy } = getCurrentInstance()
import { useUserStore } from '@/store/modules/user'
import Index from '@/views/login/index.vue'
const userStore = useUserStore()
const { the_ppt_region } = toRefs(proxy?.useDict('the_ppt_region'))

const carouselImgloading = ref(false)

const initFormData = {}
const data = reactive({
  form: { ...initFormData },
  queryParams: {
    type: ''
  }
})
const lbtList = ref([])

const { queryParams, form } = toRefs(data)
onMounted(() => {
  getData()
})

const getData = async () => {
  carouselImgloading.value = true
  const res = await getWxImg('轮播图')
  lbtList.value = res.data || []
  carouselImgloading.value = false
}

const addCarouselImg = async () => {
  console.log('添加轮播图')
}
const selectIndex = ref(null)
// 选中轮播图
const selectImg = (index) => {
  if (selectIndex.value === index) {
    document.getElementById('carouseImg' + selectIndex.value).classList.remove('imgBorder')
    selectIndex.value = null
    return
  }
  if (selectIndex.value != null) {
    document.getElementById('carouseImg' + selectIndex.value).classList.remove('imgBorder')
  }
  var newEle = document.getElementById('carouseImg' + index)
  newEle.classList.add('imgBorder')
  selectIndex.value = index
}

// 移动轮播图
const editImg = async (data) => {
  if (selectIndex.value == null) {
    proxy?.$modal.msgError('请先选择图片!')
    return
  }
  if (data == 0) {
    await proxy?.$modal.confirm('是否删除第 ' + (selectIndex.value + 1) + ' 张轮播图片?')
    proxy?.$modal.msgSuccess('删除成功')
  }
  if (selectIndex.value == 0 && data == 1) {
    proxy?.$modal.msgError('已经是第一张了!')
    return
  }
  if (selectIndex.value == lbtList.value.length - 1 && data == -1) {
    proxy?.$modal.msgError('已经是最后一张了!')
    return
  }
  console.log(selectIndex.value)

  var temp = lbtList.value[selectIndex.value]
  console.log(temp)
  console.log(temp.sort)

  lbtList.value[selectIndex.value] = lbtList.value[selectIndex.value - data]
  lbtList.value[selectIndex.value - data] = temp

  // lbtList.value[selectIndex.value - data].sort = lbtList.value[selectIndex.value].sort
  // lbtList.value[selectIndex.value].sort = temp.sort
  selectImg(selectIndex.value - data)
  console.log(lbtList.value)
}
</script>
<style scoped>
.psInfo {
  padding: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.img {
  width: 150px;
  height: 150px;
  border-radius: 10px;
}
/* .img:hover {
  opacity: 0.9;
  border: 5px solid red;
} */

.imgBorder {
  opacity: 0.9;
  border: 5px solid red;
}

.addImage {
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
