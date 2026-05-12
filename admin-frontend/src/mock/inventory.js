// 库存相关 Mock 数据
export const inboundRecords = [
  { id: 1, productName: '阿莫西林胶囊', productId: 1, productType: 'medicine', spec: '0.5g*24粒', batchNo: '20240101', quantity: 500, unitPrice: 25.00, totalAmount: 12500.00, supplier: '哈药集团', operatorName: '采购员', createTime: '2024-01-15 09:30:00', remark: '首次入库' },
  { id: 2, productName: '布洛芬缓释胶囊', productId: 2, productType: 'medicine', spec: '0.3g*20粒', batchNo: '20240115', quantity: 800, unitPrice: 18.50, totalAmount: 14800.00, supplier: '中美史克', operatorName: '采购员', createTime: '2024-01-20 10:15:00', remark: '常规补货' },
  { id: 3, productName: '电子血压计', productId: 1, productType: 'device', spec: 'HEM-7121', batchNo: '20240101', quantity: 50, unitPrice: 299.00, totalAmount: 14950.00, supplier: '欧姆龙代理', operatorName: '仓库管理员', createTime: '2024-02-01 14:00:00', remark: '新设备入库' },
  { id: 4, productName: '一次性注射器', productId: 3, productType: 'device', spec: '5ml', batchNo: '20240301', quantity: 5000, unitPrice: 0.50, totalAmount: 2500.00, supplier: '江西洪达', operatorName: '采购员', createTime: '2024-02-15 11:20:00', remark: '耗材补货' },
  { id: 5, productName: '感冒灵颗粒', productId: 3, productType: 'medicine', spec: '10g*9袋', batchNo: '20240201', quantity: 1000, unitPrice: 12.00, totalAmount: 12000.00, supplier: '广州白云山', operatorName: '采购员', createTime: '2024-03-01 08:45:00', remark: '流感季节备货' },
  { id: 6, productName: '维生素C片', productId: 5, productType: 'medicine', spec: '100mg*100片', batchNo: '20240401', quantity: 2000, unitPrice: 8.00, totalAmount: 16000.00, supplier: '东北制药', operatorName: '采购员', createTime: '2024-03-05 09:00:00', remark: '日常补货' },
  { id: 7, productName: '医用口罩', productId: 4, productType: 'device', spec: '成人款', batchNo: '20240401', quantity: 10000, unitPrice: 0.80, totalAmount: 8000.00, supplier: '振德医疗', operatorName: '仓库管理员', createTime: '2024-03-10 10:30:00', remark: '防护物资入库' },
  { id: 8, productName: '血糖仪', productId: 2, productType: 'device', spec: '稳步型', batchNo: '20240201', quantity: 100, unitPrice: 198.00, totalAmount: 19800.00, supplier: '强生代理', operatorName: '采购员', createTime: '2024-03-15 13:45:00', remark: '设备更新' }
]

export const outboundRecords = [
  { id: 1, productName: '阿莫西林胶囊', productId: 1, productType: 'medicine', spec: '0.5g*24粒', batchNo: '20240101', quantity: 100, unitPrice: 25.00, totalAmount: 2500.00, recipient: '门诊药房', operatorName: '仓库管理员', createTime: '2024-01-20 15:30:00', remark: '日常领用' },
  { id: 2, productName: '布洛芬缓释胶囊', productId: 2, productType: 'medicine', spec: '0.3g*20粒', batchNo: '20240115', quantity: 200, unitPrice: 18.50, totalAmount: 3700.00, recipient: '住院部', operatorName: '仓库管理员', createTime: '2024-01-25 09:20:00', remark: '住院部需求' },
  { id: 3, productName: '电子血压计', productId: 1, productType: 'device', spec: 'HEM-7121', batchNo: '20240101', quantity: 10, unitPrice: 299.00, totalAmount: 2990.00, recipient: '体检中心', operatorName: '仓库管理员', createTime: '2024-02-05 11:00:00', remark: '设备调配' },
  { id: 4, productName: '医用口罩', productId: 4, productType: 'device', spec: '成人款', batchNo: '20240401', quantity: 5000, unitPrice: 0.80, totalAmount: 4000.00, recipient: '各科室', operatorName: '仓库管理员', createTime: '2024-02-20 14:15:00', remark: '日常消耗' },
  { id: 5, productName: '感冒灵颗粒', productId: 3, productType: 'medicine', spec: '10g*9袋', batchNo: '20240201', quantity: 300, unitPrice: 12.00, totalAmount: 3600.00, recipient: '门诊药房', operatorName: '仓库管理员', createTime: '2024-03-05 16:00:00', remark: '流感高发期' },
  { id: 6, productName: '一次性注射器', productId: 3, productType: 'device', spec: '5ml', batchNo: '20240301', quantity: 2000, unitPrice: 0.50, totalAmount: 1000.00, recipient: '注射室', operatorName: '仓库管理员', createTime: '2024-03-12 10:00:00', remark: '日常消耗' },
  { id: 7, productName: '维生素C片', productId: 5, productType: 'medicine', spec: '100mg*100片', batchNo: '20240401', quantity: 500, unitPrice: 8.00, totalAmount: 4000.00, recipient: '门诊药房', operatorName: '仓库管理员', createTime: '2024-03-18 09:30:00', remark: '春季保健需求' },
  { id: 8, productName: '体温计', productId: 6, productType: 'device', spec: '水银型', batchNo: '20240601', quantity: 50, unitPrice: 5.00, totalAmount: 250.00, recipient: '发热门诊', operatorName: '仓库管理员', createTime: '2024-03-20 11:45:00', remark: '设备补充' }
]

