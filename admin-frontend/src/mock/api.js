// 后台管理 Mock API
import { users, roles, permissions } from './user'
import { medicines, medicineCategories } from './medicine'
import { devices, deviceCategories } from './device'
import { inboundRecords, outboundRecords, warnings, statistics, trendData, operationLogs } from './inventory'

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

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
      token: `admin_token_${user.id}_${Date.now()}`,
      userInfo,
      permissions: user.permissions
    })
  }
  return response(null, false)
}

// 药品管理
export const mockGetMedicines = async (params = {}) => {
  await delay(200)
  let result = [...medicines]
  
  if (params.keyword) {
    result = result.filter(m => m.name.includes(params.keyword) || m.barcode?.includes(params.keyword))
  }
  if (params.category) {
    result = result.filter(m => m.category === params.category)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  
  return response({ list: result.slice(start, start + pageSize), total, page, pageSize })
}

export const mockGetDevices = async (params = {}) => {
  await delay(200)
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
  
  return response({ list: result.slice(start, start + pageSize), total, page, pageSize })
}

// 库存记录
export const mockGetInboundRecords = async (params = {}) => {
  await delay(200)
  let result = [...inboundRecords]
  
  if (params.keyword) {
    result = result.filter(r => r.productName.includes(params.keyword) || r.batchNo?.includes(params.keyword))
  }
  if (params.startDate && params.endDate) {
    result = result.filter(r => r.createTime >= params.startDate && r.createTime <= params.endDate)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  
  return response({ list: result.slice(start, start + pageSize), total, page, pageSize })
}

export const mockGetOutboundRecords = async (params = {}) => {
  await delay(200)
  let result = [...outboundRecords]
  
  if (params.keyword) {
    result = result.filter(r => r.productName.includes(params.keyword) || r.batchNo?.includes(params.keyword))
  }
  if (params.startDate && params.endDate) {
    result = result.filter(r => r.createTime >= params.startDate && r.createTime <= params.endDate)
  }
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  
  return response({ list: result.slice(start, start + pageSize), total, page, pageSize })
}

// 统计数据
export const mockGetStatistics = async (period = 'month') => {
  await delay(200)
  return response(statistics[period] || statistics.month)
}

export const mockGetTrendData = async () => {
  await delay(200)
  return response(trendData)
}

export const mockGetWarnings = async () => {
  await delay(200)
  return response(warnings)
}

// 用户管理
export const mockGetUsers = async (params = {}) => {
  await delay(200)
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
  
  return response({ list: result.slice(start, start + pageSize), total, page, pageSize })
}

export const mockGetRoles = async () => {
  await delay(200)
  return response(roles)
}

export const mockGetPermissions = async () => {
  await delay(200)
  return response(permissions)
}

export const mockGetOperationLogs = async (params = {}) => {
  await delay(200)
  let result = [...operationLogs]
  
  const total = result.length
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  
  return response({ list: result.slice(start, start + pageSize), total, page, pageSize })
}

// 导出分类数据
export const mockGetMedicineCategories = async () => {
  await delay(100)
  return response(medicineCategories)
}

export const mockGetDeviceCategories = async () => {
  await delay(100)
  return response(deviceCategories)
}

export default {
  login: mockLogin,
  getMedicines: mockGetMedicines,
  getDevices: mockGetDevices,
  getMedicineCategories: mockGetMedicineCategories,
  getDeviceCategories: mockGetDeviceCategories,
  getInboundRecords: mockGetInboundRecords,
  getOutboundRecords: mockGetOutboundRecords,
  getStatistics: mockGetStatistics,
  getTrendData: mockGetTrendData,
  getWarnings: mockGetWarnings,
  getUsers: mockGetUsers,
  getRoles: mockGetRoles,
  getPermissions: mockGetPermissions,
  getOperationLogs: mockGetOperationLogs
}
