<template>
  <div class="user-page">
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
      <p class="page-desc">管理系统用户账号和权限</p>
    </div>

    <div class="content-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.keyword" placeholder="姓名/账号" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="全部" clearable style="width: 120px">
            <el-option label="管理员" value="admin" />
            <el-option label="经理" value="manager" />
            <el-option label="仓库管理员" value="warehouse" />
            <el-option label="查看者" value="viewer" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading">
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
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link size="small" @click="handlePermission(row)">权限</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const searchForm = reactive({ keyword: '', role: '' })

onMounted(() => loadData())

const loadData = async () => {
  loading.value = true
  try {
    const res = await request({ url: '/api/users', method: 'get', params: searchForm })
    tableData.value = res.list
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.role = ''
  loadData()
}

const handleAdd = () => ElMessage.info('新增用户功能开发中...')
const handleEdit = (row) => ElMessage.info('编辑用户: ' + row.name)
const handlePermission = (row) => ElMessage.info('设置权限: ' + row.name)

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除用户"${row.name}"吗？`, '提示', { type: 'warning' })
    .then(() => { ElMessage.success('删除成功'); loadData() })
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
