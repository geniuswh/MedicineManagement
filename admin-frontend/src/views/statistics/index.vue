<template>
  <div class="statistics-page">
    <div class="page-header">
      <h1 class="page-title">数据统计</h1>
      <p class="page-desc">出入库数据分析与统计报表</p>
    </div>

    <!-- 时间选择 -->
    <div class="content-card">
      <el-radio-group v-model="period" @change="loadStatistics">
        <el-radio-button label="today">今日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="year">本年</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%)">
            <el-icon><Download /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.inboundCount }}</div>
            <div class="stat-label">入库次数</div>
            <div class="stat-amount">¥{{ stats.inboundAmount }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)">
            <el-icon><Upload /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.outboundCount }}</div>
            <div class="stat-label">出库次数</div>
            <div class="stat-amount">¥{{ stats.outboundAmount }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #722ed1 0%, #9254de 100%)">
            <el-icon><Box /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalProducts }}</div>
            <div class="stat-label">产品种类</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">¥{{ totalAmount }}</div>
            <div class="stat-label">总金额</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="16">
      <el-col :span="16">
        <div class="content-card">
          <h3 class="card-title">出入库趋势</h3>
          <div class="chart-container" ref="trendChartRef"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="content-card">
          <h3 class="card-title">品类分布</h3>
          <div class="chart-container" ref="pieChartRef"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 排行榜 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <div class="content-card">
          <h3 class="card-title">入库排行 TOP 5</h3>
          <el-table :data="inboundRank" size="small">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="产品" />
            <el-table-column prop="count" label="次数" width="80" />
            <el-table-column prop="quantity" label="数量" width="80" />
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="content-card">
          <h3 class="card-title">出库排行 TOP 5</h3>
          <el-table :data="outboundRank" size="small">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="产品" />
            <el-table-column prop="count" label="次数" width="80" />
            <el-table-column prop="quantity" label="数量" width="80" />
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'

const period = ref('month')
const trendChartRef = ref(null)
const pieChartRef = ref(null)

const stats = reactive({
  inboundCount: 0,
  inboundAmount: '0',
  outboundCount: 0,
  outboundAmount: '0',
  totalProducts: 0
})

const totalAmount = computed(() => {
  return (parseFloat(stats.inboundAmount) + parseFloat(stats.outboundAmount)).toLocaleString()
})

const inboundRank = ref([])
const outboundRank = ref([])

onMounted(() => {
  loadStatistics()
})

const loadStatistics = async () => {
  try {
    const res = await request({ url: '/statistics', method: 'get', params: { period: period.value } })
    const data = res[period.value] || res.month || res
    stats.inboundCount = data.totalInbound || data.inboundCount || 0
    stats.inboundAmount = (data.inboundAmount || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })
    stats.outboundCount = data.totalOutbound || data.outboundCount || 0
    stats.outboundAmount = (data.outboundAmount || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })
    stats.totalProducts = data.totalProducts || 0
  } catch (error) {
    console.error(error)
  }
  loadTrendData()
}

const loadTrendData = async () => {
  try {
    const [trendRes, inRankRes, outRankRes] = await Promise.all([
      request({ url: '/statistics/trend', method: 'get', params: { period: period.value === 'today' ? 'week' : period.value } }),
      request({ url: '/statistics/rank', method: 'get', params: { type: 'inbound' } }),
      request({ url: '/statistics/rank', method: 'get', params: { type: 'outbound' } })
    ])
    initCharts(trendRes)
    inboundRank.value = inRankRes || []
    outboundRank.value = outRankRes || []
  } catch (error) {
    initCharts([])
  }
}

const initCharts = (trendData) => {
  const dates = trendData.length > 0 ? trendData.map(d => d.date || d.month) : ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const inboundData = trendData.length > 0 ? trendData.map(d => d.inbound) : [0, 0, 0, 0, 0, 0, 0]
  const outboundData = trendData.length > 0 ? trendData.map(d => d.outbound) : [0, 0, 0, 0, 0, 0, 0]

  const trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['入库', '出库'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: [
      { name: '入库', type: 'line', smooth: true, itemStyle: { color: '#52c41a' }, areaStyle: { color: 'rgba(82, 196, 26, 0.1)' }, data: inboundData },
      { name: '出库', type: 'line', smooth: true, itemStyle: { color: '#1890ff' }, areaStyle: { color: 'rgba(24, 144, 255, 0.1)' }, data: outboundData }
    ]
  })

  // 饼图
  const pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      data: [
        { value: stats.inboundCount || 0, name: '入库', itemStyle: { color: '#52c41a' } },
        { value: stats.outboundCount || 0, name: '出库', itemStyle: { color: '#1890ff' } }
      ]
    }]
  })

  window.addEventListener('resize', () => {
    trendChart.resize()
    pieChart.resize()
  })
}
</script>

<style scoped>
.card-title { font-size: 16px; font-weight: bold; margin-bottom: 16px; }
.stat-amount { font-size: 14px; color: #52c41a; margin-top: 4px; }
</style>
