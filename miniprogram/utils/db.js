/**
 * 数据库操作封装 - 纯Mock模式
 */

const mock = require('./mock')

/**
 * 通用查询方法
 */
async function query(collection, options = {}) {
  return mockQuery(collection, options)
}

// Mock查询
function mockQuery(collection, options) {
  const { where = {}, limit = 20, skip = 0 } = options
  
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = []
      
      switch (collection) {
        case 'medicines':
          data = mock.mockMedicines
          break
        case 'devices':
          data = mock.mockDevices
          break
        case 'users':
          data = mock.mockUsers
          break
        case 'inbound_records':
          data = mock.mockInboundRecords
          break
        case 'outbound_records':
          data = mock.mockOutboundRecords
          break
      }
      
      resolve({
        success: true,
        data: data.slice(skip, skip + limit),
        total: data.length
      })
    }, 300)
  })
}

/**
 * 根据ID查询单条数据
 */
async function getById(collection, id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = null
      
      switch (collection) {
        case 'medicines':
          data = mock.mockMedicines.find(m => m._id === id)
          break
        case 'devices':
          data = mock.mockDevices.find(d => d._id === id)
          break
        case 'users':
          data = mock.mockUsers.find(u => u._id === id)
          break
      }
      
      resolve({
        success: !!data,
        data: data || null,
        error: data ? null : '未找到数据'
      })
    }, 200)
  })
}

/**
 * 新增数据
 */
async function add(collection, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = collection.substring(0, 3) + '_' + Date.now()
      
      const newItem = {
        _id: newId,
        ...data,
        createTime: new Date(),
        updateTime: new Date()
      }
      
      switch (collection) {
        case 'inbound_records':
          mock.mockInboundRecords.unshift(newItem)
          break
        case 'outbound_records':
          mock.mockOutboundRecords.unshift(newItem)
          break
      }
      
      resolve({
        success: true,
        id: newId
      })
    }, 300)
  })
}

/**
 * 更新数据
 */
async function update(collection, id, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 300)
  })
}

/**
 * 统计数量
 */
async function count(collection, where = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let total = 0
      
      switch (collection) {
        case 'medicines':
          total = mock.mockMedicines.length
          break
        case 'devices':
          total = mock.mockDevices.length
          break
        case 'inbound_records':
          total = mock.mockInboundRecords.length
          break
        case 'outbound_records':
          total = mock.mockOutboundRecords.length
          break
      }
      
      resolve({
        success: true,
        total
      })
    }, 200)
  })
}

module.exports = {
  query,
  getById,
  add,
  update,
  count,
  mockApi: mock.mockApi
}
