/**
 * 数据库操作封装 - 通过后端API
 */

const API_BASE = 'http://localhost:3002/api'

function getToken() {
  return wx.getStorageSync('token') || ''
}

async function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          resolve({ success: true, data: res.data.data })
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          wx.redirectTo({ url: '/pages/login/login' })
          reject(new Error('登录已过期'))
        } else {
          resolve({ success: false, error: res.data?.message || '请求失败' })
        }
      },
      fail: (err) => {
        console.error('API请求失败:', err)
        resolve({ success: false, error: '网络错误' })
      }
    })
  })
}

const mockApi = {
  // 登录
  login: (account, password) => request('/auth/login', 'POST', { account, password }),

  // 获取药品列表
  getMedicines: (params = {}) => request(`/medicines?keyword=${params.keyword || ''}&category=${params.category || ''}&page=${params.page || 1}&pageSize=${params.pageSize || 50}`),

  // 获取器械列表
  getDevices: (params = {}) => request(`/devices?keyword=${params.keyword || ''}&category=${params.category || ''}&page=${params.page || 1}&pageSize=${params.pageSize || 50}`),

  // 获取入库记录
  getInboundRecords: (params = {}) => request(`/inbound?keyword=${params.keyword || ''}&page=${params.page || 1}&pageSize=${params.pageSize || 50}`),

  // 获取出库记录
  getOutboundRecords: (params = {}) => request(`/outbound?keyword=${params.keyword || ''}&page=${params.page || 1}&pageSize=${params.pageSize || 50}`),

  // 获取统计数据
  getStatistics: () => request('/statistics'),

  // 获取库存预警
  getWarnings: () => request('/warnings'),

  // 入库
  addInbound: (data) => request('/inbound', 'POST', data),

  // 出库
  addOutbound: (data) => request('/outbound', 'POST', data)
}

module.exports = {
  mockApi,
  request
}
