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
  initCharts()
})

// 时间范围变化
const handleTimeChange = () => {
  loadStatistics()
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
  // 模拟数据
  overview.inboundCount = 156
  overview.inboundAmount = '125,680.00'
  overview.outboundCount = 142
  overview.outboundAmount = '98,450.00'
  overview.totalQuantity = 8520
  overview.totalAmount = '224,130.00'
  
  inboundRankList.value = [
    { name: '阿莫西林胶囊', count: 25, quantity: 2500 },
    { name: '布洛芬片', count: 20, quantity: 2000 },
    { name: '维生素C片', count: 18, quantity: 1800 },
    { name: '医用口罩', count: 15, quantity: 5000 },
    { name: '一次性注射器', count: 12, quantity: 1200 }
  ]
  
  outboundRankList.value = [
    { name: '阿莫西林胶囊', count: 22, quantity: 2200 },
    { name: '医用口罩', count: 18, quantity: 4500 },
    { name: '布洛芬片', count: 16, quantity: 1600 },
    { name: '一次性注射器', count: 14, quantity: 1400 },
    { name: '维生素C片', count: 12, quantity: 1200 }
  ]
}

// 初始化图表
const initCharts = () => {
  // 趋势图
  const trendChart = echarts.init(trendChartRef.value)
  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['入库', '出库'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '入库',
        type: 'line',
        smooth: true,
        itemStyle: { color: '#52c41a' },
        areaStyle: { color: 'rgba(82, 196, 26, 0.1)' },
        data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1520, 1680, 1750, 1820]
      },
      {
        name: '出库',
        type: 'line',
        smooth: true,
        itemStyle: { color: '#1890ff' },
        areaStyle: { color: 'rgba(24, 144, 255, 0.1)' },
        data: [620, 782, 791, 834, 990, 1030, 1120, 1250, 1320, 1480, 1550, 1620]
      }
    ]
  }
  trendChart.setOption(trendOption)

  // 品类分布图
  const categoryChart = echarts.init(categoryChartRef.value)
  const categoryOption = {
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
        { value: 1048, name: '药品', itemStyle: { color: '#722ed1' } },
        { value: 735, name: '医疗器械', itemStyle: { color: '#1890ff' } },
        { value: 580, name: '耗材', itemStyle: { color: '#52c41a' } }
      ]
    }]
  }
  categoryChart.setOption(categoryOption)

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
