<template>
  <div class="medicine-page">
    <div class="page-header">
      <h1 class="page-title">药品管理</h1>
      <p class="page-desc">管理所有药品信息</p>
    </div>

    <div class="page-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="药品名称">
          <el-input v-model="searchForm.keyword" placeholder="名称/条码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="全部" clearable style="width: 120px">
            <el-option v-for="cat in categories" :key="cat.name" :label="cat.name" :value="cat.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="page-card">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="name" label="药品名称" min-width="150" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="unit" label="单位" width="60" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="price" label="单价" width="80">
          <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80">
          <template #default="{ row }">
            <el-tag :type="row.stock <= row.minStock ? 'danger' : 'success'">{{ row.stock }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="manufacturer" label="生产厂家" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleInbound(row)">入库</el-button>
            <el-button type="primary" link size="small" @click="handleOutbound(row)">出库</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next"
        style="margin-top: 20px; justify-content: flex-end;"
        @size-change="loadData"
        @current-change="loadData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const categories = ref([
  { name: '抗生素' }, { name: '解热镇痛' }, { name: '维生素类' },
  { name: '感冒用药' }, { name: '清热解毒' }, { name: '抗过敏' }
])

const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const searchForm = reactive({ keyword: '', category: '' })

onMounted(() => loadData())

const loadData = async () => {
  loading.value = true
  try {
    const res = await request({
      url: '/medicines',
      method: 'get',
      params: { ...pagination, ...searchForm }
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.category = ''
  pagination.page = 1
  loadData()
}

const handleInbound = (row) => {
  router.push({ path: '/inbound', query: { productId: row.id, type: 'medicine' } })
}

const handleOutbound = (row) => {
  router.push({ path: '/outbound', query: { productId: row.id, type: 'medicine' } })
}
</script>
