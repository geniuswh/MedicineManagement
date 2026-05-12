// Mock API 路由
import mockApi from './api'

// 判断是否使用Mock
const USE_MOCK = true

// 请求封装
const request = async (config) => {
  if (!USE_MOCK) {
    // 真实API请求
    const axios = await import('axios')
    return axios.default(config)
  }
  
  // Mock请求
  const { url, method = 'get', data, params } = config
  
  // 解析API路径
  const apiPath = url.replace('/api/', '').split('/')
  
  try {
    let result
    
    // 路由分发
    switch (apiPath[0]) {
      // 认证相关
      case 'auth':
        if (apiPath[1] === 'login') {
          result = await mockApi.login(data.account, data.password)
        } else if (apiPath[1] === 'info') {
          result = await mockApi.getUserInfo()
        }
        break
        
      // 药品管理
      case 'medicines':
        if (apiPath[1]) {
          if (method === 'put') {
            result = await mockApi.updateMedicine(apiPath[1], data)
          } else if (method === 'delete') {
            result = await mockApi.deleteMedicine(apiPath[1])
          } else {
            result = await mockApi.getMedicines({ id: apiPath[1] })
          }
        } else if (apiPath[1] === 'categories') {
          result = await mockApi.getMedicineCategories()
        } else {
          if (method === 'post') {
            result = await mockApi.addMedicine(data)
          } else {
            result = await mockApi.getMedicines(params || {})
          }
        }
        break
        
      // 器械管理
      case 'devices':
        if (apiPath[1] === 'categories') {
          result = await mockApi.getDeviceCategories()
        } else {
          result = await mockApi.getDevices(params || {})
        }
        break
        
      // 入库记录
      case 'inbound':
        if (method === 'post') {
          result = await mockApi.addInbound(data)
        } else {
          result = await mockApi.getInboundRecords(params || {})
        }
        break
        
      // 出库记录
      case 'outbound':
        if (method === 'post') {
          result = await mockApi.addOutbound(data)
        } else {
          result = await mockApi.getOutboundRecords(params || {})
        }
        break
        
      // 库存预警
      case 'warnings':
        result = await mockApi.getWarnings()
        break
        
      // 统计分析
      case 'statistics':
        if (apiPath[1] === 'trend') {
          result = await mockApi.getTrendData(params?.period)
        } else if (apiPath[1] === 'rank') {
          result = await mockApi.getRankData(params?.type)
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
    
    if (result.code === 200) {
      return result.data
    } else {
      throw new Error(result.message || '请求失败')
    }
  } catch (error) {
    console.error('Mock API Error:', error)
    throw error
  }
}

export default request
