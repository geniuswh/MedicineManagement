import request from '@/utils/request'

// 登录
export function login(data) {
  return request({ url: '/auth/login', method: 'post', data })
}

// 获取用户信息
export function getUserInfo() {
  return request({ url: '/auth/info', method: 'get' })
}

// 获取药品列表
export function getMedicines(params) {
  return request({ url: '/medicines', method: 'get', params })
}

// 获取药品分类
export function getMedicineCategories() {
  return request({ url: '/medicines/categories', method: 'get' })
}

// 添加药品
export function addMedicine(data) {
  return request({ url: '/medicines', method: 'post', data })
}

// 更新药品
export function updateMedicine(id, data) {
  return request({ url: `/medicines/${id}`, method: 'put', data })
}

// 删除药品
export function deleteMedicine(id) {
  return request({ url: `/medicines/${id}`, method: 'delete' })
}

// 获取器械列表
export function getDevices(params) {
  return request({ url: '/devices', method: 'get', params })
}

// 获取器械分类
export function getDeviceCategories() {
  return request({ url: '/devices/categories', method: 'get' })
}

// 添加器械
export function addDevice(data) {
  return request({ url: '/devices', method: 'post', data })
}

// 更新器械
export function updateDevice(id, data) {
  return request({ url: `/devices/${id}`, method: 'put', data })
}

// 删除器械
export function deleteDevice(id) {
  return request({ url: `/devices/${id}`, method: 'delete' })
}

// 获取入库记录
export function getInboundRecords(params) {
  return request({ url: '/inbound', method: 'get', params })
}

// 添加入库记录
export function addInbound(data) {
  return request({ url: '/inbound', method: 'post', data })
}

// 获取出库记录
export function getOutboundRecords(params) {
  return request({ url: '/outbound', method: 'get', params })
}

// 添加出库记录
export function addOutbound(data) {
  return request({ url: '/outbound', method: 'post', data })
}

// 获取库存预警
export function getWarnings() {
  return request({ url: '/warnings', method: 'get' })
}

// 获取统计数据
export function getStatistics(params) {
  return request({ url: '/statistics', method: 'get', params })
}

// 获取趋势数据
export function getTrendData(params) {
  return request({ url: '/statistics/trend', method: 'get', params })
}

// 获取排行数据
export function getRankData(params) {
  return request({ url: '/statistics/rank', method: 'get', params })
}

// 获取用户列表
export function getUsers(params) {
  return request({ url: '/users', method: 'get', params })
}

// 获取角色列表
export function getRoles() {
  return request({ url: '/roles', method: 'get' })
}

// 获取权限列表
export function getPermissions() {
  return request({ url: '/permissions', method: 'get' })
}

// 获取操作日志
export function getOperationLogs(params) {
  return request({ url: '/logs', method: 'get', params })
}

// 获取库存信息
export function getStock() {
  return request({ url: '/stock', method: 'get' })
}
