<template>
  <div class="transaction-analysis">
    <!-- 时间维度选择器 -->
    <div class="time-selector">
      <el-radio-group v-model="timeDimension" @change="handleDimensionChange">
        <el-radio-button label="day">当天</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="year">本年</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="loadData" :loading="loading">
        <el-icon><Refresh /></el-icon>
        刷新数据
      </el-button>
    </div>

    <!-- 数据概览卡片 -->
    <div class="overview-cards">
      <div class="card">
        <div class="card-header">
          <span class="card-title">交易金额</span>
          <el-icon class="card-icon transaction"><Money /></el-icon>
        </div>
        <div class="card-value">¥{{ overviewData.transactionAmount }}</div>
        <div class="card-trend" :class="getTrendClass(overviewData.transactionTrend)">
          <el-icon><ArrowUp v-if="overviewData.transactionTrend > 0" /><ArrowDown v-else /></el-icon>
          {{ Math.abs(overviewData.transactionTrend) }}%
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">提现金额</span>
          <el-icon class="card-icon withdraw"><CreditCard /></el-icon>
        </div>
        <div class="card-value">¥{{ formatAmount(overviewData.withdrawAmount) }}</div>
        <div class="card-trend" :class="getTrendClass(overviewData.withdrawTrend)">
          <el-icon><ArrowUp v-if="overviewData.withdrawTrend > 0" /><ArrowDown v-else /></el-icon>
          {{ Math.abs(overviewData.withdrawTrend) }}%
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">用户余额</span>
          <el-icon class="card-icon balance"><Wallet /></el-icon>
        </div>
        <div class="card-value">¥{{ formatAmount(overviewData.userBalance) }}</div>
        <div class="card-trend" :class="getTrendClass(overviewData.balanceTrend)">
          <el-icon><ArrowUp v-if="overviewData.balanceTrend > 0" /><ArrowDown v-else /></el-icon>
          {{ Math.abs(overviewData.balanceTrend) }}%
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <!-- 交易趋势图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>交易趋势分析</h3>
          <el-select v-model="chartType" @change="updateChart" style="width: 120px">
            <el-option label="折线图" value="line"></el-option>
            <el-option label="柱状图" value="bar"></el-option>
            <el-option label="面积图" value="area"></el-option>
          </el-select>
        </div>
        <div ref="trendChart" class="chart" style="height: 400px"></div>
      </div>

      <!-- 数据分布饼图 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>数据分布</h3>
        </div>
        <div ref="pieChart" class="chart" style="height: 400px"></div>
      </div>
    </div>

    <!-- 详细数据表格 -->
    <div class="data-table">
      <div class="table-header">
        <h3>详细数据</h3>
        <el-button type="success" @click="exportData">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
      </div>
      <el-table :data="tableDisplayData" stripe style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="sjsName" label="姓名"></el-table-column>
        <el-table-column prop="money" label="金额"></el-table-column>
        <el-table-column prop="orderType" label="订单号"></el-table-column>
        <el-table-column prop="orderTitle" label="类型"></el-table-column>
        <el-table-column prop="createTime" label="订单创建时间"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="dataList.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getTransactionAnalysis } from '@/api/transaction'
import { ElMessage } from 'element-plus'
import './index.css'
// 响应式数据
const timeDimension = ref('week') // 时间维度
const loading = ref(false) // 加载状态
const tableLoading = ref(false) // 表格加载状态
const chartType = ref('line') // 图表类型
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页条数

const tableDisplayData = ref([]) // 表格显示数据

// 图表实例
const trendChart = ref(null) // 趋势图表引用
const pieChart = ref(null) // 饼图引用
let trendChartInstance = null // 趋势图表实例
let pieChartInstance = null // 饼图表实例

