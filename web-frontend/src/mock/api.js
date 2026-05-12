// Mock API 服务
import { users, roles, permissions } from './user'
import { medicines, medicineCategories } from './medicine'
import { devices, deviceCategories } from './device'
import { inboundRecords, outboundRecords, warnings, statistics, trendData, rankData, operationLogs } from './inventory'

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟API响应
const response = (data, success = true) => ({
  code: success ? 200 : 500,
  data,
  message: success ? 'success' : 'error'
})

// 登录
export const mockLogin = async (account, password) => {
  await delay(500)
  const user = users.find(u => (u.account === account || u.phone === account) && u.password === password)
  if (user) {
    const { password: _, ...userInfo } = user
    return response({
      token: `mock_token_${user.id}_${Date.now()}`,
      userInfo,
      permissions: user.permissions
    })
  }
  return response(null, false)
}

// 获取用户信息
export const mockGetUserInfo = async () => {
  await delay(200)
  return response(users[0])
}

// ========== 药品管理 ==========
export const mockGetMedicines = async (params = {}) => {
  await delay(300)
  let result = [...medicines]
  
  // 搜索
  if (params.keyword) {
    result = result.filter(m => m.name.includes(params.keyword) || m.barcode?.includes(params.keyword))
  }
  
  // 分类筛选
  if (params.category) {
    result = result.filter(m => m.category === params.category)
  }
  
  // 状态筛选
  if (params.status) {
    result = result.filter(m => m.status === params.status)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const list = result.slice(start, start + pageSize)
  
  return response({ list, total, page, pageSize })
}

export const mockGetMedicineCategories = async () => {
  await delay(200)
  return response(medicineCategories)
}

export const mockAddMedicine = async (data) => {
  await delay(300)
  const newMedicine = {
    ...data,
    id: `med_${Date.now()}`,
    stock: 0,
    status: 'active',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  medicines.push(newMedicine)
  return response(newMedicine)
}

export const mockUpdateMedicine = async (id, data) => {
  await delay(300)
  const index = medicines.findIndex(m => m.id === id)
  if (index > -1) {
    medicines[index] = { ...medicines[index], ...data, updateTime: new Date().toISOString() }
    return response(medicines[index])
  }
  return response(null, false)
}

export const mockDeleteMedicine = async (id) => {
  await delay(300)
  const index = medicines.findIndex(m => m.id === id)
  if (index > -1) {
    medicines.splice(index, 1)
    return response({ success: true })
  }
  return response(null, false)
}

// ========== 医疗器械管理 ==========
export const mockGetDevices = async (params = {}) => {
  await delay(300)
  let result = [...devices]
  
  if (params.keyword) {
    result = result.filter(d => d.name.includes(params.keyword) || d.barcode?.includes(params.keyword))
  }
  
  if (params.category) {
    result = result.filter(d => d.category === params.category)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const list = result.slice(start, start + pageSize)
  
  return response({ list, total, page, pageSize })
}

export const mockGetDeviceCategories = async () => {
  await delay(200)
  return response(deviceCategories)
}

// ========== 库存管理 ==========
export const mockGetInboundRecords = async (params = {}) => {
  await delay(300)
  let result = [...inboundRecords]
  
  if (params.keyword) {
    result = result.filter(r => r.productName.includes(params.keyword) || r.batchNo?.includes(params.keyword))
  }
  
  if (params.productId) {
    result = result.filter(r => r.productId === params.productId)
  }
  
  if (params.startDate && params.endDate) {
    result = result.filter(r => r.date >= params.startDate && r.date <= params.endDate)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const list = result.slice(start, start + pageSize)
  
  return response({ list, total, page, pageSize })
}

export const mockGetOutboundRecords = async (params = {}) => {
  await delay(300)
  let result = [...outboundRecords]
  
  if (params.keyword) {
    result = result.filter(r => r.productName.includes(params.keyword) || r.batchNo?.includes(params.keyword))
  }
  
  if (params.productId) {
    result = result.filter(r => r.productId === params.productId)
  }
  
  if (params.startDate && params.endDate) {
    result = result.filter(r => r.date >= params.startDate && r.date <= params.endDate)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const list = result.slice(start, start + pageSize)
  
  return response({ list, total, page, pageSize })
}

export const mockAddInbound = async (data) => {
  await delay(500)
  const newRecord = {
    ...data,
    id: `ib_${Date.now()}`,
    createTime: new Date().toISOString()
  }
  inboundRecords.unshift(newRecord)
  
  // 更新库存
  const medicine = medicines.find(m => m.id === data.productId)
  if (medicine) {
    medicine.stock += data.quantity
  } else {
    const device = devices.find(d => d.id === data.productId)
    if (device) {
      device.stock += data.quantity
    }
  }
  
  return response(newRecord)
}

export const mockAddOutbound = async (data) => {
  await delay(500)
  const newRecord = {
    ...data,
    id: `ob_${Date.now()}`,
    createTime: new Date().toISOString()
  }
  outboundRecords.unshift(newRecord)
  
  // 更新库存
  const medicine = medicines.find(m => m.id === data.productId)
  if (medicine) {
    medicine.stock = Math.max(0, medicine.stock - data.quantity)
  } else {
    const device = devices.find(d => d.id === data.productId)
    if (device) {
      device.stock = Math.max(0, device.stock - data.quantity)
    }
  }
  
  return response(newRecord)
}

export const mockGetWarnings = async () => {
  await delay(200)
  return response(warnings)
}

// ========== 统计分析 ==========
export const mockGetStatistics = async (period = 'month') => {
  await delay(300)
  return response({
    ...statistics,
    period: statistics[period] || statistics.month
  })
}

export const mockGetTrendData = async (period = 'week') => {
  await delay(300)
  return response(trendData)
}

export const mockGetRankData = async (type = 'outbound') => {
  await delay(300)
  return response(rankData[type] || rankData.outboundRank)
}

// ========== 用户管理 ==========
export const mockGetUsers = async (params = {}) => {
  await delay(300)
  let result = users.map(u => {
    const { password, ...userInfo } = u
    return userInfo
  })
  
  if (params.keyword) {
    result = result.filter(u => u.name.includes(params.keyword) || u.account.includes(params.keyword))
  }
  
  if (params.role) {
    result = result.filter(u => u.role === params.role)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const list = result.slice(start, start + pageSize)
  
  return response({ list, total, page, pageSize })
}

export const mockGetRoles = async () => {
  await delay(200)
  return response(roles)
}

export const mockGetPermissions = async () => {
  await delay(200)
  return response(permissions)
}

// ========== 操作日志 ==========
export const mockGetOperationLogs = async (params = {}) => {
  await delay(300)
  let result = [...operationLogs]
  
  if (params.userId) {
    result = result.filter(l => l.userId === params.userId)
  }
  
  if (params.module) {
    result = result.filter(l => l.module === params.module)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const list = result.slice(start, start + pageSize)
  
  return response({ list, total, page, pageSize })
}

export default {
  login: mockLogin,
  getUserInfo: mockGetUserInfo,
  getMedicines: mockGetMedicines,
  getMedicineCategories: mockGetMedicineCategories,
  addMedicine: mockAddMedicine,
  updateMedicine: mockUpdateMedicine,
  deleteMedicine: mockDeleteMedicine,
  getDevices: mockGetDevices,
  getDeviceCategories: mockGetDeviceCategories,
  getInboundRecords: mockGetInboundRecords,
  getOutboundRecords: mockGetOutboundRecords,
  addInbound: mockAddInbound,
  addOutbound: mockAddOutbound,
  getWarnings: mockGetWarnings,
  getStatistics: mockGetStatistics,
  getTrendData: mockGetTrendData,
  getRankData: mockGetRankData,
  getUsers: mockGetUsers,
  getRoles: mockGetRoles,
  getPermissions: mockGetPermissions,
  getOperationLogs: mockGetOperationLogs
}
