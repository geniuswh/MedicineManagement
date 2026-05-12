<template>
  <div class="stock-page">
    <div class="page-header">
      <h1 class="page-title">库存查询</h1>
      <p class="page-desc">实时查看所有产品库存</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #722ed1 0%, #9254de 100%)">
            <el-icon><Box /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">产品总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%)">
            <el-icon><Check /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.normal }}</div>
            <div class="stat-label">库存正常</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.warning }}</div>
            <div class="stat-label">库存预警</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">¥{{ stats.amount }}</div>
            <div class="stat-label">库存金额</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="content-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 100px">
            <el-option label="药品" value="medicine" />
            <el-option label="器械" value="device" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input v-model="searchForm.keyword" placeholder="名称/条码" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 100px">
            <el-option label="正常" value="normal" />
            <el-option label="预警" value="warning" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="name" label="产品名称" min-width="150" />
        <el-table-column prop="type" label="类型" width="70">
          <template #default="{ row }">
            <el-tag :type="row.type === 'medicine' ? '' : 'info'" size="small">
              {{ row.type === 'medicine' ? '药品' : '器械' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格" width="100" />
        <el-table-column prop="stock" label="库存" width="80">
          <template #default="{ row }">
            <el-tag :type="row.stock <= row.minStock ? 'danger' : 'success'">{{ row.stock }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="minStock" label="最低库存" width="90" />
        <el-table-column prop="unit" label="单位" width="60" />
        <el-table-column prop="price" label="单价" width="80">
          <template #default="{ row }">¥{{ (row.price || 0).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="库存金额" width="100">
          <template #default="{ row }">¥{{ ((row.stock || 0) * (row.price || 0)).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="90" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const searchForm = reactive({ type: '', keyword: '', status: '' })

const stats = computed(() => {
  const total = tableData.value.length
  const warning = tableData.value.filter(i => i.stock <= i.minStock).length
  const normal = total - warning
  const amount = tableData.value.reduce((sum, i) => sum + i.stock * i.price, 0).toFixed(0)
  return { total, normal, warning, amount }
})

onMounted(() => loadData())

const loadData = async () => {
  loading.value = true
  try {
    const [medRes, devRes] = await Promise.all([
      request({ url: '/medicines', method: 'get', params: { pageSize: 100, keyword: searchForm.type === 'device' ? 'xyz999' : searchForm.keyword } }),
      request({ url: '/devices', method: 'get', params: { pageSize: 100, keyword: searchForm.type === 'medicine' ? 'xyz999' : searchForm.keyword } })
    ])
    
    let allData = [
      ...medRes.list.map(m => ({ ...m, type: 'medicine' })),
      ...devRes.list.map(d => ({ ...d, type: 'device' }))
    ]
    
    if (searchForm.status === 'warning') {
      allData = allData.filter(i => i.stock <= i.minStock)
    } else if (searchForm.status === 'normal') {
      allData = allData.filter(i => i.stock > i.minStock)
    }
    
    tableData.value = allData
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}
</script>
