<template>
  <div class="system-page">
    <div class="page-header">
      <h1 class="page-title">系统设置</h1>
      <p class="page-desc">配置系统参数</p>
    </div>

    <div class="content-card">
      <el-form :model="form" label-width="120px" style="max-width: 600px">
        <el-form-item label="系统名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="系统Logo">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="1"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="库存预警阈值">
          <el-input-number v-model="form.warningThreshold" :min="0" />
          <span style="margin-left: 10px; color: #999">库存低于此比例时预警</span>
        </el-form-item>
        <el-form-item label="数据备份">
          <el-button type="primary">立即备份</el-button>
          <span style="margin-left: 10px; color: #999">上次备份：2024-01-15 08:00</span>
        </el-form-item>
        <el-form-item label="系统版本">
          <span>v1.0.0</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存设置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  name: '医药管理系统',
  warningThreshold: 20
})

const handleSave = () => {
  ElMessage.success('保存成功')
}
</script>
