// 小程序 Mock数据
const mockMedicines = [
  { _id: 'med_001', name: '阿莫西林胶囊', spec: '0.5g*24粒', unit: '盒', price: 15.50, stock: 580, minStock: 100, category: '抗生素', manufacturer: '哈药集团制药总厂', barcode: '6901234567890' },
  { _id: 'med_002', name: '布洛芬片', spec: '0.2g*100片', unit: '瓶', price: 22.00, stock: 420, minStock: 80, category: '解热镇痛', manufacturer: '中美史克制药有限公司', barcode: '6901234567891' },
  { _id: 'med_003', name: '维生素C片', spec: '0.1g*100片', unit: '瓶', price: 8.50, stock: 850, minStock: 200, category: '维生素类', manufacturer: '东北制药集团', barcode: '6901234567892' },
  { _id: 'med_004', name: '阿奇霉素分散片', spec: '0.25g*6片', unit: '盒', price: 35.00, stock: 45, minStock: 60, category: '抗生素', manufacturer: '石药集团欧意药业有限公司', barcode: '6901234567893' },
  { _id: 'med_005', name: '复方感冒灵颗粒', spec: '10g*9袋', unit: '盒', price: 18.00, stock: 320, minStock: 100, category: '感冒用药', manufacturer: '广州白云山制药股份有限公司', barcode: '6901234567894' }
]

const mockDevices = [
  { _id: 'dev_001', name: '一次性使用无菌注射器', spec: '5ml', unit: '支', price: 1.50, stock: 2500, minStock: 500, category: '注射穿刺类', manufacturer: '山东威高集团', barcode: '6902345678901' },
  { _id: 'dev_002', name: '医用外科口罩', spec: '17.5cm×9.5cm', unit: '个', price: 0.50, stock: 800, minStock: 300, category: '医用防护', manufacturer: '河南飘安集团有限公司', barcode: '6902345678902' },
  { _id: 'dev_003', name: '一次性使用输液器', spec: '带针型', unit: '套', price: 3.20, stock: 1800, minStock: 400, category: '输液类', manufacturer: '江西洪达医疗器械集团', barcode: '6902345678903' },
  { _id: 'dev_004', name: '医用手套（乳胶）', spec: 'M号', unit: '副', price: 2.50, stock: 1200, minStock: 200, category: '医用防护', manufacturer: '蓝帆医疗股份有限公司', barcode: '6902345678904' },
  { _id: 'dev_005', name: '电子血压计', spec: '臂式', unit: '台', price: 299.00, stock: 25, minStock: 10, category: '诊断设备', manufacturer: '欧姆龙（大连）有限公司', barcode: '6902345678905' }
]

const mockUsers = [
  { _id: 'user_001', account: 'admin', phone: '13800138000', name: '系统管理员', password: 'admin123', department: '技术部', role: 'admin', permissions: ['*'], status: 'active' },
  { _id: 'user_002', account: 'manager', phone: '13800138001', name: '张经理', password: '123456', department: '管理部', role: 'manager', permissions: ['medicine:view', 'device:view', 'inbound:view', 'outbound:view', 'statistics:view'], status: 'active' },
  { _id: 'user_003', account: 'warehouse', phone: '13800138002', name: '李仓管', password: '123456', department: '仓库管理部', role: 'warehouse', permissions: ['medicine:view', 'device:view', 'inbound:add', 'outbound:add'], status: 'active' },
  { _id: 'user_004', account: 'viewer', phone: '13800138003', name: '王查看', password: '123456', department: '质量部', role: 'viewer', permissions: ['medicine:view', 'device:view'], status: 'active' }
]

const mockInboundRecords = [
  { _id: 'ib_001', productId: 'med_001', productName: '阿莫西林胶囊', productType: '药品', spec: '0.5g*24粒', batchNo: '2024011501', quantity: 100, unit: '盒', price: 15.50, totalAmount: 1550.00, supplier: '哈药集团', productionDate: '2024-01-01', expiryDate: '2026-01-01', operatorName: '李仓管', date: '2024-01-15', createTime: new Date() },
  { _id: 'ib_002', productId: 'dev_002', productName: '医用外科口罩', productType: '医疗器械', spec: '17.5cm×9.5cm', batchNo: '2024011502', quantity: 500, unit: '个', price: 0.50, totalAmount: 250.00, supplier: '河南飘安集团', productionDate: '2024-01-05', expiryDate: '2026-01-05', operatorName: '李仓管', date: '2024-01-15', createTime: new Date() }
]

