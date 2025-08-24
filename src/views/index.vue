<template>
  <div class="app-container">
    <div class="main-content">
      <!-- 英雄区域 -->
      <div class="hero-section">
        <h1 class="hero-title">风飞信息结算系统</h1>
        <p class="hero-subtitle">专业团队 · 高效交付 · 品质保证</p>
      </div>

      <div class="content-grid" :class="{ 'single-column': userStore.isDesigner === '1' }">
        <!-- 公告区域 -->
        <div class="notice-section">
          <h2 class="section-title">最新公告</h2>

          <el-card class="notice-card" v-if="noticeList.length > 0">
            <template #header>
              <div class="notice-header">
                <div class="card-header">
                  <div class="nav-button" :class="{ disabled: index <= 0 }" @click="index > 0 && handleIndex(-1)">
                    <svg-icon icon-class="1" />
                    上一条
                  </div>

                  <div class="notice-title">
                    {{ noticeList[index].noticeTitle || '暂无标题' }}
                  </div>

                  <div class="nav-button" :class="{ disabled: index >= noticeList.length - 1 }" @click="index < noticeList.length - 1 && handleIndex(1)">
                    下一条
                    <svg-icon icon-class="2" />
                  </div>
                </div>
              </div>
            </template>

            <div class="notice-content" v-html="noticeList[index].noticeContent || '暂无内容'"></div>

            <div class="notice-time">发布时间：{{ noticeList[index].createTime || '未知时间' }}</div>
          </el-card>

          <div v-else class="empty-state">
            <div class="empty-icon">📢</div>
            <div class="empty-text">暂无公告</div>
            <div class="empty-subtext">请稍后查看最新消息</div>
          </div>
        </div>

        <!-- 邀请码区域 -->
        <div v-if="userStore.isDesigner != '1'" class="invite-section">
          <h2 class="section-title">我的邀请码</h2>

          <el-card class="invite-card">
            <div class="invite-code">{{ code || '获取中...' }}</div>
            <div class="invite-description">分享您的专属邀请码，邀请更多用户加入我们的平台</div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue'
import { listNotice, getCode } from '@/api/notice'
import { useUserStore } from '@/store/modules/user'
import './index.css'

const userStore = useUserStore() // 用户状态管理
const router = useRouter() // 路由实例

const index = ref(0) // 当前公告索引
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

const noticeList = ref([]) // 公告列表
const code = ref('') // 邀请码

async function getList() {
  const res = await listNotice(queryParams.value) // 获取公告列表
  noticeList.value = res.rows || []

  if (userStore.isDesigner != '1') {
    const res = await getCode(userStore.name) // 获取邀请码
    code.value = res.msg || '--'
  }
}

function handleIndex(data) {
  index.value = index.value + data // 切换公告索引
}
</script>