export const warnings = [
  { id: 1, name: '阿司匹林肠溶片', type: 'medicine', spec: '100mg*30片', stock: 50, minStock: 100, unit: '盒', category: '解热镇痛', level: 'warning' },
  { id: 2, name: '氯雷他定片', type: 'medicine', spec: '10mg*6片', stock: 30, minStock: 60, unit: '盒', category: '抗过敏', level: 'danger' },
  { id: 3, name: '轮椅', type: 'device', spec: '折叠式', stock: 5, minStock: 10, unit: '辆', category: '康复设备', level: 'warning' },
  { id: 4, name: '复方甘草片', type: 'medicine', spec: '100片', stock: 100, minStock: 250, unit: '瓶', category: '止咳化痰', level: 'danger' },
  { id: 5, name: '雾化器', type: 'device', spec: '压缩式', stock: 15, minStock: 20, unit: '台', category: '治疗设备', level: 'warning' },
  { id: 6, name: '头孢克肟分散片', type: 'medicine', spec: '0.1g*6片', stock: 40, minStock: 80, unit: '盒', category: '抗生素', level: 'danger' }
]

export const statistics = {
  month: {
    totalInbound: 156,
    inboundAmount: 125680.00,
    totalOutbound: 189,
    outboundAmount: 98750.00,
    totalProducts: 20,
    lowStockCount: 6
  },
  quarter: {
    totalInbound: 456,
    inboundAmount: 386540.00,
    totalOutbound: 512,
    outboundAmount: 285600.00,
    totalProducts: 20,
    lowStockCount: 6
  },
  year: {
    totalInbound: 1824,
    inboundAmount: 1568900.00,
    totalOutbound: 2048,
    outboundAmount: 1125600.00,
    totalProducts: 20,
    lowStockCount: 6
  }
}

export const trendData = [
  { month: '1月', inbound: 12500, outbound: 8500 },
  { month: '2月', inbound: 15800, outbound: 12300 },
  { month: '3月', inbound: 18200, outbound: 15600 },
  { month: '4月', inbound: 14500, outbound: 11200 },
  { month: '5月', inbound: 16800, outbound: 13800 },
  { month: '6月', inbound: 19200, outbound: 16500 },
  { month: '7月', inbound: 21000, outbound: 18200 },
  { month: '8月', inbound: 23500, outbound: 19600 },
  { month: '9月', inbound: 19800, outbound: 17100 },
  { month: '10月', inbound: 22400, outbound: 18900 },
  { month: '11月', inbound: 25600, outbound: 21300 },
  { month: '12月', inbound: 28900, outbound: 24500 }
]

export const rankData = [
  { name: '阿莫西林胶囊', outbound: 568, amount: 14200 },
  { name: '感冒灵颗粒', outbound: 456, amount: 5472 },
  { name: '布洛芬缓释胶囊', outbound: 389, amount: 7197 },
  { name: '医用口罩', outbound: 15000, amount: 12000 },
  { name: '一次性注射器', outbound: 8000, amount: 4000 }
]

export const operationLogs = [
  { id: 1, operator: 'admin', action: '登录系统', module: '用户管理', ip: '192.168.1.100', time: '2024-03-01 09:00:00' },
  { id: 2, operator: 'admin', action: '添加药品', module: '药品管理', ip: '192.168.1.100', time: '2024-03-01 09:15:00', detail: '添加药品：奥美拉唑肠溶胶囊' },
  { id: 3, operator: '仓库管理员', action: '入库操作', module: '库存管理', ip: '192.168.1.101', time: '2024-03-01 10:00:00', detail: '入库：感冒灵颗粒 x 1000' },
  { id: 4, operator: '采购员', action: '出库操作', module: '库存管理', ip: '192.168.1.102', time: '2024-03-01 11:30:00', detail: '出库：阿莫西林胶囊 x 100' },
  { id: 5, operator: 'admin', action: '修改用户权限', module: '用户管理', ip: '192.168.1.100', time: '2024-03-01 14:00:00', detail: '修改用户：采购员' },
  { id: 6, operator: '仓库管理员', action: '库存盘点', module: '库存管理', ip: '192.168.1.101', time: '2024-03-02 09:30:00', detail: '完成月度盘点' },
  { id: 7, operator: 'admin', action: '导出报表', module: '统计分析', ip: '192.168.1.100', time: '2024-03-02 15:00:00', detail: '导出月度统计报表' },
  { id: 8, operator: '采购员', action: '新增供应商', module: '系统设置', ip: '192.168.1.102', time: '2024-03-03 10:00:00', detail: '新增供应商：XX医药公司' }
]
