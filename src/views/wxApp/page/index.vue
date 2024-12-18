<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="p-5 flex flex-col" v-loading="carouselImgloading">
        <div>轮播图 -- 加载顺序由左至右</div>
        <div>展示所有的图片,点击图片进行替换</div>
        <div class="flex flex-wrap gap-2 p-2">
          <div v-for="(item, index) in lbtList" :key="index" class="flex items-center">
            <img class="img" :src="item.path" />
            <div class="imgInfo flex justify-center items-center">
              <el-button type="danger" @click="deleteImg()">删除</el-button>
            </div>
            <div class="ml-2">-></div>
          </div>
          <div class="addImage flex justify-center items-center">
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

/** 查询【请填写功能名称】列表 */
const getData = async () => {
  const res = await getWxImg('轮播图')
  lbtList.value = res.data || []
  console.log(lbtList.value)
}
// const addWXImg = async(() => {
//   // 添加图片
// })

// const addCarouselImg = async () => {
//   console.log('添加轮播图')
// }

// /** 表单重置 */
// const reset = () => {
//   form.value = { ...initFormData }
//   orderFormRef.value?.resetFields()
// }

// /** 搜索按钮操作 */
// const handleQuery = () => {
//   queryParams.value.pageNum = 1
//   getList()
// }

// /** 重置按钮操作 */
// const resetQuery = () => {
//   queryFormRef.value?.resetFields()
//   handleQuery()
// }

// /** 查看订单详细数据 */
// const handleView = async (row) => {
//   reset()
//   Object.assign(form.value, row)
//   dialog.visible = true
//   dialog.title = '查看订单详情'
// }
</script>
<style scoped>
.psInfo {
  padding: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.img {
  width: 200px;
  height: 200px;
}
.hover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  opacity: 0; /* 默认不显示 */
  transition: opacity 0.3s ease-in-out; /* 过渡效果 */
  background: red;
}

/* .img:hover .hover-image {
  opacity: 1;
  width: 100px;
  height: 100px;
  background: red;
} */

.imgInfo:hover {
  opacity: 0.9;
  /* width: 200px;
  height: 200px; */
}
.addImage {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.imgCard {
  width: 100%;
  height: 100%;
}
.imgInfo {
  width: 200px;
  height: 200px;
  position: relative;
  margin-left: -200px;
  background: rgb(139, 138, 138);
  z-index: 1000;
  opacity: 0;
}
</style>
