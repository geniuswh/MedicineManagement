// Mock数据 - 库存相关
import { medicines } from './medicine'
import { devices } from './device'
import { users } from './user'

// 生成过去N天的日期
function getDateString(daysAgo) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// 入库记录
export const inboundRecords = [
  // 今天
  {
    id: 'ib_001',
    productId: 'med_001',
    productName: '阿莫西林胶囊',
    productType: '药品',
    spec: '0.5g*24粒',
    batchNo: '2024011501',
    quantity: 100,
    unit: '盒',
    price: 15.50,
    totalAmount: 1550.00,
    supplier: '哈药集团医药有限公司',
    productionDate: '2024-01-01',
    expiryDate: '2026-01-01',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(0),
    remark: '常规补货',
    createTime: `${getDateString(0)} 09:30:00`
  },
  {
    id: 'ib_002',
    productId: 'dev_002',
    productName: '医用外科口罩',
    productType: '医疗器械',
    spec: '17.5cm×9.5cm',
    batchNo: '2024011502',
    quantity: 500,
    unit: '个',
    price: 0.50,
    totalAmount: 250.00,
    supplier: '河南飘安集团有限公司',
    productionDate: '2024-01-05',
    expiryDate: '2026-01-05',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(0),
    remark: '防疫物资',
    createTime: `${getDateString(0)} 10:15:00`
  },
  {
    id: 'ib_003',
    productId: 'med_002',
    productName: '布洛芬片',
    productType: '药品',
    spec: '0.2g*100片',
    batchNo: '2024011503',
    quantity: 50,
    unit: '瓶',
    price: 22.00,
    totalAmount: 1100.00,
    supplier: '中美史克制药有限公司',
    productionDate: '2024-01-03',
    expiryDate: '2026-01-03',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(0),
    remark: '',
    createTime: `${getDateString(0)} 14:20:00`
  },
  // 昨天
  {
    id: 'ib_004',
    productId: 'med_003',
    productName: '维生素C片',
    productType: '药品',
    spec: '0.1g*100片',
    batchNo: '2024011401',
    quantity: 200,
    unit: '瓶',
    price: 8.50,
    totalAmount: 1700.00,
    supplier: '东北制药集团',
    productionDate: '2024-01-02',
    expiryDate: '2026-01-02',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(1),
    remark: '',
    createTime: `${getDateString(1)} 08:45:00`
  },
  {
    id: 'ib_005',
    productId: 'dev_003',
    productName: '一次性使用输液器',
    productType: '医疗器械',
    spec: '带针型',
    batchNo: '2024011402',
    quantity: 300,
    unit: '套',
    price: 3.20,
    totalAmount: 960.00,
    supplier: '江西洪达医疗器械集团',
    productionDate: '2024-01-01',
    expiryDate: '2027-01-01',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(1),
    remark: '',
    createTime: `${getDateString(1)} 11:30:00`
  },
  // 前天
  {
    id: 'ib_006',
    productId: 'med_006',
    productName: '板蓝根颗粒',
    productType: '药品',
    spec: '10g*20袋',
    batchNo: '2024011301',
    quantity: 150,
    unit: '盒',
    price: 25.00,
    totalAmount: 3750.00,
    supplier: '广州白云山和记黄埔中药有限公司',
    productionDate: '2023-12-20',
    expiryDate: '2025-12-20',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(2),
    remark: '',
    createTime: `${getDateString(2)} 09:00:00`
  }
]

// 出库记录
export const outboundRecords = [
  // 今天
  {
    id: 'ob_001',
    productId: 'med_001',
    productName: '阿莫西林胶囊',
    productType: '药品',
    spec: '0.5g*24粒',
    batchNo: '2024011501',
    quantity: 20,
    unit: '盒',
    price: 15.50,
    totalAmount: 310.00,
    department: '内科',
    receiver: '张医生',
    purpose: '门诊用药',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(0),
    remark: '',
    createTime: `${getDateString(0)} 10:30:00`
  },
  {
    id: 'ob_002',
    productId: 'dev_002',
    productName: '医用外科口罩',
    productType: '医疗器械',
    spec: '17.5cm×9.5cm',
    batchNo: '2024011502',
    quantity: 100,
    unit: '个',
    price: 0.50,
    totalAmount: 50.00,
    department: '外科',
    receiver: '王护士',
    purpose: '日常使用',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(0),
    remark: '',
    createTime: `${getDateString(0)} 11:45:00`
  },
  {
    id: 'ob_003',
    productId: 'dev_001',
    productName: '一次性使用无菌注射器',
    productType: '医疗器械',
    spec: '5ml',
    batchNo: '2024011001',
    quantity: 200,
    unit: '支',
    price: 1.50,
    totalAmount: 300.00,
    department: '注射室',
    receiver: '李护士',
    purpose: '日常注射',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(0),
    remark: '',
    createTime: `${getDateString(0)} 15:00:00`
  },
  // 昨天
  {
    id: 'ob_004',
    productId: 'med_002',
    productName: '布洛芬片',
    productType: '药品',
    spec: '0.2g*100片',
    batchNo: '2024011201',
    quantity: 15,
    unit: '瓶',
    price: 22.00,
    totalAmount: 330.00,
    department: '内科',
    receiver: '刘医生',
    purpose: '门诊用药',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(1),
    remark: '',
    createTime: `${getDateString(1)} 09:20:00`
  },
  {
    id: 'ob_005',
    productId: 'dev_008',
    productName: '医用纱布块',
    productType: '医疗器械',
    spec: '10cm×10cm',
    batchNo: '2024011101',
    quantity: 100,
    unit: '块',
    price: 0.80,
    totalAmount: 80.00,
    department: '外科',
    receiver: '赵护士',
    purpose: '换药使用',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(1),
    remark: '',
    createTime: `${getDateString(1)} 14:30:00`
  },
  // 前天
  {
    id: 'ob_006',
    productId: 'med_003',
    productName: '维生素C片',
    productType: '药品',
    spec: '0.1g*100片',
    batchNo: '2024011002',
    quantity: 30,
    unit: '瓶',
    price: 8.50,
    totalAmount: 255.00,
    department: '药房',
    receiver: '周药师',
    purpose: '零售',
    operatorId: 3,
    operatorName: '李仓管',
    date: getDateString(2),
    remark: '',
    createTime: `${getDateString(2)} 10:15:00`
  }
]

