<template>
  <div class="device-page">
    <div class="page-header">
      <h1 class="page-title">医疗器械管理</h1>
      <p class="page-desc">管理所有医疗器械信息</p>
    </div>

    <div class="content-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="器械名称">
          <el-input v-model="searchForm.keyword" placeholder="名称/条码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="cat in categories" :key="cat.name" :label="cat.name" :value="cat.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleAdd">新增器械</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="content-card">
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="器械名称" min-width="180" />
        <el-table-column prop="spec" label="规格型号" width="120" />
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
        <el-table-column prop="minStock" label="最低库存" width="90" />
        <el-table-column prop="manufacturer" label="生产厂家" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑器械' : '新增器械'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="器械名称">
          <el-input v-model="form.name" placeholder="请输入器械名称" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规格型号">
              <el-input v-model="form.spec" placeholder="如：成人型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位">
              <el-input v-model="form.unit" placeholder="如：个" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类">
              <el-select v-model="form.category" placeholder="选择分类" style="width: 100%">
                <el-option v-for="cat in categories" :key="cat.name" :label="cat.name" :value="cat.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单价">
              <el-input-number v-model="form.price" :precision="2" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="生产厂家">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input v-model="form.registrationNumber" placeholder="械注准..." />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最低库存">
              <el-input-number v-model="form.minStock" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条形码">
              <el-input v-model="form.barcode" placeholder="可选" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const categories = ref([
  { name: '注射穿刺类' }, { name: '医用防护' }, { name: '输液类' },
  { name: '诊断设备' }, { name: '导管类' }, { name: '敷料类' }, { name: '消毒用品' }
])

const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const searchForm = reactive({ keyword: '', category: '' })

onMounted(() => { loadData(); loadCategories() })

const loadCategories = async () => {
  try {
    const res = await request({ url: '/devices/categories', method: 'get' })
    categories.value = res
  } catch (error) {
    // 使用默认分类
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await request({
      url: '/devices',
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

const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: '', name: '', spec: '', unit: '', category: '', price: 0,
  manufacturer: '', registrationNumber: '', minStock: 0, barcode: '', remark: ''
})

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { id: '', name: '', spec: '', unit: '', category: '', price: 0, manufacturer: '', registrationNumber: '', minStock: 0, barcode: '', remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除"${row.name}"吗？`, '提示', { type: 'warning' })
    .then(async () => {
      try {
        await request({ url: `/devices/${row.id}`, method: 'delete' })
        ElMessage.success('删除成功')
        loadData()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await request({ url: `/devices/${form.id}`, method: 'put', data: { ...form } })
      ElMessage.success('编辑成功')
    } else {
      await request({ url: '/devices', method: 'post', data: { ...form, stock: 0 } })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(isEdit.value ? '编辑失败' : '新增失败')
  }
}
</script>
