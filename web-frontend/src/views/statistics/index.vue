<template>
  <div class="statistics-page">
    <div class="page-header">
      <h1 class="page-title">统计分析</h1>
      <p class="page-desc">出入库数据统计与趋势分析</p>
    </div>

    <!-- 时间选择器 -->
    <div class="page-card">
      <div class="time-selector">
        <el-radio-group v-model="timeRange" @change="handleTimeChange">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="year">本年</el-radio-button>
        </el-radio-group>
        
        <el-date-picker
          v-model="customDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </div>
    </div>

    <!-- 总览数据 -->
    <el-row :gutter="20" class="overview-section">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%)">
            <el-icon><Download /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ overview.inboundCount }}</div>
            <div class="stat-label">入库次数</div>
            <div class="stat-amount">¥{{ overview.inboundAmount }}</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)">
            <el-icon><Upload /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ overview.outboundCount }}</div>
            <div class="stat-label">出库次数</div>
            <div class="stat-amount">¥{{ overview.outboundAmount }}</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #722ed1 0%, #9254de 100%)">
            <el-icon><Box /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ overview.totalQuantity }}</div>
            <div class="stat-label">出入库总量</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">¥{{ overview.totalAmount }}</div>
            <div class="stat-label">总金额</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="16">
        <div class="page-card">
          <h3 class="card-title">出入库趋势</h3>
          <div class="chart-container" ref="trendChartRef"></div>
        </div>
      </el-col>
      
      <el-col :xs="24" :lg="8">
        <div class="page-card">
          <h3 class="card-title">品类分布</h3>
          <div class="chart-container" ref="categoryChartRef"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 排行榜 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <div class="page-card">
          <h3 class="card-title">入库排行 TOP 10</h3>
          <el-table :data="inboundRankList" style="width: 100%">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="count" label="入库次数" width="100" />
            <el-table-column prop="quantity" label="数量" width="100" />
          </el-table>
        </div>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <div class="page-card">
          <h3 class="card-title">出库排行 TOP 10</h3>
          <el-table :data="outboundRankList" style="width: 100%">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="count" label="出库次数" width="100" />
            <el-table-column prop="quantity" label="数量" width="100" />
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 导出按钮 -->
    <div class="export-btn-wrapper" v-if="hasExportPermission">
      <el-button type="primary" :icon="Download" @click="exportReport">
        导出报表
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const userStore = useUserStore()

const timeRange = ref('month')
const customDateRange = ref([])

const overview = reactive({
  inboundCount: 0,
  inboundAmount: '0.00',
  outboundCount: 0,
  outboundAmount: '0.00',
  totalQuantity: 0,
  totalAmount: '0.00'
})

const inboundRankList = ref([])
const outboundRankList = ref([])

const trendChartRef = ref(null)
const categoryChartRef = ref(null)

const hasExportPermission = computed(() => userStore.hasPermission('statistics:export'))

onMounted(() => {
  loadStatistics()
  loadTrendData()
  loadRankData()
})

// 时间范围变化
const handleTimeChange = () => {
  loadStatistics()
  loadTrendData()
}

// 自定义日期变化
const handleDateChange = () => {
  if (customDateRange.value && customDateRange.value.length === 2) {
    timeRange.value = ''
    loadStatistics()
  }
}

// 加载统计数据
const loadStatistics = async () => {
  try {
    const res = await request({ url: '/statistics', method: 'get', params: { period: timeRange.value || 'month' } })
    const data = res[timeRange.value] || res.month || res
    // today 格式: { inboundCount, outboundCount, inboundAmount, outboundAmount }
    // month/quarter/year 格式: { totalInbound, totalOutbound, inboundAmount, outboundAmount }
    overview.inboundCount = data.totalInbound || data.inboundCount || 0
    overview.inboundAmount = (data.inboundAmount || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })
    overview.outboundCount = data.totalOutbound || data.outboundCount || 0
    overview.outboundAmount = (data.outboundAmount || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2 })
    overview.totalQuantity = overview.inboundCount + overview.outboundCount
    overview.totalAmount = ((data.inboundAmount || 0) + (data.outboundAmount || 0)).toLocaleString('zh-CN', { minimumFractionDigits: 2 })
  } catch (e) {
    console.error('加载统计失败', e)
  }
}

// 加载趋势数据
const loadTrendData = async () => {
  try {
    const res = await request({ url: '/statistics/trend', method: 'get', params: { period: timeRange.value === 'today' ? 'week' : (timeRange.value || 'month') } })
    initCharts(res)
  } catch (e) {
    initCharts([])
  }
}

// 加载排行数据
const loadRankData = async () => {
  try {
    const [inboundRes, outboundRes] = await Promise.all([
      request({ url: '/statistics/rank', method: 'get', params: { type: 'inbound' } }),
      request({ url: '/statistics/rank', method: 'get', params: { type: 'outbound' } })
    ])
    inboundRankList.value = inboundRes || []
    outboundRankList.value = outboundRes || []
  } catch (e) {
    console.error('加载排行失败', e)
  }
}

// 初始化图表
const initCharts = (trendData) => {
  const dates = trendData.length > 0 ? trendData.map(d => d.date || d.month) : []
  const inboundData = trendData.map(d => d.inbound)
  const outboundData = trendData.map(d => d.outbound)

  const trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['入库', '出库'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: dates },
    yAxis: { type: 'value' },
    series: [
      { name: '入库', type: 'line', smooth: true, itemStyle: { color: '#52c41a' }, areaStyle: { color: 'rgba(82, 196, 26, 0.1)' }, data: inboundData },
      { name: '出库', type: 'line', smooth: true, itemStyle: { color: '#1890ff' }, areaStyle: { color: 'rgba(24, 144, 255, 0.1)' }, data: outboundData }
    ]
  })

  const categoryChart = echarts.init(categoryChartRef.value)
  categoryChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
      labelLine: { show: false },
      data: [
        { value: overview.inboundCount || 0, name: '入库', itemStyle: { color: '#52c41a' } },
        { value: overview.outboundCount || 0, name: '出库', itemStyle: { color: '#1890ff' } }
      ]
    }]
  })

  window.addEventListener('resize', () => {
    trendChart.resize()
    categoryChart.resize()
  })
}

// 导出报表
const exportReport = () => {
  ElMessage.success('报表导出功能开发中...')
}
</script>

<style lang="scss" scoped>
.statistics-page {
  .time-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .overview-section {
    margin-bottom: 20px;
    
    .stat-card {
      display: flex;
      align-items: center;
      padding: 24px;
      
      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #fff;
        margin-right: 16px;
        flex-shrink: 0;
      }
      
      .stat-content {
        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #333;
          line-height: 1.2;
        }
        
        .stat-label {
          font-size: 14px;
          color: #999;
          margin-top: 4px;
        }
        
        .stat-amount {
          font-size: 16px;
          color: #52c41a;
          margin-top: 8px;
          font-weight: 500;
        }
      }
    }
  }
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
  }
  
  .export-btn-wrapper {
    position: fixed;
    bottom: 40px;
    right: 40px;
  }
}
</style>