const mockOutboundRecords = [
  { _id: 'ob_001', productId: 'med_001', productName: '阿莫西林胶囊', productType: '药品', spec: '0.5g*24粒', batchNo: '2024011501', quantity: 20, unit: '盒', price: 15.50, totalAmount: 310.00, department: '内科', receiver: '张医生', operatorName: '李仓管', date: '2024-01-15', createTime: new Date() },
  { _id: 'ob_002', productId: 'dev_002', productName: '医用外科口罩', productType: '医疗器械', spec: '17.5cm×9.5cm', batchNo: '2024011502', quantity: 100, unit: '个', price: 0.50, totalAmount: 50.00, department: '外科', receiver: '王护士', operatorName: '李仓管', date: '2024-01-15', createTime: new Date() }
]

// Mock API
const mockApi = {
  // 登录
  login: (account, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => (u.account === account || u.phone === account) && u.password === password)
        if (user) {
          const { password: _, ...userInfo } = user
          resolve({ success: true, data: { token: user._id, userInfo, permissions: user.permissions } })
        } else {
          resolve({ success: false, error: '账号或密码错误' })
        }
      }, 500)
    })
  },

  // 获取药品列表
  getMedicines: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...mockMedicines]
        if (params.keyword) {
          result = result.filter(m => m.name.includes(params.keyword))
        }
        resolve({ success: true, data: result })
      }, 300)
    })
  },

  // 获取器械列表
  getDevices: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...mockDevices]
        if (params.keyword) {
          result = result.filter(d => d.name.includes(params.keyword))
        }
        resolve({ success: true, data: result })
      }, 300)
    })
  },

  // 获取入库记录
  getInboundRecords: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockInboundRecords })
      }, 300)
    })
  },

  // 获取出库记录
  getOutboundRecords: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockOutboundRecords })
      }, 300)
    })
  },

  // 获取统计数据
  getStatistics: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalProducts: mockMedicines.length + mockDevices.length,
            todayInbound: mockInboundRecords.length,
            todayOutbound: mockOutboundRecords.length,
            warnings: mockMedicines.filter(m => m.stock <= m.minStock).length + mockDevices.filter(d => d.stock <= d.minStock).length
          }
        })
      }, 300)
    })
  },

  // 获取库存预警
  getWarnings: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const warnings = [
          ...mockMedicines.filter(m => m.stock <= m.minStock).map(m => ({ ...m, type: 'medicine' })),
          ...mockDevices.filter(d => d.stock <= d.minStock).map(d => ({ ...d, type: 'device' }))
        ]
        resolve({ success: true, data: warnings })
      }, 300)
    })
  },

  // 入库
  addInbound: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          _id: 'ib_' + Date.now(),
          ...data,
          createTime: new Date()
        }
        mockInboundRecords.unshift(newRecord)
        
        // 更新库存
        const medicine = mockMedicines.find(m => m._id === data.productId)
        if (medicine) {
          medicine.stock += data.quantity
        } else {
          const device = mockDevices.find(d => d._id === data.productId)
          if (device) {
            device.stock += data.quantity
          }
        }
        
        resolve({ success: true, data: newRecord })
      }, 500)
    })
  },

  // 出库
  addOutbound: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          _id: 'ob_' + Date.now(),
          ...data,
          createTime: new Date()
        }
        mockOutboundRecords.unshift(newRecord)
        
        // 更新库存
        const medicine = mockMedicines.find(m => m._id === data.productId)
        if (medicine) {
          medicine.stock = Math.max(0, medicine.stock - data.quantity)
        } else {
          const device = mockDevices.find(d => d._id === data.productId)
          if (device) {
            device.stock = Math.max(0, device.stock - data.quantity)
          }
        }
        
        resolve({ success: true, data: newRecord })
      }, 500)
    })
  }
}

module.exports = {
  mockMedicines,
  mockDevices,
  mockUsers,
  mockInboundRecords,
  mockOutboundRecords,
  mockApi
}
