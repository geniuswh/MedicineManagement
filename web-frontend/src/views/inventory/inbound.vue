<template>
  <div class="inbound-page">
    <div class="page-header">
      <h1 class="page-title">入库管理</h1>
      <p class="page-desc">药品与医疗器械入库登记</p>
    </div>

    <el-row :gutter="20">
      <!-- 入库表单 -->
      <el-col :xs="24" :lg="12">
        <div class="page-card">
          <div class="card-header">
            <span class="card-title">入库登记</span>
          </div>
          
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="产品类型" prop="productType">
              <el-radio-group v-model="form.productType" @change="handleTypeChange">
                <el-radio label="medicine">药品</el-radio>
                <el-radio label="device">医疗器械</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="选择产品" prop="productId">
              <el-select
                v-model="form.productId"
                filterable
                placeholder="请选择产品"
                style="width: 100%"
                @change="handleProductChange"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span>{{ item.name }}</span>
                  <span style="color: #999; font-size: 12px; margin-left: 8px;">
                    {{ item.spec }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="规格">
              <el-input v-model="form.spec" disabled />
            </el-form-item>
            
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="form.batchNo" placeholder="请输入批号" />
            </el-form-item>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="数量" prop="quantity">
                  <el-input-number v-model="form.quantity" :min="1" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位">
                  <el-input v-model="form.unit" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="单价" prop="price">
                  <el-input-number v-model="form.price" :precision="2" :min="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总金额">
                  <el-input v-model="totalAmount" disabled>
                    <template #prefix>¥</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="form.supplier" placeholder="请输入供应商" />
            </el-form-item>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="生产日期" prop="productionDate">
                  <el-date-picker
                    v-model="form.productionDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="有效期至" prop="expiryDate">
                  <el-date-picker
                    v-model="form.expiryDate"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="submitting">
                确认入库
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      
      <!-- 最近入库记录 -->
      <el-col :xs="24" :lg="12">
        <div class="page-card">
          <div class="card-header">
            <span class="card-title">最近入库记录</span>
          </div>
          
          <el-table :data="recentRecords" size="small" max-height="600">
            <el-table-column prop="productName" label="产品" min-width="120" />
            <el-table-column prop="batchNo" label="批号" width="100" />
            <el-table-column prop="quantity" label="数量" width="80">
              <template #default="{ row }">
                <span class="text-success">+{{ row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="金额" width="80">
              <template #default="{ row }">
                ¥{{ row.totalAmount.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="140">
              <template #default="{ row }">
                {{ row.createTime.split(' ')[0] }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()

const formRef = ref(null)
const submitting = ref(false)
const productList = ref([])
const recentRecords = ref([])

const form = reactive({
  productType: 'medicine',
  productId: '',
  productName: '',
  spec: '',
  batchNo: '',
  quantity: 1,
  unit: '',
  price: 0,
  supplier: '',
  productionDate: '',
  expiryDate: '',
  remark: ''
})

const rules = {
  productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
  batchNo: [{ required: true, message: '请输入批号', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  supplier: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
  productionDate: [{ required: true, message: '请选择生产日期', trigger: 'change' }],
  expiryDate: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

const totalAmount = computed(() => {
  return (form.quantity * form.price).toFixed(2)
})

onMounted(() => {
  loadProducts()
  loadRecentRecords()
  
  // 从路由参数获取产品ID
  if (route.query.productId) {
    form.productId = route.query.productId
    form.productType = route.query.type || 'medicine'
    handleProductChange(route.query.productId)
  }
})

const loadProducts = async () => {
  try {
    const url = form.productType === 'medicine' ? '/api/medicines' : '/api/devices'
    const res = await request({ url, method: 'get', params: { pageSize: 100 } })
    productList.value = res.list
  } catch (error) {
    console.error('加载产品失败:', error)
  }
}

const loadRecentRecords = async () => {
  try {
    const res = await request({
      url: '/api/inbound',
      method: 'get',
      params: { pageSize: 10 }
    })
    recentRecords.value = res.list
  } catch (error) {
    console.error('加载记录失败:', error)
  }
}

watch(() => form.productType, () => {
  loadProducts()
  form.productId = ''
})

const handleTypeChange = () => {
  form.productId = ''
  form.productName = ''
  form.spec = ''
  form.unit = ''
  form.price = 0
}

const handleProductChange = (productId) => {
  const product = productList.value.find(p => p.id === productId)
  if (product) {
    form.productName = product.name
    form.spec = product.spec
    form.unit = product.unit
    form.price = product.price
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitting.value = true
  try {
    await request({
      url: '/api/inbound',
      method: 'post',
      data: {
        productId: form.productId,
        productName: form.productName,
        productType: form.productType === 'medicine' ? '药品' : '医疗器械',
        spec: form.spec,
        batchNo: form.batchNo,
        quantity: form.quantity,
        unit: form.unit,
        price: form.price,
        totalAmount: parseFloat(totalAmount.value),
        supplier: form.supplier,
        productionDate: form.productionDate,
        expiryDate: form.expiryDate,
        remark: form.remark,
        operatorId: 1,
        operatorName: '管理员',
        date: new Date().toISOString().split('T')[0]
      }
    })
    
    ElMessage.success('入库成功')
    handleReset()
    loadRecentRecords()
    
  } catch (error) {
    ElMessage.error('入库失败')
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.inbound-page {
  .card-header {
    margin-bottom: 20px;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  
  .text-success {
    color: #52c41a;
    font-weight: bold;
  }
}
</style>
