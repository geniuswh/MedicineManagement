<template>
  <div class="log-page">
    <div class="page-header">
      <h1 class="page-title">操作日志</h1>
      <p class="page-desc">系统操作记录查询</p>
    </div>

    <div class="content-card">
      <el-table :data="logs" v-loading="loading">
        <el-table-column prop="userName" label="操作人" width="100" />
        <el-table-column prop="action" label="操作" width="80">
          <template #default="{ row }">
            <el-tag size="small">{{ row.action }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="100" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="ip" label="IP" width="120" />
        <el-table-column prop="createTime" label="时间" width="160" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const logs = ref([])

onMounted(() => loadLogs())

const loadLogs = async () => {
  loading.value = true
  try {
    const res = await request({ url: '/api/logs', method: 'get' })
    logs.value = res.list
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}
</script>