// 库存预警
export const warnings = [
  { ...medicines[3], type: 'medicine', warningLevel: 'danger' }, // 阿奇霉素分散片 库存45 最低60
  { ...medicines[0], type: 'medicine', warningLevel: 'warning' }, // 阿莫西林 库存低于最低库存
  { ...devices[4], type: 'device', warningLevel: 'warning' }, // 电子血压计
  { ...devices[5], type: 'device', warningLevel: 'warning' }  // 血糖仪
]

// 统计数据
export const statistics = {
  totalProducts: medicines.length + devices.length,
  totalMedicines: medicines.length,
  totalDevices: devices.length,
  totalStock: medicines.reduce((sum, m) => sum + m.stock, 0) + devices.reduce((sum, d) => sum + d.stock, 0),
  
  // 今日统计
  today: {
    inboundCount: inboundRecords.filter(r => r.date === getDateString(0)).length,
    outboundCount: outboundRecords.filter(r => r.date === getDateString(0)).length,
    inboundAmount: inboundRecords.filter(r => r.date === getDateString(0)).reduce((sum, r) => sum + r.totalAmount, 0),
    outboundAmount: outboundRecords.filter(r => r.date === getDateString(0)).reduce((sum, r) => sum + r.totalAmount, 0)
  },
  
  // 本周统计
  week: {
    inboundCount: 15,
    outboundCount: 18,
    inboundAmount: 25680.00,
    outboundAmount: 18450.00
  },
  
  // 本月统计
  month: {
    inboundCount: 156,
    outboundCount: 142,
    inboundAmount: 125680.00,
    outboundAmount: 98450.00
  },
  
  // 本年统计
  year: {
    inboundCount: 1250,
    outboundCount: 1180,
    inboundAmount: 856800.00,
    outboundAmount: 684500.00
  }
}

// 出入库趋势数据（最近7天）
export const trendData = [
  { date: getDateString(6), inbound: 18, outbound: 15 },
  { date: getDateString(5), inbound: 22, outbound: 19 },
  { date: getDateString(4), inbound: 16, outbound: 20 },
  { date: getDateString(3), inbound: 25, outbound: 22 },
  { date: getDateString(2), inbound: 20, outbound: 18 },
  { date: getDateString(1), inbound: 19, outbound: 21 },
  { date: getDateString(0), inbound: 21, outbound: 17 }
]

// 排行数据
export const rankData = {
  // 入库排行
  inboundRank: [
    { name: '医用外科口罩', spec: '17.5cm×9.5cm', count: 25, quantity: 5200 },
    { name: '一次性使用无菌注射器', spec: '5ml', count: 20, quantity: 3500 },
    { name: '阿莫西林胶囊', spec: '0.5g*24粒', count: 18, quantity: 1800 },
    { name: '布洛芬片', spec: '0.2g*100片', count: 15, quantity: 1500 },
    { name: '板蓝根颗粒', spec: '10g*20袋', count: 12, quantity: 1200 }
  ],
  // 出库排行
  outboundRank: [
    { name: '医用外科口罩', spec: '17.5cm×9.5cm', count: 28, quantity: 4800 },
    { name: '一次性使用无菌注射器', spec: '5ml', count: 22, quantity: 3200 },
    { name: '阿莫西林胶囊', spec: '0.5g*24粒', count: 16, quantity: 1500 },
    { name: '医用纱布块', spec: '10cm×10cm', count: 14, quantity: 2500 },
    { name: '创可贴', spec: '7cm×2cm', count: 12, quantity: 1800 }
  ]
}

// 操作日志
export const operationLogs = [
  { id: 1, userId: 3, userName: '李仓管', action: '入库', module: '药品管理', description: '入库：阿莫西林胶囊 100盒', ip: '192.168.1.100', createTime: `${getDateString(0)} 09:30:00` },
  { id: 2, userId: 3, userName: '李仓管', action: '出库', module: '药品管理', description: '出库：阿莫西林胶囊 20盒 → 内科', ip: '192.168.1.100', createTime: `${getDateString(0)} 10:30:00` },
  { id: 3, userId: 3, userName: '李仓管', action: '入库', module: '器械管理', description: '入库：医用外科口罩 500个', ip: '192.168.1.100', createTime: `${getDateString(0)} 10:15:00` },
  { id: 4, userId: 2, userName: '张经理', action: '编辑', module: '药品管理', description: '修改药品信息：布洛芬片', ip: '192.168.1.101', createTime: `${getDateString(0)} 11:00:00` },
  { id: 5, userId: 1, userName: '系统管理员', action: '登录', module: '用户管理', description: '管理员登录系统', ip: '192.168.1.1', createTime: `${getDateString(0)} 08:00:00` },
  { id: 6, userId: 3, userName: '李仓管', action: '出库', module: '器械管理', description: '出库：一次性使用无菌注射器 200支 → 注射室', ip: '192.168.1.100', createTime: `${getDateString(0)} 15:00:00` }
]
