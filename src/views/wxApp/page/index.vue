<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" style="padding: 10px; disabled: flex; flex-direction: column" v-loading="carouselImgloading">
        <div>轮播图 -- 加载顺序由左至右</div>
        <div class="carouselImg"></div>
        <div>展示所有的图片,点击图片进行替换</div>
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
import { listOrder, getOrder } from '@/api/order'
import { getWxImg } from '@/api/wx/image'
const { proxy } = getCurrentInstance()
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const { the_ppt_region } = toRefs(proxy?.useDict('the_ppt_region'))

const carouselImgloading = ref(false)

const orderList = ref([])
const loading = ref(true)
const total = ref(0)

const queryFormRef = ref()
const orderFormRef = ref()

const dialog = reactive({
  visible: false,
  title: ''
})

const initFormData = {}
const data = reactive({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sjsPhone: '',
    deptName: ''
  }
})

const { queryParams, form } = toRefs(data)
onMounted(() => {
  getData()
})

/** 查询【请填写功能名称】列表 */
const getData = async () => {
  loading.value = true
  queryParams.value.deptName = userStore.deptName
  queryParams.value.sjsPhone = userStore.name
  const res = await listOrder(queryParams.value)
  orderList.value = res.rows
  total.value = res.total
  loading.value = false
}

const addCarouselImg = async () => {
  console.log('添加轮播图')
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData }
  orderFormRef.value?.resetFields()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 查看订单详细数据 */
const handleView = async (row) => {
  reset()
  Object.assign(form.value, row)
  dialog.visible = true
  dialog.title = '查看订单详情'
}
</script>
<style scoped>
.psInfo {
  padding: 5px;
  display: flex;
  flex-direction: column;
}
.carouselImg {
  padding: 20px;
}
</style>
