<template>
  <div class="app-container">
    <div style="display: flex">
      <div class="info">
        <h1 style="text-align: center">简介</h1>
        <text
          >本项目是一款面向设计师的计算系统，旨在提升客服工作效率，为设计师提供便捷的服务，通过结合先进的技术手段，打造一个功能完善、性能优越、易于操作的软件系统。以下是本项目的简要介绍：<br />
          1、项目名称：风飞结算系统 <br />2、项目类型：Web应用<br />
        </text>
      </div>
      <div class="notice">
        <h1>公告</h1>
        <el-card style="max-width: 100%" v-if="noticeList.length > 0">
          <template #header>
            <div class="card-header">
              <div v-if="index > 0" @click="handleIndex(-1)">
                <svg-icon icon-class="1" />
                上一条
              </div>
              <div v-else></div>
              <span>{{ noticeList[index].noticeTitle || '--' }}</span>
              <div v-if="index < noticeList.length - 1" @click="handleIndex(1)">
                下一条
                <svg-icon icon-class="2" />
              </div>
              <div v-else></div>
            </div>
          </template>
          <div v-html="noticeList[index].noticeContent || '--'"></div>
          <div style="margin-top: 50px">发布时间： {{ noticeList[index].createTime || '--' }}</div>
        </el-card>

        <div v-if="userStore.deptName != '设计师部门'" style="display: flex; margin-top: 50px">
          <div class="card">
            <h2>邀请码</h2>
            <el-card>
              <div style="font-size: 30px; margin-top: 20px">{{ code }}</div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs, watch } from 'vue'
import { listNotice, getCode } from '@/api/notice'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
const router = useRouter()

const index = ref(0)
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
})
const { queryParams } = toRefs(data)

onMounted(async () => {
  if ('注册中' === userStore.regisStatus) {
    await router.push('/information')
  } else if ('审核中' === userStore.regisStatus) {
    await router.push('/auditing')
  } else if ('审核不通过' === userStore.regisStatus) {
    await router.push('/reject')
  }
  getList()
})

const noticeList = ref([])
const code = ref('')
async function getList() {
  const res = await listNotice(queryParams.value)
  noticeList.value = res.rows || []

  // 获取当前用户的邀请码
  if (userStore.deptName != '设计师部门') {
    const res = await getCode(userStore.name)
    code.value = res.msg || '--'
  }
}

function handleIndex(data) {
  index.value = index.value + data
}
</script>

<style scoped lang="scss">
.info {
  width: 100%;
  padding: 10px;
  // text-align: center;
  padding: 10px;
}
.notice {
  width: 100%;
  text-align: center;
  padding: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
.card-header > div {
  width: 100px;
}
.card {
  width: 50%;
  padding: 10px;
}
</style>
