<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">个人中心</h1>
      <p class="page-desc">管理个人信息</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <div class="page-card" style="text-align: center">
          <el-avatar :size="100" :src="userInfo.avatar">
            {{ userInfo.name?.charAt(0) }}
          </el-avatar>
          <h2 style="margin: 16px 0 8px">{{ userInfo.name }}</h2>
          <el-tag :type="getRoleType(userInfo.role)">{{ getRoleName(userInfo.role) }}</el-tag>
          <p style="color: #999; margin-top: 8px">{{ userInfo.department }}</p>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="page-card">
          <h3 style="margin-bottom: 20px">基本信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="账号">{{ userInfo.account }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="部门">{{ userInfo.department }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{ getRoleName(userInfo.role) }}</el-descriptions-item>
            <el-descriptions-item label="创建时间" :span="2">{{ userInfo.createTime }}</el-descriptions-item>
          </el-descriptions>
          
          <h3 style="margin: 24px 0 16px">权限列表</h3>
          <el-tag v-for="perm in permissions" :key="perm" style="margin: 4px">{{ perm }}</el-tag>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const permissions = computed(() => userStore.permissions)

const getRoleType = (role) => {
  const types = { admin: 'danger', manager: 'warning', warehouse: '', viewer: 'info' }
  return types[role] || ''
}

const getRoleName = (role) => {
  const names = { admin: '管理员', manager: '经理', warehouse: '仓库管理员', viewer: '查看者' }
  return names[role] || role
}
</script>