// 数据
const overviewData = reactive({
  transactionAmount: 0, // 交易金额
  withdrawAmount: 0, // 提现金额
  userBalance: 0, // 用户余额
  transactionTrend: 0, // 交易趋势
  withdrawTrend: 0, // 提现趋势
  balanceTrend: 0, // 余额趋势
  transactionCount: 0
})

const chartData = ref([]) // 图表数据

// 方法
const formatAmount = (amount) => {
  if (!amount) return '0.00'
  return Number(amount).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getTrendClass = (trend) => {
  return trend > 0 ? 'trend-up' : 'trend-down'
}

const handleDimensionChange = (dimension) => {
  timeDimension.value = dimension
  loadData()
}

const dataList = ref([])
const loadData = async () => {
  overviewData.transactionAmount = 0
  overviewData.withdrawAmount = 0
  overviewData.userBalance = 0
  overviewData.transactionTrend = 0
  overviewData.withdrawTrend = 0
  overviewData.balanceTrend = 0
  overviewData.transactionCount = 0

  loading.value = true
  const res = await getTransactionAnalysis(timeDimension.value)
  dataList.value = res.data || []

  dataList.value.forEach((item) => {
    overviewData.transactionAmount += Number(item.money)
    overviewData.transactionCount += 1
  })

  // 重置到第一页并更新表格显示
  currentPage.value = 1
  updateTable()

  // 更新图表
  await nextTick()
  updateChart()
  updatePieChart()

  loading.value = false
}

const updateChart = () => {
  if (!trendChartInstance) return

  const option = {
    title: {
      text: '交易数据趋势',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['交易金额', '提现金额', '用户余额'],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.map((item) => item.date)
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [
      {
        name: '交易金额',
        type: chartType.value === 'area' ? 'line' : chartType.value,
        data: chartData.value.map((item) => item.transactionAmount),
        smooth: true,
        areaStyle: chartType.value === 'area' ? {} : null,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '提现金额',
        type: chartType.value === 'area' ? 'line' : chartType.value,
        data: chartData.value.map((item) => item.withdrawAmount),
        smooth: true,
        areaStyle: chartType.value === 'area' ? {} : null,
        itemStyle: {
          color: '#67C23A'
        }
      },
      {
        name: '用户余额',
        type: chartType.value === 'area' ? 'line' : chartType.value,
        data: chartData.value.map((item) => item.userBalance),
        smooth: true,
        areaStyle: chartType.value === 'area' ? {} : null,
        itemStyle: {
          color: '#E6A23C'
        }
      }
    ]
  }

  trendChartInstance.setOption(option)
}

const updatePieChart = () => {
  if (!pieChartInstance || !overviewData.transactionAmount) return

  const option = {
    title: {
      text: '资金分布',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [
      {
        name: '资金分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: [
          {
            value: overviewData.transactionAmount,
            name: '交易金额',
            itemStyle: { color: '#409EFF' }
          },
          {
            value: overviewData.withdrawAmount,
            name: '提现金额',
            itemStyle: { color: '#67C23A' }
          },
          {
            value: overviewData.userBalance,
            name: '用户余额',
            itemStyle: { color: '#E6A23C' }
          }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  pieChartInstance.setOption(option)
}

const handleSizeChange = (size) => {
  pageSize.value = size
  updateTable()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  updateTable()
}

const updateTable = () => {
  const start = (currentPage.value - 1) * pageSize.value // 起始索引
  const end = start + pageSize.value // 结束索引
  tableDisplayData.value = dataList.value.slice(start, end) // 当前页显示的数据
}

const exportData = () => {
  ElMessage.success('数据导出功能开发中')
}

// 初始化图表
const initCharts = () => {
  if (trendChart.value) {
    trendChartInstance = echarts.init(trendChart.value)
  }
  if (pieChart.value) {
    pieChartInstance = echarts.init(pieChart.value)
  }

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    trendChartInstance?.resize()
    pieChartInstance?.resize()
  })
}

// 生命周期
onMounted(async () => {
  await nextTick()
  initCharts()
  loadData()
})
</script>
