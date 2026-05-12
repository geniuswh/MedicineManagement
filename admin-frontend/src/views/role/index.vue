<template>
  <div class="role-page">
    <div class="page-header">
      <h1 class="page-title">角色管理</h1>
      <p class="page-desc">配置系统角色及其权限</p>
    </div>

    <div class="content-card">
      <el-table :data="roles" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="角色标识" width="120" />
        <el-table-column prop="label" label="角色名称" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑权限</el-button>
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

const roles = ref([])

onMounted(() => loadRoles())

const loadRoles = async () => {
  try {
    const res = await request({ url: '/api/roles', method: 'get' })
    roles.value = res
  } catch (error) {
    roles.value = [
      { id: 1, name: 'admin', label: '管理员', description: '拥有所有权限' },
      { id: 2, name: 'manager', label: '经理', description: '管理药品、器械和出入库' },
      { id: 3, name: 'warehouse', label: '仓库管理员', description: '负责出入库操作' },
      { id: 4, name: 'viewer', label: '查看者', description: '只能查看数据' }
    ]
  }
}

const handleEdit = (row) => {
  ElMessage.info('编辑权限: ' + row.label)
}
</script>
