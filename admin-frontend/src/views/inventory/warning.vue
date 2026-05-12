<template>
  <div class="warning-page">
    <div class="page-header">
      <h1 class="page-title">库存预警</h1>
      <p class="page-desc">库存低于最低库存的产品列表</p>
    </div>

    <div class="content-card">
      <el-alert
        title="当前有多个产品库存不足，请及时补货"
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom: 20px"
      />

      <el-table :data="warnings" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="产品名称" min-width="150" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'medicine' ? '' : 'info'" size="small">
              {{ row.type === 'medicine' ? '药品' : '器械' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="stock" label="当前库存" width="100">
          <template #default="{ row }">
            <el-tag type="danger" effect="dark">{{ row.stock }} {{ row.unit }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="minStock" label="最低库存" width="100">
          <template #default="{ row }">{{ row.minStock }} {{ row.unit }}</template>
        </el-table-column>
        <el-table-column label="差额" width="80">
          <template #default="{ row }">
            <span class="text-danger">{{ row.minStock - row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleInbound(row)">立即补货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const warnings = ref([])

onMounted(() => loadData())

const loadData = async () => {
  loading.value = true
  try {
    const res = await request({ url: '/api/warnings', method: 'get' })
    warnings.value = res
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleInbound = (row) => {
  ElMessage.success('已跳转到入库页面: ' + row.name)
}
</script>

<style scoped>
.text-danger { color: #ff4d4f; font-weight: bold; }
</style>
