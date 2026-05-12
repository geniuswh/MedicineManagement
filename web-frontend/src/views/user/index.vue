<template>
  <div class="user-page">
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
      <p class="page-desc">管理系统用户</p>
    </div>

    <div class="page-card">
      <el-table :data="users" v-loading="loading">
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="account" label="账号" width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleName(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="140" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const users = ref([])

onMounted(() => loadData())

const loadData = async () => {
  loading.value = true
  try {
    const res = await request({ url: '/api/users', method: 'get', params: { pageSize: 100 } })
    users.value = res.list
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const getRoleType = (role) => {
  const types = { admin: 'danger', manager: 'warning', warehouse: '', viewer: 'info' }
  return types[role] || ''
}

const getRoleName = (role) => {
  const names = { admin: '管理员', manager: '经理', warehouse: '仓库管理员', viewer: '查看者' }
  return names[role] || role
}
</script>
