<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1 class="page-title">控制台</h1>
      <p class="page-desc">欢迎回来，{{ userInfo.name }}</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #722ed1 0%, #9254de 100%)">
            <el-icon><Box /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalProducts }}</div>
            <div class="stat-label">产品总数</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%)">
            <el-icon><Download /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayInbound }}</div>
            <div class="stat-label">今日入库</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)">
            <el-icon><Upload /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayOutbound }}</div>
            <div class="stat-label">今日出库</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">用户总数</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16">
      <el-col :xs="24" :lg="16">
        <div class="content-card">
          <div class="card-header">
            <span class="card-title">出入库趋势</span>
            <el-radio-group v-model="chartPeriod" size="small">
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="year">本年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container" ref="trendChartRef"></div>
        </div>
      </el-col>
      
      <el-col :xs="24" :lg="8">
        <div class="content-card">
          <div class="card-header">
            <span class="card-title">品类分布</span>
          </div>
          <div class="chart-container" ref="pieChartRef"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <div class="content-card">
          <div class="card-header">
            <span class="card-title">最近出入库</span>
            <el-button type="primary" link>查看全部</el-button>
          </div>
          <el-table :data="recentRecords" size="small">
            <el-table-column prop="productName" label="产品" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">
                <el-tag :type="row.type === 'inbound' ? 'success' : 'primary'" size="small">
                  {{ row.type === 'inbound' ? '入库' : '出库' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="time" label="时间" width="100" />
          </el-table>
        </div>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <div class="content-card">
          <div class="card-header">
            <span class="card-title">库存预警</span>
            <el-badge :value="warnings.length">
              <el-button type="primary" link>查看全部</el-button>
            </el-badge>
          </div>
          <el-table :data="warnings" size="small">
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="stock" label="库存" width="80">
              <template #default="{ row }">
                <el-tag type="danger" size="small">{{ row.stock }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="minStock" label="最低" width="70" />
            <el-table-column label="操作" width="80">
              <template #default>
                <el-button type="primary" link size="small">补货</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <div class="content-card">
      <div class="card-header">
        <span class="card-title">快捷操作</span>
      </div>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="8" :md="4" v-for="action in quickActions" :key="action.name">
          <div class="quick-action" @click="handleAction(action.path)">
            <el-icon :size="32" :style="{ color: action.color }">
              <component :is="action.icon" />
            </el-icon>
            <span>{{ action.name }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
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
const chartPeriod = ref('week')

const stats = reactive({
  totalProducts: 0,
  todayInbound: 0,
  todayOutbound: 0,
  totalUsers: 0
})

const recentRecords = ref([])
const warnings = ref([])

const quickActions = [
  { name: '药品入库', icon: 'Download', color: '#52c41a', path: '/product/medicine' },
  { name: '药品出库', icon: 'Upload', color: '#1890ff', path: '/product/medicine' },
  { name: '添加药品', icon: 'Plus', color: '#722ed1', path: '/product/medicine' },
  { name: '添加器械', icon: 'Plus', color: '#fa8c16', path: '/product/device' },
  { name: '用户管理', icon: 'User', color: '#eb2f96', path: '/user' },
  { name: '数据统计', icon: 'DataAnalysis', color: '#13c2c2', path: '/statistics' }
]

const trendChartRef = ref(null)
const pieChartRef = ref(null)

onMounted(() => {
  loadStatistics()
  loadRecentRecords()
  loadWarnings()
  loadChartData()
})

const loadStatistics = async () => {
  try {
    const [statsRes, usersRes] = await Promise.all([
      request({ url: '/statistics', method: 'get', params: { period: 'month' } }),
      request({ url: '/users', method: 'get', params: { pageSize: 1 } })
    ])
    stats.totalProducts = statsRes.totalProducts || 0
    stats.todayInbound = statsRes.today?.inboundCount || 0
    stats.todayOutbound = statsRes.today?.outboundCount || 0
    stats.totalUsers = usersRes.total || 0
  } catch (e) {
    console.error('加载统计失败', e)
  }
}

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

const loadWarnings = async () => {
  try {
    const res = await request({ url: '/warnings', method: 'get' })
    warnings.value = res.slice(0, 5)
  } catch (e) {
    console.error('加载预警失败', e)
  }
}

const loadChartData = async () => {
  try {
    const trendRes = await request({ url: '/statistics/trend', method: 'get', params: { period: 'week' } })
    initCharts(trendRes)
  } catch (e) {
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
    xAxis: { type: 'category', boundaryGap: false, data: dates },
    yAxis: { type: 'value' },
    series: [
      { name: '入库', type: 'line', smooth: true, itemStyle: { color: '#52c41a' }, areaStyle: { color: 'rgba(82, 196, 26, 0.1)' }, data: inboundData },
      { name: '出库', type: 'line', smooth: true, itemStyle: { color: '#1890ff' }, areaStyle: { color: 'rgba(24, 144, 255, 0.1)' }, data: outboundData }
    ]
  })

  const pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      data: [
        { value: stats.totalProducts || 0, name: '产品总数', itemStyle: { color: '#722ed1' } },
        { value: stats.totalUsers || 0, name: '用户总数', itemStyle: { color: '#eb2f96' } }
      ]
    }]
  })

  window.addEventListener('resize', () => {
    trendChart.resize()
    pieChart.resize()
  })
}

const handleAction = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  .stat-row {
    margin-bottom: 16px;
    
    .stat-card {
      margin-bottom: 16px;
    }
  }
  
  .quick-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;
    background: #fafafa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 16px;
    
    &:hover {
      background: #e6f7ff;
      transform: translateY(-2px);
    }
    
    span {
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
