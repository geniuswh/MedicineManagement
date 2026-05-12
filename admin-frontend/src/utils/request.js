// Admin Mock请求封装
import mockApi from '@/mock/api'
import { medicineCategories } from '@/mock/medicine'
import { deviceCategories } from '@/mock/device'

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

// 请求封装
const request = async (config) => {
  const { url, method = 'get', data, params } = config
  
  // 解析API路径
  const apiPath = url.replace('/api/', '').split('/')
  
  await delay(150)
  
  try {
    let result
    
    // 路由分发
    switch (apiPath[0]) {
      // 认证相关
      case 'auth':
        if (apiPath[1] === 'login') {
          result = await mockApi.login(data.account, data.password)
        }
        break
        
      // 药品管理
      case 'medicines':
        if (apiPath[1] === 'categories') {
          result = { code: 200, data: medicineCategories }
        } else {
          result = await mockApi.getMedicines(params || {})
        }
        break
        
      // 器械管理
      case 'devices':
        if (apiPath[1] === 'categories') {
          result = { code: 200, data: deviceCategories }
        } else {
          result = await mockApi.getDevices(params || {})
        }
        break
        
      // 入库记录
      case 'inbound':
        result = await mockApi.getInboundRecords(params || {})
        break
        
      // 出库记录
      case 'outbound':
        result = await mockApi.getOutboundRecords(params || {})
        break
        
      // 库存预警
      case 'warnings':
        result = await mockApi.getWarnings()
        break
        
      // 统计分析
      case 'statistics':
        if (apiPath[1] === 'trend') {
          result = await mockApi.getTrendData()
        } else {
          result = await mockApi.getStatistics(params?.period)
        }
        break
        
      // 用户管理
      case 'users':
        result = await mockApi.getUsers(params || {})
        break
        
      // 角色管理
      case 'roles':
        result = await mockApi.getRoles()
        break
        
      // 权限管理
      case 'permissions':
        result = await mockApi.getPermissions()
        break
        
      // 操作日志
      case 'logs':
        result = await mockApi.getOperationLogs(params || {})
        break
        
      default:
        result = { code: 404, message: 'API not found' }
    }
    
    if (result && result.code === 200) {
      return result.data
    } else {
      throw new Error(result?.message || '请求失败')
    }
  } catch (error) {
    console.error('Mock API Error:', error)
    throw error
  }
}

export default request
