<template>
  <div class="records-page">
    <div class="page-header">
      <h1 class="page-title">出入库记录</h1>
      <p class="page-desc">查看所有出入库操作记录</p>
    </div>

    <div class="content-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="记录类型">
          <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 100px">
            <el-option label="入库" value="inbound" />
            <el-option label="出库" value="outbound" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="产品名称/批号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="content-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'inbound' ? 'success' : 'primary'" size="small">
              {{ row.type === 'inbound' ? '入库' : '出库' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" min-width="150" />
        <el-table-column prop="productType" label="产品类型" width="90" />
        <el-table-column prop="spec" label="规格" width="100" />
        <el-table-column prop="batchNo" label="批号" width="100" />
        <el-table-column prop="quantity" label="数量" width="80">
          <template #default="{ row }">
            <span :class="row.type === 'inbound' ? 'text-success' : 'text-primary'">
              {{ row.type === 'inbound' ? '+' : '-' }}{{ row.quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="金额" width="90">
          <template #default="{ row }">¥{{ row.totalAmount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="operatorName" label="操作人" width="80" />
        <el-table-column prop="createTime" label="时间" width="140" />
        <el-table-column label="详情" width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="showDetail(row)">查看</el-button>
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
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const dateRange = ref([])

const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const searchForm = reactive({ type: '', keyword: '' })

onMounted(() => loadData())

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...pagination,
      keyword: searchForm.keyword,
      startDate: dateRange.value?.[0],
      endDate: dateRange.value?.[1]
    }
    
    let allData = []
    let total = 0
    
    if (searchForm.type === 'inbound' || !searchForm.type) {
      const inboundRes = await request({ url: '/api/inbound', method: 'get', params })
      allData = allData.concat(inboundRes.list.map(item => ({ ...item, type: 'inbound' })))
      total += inboundRes.total
    }
    
    if (searchForm.type === 'outbound' || !searchForm.type) {
      const outboundRes = await request({ url: '/api/outbound', method: 'get', params })
      allData = allData.concat(outboundRes.list.map(item => ({ ...item, type: 'outbound' })))
      total += outboundRes.total
    }
    
    // 按时间排序
    allData.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    
    tableData.value = allData
    pagination.total = total
    
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.keyword = ''
  dateRange.value = []
  pagination.page = 1
  loadData()
}

const showDetail = (row) => {
  ElMessage.info('查看详情: ' + row.productName)
}
</script>

<style scoped>
.text-success { color: #52c41a; font-weight: bold; }
.text-primary { color: #1890ff; font-weight: bold; }
</style>
