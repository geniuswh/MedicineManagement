<template>
  <div class="inventory-page">
    <div class="page-header">
      <h1 class="page-title">库存管理</h1>
      <p class="page-desc">药品与医疗器械库存查询</p>
    </div>

    <!-- 搜索栏 -->
    <div class="page-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="产品类型">
          <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 120px">
            <el-option label="药品" value="medicine" />
            <el-option label="器械" value="device" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input v-model="searchForm.keyword" placeholder="产品名称/条码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="库存状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="normal" />
            <el-option label="预警" value="warning" />
            <el-option label="缺货" value="shortage" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="8">
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
      <el-col :xs="24" :sm="8">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%)">
            <el-icon><Check /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.normalCount }}</div>
            <div class="stat-label">库存正常</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.warningCount }}</div>
            <div class="stat-label">库存预警</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <div class="page-card">
      <div class="card-header">
        <span class="card-title">库存列表</span>
        <el-button type="primary" :icon="Download" @click="$router.push('/inbound')">入库</el-button>
      </div>
      
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="产品名称" min-width="150" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'medicine' ? 'purple' : 'blue'" size="small">
              {{ row.type === 'medicine' ? '药品' : '器械' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="unit" label="单位" width="60" />
        <el-table-column prop="stock" label="库存" width="100">
          <template #default="{ row }">
            <el-tag :type="getStockType(row)" effect="dark">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="minStock" label="最低库存" width="90" />
        <el-table-column prop="price" label="单价" width="80">
          <template #default="{ row }">
            ¥{{ (row.price || 0).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleInbound(row)">入库</el-button>
            <el-button type="primary" link size="small" @click="handleOutbound(row)">出库</el-button>
            <el-button type="info" link size="small" @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end;"
        @size-change="loadData"
        @current-change="loadData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()

const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const searchForm = reactive({
  type: '',
  keyword: '',
  status: ''
})

const stats = computed(() => {
  const total = tableData.value.length
  const normal = tableData.value.filter(item => item.stock > item.minStock).length
  const warning = tableData.value.filter(item => item.stock <= item.minStock).length
  return {
    totalProducts: pagination.total,
    normalCount: normal,
    warningCount: warning
  }
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const [medicinesRes, devicesRes] = await Promise.all([
      request({
        url: '/medicines',
        method: 'get',
        params: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          keyword: searchForm.keyword,
          ...searchForm.type === 'medicine' && { type: 'medicine' }
        }
      }),
      request({
        url: '/devices',
        method: 'get',
        params: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          keyword: searchForm.keyword,
          ...searchForm.type === 'device' && { type: 'device' }
        }
      })
    ])
    
    // 合并数据
    let allData = [
      ...medicinesRes.list.map(m => ({ ...m, type: 'medicine' })),
      ...devicesRes.list.map(d => ({ ...d, type: 'device' }))
    ]
    
    // 筛选
    if (searchForm.type === 'medicine') {
      allData = allData.filter(item => item.type === 'medicine')
    } else if (searchForm.type === 'device') {
      allData = allData.filter(item => item.type === 'device')
    }
    
    if (searchForm.status === 'warning') {
      allData = allData.filter(item => item.stock <= item.minStock)
    } else if (searchForm.status === 'normal') {
      allData = allData.filter(item => item.stock > item.minStock)
    }
    
    tableData.value = allData
    pagination.total = medicinesRes.total + devicesRes.total
    
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const getStockType = (row) => {
  if (row.stock <= 0) return 'danger'
  if (row.stock <= row.minStock) return 'warning'
  return 'success'
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.keyword = ''
  searchForm.status = ''
  pagination.page = 1
  loadData()
}

const handleInbound = (row) => {
  router.push({
    path: '/inbound',
    query: { productId: row.id, type: row.type }
  })
}

const handleOutbound = (row) => {
  router.push({
    path: '/outbound',
    query: { productId: row.id, type: row.type }
  })
}

const handleDetail = (row) => {
  ElMessage.info('查看详情: ' + row.name)
}
</script>

<style lang="scss" scoped>
.inventory-page {
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
