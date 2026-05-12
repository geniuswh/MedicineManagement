<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">首页</h1>
      <p class="page-desc">欢迎回来，{{ userInfo.name }}</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #722ed1 0%, #9254de 100%)">
            <el-icon><FirstAidKit /></el-icon>
          </div>
          <div class="stat-value">{{ statistics.totalProducts }}</div>
          <div class="stat-label">产品总数</div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%)">
            <el-icon><Download /></el-icon>
          </div>
          <div class="stat-value">{{ statistics.todayInbound }}</div>
          <div class="stat-label">今日入库</div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)">
            <el-icon><Upload /></el-icon>
          </div>
          <div class="stat-value">{{ statistics.todayOutbound }}</div>
          <div class="stat-label">今日出库</div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-value">{{ statistics.warnings }}</div>
          <div class="stat-label">库存预警</div>
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

    <!-- 最近记录 & 库存预警 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <div class="page-card">
          <div class="card-header">
            <h3 class="card-title">最近记录</h3>
            <el-button type="primary" link @click="$router.push('/inventory')">
              查看更多
            </el-button>
          </div>
          <el-table :data="recentRecords" style="width: 100%">
            <el-table-column prop="productName" label="产品名称" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">
                <el-tag :type="row.type === 'inbound' ? 'success' : 'primary'" size="small">
                  {{ row.type === 'inbound' ? '入库' : '出库' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80">
              <template #default="{ row }">
                <span :class="row.type === 'inbound' ? 'text-success' : 'text-danger'">
                  {{ row.type === 'inbound' ? '+' : '-' }}{{ row.quantity }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="120" />
          </el-table>
        </div>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <div class="page-card">
          <div class="card-header">
            <h3 class="card-title">库存预警</h3>
            <el-badge :value="warnings.length" :hidden="warnings.length === 0">
              <el-button type="primary" link>查看全部</el-button>
            </el-badge>
          </div>
          <el-table :data="warnings" style="width: 100%">
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="stock" label="当前库存" width="100">
              <template #default="{ row }">
                <el-tag :type="row.stock < row.minStock ? 'danger' : 'warning'">
                  {{ row.stock }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="minStock" label="最低库存" width="100" />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleInbound(row)">
                  补货
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

const statistics = reactive({
  totalProducts: 0,
  todayInbound: 0,
  todayOutbound: 0,
  warnings: 0
})

const recentRecords = ref([])
const warnings = ref([])

const trendChartRef = ref(null)
const categoryChartRef = ref(null)

onMounted(() => {
  loadStatistics()
  loadRecentRecords()
  loadWarnings()
  loadChartData()
})

// 加载统计数据
const loadStatistics = async () => {
  try {
    const res = await request({ url: '/statistics', method: 'get', params: { period: 'month' } })
    statistics.totalProducts = res.totalProducts || 0
    statistics.todayInbound = res.today?.inboundCount || 0
    statistics.todayOutbound = res.today?.outboundCount || 0
    statistics.warnings = res.lowStockCount || 0
  } catch (e) {
    console.error('加载统计失败', e)
  }
}

// 加载最近记录
const loadRecentRecords = async () => {
  try {
    const [inboundRes, outboundRes] = await Promise.all([
      request({ url: '/inbound', method: 'get', params: { pageSize: 5 } }),
      request({ url: '/outbound', method: 'get', params: { pageSize: 5 } })
    ])
    const allRecords = [
      ...inboundRes.list.map(r => ({ ...r, type: 'inbound' })),
      ...outboundRes.list.map(r => ({ ...r, type: 'outbound' }))
    ].sort((a, b) => new Date(b.createTime) - new Date(a.createTime)).slice(0, 5)
    recentRecords.value = allRecords
  } catch (e) {
    console.error('加载记录失败', e)
  }
}

// 加载库存预警
const loadWarnings = async () => {
  try {
    const res = await request({ url: '/warnings', method: 'get' })
    warnings.value = res.slice(0, 5)
  } catch (e) {
    console.error('加载预警失败', e)
  }
}

// 加载图表数据
const loadChartData = async () => {
  try {
    const trendRes = await request({ url: '/statistics/trend', method: 'get', params: { period: 'week' } })
    initCharts(trendRes)
  } catch (e) {
    initCharts([])
  }
}

// 初始化图表
const initCharts = (trendData) => {
  const trendChart = echarts.init(trendChartRef.value)
  const dates = trendData.length > 0 ? trendData.map(d => d.date || d.month) : ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const inboundData = trendData.length > 0 ? trendData.map(d => d.inbound) : [0, 0, 0, 0, 0, 0, 0]
  const outboundData = trendData.length > 0 ? trendData.map(d => d.outbound) : [0, 0, 0, 0, 0, 0, 0]

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

  // 品类分布图
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
        { value: statistics.totalProducts || 0, name: '产品总数', itemStyle: { color: '#722ed1' } },
        { value: statistics.warnings || 0, name: '库存预警', itemStyle: { color: '#fa8c16' } }
      ]
    }]
  })

  window.addEventListener('resize', () => {
    trendChart.resize()
    categoryChart.resize()
  })
}

// 补货
const handleInbound = (row) => {
  router.push({
    path: '/inbound',
    query: { productId: row.id, type: row.type || 'medicine' }
  })
}
</script>

<style lang="scss" scoped>
.dashboard {
  .stat-cards {
    margin-bottom: 20px;
    
    .stat-card {
      margin-bottom: 20px;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
}
</style>
