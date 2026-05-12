<template>
  <div class="outbound-page">
    <div class="page-header">
      <h1 class="page-title">出库管理</h1>
      <p class="page-desc">药品与医疗器械出库登记</p>
    </div>

    <el-row :gutter="20">
      <!-- 出库表单 -->
      <el-col :xs="24" :lg="12">
        <div class="page-card">
          <div class="card-header">
            <span class="card-title">出库登记</span>
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
                    库存: {{ item.stock }} {{ item.unit }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="当前库存" v-if="selectedProduct">
              <el-tag :type="stockTagType" size="large">
                {{ selectedProduct.stock }} {{ selectedProduct.unit }}
              </el-tag>
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
                  <el-input-number v-model="form.quantity" :min="1" :max="maxQuantity" style="width: 100%" />
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
            
            <el-form-item label="领用部门" prop="department">
              <el-input v-model="form.department" placeholder="请输入领用部门" />
            </el-form-item>
            
            <el-form-item label="领用人" prop="receiver">
              <el-input v-model="form.receiver" placeholder="请输入领用人姓名" />
            </el-form-item>
            
            <el-form-item label="用途说明">
              <el-input v-model="form.purpose" type="textarea" :rows="2" placeholder="请输入用途说明" />
            </el-form-item>
            
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="submitting">
                确认出库
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      
      <!-- 最近出库记录 -->
      <el-col :xs="24" :lg="12">
        <div class="page-card">
          <div class="card-header">
            <span class="card-title">最近出库记录</span>
          </div>
          
          <el-table :data="recentRecords" size="small" max-height="600">
            <el-table-column prop="productName" label="产品" min-width="120" />
            <el-table-column prop="department" label="领用部门" width="80" />
            <el-table-column prop="quantity" label="数量" width="80">
              <template #default="{ row }">
                <span class="text-primary">-{{ row.quantity }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="receiver" label="领用人" width="70" />
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
const selectedProduct = ref(null)

const form = reactive({
  productType: 'medicine',
  productId: '',
  productName: '',
  spec: '',
  batchNo: '',
  quantity: 1,
  unit: '',
  price: 0,
  department: '',
  receiver: '',
  purpose: '',
  remark: ''
})

const rules = {
  productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
  batchNo: [{ required: true, message: '请输入批号', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  department: [{ required: true, message: '请输入领用部门', trigger: 'blur' }],
  receiver: [{ required: true, message: '请输入领用人', trigger: 'blur' }]
}

const totalAmount = computed(() => {
  return (form.quantity * form.price).toFixed(2)
})

const maxQuantity = computed(() => {
  return selectedProduct.value?.stock || 9999
})

const stockTagType = computed(() => {
  if (!selectedProduct.value) return 'info'
  if (selectedProduct.value.stock <= 0) return 'danger'
  if (selectedProduct.value.stock <= selectedProduct.value.minStock) return 'warning'
  return 'success'
})

onMounted(() => {
  loadProducts()
  loadRecentRecords()
  
  if (route.query.productId) {
    form.productId = route.query.productId
    form.productType = route.query.type || 'medicine'
    handleProductChange(route.query.productId)
  }
})

const loadProducts = async () => {
  try {
    const url = form.productType === 'medicine' ? '/medicines' : '/devices'
    const res = await request({ url, method: 'get', params: { pageSize: 100 } })
    productList.value = res.list.filter(item => item.stock > 0)
  } catch (error) {
    console.error('加载产品失败:', error)
  }
}

const loadRecentRecords = async () => {
  try {
    const res = await request({
      url: '/outbound',
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
  selectedProduct.value = null
})

const handleTypeChange = () => {
  form.productId = ''
  form.productName = ''
  form.spec = ''
  form.unit = ''
  form.price = 0
  selectedProduct.value = null
}

const handleProductChange = (productId) => {
  const product = productList.value.find(p => p.id === productId)
  if (product) {
    selectedProduct.value = product
    form.productName = product.name
    form.spec = product.spec
    form.unit = product.unit
    form.price = product.price
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  // 检查库存
  if (form.quantity > selectedProduct.value.stock) {
    ElMessage.warning('出库数量不能大于当前库存')
    return
  }
  
  submitting.value = true
  try {
    await request({
      url: '/outbound',
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
        department: form.department,
        receiver: form.receiver,
        purpose: form.purpose,
        remark: form.remark,
        operatorId: 1,
        operatorName: '管理员',
        date: new Date().toISOString().split('T')[0]
      }
    })
    
    ElMessage.success('出库成功')
    handleReset()
    loadRecentRecords()
    loadProducts() // 刷新库存
    
  } catch (error) {
    ElMessage.error('出库失败')
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
  selectedProduct.value = null
}
</script>

<style lang="scss" scoped>
.outbound-page {
  .card-header {
    margin-bottom: 20px;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  
  .text-primary {
    color: #1890ff;
    font-weight: bold;
  }
}
</style>
